import { Document, Types } from "mongoose";
import { PopulatedAppointment } from "./IAppointment";

export interface IPatient extends Document{
    name: string;
    email: string;
    password?: string;
    isOAuth: boolean;
    detailsComplete: boolean;
    status: string;
    isVerified: boolean;
    verificationToken?: string | undefined;
    profileUrl?: string;
    age: number;
    phone: string;
    isPhoneVerified: boolean;
    address?: string;
        upcomingAppointments: Types.ObjectId[];
    medicalRecords: Types.ObjectId[];
    resetToken?: string | undefined;
    resetTokenExpiry?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
    googleCalendarRefreshToken?: string;
}

export interface PopulatedPatient extends Document {
    name: string;
    email: string;
    password?: string;
    isOAuth: boolean;
    detailsComplete: boolean;
    status: string;
    isVerified: boolean;
    verificationToken?: string | undefined;
    profileUrl?: string;
    age: number;
    phone: string;
    isPhoneVerified: boolean;
    address?: string;
    upcomingAppointments: PopulatedAppointment[];
    medicalRecords: PopulatedAppointment[];
    resetToken?: string | undefined;
    resetTokenExpiry?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
    googleCalendarRefreshToken?: string;
}