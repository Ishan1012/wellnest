import { HydratedDocument, Schema, Types, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IAppointment, PatientInfo } from '../interface/IAppointment';
import Doctor from './Doctor';
import { CallbackError } from 'mongoose';
import Patient from './Patient';

const patientInfoSchema = new Schema<PatientInfo>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format']
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    concern: {
        type: String,
        required: true,
        trim: true
    },
}, { _id: false });

const appointmentSchema = new Schema<IAppointment>({
    id: {
        type: String,
        default: () => "APPOINTMENT" + uuidv4().replace(/-/g, "").slice(0, 10),
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Confirmed', 'Rescheduled', 'Cancelled', 'In-Progress', 'Completed'],
        default: 'Scheduled'
    },
    type: {
        type: String,
        required: true,
    },
    doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    patientInfo: {
        type: patientInfoSchema,
        required: true
    },
    reportUrl: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

appointmentSchema.post<HydratedDocument<IAppointment>>('save', async function (appointment, next: (err?: CallbackError) => void) {
    try {
        if (!appointment || !appointment._id) return next();

        const appointmentId = appointment._id as unknown as Types.ObjectId;

        if (appointment.userId) {
            const patient = await Patient.findOne({ id: appointment.userId });

            if (patient) {
                if (appointment.status === 'Completed') {
                    // Remove from upcomingAppointments
                    patient.upcomingAppointments = patient.upcomingAppointments.filter(
                        id => id.toString() !== appointmentId.toString()
                    );
                    // Add to medicalRecords
                    if (!patient.medicalRecords.some(id => id.equals(appointmentId))) {
                        patient.medicalRecords.push(appointmentId);
                    }
                } else {
                    // Add to upcomingAppointments
                    if (!patient.upcomingAppointments.some(id => id.equals(appointmentId))) {
                        patient.upcomingAppointments.push(appointmentId);
                    }
                    // Remove from medicalRecords
                    patient.medicalRecords = patient.medicalRecords.filter(
                        id => id.toString() !== appointmentId.toString()
                    );
                }
                await patient.save();
            }
        }

        const doctor = await Doctor.findById(appointment.doctor);
        if (doctor) {
            if (appointment.status === 'Completed') {
                // Remove from upcomingAppointments
                doctor.upcomingAppointments = doctor.upcomingAppointments.filter(
                    id => id.toString() !== appointmentId.toString()
                );
                // Add to medicalRecords
                if (!doctor.medicalRecords.some(id => id.equals(appointmentId))) {
                    doctor.medicalRecords.push(appointmentId);
                }
            } else {
                // Add to upcomingAppointments
                if (!doctor.upcomingAppointments.some(id => id.equals(appointmentId))) {
                    doctor.upcomingAppointments.push(appointmentId);
                }
                // Remove from medicalRecords
                doctor.medicalRecords = doctor.medicalRecords.filter(
                    id => id.toString() !== appointmentId.toString()
                );
            }
            await doctor.save();
        }

        next();
    } catch (err: any) {
        next(err);
    }
});

const Appointment = model<IAppointment>('Appointments', appointmentSchema);

export default Appointment;