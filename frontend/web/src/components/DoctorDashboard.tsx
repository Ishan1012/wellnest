import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getDoctorAppointmentsApi, getSummaryApi, submitDoctorNotesApi } from '@/apis/apis';
import { AppointmentDetails, Summary } from '@/types/type';
import { toast } from 'sonner';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  PencilSquareIcon, 
  CheckCircleIcon,
  LinkIcon,
  SparklesIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function DoctorDashboardContent() {
  const { isAuthenticated, getUser } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppt, setSelectedAppt] = useState<AppointmentDetails | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Form states for submitting notes
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [reportUrl, setReportUrl] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);

  const searchParams = useSearchParams();
  const apptIdParam = searchParams ? searchParams.get('apptId') : null;

  const handleSelectAppointment = async (appt: AppointmentDetails) => {
    setSelectedAppt(appt);
    setSummary(null);
    setDoctorNotes('');
    setPrescription('');
    setReportUrl(appt.reportUrl || '');
    setLoadingSummary(true);

    try {
      const response = await getSummaryApi(appt.id);
      if (response.data.success) {
        const summaryData = response.data.summary;
        setSummary(summaryData);
        setDoctorNotes(summaryData.doctorNotes || '');
        setPrescription(summaryData.prescription || '');
      }
    } catch (err: any) {
      console.log("No summary found or error:", err.message);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    const checkRoleAndFetch = async () => {
      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }
      try {
        const fullUser = await getUser();
        const isDoc = fullUser?.id?.startsWith('DOC');
        if (!isDoc) {
          toast.error("Access denied. Doctor permission required.");
          router.replace('/');
          return;
        }
        
        // Fetch appointments
        const apptsResponse = await getDoctorAppointmentsApi();
        if (apptsResponse.data.success) {
          const list = apptsResponse.data.appointments;
          setAppointments(list);
          if (apptIdParam) {
            const matched = list.find((a: AppointmentDetails) => a.id === apptIdParam);
            if (matched) {
              handleSelectAppointment(matched);
            }
          }
        }
      } catch (err: any) {
        toast.error("Error loading dashboard: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    checkRoleAndFetch();
  }, [isAuthenticated, router, apptIdParam]);

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    if (!doctorNotes.trim()) {
      toast.error("Please enter doctor notes first!");
      return;
    }

    setSavingNotes(true);
    try {
      const response = await submitDoctorNotesApi(selectedAppt.id, {
        doctorNotes,
        prescription,
        reportUrl: reportUrl.trim() || undefined
      });

      if (response.data.success) {
        toast.success("Notes saved and AI patient summary generated!");
        setSummary(response.data.summary);
        
        // Update list status to Completed
        setAppointments(prev => prev.map(a => 
          a.id === selectedAppt.id ? { ...a, status: 'Completed', reportUrl: reportUrl.trim() || undefined } : a
        ));
        
        // Update selected appt state
        setSelectedAppt(prev => prev ? { ...prev, status: 'Completed', reportUrl: reportUrl.trim() || undefined } : null);
      } else {
        toast.error(response.data.message || "Failed to save notes");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setSavingNotes(false);
    }
  };

  const getUrgencyBadge = (level?: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-850 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-250';
    }
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Doctor Clinical Workspace</h1>
        <p className="text-slate-500 mt-1">Review upcoming appointments, read AI pre-visit intake triages, write medical logs, and upload files.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-emerald-700">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 font-semibold animate-pulse">Loading clinical workspace...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Appointments Queue Panel */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CalendarDaysIcon className="h-5 w-5 text-emerald-700" />
              Patient Appointments Ledger
            </h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {appointments.length > 0 ? (
                appointments.map((appt) => {
                  const isSelected = selectedAppt?.id === appt.id;
                  return (
                    <div
                      key={appt.id}
                      onClick={() => handleSelectAppointment(appt)}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-500 shadow-sm shadow-emerald-500/10' 
                          : 'bg-slate-50/50 border-slate-150 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{appt.patientInfo.name}</p>
                          <p className="text-slate-400 text-xs mt-0.5">Concern: {appt.patientInfo.concern}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            appt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-sky-100 text-sky-850'
                          }`}>
                            {appt.status || 'Scheduled'}
                          </span>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            appt.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-yellow-50 text-yellow-750 border border-yellow-100'
                          }`}>
                            {appt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="h-4 w-4 text-emerald-600" />
                          {appt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4 text-emerald-600" />
                          {appt.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-center py-10 text-sm">No appointments scheduled.</p>
              )}
            </div>
          </div>

          {/* Appointment Details & AI Summarizer Workspace */}
          <div className="lg:col-span-7 space-y-6">
            {selectedAppt ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                
                {/* Selected Appointment Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedAppt.patientInfo.name}</h2>
                    <p className="text-xs text-slate-450 mt-1">ID: {selectedAppt.id} | Age: {selectedAppt.patientInfo.age} | Gender: {selectedAppt.patientInfo.gender}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                      selectedAppt.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-yellow-105 bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}>
                      Payment: {selectedAppt.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                    {summary?.urgencyLevel && (
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getUrgencyBadge(summary.urgencyLevel)}`}>
                        Urgency: {summary.urgencyLevel}
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Pre-Visit summary Panel */}
                <div className="bg-emerald-50/30 border border-emerald-500/10 rounded-xl p-5 space-y-2.5">
                  <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                    <SparklesIcon className="h-5 w-5 text-emerald-700" />
                    LLM Pre-Visit AI Intake summary (Doctor-Only Triage)
                  </h3>
                  <div className="mt-1">
                    {loadingSummary ? (
                      <div className="flex items-center gap-2 text-emerald-700 py-3">
                        <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xs font-semibold animate-pulse">Generating / loading AI pre-visit intake summary...</p>
                      </div>
                    ) : summary?.preVisitSummary ? (
                      <MarkdownRenderer content={summary.preVisitSummary} />
                    ) : (
                      <p className="text-xs text-slate-505 text-slate-500 italic">No AI pre-visit intake details generated for this appointment concern.</p>
                    )}
                  </div>
                </div>

                {/* Write clinical details form */}
                <form onSubmit={handleSaveNotes} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                      <PencilSquareIcon className="h-4 w-4 text-emerald-700" />
                      Clinical consultation notes *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={doctorNotes}
                      onChange={(e) => setDoctorNotes(e.target.value)}
                      placeholder="Write clinical findings, symptoms evaluated, and medical instructions..."
                      className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                        <DocumentTextIcon className="h-4 w-4 text-emerald-700" />
                        Prescription / Medication
                      </label>
                      <input
                        type="text"
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        placeholder="e.g. Paracetamol 500mg (TDS) for 3 days"
                        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                        <LinkIcon className="h-4 w-4 text-emerald-700" />
                        Patient Report File URL Link
                      </label>
                      <input
                        type="text"
                        value={reportUrl}
                        onChange={(e) => setReportUrl(e.target.value)}
                        placeholder="Paste report/prescription link..."
                        className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingNotes}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold transition cursor-pointer shadow-md shadow-emerald-700/10 text-sm disabled:bg-emerald-800"
                  >
                    {savingNotes ? (
                      <>Saving & Summarizing...</>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-5 w-5" />
                        Submit Clinical Details & Generate AI patient summary
                      </>
                    )}
                  </button>
                </form>

                {/* AI Post-visit patient summary display */}
                {summary?.postVisitSummary && (
                  <div className="bg-sky-50/30 border border-sky-500/15 rounded-xl p-5 space-y-2.5 mt-4">
                    <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                      <SparklesIcon className="h-5 w-5 text-sky-700" />
                      Generated Patient-Friendly AI summary
                    </h3>
                    <div className="mt-1">
                      <MarkdownRenderer content={summary.postVisitSummary} />
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-sm text-center flex flex-col items-center justify-center py-24">
                <CalendarDaysIcon className="h-16 w-16 text-slate-300 mb-4 animate-bounce-once" />
                <h3 className="text-lg font-bold text-slate-700">No Patient Selected</h3>
                <p className="text-slate-400 max-w-sm mt-1 text-sm">Select an appointment from the queue ledger to write clinical notes, upload reports, and check the pre-visit triage summary.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </main>
  );
}
