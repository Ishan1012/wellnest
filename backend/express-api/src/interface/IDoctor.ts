import { Document, Types } from "mongoose";
import { IAppointment } from "./IAppointment";

export interface IDoctor extends Document {
    name: string;
    email: string;
    password?: string;
    isOAuth: boolean;
    detailsComplete: boolean;
    specialty: string;
    qualifications?: string;
    profileUrl?: string;
    status: string;
    isVerified: boolean;
    verificationToken?: string | undefined;
    isAdmin: boolean;
    availability: string[];
    timeSlots: string[];
    upcomingAppointments: Types.ObjectId[];
    medicalRecords: Types.ObjectId[];
    address?: string;
    phone: string;
    isPhoneVerified: boolean;
    experience: string;
    lat: number;
    lng: number;
        notifications: {
        appointmentReminders: boolean;
        healthTips: boolean;
        promotionalUpdates: boolean;
    };
    resetToken?: string | undefined;
    resetTokenExpiry?: Date | undefined;
    googleCalendarRefreshToken?: string;
}

export interface PopulatedDoctor extends Document {
    name: string;
    email: string;
    password?: string;
    isOAuth: boolean;
    detailsComplete: boolean;
    specialty: string;
    qualifications?: string;
    profileUrl?: string;
    status: string;
    isVerified: boolean;
    verificationToken?: string | undefined;
    isAdmin: boolean;
    availability: string[];
    timeSlots: string[];
    upcomingAppointments: IAppointment[];
    medicalRecords: IAppointment[];
    address?: string;
    phone: string;
    isPhoneVerified: boolean;
    experience: string;
    lat: number;
    lng: number;
    notifications: {
        appointmentReminders: boolean;
        healthTips: boolean;
        promotionalUpdates: boolean;
    };
    resetToken?: string | undefined;
    resetTokenExpiry?: Date | undefined;
    googleCalendarRefreshToken?: string;
}