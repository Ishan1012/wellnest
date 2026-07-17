'use client';
import React from 'react';
import Footer from '@/pages/Footer';
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const ForgotPasswordForm = dynamic(() => import("@/components/ForgotPasswordForm"), { ssr: false });

export default function ForgotPassword() {
  return (
    <>
      <Header />
      <ForgotPasswordForm />
      <Footer />
    </>
  );
}
