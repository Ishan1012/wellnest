"use client";
import React from 'react'
import AboutPage from '@/pages/AboutPage'
import Footer from '@/pages/Footer'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });

export default function About() {
  return (
    <>
      <Header />
      <AboutPage />
      <Footer />
    </>
  )
}
