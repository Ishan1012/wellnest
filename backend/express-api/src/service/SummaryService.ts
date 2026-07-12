import { Types } from "mongoose";
import { ISummary } from "../interface/ISummary";
import { SummaryRepository } from "../repository/SummaryRepository";
import { AppointmentRepository } from "../repository/AppointmentRepository";
import { generatePreVisitSummary, generatePostVisitSummary } from "../config/LlmService";

export class SummaryService {
    private summaryRepository: SummaryRepository;
    private appointmentRepository: AppointmentRepository;

    constructor() {
        this.summaryRepository = new SummaryRepository();
        this.appointmentRepository = new AppointmentRepository();
    }

    async createPreVisitSummary(appointmentObjectId: Types.ObjectId): Promise<ISummary | null> {
        try {
            // Check if summary already exists
            const existing = await this.summaryRepository.findByAppointmentObjectId(appointmentObjectId);
            if (existing) {
                return existing;
            }

            // Fetch the populated appointment
            const appointment = await this.appointmentRepository.findById(
                // We need to find by _id, not by custom id
                appointmentObjectId.toString()
            );

            if (!appointment) {
                console.error("Cannot create pre-visit summary: appointment not found for ObjectId", appointmentObjectId);
                return null;
            }

            const { summary, urgencyLevel } = await generatePreVisitSummary(
                appointment.patientInfo.name,
                appointment.patientInfo.age,
                appointment.patientInfo.gender,
                appointment.patientInfo.concern,
                appointment.type
            );

            return await this.summaryRepository.create({
                appointmentId: appointmentObjectId,
                preVisitSummary: summary,
                urgencyLevel
            });
        } catch (error) {
            console.error("Error creating pre-visit summary:", error);
            return null;
        }
    }

    async addDoctorNotes(
        appointmentId: string,
        doctorNotes: string,
        prescription: string,
        reportUrl?: string
    ): Promise<ISummary | null> {
        try {
            // Find the appointment to get its ObjectId and patient info
            const appointment = await this.appointmentRepository.findById(appointmentId);
            if (!appointment) {
                throw new Error("Appointment not found");
            }

            const appointmentObjectId = appointment._id as Types.ObjectId;

            // Update report URL on the appointment if provided
            if (reportUrl) {
                const Appointment = (await import("../model/Appointment")).default;
                await Appointment.findByIdAndUpdate(appointmentObjectId, { reportUrl }).exec();
            }

            // Generate post-visit summary using LLM
            const postVisitSummary = await generatePostVisitSummary(
                appointment.patientInfo.name,
                appointment.patientInfo.concern,
                doctorNotes,
                prescription
            );

            // Check if summary already exists (created during pre-visit)
            const existing = await this.summaryRepository.findByAppointmentObjectId(appointmentObjectId);

            if (existing) {
                return await this.summaryRepository.update(appointmentObjectId, {
                    doctorNotes,
                    prescription,
                    postVisitSummary
                });
            } else {
                return await this.summaryRepository.create({
                    appointmentId: appointmentObjectId,
                    doctorNotes,
                    prescription,
                    postVisitSummary
                });
            }
        } catch (error) {
            console.error("Error adding doctor notes:", error);
            throw error;
        }
    }

    async getSummaryByAppointmentId(appointmentId: string): Promise<ISummary | null> {
        return await this.summaryRepository.findByAppointmentId(appointmentId);
    }

    async getSummaryByAppointmentObjectId(appointmentObjectId: Types.ObjectId): Promise<ISummary | null> {
        return await this.summaryRepository.findByAppointmentObjectId(appointmentObjectId);
    }
}
