import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IAdmin } from '../interface/IAdmin';

const adminSchema = new Schema<IAdmin>({
    id: {
        type: String,
        default: () => "ADM" + uuidv4().replace(/-/g, "").slice(0, 10),
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileUrl: {
        type: String,
        default: '/images/user-default.png',
    },
    resetToken: {
        type: String,
        required: false
    },
    resetTokenExpiry: {
        type: Date,
        required: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Admin = model<IAdmin>('Admin', adminSchema);

export default Admin;
