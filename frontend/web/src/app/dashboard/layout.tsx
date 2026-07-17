'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  CalendarIcon,
  ArrowLeftOnRectangleIcon,
  ShieldCheckIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { userSession, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Wait for the context to load stored session
    const timer = setTimeout(() => {
      if (!isAuthenticated || !isAdmin) {
        router.replace('/login');
      } else {
        setCheckingAuth(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdmin, router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-emerald-700 font-semibold animate-pulse">Verifying Admin Permissions...</p>
      </div>
    );
  }

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: HomeIcon },
    { name: 'Doctors', href: '/dashboard/doctors', icon: UserGroupIcon },
    { name: 'Patients', href: '/dashboard/patients', icon: UsersIcon },
    { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
        {/* Sidebar Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 bg-slate-50/50">
          <div className="h-auto w-7 relative">
            <Image src={'/images/mascot.png'} height={500} width={500} alt='hero' className='h-auto w-7' />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 leading-none">WellNest</h1>
            <span className="text-[10px] text-emerald-700 font-bold tracking-wider uppercase">Admin Portal</span>
          </div>
        </div>

        {/* Sidebar Profile */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-emerald-500/10">
            <Image
              src={userSession?.profile || '/images/user-default.png'}
              alt="Admin Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="truncate">
            <p className="font-semibold text-sm text-slate-900 truncate">{userSession?.name || 'Administrator'}</p>
            <p className="text-xs text-slate-500 truncate">{userSession?.email || 'admin@wellnest.com'}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group font-medium text-sm ${isActive
                  ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/10'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-450 group-hover:text-emerald-600'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Signout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all cursor-pointer font-medium text-sm"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2">
            <div className="h-auto w-7 relative">
              <Image src={'/images/mascot.png'} height={500} width={500} alt='hero' className='h-auto w-7' />
            </div>
            <span className="font-bold text-slate-900 text-md uppercase tracking-wider">WellNest Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-500 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-10 bg-white/95 backdrop-blur-md flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                <Image
                  src={userSession?.profile || '/images/user-default.png'}
                  alt="Admin Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{userSession?.name}</p>
                <p className="text-sm text-slate-500">{userSession?.email}</p>
              </div>
            </div>
            <nav className="flex-1 p-6 space-y-1.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-5 py-3 rounded-xl ${isActive
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-6 border-t border-slate-200 bg-slate-50/50">
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-medium"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
