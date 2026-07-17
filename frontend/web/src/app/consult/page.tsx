'use client';

import React from 'react'
import dynamic from 'next/dynamic';

const Header = dynamic(() => import("@/components/Header"), { ssr: false });
const Consult = dynamic(() => import("@/components/ConsultPage"), { ssr: false });

export default function ConsultPage() {
  return (
    <>
      <Header />
      <Consult />
    </>
  );
}
