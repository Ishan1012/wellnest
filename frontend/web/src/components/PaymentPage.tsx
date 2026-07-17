import React, { useState } from 'react';
import { createPaymentOrderApi, verifyPaymentApi } from '@/apis/apis';
import { AppointmentDetails } from '@/types/type';
import { toast } from 'sonner';
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline';

interface PaymentPageProps {
  details: Omit<AppointmentDetails, 'id'> & { id?: string };
  appointmentId: string;
  onPaymentSuccess: () => void;
  prevStep: () => void;
}

export default function PaymentPage({ details, appointmentId, onPaymentSuccess, prevStep }: PaymentPageProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create order on the backend
      const response = await createPaymentOrderApi(appointmentId);
      if (!response.data.success) {
        toast.error("Failed to initiate payment. Please try again.");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency, keyId } = response.data;

      // 2. Configure Razorpay Options
      const options = {
        key: keyId,
        amount: amount, // already in paise
        currency: currency,
        name: "WellNest Health",
        description: `Consultation Fee with Dr. ${details.doctor?.name || "Clinic Specialist"}`,
        image: "/images/mascot.png",
        order_id: orderId,
        handler: async function (paymentRes: any) {
          // Success callback: paymentRes.razorpay_payment_id, paymentRes.razorpay_order_id, paymentRes.razorpay_signature
          try {
            setLoading(true);
            const verifyRes = await verifyPaymentApi(
              paymentRes.razorpay_order_id,
              paymentRes.razorpay_payment_id,
              paymentRes.razorpay_signature
            );

            if (verifyRes.data.success) {
              toast.success("Payment verified successfully!");
              onPaymentSuccess();
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || "An error occurred during verification");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: details.patientInfo.name,
          email: details.patientInfo.email,
          contact: details.patientInfo.phone,
        },
        notes: {
          appointmentId: appointmentId,
        },
        theme: {
          color: "#065f46", // Emerald-800
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment process cancelled.");
            setLoading(false);
          }
        }
      };

      // 3. Open Razorpay checkout modal
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to start payment process");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-[fadeInUp_0.6s_ease-out]">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-emerald-100/80 text-emerald-800 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
          <CreditCardIcon className="h-8 w-8 text-emerald-700 animate-pulse" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Secure Payment Check</h2>
        <p className="text-slate-500 mt-2 text-sm">Please finalize the ₹200 consultation deposit to secure your slots.</p>
      </div>

      {/* Invoice Details Card */}
      <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 backdrop-blur-sm">
        <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider border-b border-slate-200/60 pb-2">Order Description</h3>
        <div className="space-y-3.5 text-sm text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Practitioner</span>
            <span className="font-semibold text-slate-800">Dr. {details.doctor?.name || "N/A"} ({details.doctor?.specialty || "N/A"})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Session Type</span>
            <span className="font-semibold text-slate-800">{details.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Date & Time</span>
            <span className="font-semibold text-slate-800">{details.date} at {details.time}</span>
          </div>
          <hr className="border-slate-200" />
          <div className="flex justify-between items-baseline pt-2">
            <span className="text-slate-900 font-extrabold text-base">Amount Due</span>
            <span className="text-2xl font-black text-emerald-800">₹200.00</span>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <ShieldCheckIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs text-slate-500 font-semibold">100% Encrypted Payment</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <LockClosedIcon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span className="text-xs text-slate-500 font-semibold">Powered by Razorpay</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
        <button
          onClick={prevStep}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 border border-slate-200 rounded-xl text-slate-650 hover:bg-slate-50 hover:text-slate-800 font-bold transition text-sm cursor-pointer disabled:opacity-50"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Modify Details
        </button>
        
        <button
          onClick={handlePayment}
          disabled={loading}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md shadow-emerald-700/10 transition duration-300 text-sm cursor-pointer disabled:bg-emerald-800/80"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Verifying Payment...
            </div>
          ) : (
            <>
              <SparklesIcon className="h-4 w-4" />
              Pay ₹200 via UPI/Cards
            </>
          )}
        </button>
      </div>
    </div>
  );
}
