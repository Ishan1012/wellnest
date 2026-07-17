'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const AdminOverview = dynamic(() => import("@/components/AdminOverview"), { ssr: false });

export default function DashboardPage() {
  return <AdminOverview />;
}
