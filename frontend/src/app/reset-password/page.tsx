'use client';
import React, { useState, FormEvent, Suspense } from 'react';
import Image from 'next/image';
import Footer from '@/pages/Footer';
import dynamic from 'next/dynamic';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPasswordApi } from '@/apis/apis';
import { toast } from 'sonner';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams ? searchParams.get('token') : null;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Password reset token is missing!");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPasswordApi(token, password);
      if (response.data.success) {
        setSuccess(true);
        toast.success(response.data.message || "Password reset successfully!");
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "An error occurred.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600">
          {success 
            ? "Your password has been updated successfully" 
            : "Please enter your new password below"}
        </p>
      </div>

      {success ? (
        <div className="space-y-6 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircleIcon className="h-10 w-10" />
          </div>
          <p className="text-gray-700">
            You can now log in using your new password.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-300"
          >
            Log In Now
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter new password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 cursor-pointer hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !token}
              className="w-full cursor-pointer flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300 disabled:bg-emerald-400"
            >
              {loading ? 'Resetting password...' : 'Reset Password'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}

export default function ResetPassword() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-emerald-100/30 flex items-center justify-center px-4 py-12 pt-20">
        <Suspense fallback={<div className="text-emerald-700 text-lg font-semibold animate-pulse">Loading reset page...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
