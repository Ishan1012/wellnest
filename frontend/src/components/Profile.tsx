'use client';
import React, { useState, useEffect, useCallback, FC, ReactElement } from 'react';
import {
	Phone,
	MapPin,
	Calendar,
	LogOut,
	ChevronRight,
	FileText,
	Settings,
	Bell,
	Download,
	Stethoscope,
	Briefcase
} from "lucide-react";
import { AppointmentDetails, Doctor, Patient } from '@/types/type';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { scheduleDoctorLeaveApi, getCalendarConnectUrlApi, disconnectCalendarApi } from '@/apis/apis';

type UserProfile = Patient | Doctor;

const LoadingPage: FC = () => (
	<div className="min-h-screen bg-slate-50 flex items-center justify-center">
		<div className="flex items-center space-x-2 text-emerald-600">
			<svg className="animate-spin h-6 w-6 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
				<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
			<p className="text-xl font-semibold">Loading Profile...</p>
		</div>
	</div>
);

interface InfoItemProps {
	icon: ReactElement;
	label: string;
	value: string | number | undefined;
}

const InfoItem: FC<InfoItemProps> = ({ icon, label, value }) => {
	const displayValue = value === undefined || value === null || value === '' ? 'N/A' : value;
	return (
		<div className="flex items-center">
			<div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full">
				{icon}
			</div>
			<div className="ml-4">
				<p className="text-sm font-semibold text-slate-500">{label}</p>
				<p className="text-md font-bold text-slate-800">{displayValue}</p>
			</div>
		</div>
	);
};

interface ProfileCardProps {
	user: UserProfile;
}
const ProfileCard: FC<ProfileCardProps> = ({ user }) => {
	const router = useRouter();
	const isPatient = user.id.startsWith('PAT');
	const profileUrl = user.profileUrl || user.profileUrl;
	const [imgSrc, setImgSrc] = useState(profileUrl || "/images/user-default.png");

	const openRegistrationForm = useCallback(() => {
		if (isPatient) {
			router.push('/register/patient');
		} else {
			router.push('/register/doctor');
		}
	}, [isPatient, router]);

	const isDetailsComplete = isPatient
		? (user as Patient).age !== undefined && (user as Patient).phone !== undefined && (user as Patient).address !== undefined
		: (user as Doctor).specialty !== undefined && (user as Doctor).qualifications !== undefined && (user as Doctor).phone !== undefined;

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
			<img
				src={imgSrc}
				alt="User Profile"
				className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-emerald-200 object-cover"
				onError={() => setImgSrc("/images/user-default.png")}
			/>
			<h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
			<p className="text-slate-600 mt-1">{user.email}</p>

			<div className="mt-8 text-left space-y-4">
				{!isDetailsComplete ? (
					<div className="flex justify-center mt-4">
						<button
							className="px-4 py-2 cursor-pointer bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition duration-200"
							onClick={openRegistrationForm}
						>
							Complete Details
						</button>
					</div>
				) : (
					isPatient ? (
						<>
							<InfoItem icon={<Calendar size={20} />} label="Age" value={(user as Patient).age} />
							<InfoItem icon={<Phone size={20} />} label="Phone" value={(user as Patient).phone} />
							<InfoItem icon={<MapPin size={20} />} label="Address" value={(user as Patient).address} />
						</>
					) : (
						<>
							<InfoItem icon={<Stethoscope size={20} />} label="Specialty" value={(user as Doctor).specialty} />
							<InfoItem icon={<Briefcase size={20} />} label="Experience (Years)" value={(user as Doctor).experience} />
							<InfoItem icon={<Phone size={20} />} label="Phone" value={(user as Doctor).phone} />
							<InfoItem icon={<MapPin size={20} />} label="Address" value={(user as Doctor).address} />
						</>
					)
				)}
			</div>
			<button
				onClick={openRegistrationForm}
				className="mt-8 w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
			>
				Edit Profile
			</button>
		</div>
	);
}

interface DashboardNavProps {
	user: UserProfile;
}
const DashboardNav: FC<DashboardNavProps> = ({ user }) => {
	const router = useRouter();
	const isPatient = user.id.startsWith('PAT');

	const patientNavItems = [
		{ icon: <Calendar />, text: "Appointments" },
		{ icon: <FileText />, text: "Medical Records" },
		{ icon: <Bell />, text: "Notifications" },
		{ icon: <Settings />, text: "Account Settings" },
	];

	const doctorNavItems = [
		{ icon: <Calendar />, text: "Schedule & Slots" },
		{ icon: <Briefcase />, text: "Patient Queue" },
		{ icon: <Settings />, text: "Account Settings" },
	];

	const navItems = isPatient ? patientNavItems : doctorNavItems;

	const handleClick = useCallback((name: string) => {
		if (name === "Account Settings" || name === "Notifications") {
			router.push(`/profile?id=${user.id}`);
		} else if (name === "Medical Records") {
			router.push('/profile#records');
		} else if (name === "Appointments") {
			router.push('/profile#upcoming');
		} else if (name === "Schedule & Slots" || name === "Patient Queue") {
			router.push('/doctor-dashboard'); // Example route for doctor actions
		}
	}, [user.id, router]);

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8">
			<h2 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
				{navItems.map(item => (
					<div
						key={item.text}
						onClick={() => handleClick(item.text)}
						className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg text-center cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
					>
						<div className="text-emerald-500 mb-2">{React.cloneElement(item.icon, { size: 32, strokeWidth: 1.5 })}</div>
						<p className="font-semibold text-sm">{item.text}</p>
					</div>
				))}
			</div>
		</div>
	);
};

interface AppointmentCardProps {
	appointment: AppointmentDetails;
	isPatientView: boolean;
}
const AppointmentCard: FC<AppointmentCardProps> = ({ appointment, isPatientView }) => {
	const router = useRouter();

	const openAppointment = useCallback(() => {
		if (isPatientView) {
			router.push(`/appointment/${appointment.id}`);
		} else {
			router.push(`/doctor-dashboard?apptId=${appointment.id}`);
		}
	}, [appointment.id, isPatientView, router]);

	const partner = isPatientView ? appointment.doctor : appointment.patientInfo;
	const partnerName = partner?.name || "N/A";
	let detailText = '';
	let roleText = '';

	if (partner && 'specialty' in partner) {
		detailText = partner.specialty || 'N/A';
		roleText = `with Dr. ${partnerName}`;
	} else {
		detailText = `Age: ${partner?.age || 'N/A'}, Phone: ${partner?.phone || 'N/A'}`;
		roleText = `for ${partnerName}`;
	}

	return (
		<div onClick={openAppointment} className="bg-slate-50 p-4 rounded-lg flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer border border-slate-100 hover:border-emerald-250">
			<div className="flex items-center">
				<div className="bg-emerald-100 text-emerald-700 p-3 rounded-lg">
					<Calendar size={24} />
				</div>
				<div className="ml-4">
					<p className="font-bold text-slate-800">{roleText}</p>
					<p className="text-sm text-slate-600">{detailText}</p>
					<p className="text-xs text-slate-500 font-semibold mt-0.5">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {appointment.time}</p>
				</div>
			</div>
			<ChevronRight className="text-slate-400" />
		</div>
	);
};

interface RecordCardProps {
	isPatient: boolean;
	record: AppointmentDetails;
}
const RecordCard: FC<RecordCardProps> = ({ isPatient, record }) => {
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`/records/${record.id}`);
	};

	return (
		<div onClick={handleCardClick} className="bg-slate-50 p-4 rounded-lg flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer border border-slate-100 hover:border-emerald-250">
			{isPatient ? (
				<div className="flex items-center">
					<div className="bg-slate-200 text-slate-650 p-3 rounded-lg">
						<FileText size={24} />
					</div>
					<div className="ml-4">
						<p className="font-bold text-slate-800">{record.type}</p>
						<p className="text-sm text-slate-600">with Dr. {record.doctor?.name} ({record.doctor?.specialty})</p>
						<p className="text-xs text-slate-500 font-semibold mt-0.5">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
					</div>
				</div>
			) : (
				<div className="flex items-center">
					<div className="bg-slate-200 text-slate-655 p-3 rounded-lg">
						<FileText size={24} />
					</div>
					<div className="ml-4">
						<p className="font-bold text-slate-800">{record.type}</p>
						<p className="text-sm text-slate-600">with {record.patientInfo.name} (Age: {record.patientInfo.age})</p>
						<p className="text-xs text-slate-500 font-semibold mt-0.5">{new Date(record.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
					</div>
				</div>
			)}
			<div className="flex items-center gap-2">
				{record.reportUrl && (
					<a href={record.reportUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center font-semibold text-emerald-700 hover:text-emerald-850 text-xs mr-2">
						<Download size={16} className="mr-1.5" />
						Report
					</a>
				)}
				<ChevronRight className="text-slate-400" />
			</div>
		</div>
	);
};

interface AppointmentsSectionProps {
	appointments: AppointmentDetails[];
	isPatientView: boolean;
	title: string;
	id: string;
	emptyMessage: string;
}
const AppointmentsSection: FC<AppointmentsSectionProps> = ({ appointments, isPatientView, title, id, emptyMessage }) => {
	return (
		<div id={id} className="bg-white rounded-2xl shadow-xl p-8">
			<h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>
			<div className="space-y-4">
				{(appointments && appointments.length > 0) ? (
					appointments.map((appt, index) => <AppointmentCard key={index} appointment={appt} isPatientView={isPatientView} />)
				) : (
					<p className="text-slate-600 text-center py-4">{emptyMessage}</p>
				)}
			</div>
		</div>
	);
}

interface MedicalRecordsProps {
	isPatient: boolean;
	records: AppointmentDetails[];
}
const MedicalRecords: FC<MedicalRecordsProps> = ({ isPatient, records }) => (
	<div id="records" className="bg-white rounded-2xl shadow-xl p-8">
		<h2 className="text-2xl font-bold text-slate-900 mb-6">Medical Records</h2>
		<div className="space-y-4">
			{(records && records.length) > 0 ? (
				records.map((record, index) => <RecordCard key={index} isPatient={isPatient} record={record} />)
			) : (
				<p className="text-slate-600 text-center py-4">You have no past medical records.</p>
			)}
		</div>
	</div>
);

interface SyncCalendarCardProps {
	user: Patient | Doctor;
	onUpdate: () => void;
}

const SyncCalendarCard: FC<SyncCalendarCardProps> = ({ user, onUpdate }) => {
	const [connecting, setConnecting] = useState(false);
	const [disconnecting, setDisconnecting] = useState(false);

	const isConnected = !!user.googleCalendarRefreshToken;

	const handleConnect = async () => {
		setConnecting(true);
		try {
			const res = await getCalendarConnectUrlApi();
			if (res.data.success && res.data.url) {
				window.location.href = res.data.url;
			} else {
				toast.error("Failed to generate Google authorization link.");
			}
		} catch (err: any) {
			toast.error(err.response?.data?.message || err.message || "Failed to initiate sync.");
		} finally {
			setConnecting(false);
		}
	};

	const handleDisconnect = async () => {
		setDisconnecting(true);
		try {
			const res = await disconnectCalendarApi();
			if (res.data.success) {
				toast.success("Google Calendar disconnected successfully!");
				onUpdate();
			} else {
				toast.error(res.data.message || "Failed to disconnect calendar.");
			}
		} catch (err: any) {
			toast.error(err.response?.data?.message || err.message || "Error disconnecting calendar.");
		} finally {
			setDisconnecting(false);
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-xl p-8 text-left space-y-4">
			<h2 className="text-xl font-bold text-slate-900">Sync Calendar</h2>
			<p className="text-slate-500 text-xs leading-relaxed">
				Connect your Google Calendar to synchronize scheduled appointments and get alerts directly on your devices.
			</p>
			{isConnected ? (
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
						<span className="text-sm font-semibold flex items-center gap-1.5">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
							</svg>
							Connected
						</span>
					</div>
					<button
						onClick={handleDisconnect}
						disabled={disconnecting}
						className="w-full flex items-center justify-center font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2.5 rounded-lg text-sm transition cursor-pointer disabled:opacity-50"
					>
						{disconnecting ? "Disconnecting..." : "Disconnect Calendar"}
					</button>
				</div>
			) : (
				<button
					onClick={handleConnect}
					disabled={connecting}
					className="w-full flex items-center justify-center font-bold bg-[#0f172a] text-white hover:bg-slate-800 px-4 py-2.5 rounded-lg text-sm transition cursor-pointer disabled:opacity-50 gap-2"
				>
					{connecting ? "Connecting..." : (
						<>
							Connect Google Calendar
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
							</svg>
						</>
					)}
				</button>
			)}
		</div>
	);
};

const Profile: FC = () => {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();

	const { logout, getUser, isAdmin } = useAuth();

	const isPatient = user?.id.startsWith('PAT') ?? false;

	const [leaveDate, setLeaveDate] = useState<string>('');
	const [submittingLeave, setSubmittingLeave] = useState<boolean>(false);

	const handleScheduleLeave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!leaveDate) {
			toast.error("Please select a leave date!");
			return;
		}
		setSubmittingLeave(true);
		try {
			const response = await scheduleDoctorLeaveApi(leaveDate);
			if (response.data.success) {
				toast.success(response.data.message || `Leave scheduled successfully for ${leaveDate}!`);
				setLeaveDate('');
				// Reload user details (queue)
				const data = await getUser();
				setUser(data);
			} else {
				toast.error(response.data.message || "Failed to schedule leave.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || error.message || "An error occurred.");
		} finally {
			setSubmittingLeave(false);
		}
	};

	useEffect(() => {
		if (isAdmin) {
			router.replace('/dashboard');
			return;
		}

		// Handle Google Calendar OAuth redirect messages
		const searchParams = new URLSearchParams(window.location.search);
		const calendarStatus = searchParams.get("calendar");
		if (calendarStatus === "connected") {
			toast.success("Google Calendar connected successfully!");
			const newUrl = window.location.pathname;
			window.history.replaceState({}, '', newUrl);
		} else if (calendarStatus === "error") {
			const msg = searchParams.get("message") || "Authorization failed";
			toast.error(`Failed to connect calendar: ${msg}`);
			const newUrl = window.location.pathname;
			window.history.replaceState({}, '', newUrl);
		}

		const fetchUserData = async () => {
			try {
				const data = await getUser();

				setUser(data);
				setIsLoading(false);
			} catch (error) {
				const errorMessage = String(error);

				if (errorMessage.includes("jwt expired")) {
					logout();
					router.replace('/login');
					toast.error("Session expired. Please log in again.");
				} else {
					console.error(error);
					toast.error("An error occurred: " + errorMessage);
				}
			}
		};

		fetchUserData();
	}, [getUser, logout, router, isAdmin]);

	const handleLogout = () => {
		logout();
		toast.success('Logged out successfully!');
		router.replace('/');
	}

	if (isLoading) {
		return <LoadingPage />;
	}

	if (!user) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center">
				<p className="text-xl text-slate-600">Could not load user profile.</p>
			</div>
		)
	}

	const patientUser = user as Patient;
	const doctorUser = user as Doctor;

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased mt-10">
			<main className="container mx-auto px-4 sm:px-6 py-12">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<aside className="lg:col-span-1 space-y-8">
						<ProfileCard user={user} />
						<SyncCalendarCard user={user} onUpdate={async () => {
							const data = await getUser();
							setUser(data);
						}} />
						<button onClick={handleLogout} className="w-full flex items-center justify-center font-semibold bg-slate-200 text-slate-700 px-6 py-3 rounded-lg hover:bg-rose-500 hover:text-white transition-colors cursor-pointer">
							<LogOut className="mr-2" size={20} /> Log Out
						</button>
					</aside>

					<div className="lg:col-span-2 space-y-8">
						<DashboardNav user={user} />
						{isPatient && patientUser.upcomingAppointments && (
							<AppointmentsSection
								appointments={patientUser.upcomingAppointments}
								isPatientView={true}
								title="Upcoming Appointments"
								id="upcoming"
								emptyMessage="You have no upcoming appointments."
							/>
						)}
						{!isPatient && doctorUser.upcomingAppointments && (
							<AppointmentsSection
								appointments={doctorUser.upcomingAppointments}
								isPatientView={false}
								title="Today's Patient Queue"
								id="queue"
								emptyMessage="You have no patients scheduled for today."
							/>
						)}
						{!isPatient && (
							<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
								<h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
									<Calendar className="text-emerald-700" size={22} />
									Schedule Leave Day
								</h3>
								<p className="text-slate-500 text-sm">
									Schedule a leave day. Selecting a date will cancel all appointments on that day and automatically email the affected patients.
								</p>
								<form onSubmit={handleScheduleLeave} className="flex flex-col sm:flex-row gap-3">
									<input
										type="date"
										required
										min={new Date().toISOString().split('T')[0]}
										value={leaveDate}
										onChange={(e) => setLeaveDate(e.target.value)}
										className="flex-1 bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-slate-850 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-sm shadow-sm"
									/>
									<button
										type="submit"
										disabled={submittingLeave}
										className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition cursor-pointer disabled:bg-emerald-800"
									>
										{submittingLeave ? 'Scheduling...' : 'Schedule Leave'}
									</button>
								</form>
							</div>
						)}
						{isPatient && patientUser.medicalRecords && (
							<MedicalRecords isPatient={isPatient} records={patientUser.medicalRecords} />
						)}
						{!isPatient && doctorUser.medicalRecords && (
							<MedicalRecords isPatient={isPatient} records={doctorUser.medicalRecords} />
						)}
					</div>
				</div>
			</main>
		</div>
	);
};

export default Profile;