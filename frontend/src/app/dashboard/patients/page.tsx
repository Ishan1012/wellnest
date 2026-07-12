'use client';
import React, { useEffect, useState } from 'react';
import { getAdminPatients, updatePatientStatus } from '@/apis/apis';
import { Patient } from '@/types/type';
import { 
  MagnifyingGlassIcon, 
  CheckIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function PatientsOverview() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPatients = async () => {
    try {
      const response = await getAdminPatients();
      if (response.data.success) {
        setPatients(response.data.patients);
      }
    } catch (err: any) {
      toast.error("Failed to fetch patients list: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleStatusChange = async (patient: Patient, newStatus: string) => {
    try {
      const response = await updatePatientStatus(patient.id, newStatus);
      if (response.data.success) {
        toast.success(`Patient status updated to ${newStatus}`);
        setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: newStatus } : p));
      } else {
        toast.error(response.data.message || "Failed to update patient status");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "An error occurred");
    }
  };

  const filteredPatients = patients.filter(patient => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-64 bg-slate-100 border border-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Patients Directory</h1>
        <p className="text-slate-500 mt-1">Review active users and block/unblock patient registrations.</p>
      </div>

      {/* Filter and search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patients by name or email..."
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
        />
      </div>

      {/* Patients table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Name / ID</th>
                <th className="px-6 py-4">Age / Phone</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 text-sm">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{patient.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{patient.email}</div>
                      <div className="text-emerald-700 text-xs font-bold tracking-wider mt-1">{patient.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 font-semibold">{patient.age ? `${patient.age} years` : 'N/A'}</div>
                      <div className="text-slate-405 text-slate-400 text-xs mt-0.5">{patient.phone || 'No phone'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          patient.isVerified 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200/50'
                        }`}>
                          Email: {patient.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        <br />
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          patient.isPhoneVerified 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/50' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200/50'
                        }`}>
                          Phone: {patient.isPhoneVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        patient.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/20' 
                          : 'bg-red-100 text-red-800 border border-red-200/20'
                      }`}>
                        {patient.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(patient.status === 'active' || !patient.status) ? (
                        <button
                          onClick={() => handleStatusChange(patient, 'blocked')}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 hover:border-transparent text-red-700 text-xs font-semibold cursor-pointer transition-all duration-200"
                        >
                          <NoSymbolIcon className="h-4 w-4" /> Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(patient, 'active')}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-700 hover:text-white border border-emerald-100 hover:border-transparent text-emerald-700 text-xs font-semibold cursor-pointer transition-all duration-200"
                        >
                          <CheckIcon className="h-4 w-4" /> Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No patients found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
