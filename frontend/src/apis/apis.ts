import { AppointmentDetails, DoctorFormData, FormDataConsult, PatientFormData, SignInRequest, SignUpRequest } from "@/types/type";
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URI || "http://localhost:5000/api/v1";

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const userSession = localStorage.getItem("userSession");

    const excludedPaths = ['/auth/signin', '/auth/signup', '/auth/signin/google'];

    const shouldExclude = excludedPaths.some(path =>
      config.url?.includes(path)
    );

    if (!shouldExclude && userSession) {
      const token = JSON.parse(userSession).token;

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const expressApi = () => api.get('/');

export const signInApi = (signInRequest: SignInRequest) => api.post('/auth/signin', signInRequest);

export const signUpApi = (signUpRequest: SignUpRequest) => api.post('/auth/signup', signUpRequest);

export const signInByGoogleApi = (code: string, role: string) => api.post('/auth/signin/google', { code, role }, { headers: { 'Content-Type': 'application/json' } });

export const userApi = () => api.get('/auth/me');

export const registerPatientApi = (registrationForm: PatientFormData) => api.put(`/patient`, registrationForm);

export const registerDoctorApi = (registrationForm: DoctorFormData) => api.put(`/doctor`, registrationForm);

export const getDoctorsApi = () => api.get('/doctor/registered/');

export const bookAppointmentApi = (appointment: Omit<AppointmentDetails, 'id'>) => api.post('/appointment', appointment);

export const getAppointmentApi = (id: string) => api.get(`/appointment/${id}`);

export const smartConsultApi = (symptoms: string) => api.post('/consult', { symptoms });

export const forgotPasswordApi = (email: string) => api.post('/auth/forgot-password', { email });

export const resetPasswordApi = (token: string, password: string) => api.post('/auth/reset-password', { token, password });

export const getAdminStats = () => api.get('/admin/stats');

export const getAdminDoctors = () => api.get('/admin/doctors');

export const getAdminPatients = () => api.get('/admin/patients');

export const getAdminAppointments = () => api.get('/admin/appointments');

export const adminAddDoctor = (doctorDetails: any) => api.post('/admin/doctor', doctorDetails);

export const updateDoctorStatus = (id: string, status: string) => api.patch(`/admin/doctor/${id}/status`, { status });

export const updatePatientStatus = (id: string, status: string) => api.patch(`/admin/patient/${id}/status`, { status });

export const updateDoctorScheduleApi = (id: string, availability: string[], timeSlots: string[]) => api.patch(`/admin/doctor/${id}/schedule`, { availability, timeSlots });

export const scheduleDoctorLeaveApi = (date: string) => api.post('/doctor/leave', { date });

export const getSummaryApi = (appointmentId: string) => api.get(`/summary/${appointmentId}`);

export const submitDoctorNotesApi = (appointmentId: string, data: { doctorNotes: string; prescription: string; reportUrl?: string }) => api.post(`/summary/${appointmentId}/doctor-notes`, data);

export const getDoctorAppointmentsApi = () => api.get(`/appointment/doctor/me`);

export const getCalendarConnectUrlApi = () => api.get('/calendar/connect');
export const getCalendarStatusApi = () => api.get('/calendar/status');
export const disconnectCalendarApi = () => api.post('/calendar/disconnect');

export const createPaymentOrderApi = (appointmentId: string) => api.post('/transaction/create-order', { appointmentId });
export const verifyPaymentApi = (orderId: string, paymentId: string, signature: string) => api.post('/transaction/verify', { orderId, paymentId, signature });
export const getTransactionApi = (appointmentId: string) => api.get(`/transaction/${appointmentId}`);