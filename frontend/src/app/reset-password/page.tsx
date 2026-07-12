'use client';
import React, { Suspense } from 'react';
import Footer from '@/pages/Footer';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const ResetPasswordForm = dynamic(() => import("@/components/ResetPasswordForm"), { ssr: false });

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
