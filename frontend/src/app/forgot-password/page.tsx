'use client';
import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import Footer from '@/pages/Footer';
import dynamic from 'next/dynamic';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { forgotPasswordApi } from '@/apis/apis';
import { toast } from 'sonner';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await forgotPasswordApi(email);
      if (response.data.success) {
        setSuccess(true);
        toast.success(response.data.message || "Reset link sent!");
      } else {
        toast.error(response.data.message || "Failed to send reset link.");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "An error occurred.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-emerald-100/30 flex items-center justify-center px-4 py-12 pt-20">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 space-y-6">
          
          {/* Logo and Title */}
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src="/images/mascot.png"
                alt="WellNest Logo"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600">
              {success 
                ? "Check your inbox for a link to reset your password" 
                : "Enter your email address and we'll send you a link to reset your password"}
            </p>
          </div>

          {success ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                ✉️
              </div>
              <p className="text-gray-700">
                We've sent an email to <span className="font-semibold">{email}</span>. Click the link in the email to reset your password.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 cursor-pointer flex items-center justify-center mx-auto gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Try another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 disabled:bg-emerald-400"
                >
                  {loading ? 'Sending link...' : 'Send reset link'}
                </button>
              </div>

              <div className="text-center">
                <a
                  href="/login"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeftIcon className="h-4 w-4" /> Back to Sign In
                </a>
              </div>
            </form>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
}
