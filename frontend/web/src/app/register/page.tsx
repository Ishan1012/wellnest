'use client';
import React from 'react'
import Footer from '@/pages/Footer'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const RegisterForm = dynamic(() => import("@/components/RegisterForm"), { ssr: false });

export default function Register() {
  return (
    <>
      <Header />
      <RegisterForm userType="Patient" />
      <Footer />
    </>
  );
}
