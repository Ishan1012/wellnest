'use client';
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/pages/Footer';
import { getAppointmentApi, getSummaryApi } from '@/apis/apis';
import { AppointmentDetails, Summary } from '@/types/type';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  ArrowLeftIcon,
  SparklesIcon,
  DocumentTextIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export default function RecordDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        // Fetch appointment details
        const apptRes = await getAppointmentApi(id);
        if (apptRes.data.success) {
          setAppointment(apptRes.data.appointment);
        }

        // Fetch summary/notes details
        const summaryRes = await getSummaryApi(id);
        if (summaryRes.data.success) {
          setSummary(summaryRes.data.summary);
        }
      } catch (err: any) {
        console.log("Error loading record details or summary:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const getUrgencyBadge = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-850 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-850 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-250';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-14">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-700">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-semibold animate-pulse">Loading record details...</p>
          </div>
        ) : appointment ? (
          <div className="space-y-6">
            
            {/* Record Overview Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-2">
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold tracking-wider uppercase bg-emerald-50 px-2.5 py-1 rounded">Medical Record</span>
                  <h1 className="text-2xl font-bold text-slate-900 mt-2">{appointment.type}</h1>
                  <p className="text-xs text-slate-400 mt-0.5">ID: {appointment.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {appointment.status || 'Completed'}
                  </span>
                  {summary?.urgencyLevel && (
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getUrgencyBadge(summary.urgencyLevel)}`}>
                      Urgency: {summary.urgencyLevel}
                    </span>
                  )}
                </div>
              </div>

              {/* Consultation Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-650">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                    <UserIcon className="h-4.5 w-4.5 text-slate-450" />
                    Patient Information
                  </h3>
                  <div className="space-y-1">
                    <p><span className="text-slate-400 font-medium">Name:</span> {appointment.patientInfo.name}</p>
                    <p><span className="text-slate-400 font-medium">Age & Gender:</span> {appointment.patientInfo.age} | {appointment.patientInfo.gender}</p>
                    <p><span className="text-slate-400 font-medium">Phone:</span> {appointment.patientInfo.phone}</p>
                    <p><span className="text-slate-400 font-medium">Email:</span> {appointment.patientInfo.email}</p>
                    <p><span className="text-slate-400 font-medium">Home Address:</span> {appointment.patientInfo.address || "Not Provided"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-slate-500">
                    <CalendarDaysIcon className="h-4.5 w-4.5 text-slate-450" />
                    Appointment Schedule
                  </h3>
                  <div className="space-y-1">
                    <p><span className="text-slate-400 font-medium">Consulting Doctor:</span> <span className="font-semibold text-slate-800">Dr. {appointment.doctor?.name || "N/A"}</span></p>
                    <p><span className="text-slate-400 font-medium">Doctor Specialty:</span> {appointment.doctor?.specialty || "N/A"}</p>
                    <p><span className="text-slate-400 font-medium">Scheduled Date:</span> {appointment.date}</p>
                    <p><span className="text-slate-400 font-medium">Scheduled Time:</span> {appointment.time}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Intake Triage summary */}
            {summary?.preVisitSummary && (
              <div className="bg-emerald-50/30 border border-emerald-500/10 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                  <SparklesIcon className="h-5 w-5 text-emerald-700" />
                  Pre-Visit AI Intake summary (Triage)
                </h3>
                <div className="mt-1">
                  <MarkdownRenderer content={summary.preVisitSummary} />
                </div>
              </div>
            )}

            {/* Doctor's Notes & Diagnosis */}
            {summary?.doctorNotes && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-550 text-slate-500 mb-2.5 flex items-center gap-1.5">
                    <DocumentTextIcon className="h-4.5 w-4.5 text-emerald-700" />
                    Doctor Consultation Notes & Findings
                  </h3>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {summary.doctorNotes}
                  </p>
                </div>

                {summary.prescription && (
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                      💊 Prescription / treatment Plan
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 font-semibold">
                      {summary.prescription}
                    </p>
                  </div>
                )}

                {appointment.reportUrl && (
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-emerald-700" />
                    <span className="text-sm text-slate-500 font-medium">Patient Consultation Report:</span>
                    <a 
                      href={appointment.reportUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm font-semibold text-emerald-700 hover:text-emerald-850 hover:underline"
                    >
                      Download / View Report File
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* AI Post-visit Summary */}
            {summary?.postVisitSummary && (
              <div className="bg-sky-50/30 border border-sky-500/15 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                  <SparklesIcon className="h-5 w-5 text-sky-700" />
                  Post-Visit AI Patient summary
                </h3>
                <div className="mt-1">
                  <MarkdownRenderer content={summary.postVisitSummary} />
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm text-center py-24">
            <p className="text-xl text-slate-600 font-bold">Could not load medical record.</p>
            <p className="text-slate-400 mt-1 text-sm">Please verify the record ID or try again later.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
