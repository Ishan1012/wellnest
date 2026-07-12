import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IPatient } from '../interface/IPatient';

const patientSchema = new Schema<IPatient>({
    id: {
        type: String,
        default: () => "PAT" + uuidv4().replace(/-/g, "").slice(0, 10),
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        reqiured: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    isOAuth: {
        type: Boolean,
        default: false
    },
    detailsComplete: {
        type: Boolean,
        default: false,
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
        required: function (this: IPatient) {
            return !this.isVerified;
        },
    },
    profileUrl: {
        type: String,
        default: '/images/user-default.png',
    },
    age: {
        type: Number,
        required: function (this: IPatient) {
            return this.detailsComplete;
        }
    },
    phone: {
        type: String,
        required: function (this: IPatient) {
            return this.detailsComplete;
        }
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
        required: function (this: IPatient) {
            return this.detailsComplete;
        }
    },
    upcomingAppointments: {
        type: [Schema.Types.ObjectId],
        ref: 'Appointments',
        default: []
    },
        medicalRecords: {
        type: [Schema.Types.ObjectId],
        ref: 'Appointments',
        default: []
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

const Patient = model<IPatient>('Patient', patientSchema);

export default Patient;