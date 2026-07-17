'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const AdminDoctors = dynamic(() => import("@/components/AdminDoctors"), { ssr: false });

export default function DoctorsOverview() {
  return (
    <Suspense fallback={<div className="text-emerald-700 text-lg font-semibold animate-pulse">Loading doctors...</div>}>
      <AdminDoctors />
    </Suspense>
  );
}
