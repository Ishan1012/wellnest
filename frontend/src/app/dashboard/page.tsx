'use client';
import React, { useEffect, useState } from 'react';
import { getAdminStats } from '@/apis/apis';
import { AdminStats } from '@/types/type';
import { 
  UserGroupIcon, 
  UsersIcon, 
  CalendarIcon, 
  ArrowTopRightOnSquareIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminOverview() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getAdminStats();
        if (response.data.success) {
          setStats(response.data.stats);
        }
      } catch (err: any) {
        toast.error("Failed to load statistics: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Registered Doctors',
      value: stats?.totalDoctors ?? 0,
      icon: UserGroupIcon,
      color: 'from-emerald-500/5 to-teal-500/5',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconColor: 'text-emerald-700',
      link: '/dashboard/doctors',
      linkLabel: 'Manage Doctors'
    },
    {
      title: 'Total Active Patients',
      value: stats?.totalPatients ?? 0,
      icon: UsersIcon,
      color: 'from-sky-500/5 to-indigo-500/5',
      iconBg: 'bg-sky-50 text-sky-700 border-sky-100',
      iconColor: 'text-sky-700',
      link: '/dashboard/patients',
      linkLabel: 'Manage Patients'
    },
    {
      title: 'Total Appointments Booked',
      value: stats?.totalAppointments ?? 0,
      icon: CalendarIcon,
      color: 'from-purple-500/5 to-pink-500/5',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-100',
      iconColor: 'text-purple-700',
      link: '/dashboard/appointments',
      linkLabel: 'View Appointments'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Here is a quick snapshot of the WellNest application statistics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className={`bg-white border border-slate-250 bg-gradient-to-br ${card.color} border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-350 hover:shadow-md transition-all duration-300 group`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                <p className="text-4xl font-bold text-slate-800 mt-3 group-hover:scale-102 transition-transform duration-300 origin-left">{card.value}</p>
              </div>
              <div className={`p-3 rounded-xl border ${card.iconBg}`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link 
                href={card.link}
                className="text-sm font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {card.linkLabel} <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950 mb-4">Quick Administrator Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link 
            href="/dashboard/doctors?add=true"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-500/20 transition-all group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
              <PlusIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors text-sm">Add New Doctor</p>
              <p className="text-xs text-slate-500 mt-0.5">Create new doctor profile</p>
            </div>
          </Link>

          <Link 
            href="/dashboard/patients"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-sky-50/50 hover:border-sky-500/20 transition-all group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-sky-100 text-sky-850 text-sky-800">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-sky-700 transition-colors text-sm">Review Patients</p>
              <p className="text-xs text-slate-500 mt-0.5">Manage patient statuses</p>
            </div>
          </Link>

          <Link 
            href="/dashboard/appointments"
            className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-purple-50/50 hover:border-purple-500/20 transition-all group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-800">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors text-sm">View Schedule</p>
              <p className="text-xs text-slate-500 mt-0.5">Track all medical slots</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
