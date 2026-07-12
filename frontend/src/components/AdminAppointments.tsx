import React, { useEffect, useState } from 'react';
import { getAdminAppointments } from '@/apis/apis';
import { AppointmentDetails } from '@/types/type';
import { 
  MagnifyingGlassIcon, 
  CalendarDaysIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<AppointmentDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await getAdminAppointments();
        if (response.data.success) {
          setAppointments(response.data.appointments);
        }
      } catch (err: any) {
        toast.error("Failed to load appointments: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedAppointment(prev => prev === id ? null : id);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const query = searchQuery.toLowerCase();
    const docName = appointment.doctor?.name.toLowerCase() || '';
    const patName = appointment.patientInfo?.name.toLowerCase() || '';
    const appId = appointment.id.toLowerCase();
    
    const matchesSearch = docName.includes(query) || patName.includes(query) || appId.includes(query);
    const matchesStatus = statusFilter === 'All' || appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'Scheduled':
      case 'Confirmed':
        return 'bg-sky-100 text-sky-850 border border-sky-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'In-Progress':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-slate-100 text-slate-650 border border-slate-200';
    }
  };

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
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Appointments Ledger</h1>
        <p className="text-slate-500 mt-1">Review all scheduled, completed, and cancelled consultation bookings.</p>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-550 text-slate-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name, patient name, or appointment ID..."
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
          />
        </div>
        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-705 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Appointment ID</th>
                <th className="px-6 py-4">Patient Name</th>
                <th className="px-6 py-4">Doctor Assigned</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="text-slate-650 text-sm">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((app) => {
                  const isExpanded = expandedAppointment === app.id;
                  return (
                    <React.Fragment key={app.id}>
                      <tr className="hover:bg-slate-50/30 border-b border-slate-100 transition-colors">
                        <td className="px-6 py-4 font-bold text-emerald-700">{app.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{app.patientInfo?.name}</div>
                          <div className="text-slate-400 text-xs mt-0.5">{app.patientInfo?.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {app.doctor ? (
                            <>
                              <div className="font-semibold text-slate-800">{app.doctor.name}</div>
                              <div className="text-slate-400 text-xs mt-0.5">{app.doctor.specialty}</div>
                            </>
                          ) : (
                            <span className="text-slate-400 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <CalendarDaysIcon className="h-4 w-4 text-emerald-600" />
                            {app.date}
                          </div>
                          <div className="text-slate-400 text-xs mt-1 ml-5">{app.time}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${getStatusBadgeClass(app.status || 'Scheduled')}`}>
                            {app.status || 'Scheduled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => toggleExpand(app.id)}
                            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-650 hover:text-slate-800 transition font-semibold cursor-pointer text-xs"
                          >
                            {isExpanded ? (
                              <>Hide <ChevronUpIcon className="h-3.5 w-3.5" /></>
                            ) : (
                              <>Show <ChevronDownIcon className="h-3.5 w-3.5" /></>
                            )}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Section */}
                      {isExpanded && (
                        <tr className="bg-slate-50/40 border-b border-slate-100">
                          <td colSpan={6} className="px-8 py-5 text-slate-600">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Patient Vitals & Contact</h3>
                                <div className="space-y-1.5 text-sm">
                                  <p><span className="text-slate-400 font-medium">Gender:</span> {app.patientInfo?.gender || 'N/A'}</p>
                                  <p><span className="text-slate-400 font-medium">Age:</span> {app.patientInfo?.age || 'N/A'}</p>
                                  <p><span className="text-slate-400 font-medium">Phone:</span> {app.patientInfo?.phone || 'N/A'}</p>
                                  <p><span className="text-slate-400 font-medium">Home Address:</span> {app.patientInfo?.address || 'N/A'}</p>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 border-b border-slate-200 pb-1">Consultation Intent</h3>
                                <div className="space-y-2 text-sm">
                                  <p><span className="text-slate-400 font-medium">Type of slot:</span> {app.type}</p>
                                  <div>
                                    <p className="text-slate-400 font-medium mb-0.5">Primary Concern:</p>
                                    <p className="bg-white p-2.5 rounded-lg border border-slate-100 text-slate-650 italic shadow-inner">
                                      "{app.patientInfo?.concern || 'No concern stated'}"
                                    </p>
                                  </div>
                                  {app.reportUrl && (
                                    <p>
                                      <span className="text-slate-400 font-medium">Report Attachment:</span>{' '}
                                      <a href={app.reportUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-semibold hover:underline">
                                        View Uploaded Report
                                      </a>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No appointments found matching "{searchQuery}"
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
