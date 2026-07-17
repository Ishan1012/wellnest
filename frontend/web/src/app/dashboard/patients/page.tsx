'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const AdminPatients = dynamic(() => import("@/components/AdminPatients"), { ssr: false });

export default function PatientsOverview() {
  return <AdminPatients />;
}
