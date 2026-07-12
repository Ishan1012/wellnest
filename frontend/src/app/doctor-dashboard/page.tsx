'use client';
import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/pages/Footer';
import dynamic from 'next/dynamic';

const DoctorDashboardContent = dynamic(() => import("@/components/DoctorDashboard"), { ssr: false });

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-10">
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-emerald-700 font-semibold animate-pulse">
          Loading workspace...
        </div>
      }>
        <DoctorDashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
