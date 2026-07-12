'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const AdminAppointments = dynamic(() => import("@/components/AdminAppointments"), { ssr: false });

export default function AppointmentsOverview() {
  return <AdminAppointments />;
}
