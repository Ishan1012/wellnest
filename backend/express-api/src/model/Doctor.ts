import { model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IDoctor } from '../interface/IDoctor';
import { IPatient } from '../interface/IPatient';

const doctorSchema = new Schema<IDoctor>({
    id: {
        type: String,
        default: () => "DOC" + uuidv4().replace(/-/g, "").slice(0, 10),
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: function (this: IDoctor) {
            return !this.isOAuth;
        },
    },
    isOAuth: {
        type: Boolean,
        default: false
    },
    detailsComplete: {
        type: Boolean,
        default: false,
    },
    specialty: {
        type: String,
        reqiured: function (this: IDoctor) {
            return this.detailsComplete;
        },
    },
    qualifications: {
        type: String,
        reqiured: function (this: IDoctor) {
            return this.detailsComplete;
        },
    },
    profileUrl: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked', 'suspended', 'deleted'],
        default: 'active'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: function (this: IDoctor) {
            return !this.isVerified;
        },
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    availability: {
        type: [String],
        default: [
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        ],
    },
    timeSlots: {
        type: [String],
        default: [
            '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
        ],
    },
    upcomingAppointments: {
        type: [Schema.Types.ObjectId],
        ref: 'Appointments',
        default: [],
    },
    medicalRecords: {
        type: [Schema.Types.ObjectId],
        ref: 'Appointments',
        default: [],
    },
    address: {
        type: String,
        reqiured: function (this: IDoctor) {
            return this.detailsComplete;
        },
    },
    phone: {
        type: String,
        reqiured: function (this: IDoctor) {
            return this.detailsComplete;
        },
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    experience: {
        type: String,
        reqiured: function (this: IDoctor) {
            return this.detailsComplete;
        },
        min: 0
    },
    lat: {
        type: Number,
        reqiured: function (this: IDoctor) {
            return this.detailsComplete;
        },
    },
    lng: {
        type: Number,
        reqiured: function (this: IDoctor) {
            return this.detailsComplete;
        },
    },
        notifications: {
        appointmentReminders: {
            type: Boolean,
            default: true
        },
        healthTips: {
            type: Boolean,
            default: true
        },
        promotionalUpdates: {
            type: Boolean,
            default: true
        },
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpiry: {
        type: Date,
        required: false
    },
    googleCalendarRefreshToken: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Doctor = model<IDoctor>('Doctor', doctorSchema);

export default Doctor;