'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { getAdminDoctors, adminAddDoctor, updateDoctorStatus } from '@/apis/apis';
import { Doctor } from '@/types/type';
import { 
  UserPlusIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  CheckIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function DoctorsContent() {
  const searchParams = useSearchParams();
  const autoOpenAdd = searchParams ? searchParams.get('add') === 'true' : false;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialty: '',
    experience: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await getAdminDoctors();
      if (response.data.success) {
        setDoctors(response.data.doctors);
      }
    } catch (err: any) {
      toast.error("Failed to fetch doctors list: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    if (autoOpenAdd) {
      setModalOpen(true);
    }
  }, [autoOpenAdd]);

  const handleStatusChange = async (doctor: Doctor, newStatus: string) => {
    try {
      const response = await updateDoctorStatus(doctor.id, newStatus);
      if (response.data.success) {
        toast.success(`Doctor status updated to ${newStatus}`);
        setDoctors(prev => prev.map(d => d.id === doctor.id ? { ...d, status: newStatus } : d));
      } else {
        toast.error(response.data.message || "Failed to update doctor status");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "An error occurred");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await adminAddDoctor(formData);
      if (response.data.success) {
        toast.success("Doctor added successfully! Verification email sent.");
        setModalOpen(false);
        setFormData({
          name: '',
          email: '',
          password: '',
          specialty: '',
          experience: ''
        });
        fetchDoctors();
      } else {
        toast.error(response.data.message || "Failed to add doctor");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    const query = searchQuery.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.email.toLowerCase().includes(query) ||
      doctor.specialty?.toLowerCase().includes(query)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctors Directory</h1>
          <p className="text-slate-500 mt-1">Manage and block/unblock doctors, or add a new doctor account.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition shadow-md shadow-emerald-700/10 cursor-pointer text-sm"
        >
          <UserPlusIcon className="h-5 w-5" />
          Add Doctor
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-slate-450 text-slate-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doctors by name, email, or specialty..."
          className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
        />
      </div>

      {/* Doctor table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-250 border-slate-200 bg-slate-50/60 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Specialty</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 text-sm">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{doctor.name}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{doctor.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{doctor.specialty || 'General'}</td>
                    <td className="px-6 py-4 text-slate-500">{doctor.experience ? `${doctor.experience} years` : 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        (doctor as any).status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/20' 
                          : 'bg-red-100 text-red-800 border border-red-200/20'
                      }`}>
                        {(doctor as any).status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {((doctor as any).status === 'active' || !(doctor as any).status) ? (
                        <button
                          onClick={() => handleStatusChange(doctor, 'blocked')}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 hover:border-transparent text-red-700 text-xs font-semibold cursor-pointer transition-all duration-200"
                        >
                          <NoSymbolIcon className="h-4 w-4" /> Block
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(doctor, 'active')}
                          className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-700 hover:text-white border border-emerald-100 hover:border-transparent text-emerald-750 text-emerald-700 text-xs font-semibold cursor-pointer transition-all duration-200"
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
                    No doctors found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-zoomIn">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50/30">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlusIcon className="h-5 w-5 text-emerald-700" />
                Add New Doctor
              </h2>
              <button 
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddDoctor} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Dr. Jane Smith"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="doctor@wellnest.com"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create password"
                  className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Specialty</label>
                  <input
                    type="text"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g. Cardiologist"
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-850 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Experience (years)</label>
                  <input
                    type="text"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-850 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-slate-100 bg-slate-50/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 cursor-pointer py-2.5 rounded-lg border border-slate-200 text-slate-650 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 cursor-pointer py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition disabled:bg-emerald-800 text-sm"
                >
                  {submitting ? 'Adding...' : 'Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function DoctorsOverview() {
  return (
    <Suspense fallback={<div className="text-emerald-700 text-lg font-semibold animate-pulse">Loading doctors...</div>}>
      <DoctorsContent />
    </Suspense>
  );
}
