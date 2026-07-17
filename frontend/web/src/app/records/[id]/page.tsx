'use client';
import React from 'react';
import Footer from '@/pages/Footer';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const RecordDetails = dynamic(() => import("@/components/RecordDetails"), { ssr: false });

export default function RecordDetailsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pt-14">
      <Header />
      <RecordDetails />
      <Footer />
    </div>
  );
}
