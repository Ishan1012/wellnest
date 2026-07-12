import { Types } from "mongoose";
import { IAppointment, PopulatedAppointment } from "../interface/IAppointment";
import Appointment from "../model/Appointment";

export class AppointmentRepository {
    async create(record: IAppointment): Promise<IAppointment | null> {
        const newRecord = new Appointment(record);
        return await newRecord.save();
    }

    async findById(id: string): Promise<PopulatedAppointment | null> {
        return await Appointment.findOne({ id }).populate('doctor').exec() as PopulatedAppointment | null;
    }

    async findByAppointmentId(id: string): Promise<PopulatedAppointment | null> {
        return await Appointment.findOne({ id }).populate('doctor').exec() as PopulatedAppointment | null;
    }

    async findByUserId(userId: Types.ObjectId): Promise<IAppointment[]> {
        return await Appointment.find({ userId }).populate('doctor').sort({ createdAt: -1 }).exec();
    }

    async findByDoctorId(doctorId: Types.ObjectId): Promise<IAppointment[]> {
        return await Appointment.find({ doctorId }).populate('doctor').sort({ createdAt: -1 }).exec();
    }

    async getStatus(id: string): Promise<string | null> {
        const record = await Appointment.findOne({ id }).select('status').lean().exec();
        return record?.status || null;
    }

    async setStatus(id: string, newStatus: string): Promise<IAppointment | null> {
        const record = await Appointment.findOne({ id }).exec();
        if (record) {
            record.status = newStatus;
            return await record.save();
        }
        return null;
    }

    async getAll(): Promise<IAppointment[]> {
        return await Appointment.find().sort({ createdAt: -1 }).exec();
    }

    async delete(id: string): Promise<void> {
        await Appointment.findOneAndDelete({ id });
    }
}