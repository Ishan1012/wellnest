import { Types } from "mongoose";
import { IAppointment, PopulatedAppointment } from "../interface/IAppointment";
import { AppointmentRepository } from "../repository/AppointmentRepository";
import { AppointmentConfirmationEmail } from "../utils/Appointment";
import transporter from "../config/NodeMailer";
import { SummaryService } from "./SummaryService";
import Patient from "../model/Patient";
import Doctor from "../model/Doctor";
import { GoogleCalendarService } from "./GoogleCalendarService";

export class AppointmentService {
    private appointmentRepository: AppointmentRepository;
    private summaryService: SummaryService;

    constructor() {
        this.appointmentRepository = new AppointmentRepository();
        this.summaryService = new SummaryService();
    }

    async createAppointment(userId: string, appointment: IAppointment): Promise<IAppointment | null> {
        appointment.userId = userId;

        const newAppointment: IAppointment | null = await this.appointmentRepository.create(appointment);

        if (newAppointment) {
            try {
                const fetchAppointment = await this.appointmentRepository.findById(newAppointment?.id);

                if (fetchAppointment) {
                    const emailTasks = [];

                    emailTasks.push(
                        transporter.sendMail({
                            from: `WellNest <${process.env.EMAIL_ID}>`,
                            to: fetchAppointment.patientInfo.email,
                            subject: 'Appointment Confirmed',
                            html: AppointmentConfirmationEmail(fetchAppointment),
                        })
                    );

                    if (fetchAppointment.doctor?.email) {
                        emailTasks.push(
                            transporter.sendMail({
                                from: `WellNest <${process.env.EMAIL_ID}>`,
                                to: fetchAppointment.doctor.email,
                                subject: 'New Appointment',
                                html: AppointmentConfirmationEmail(fetchAppointment),
                            })
                        );
                    }

                    Promise.allSettled(emailTasks).catch(console.error);

                    // Sync Google Calendar events asynchronously
                    try {
                        const googleCalendarService = new GoogleCalendarService();
                        
                        // 1. Patient event
                        Patient.findOne({ id: userId }).then(patient => {
                            if (patient && patient.googleCalendarRefreshToken) {
                                googleCalendarService.createCalendarEvent(patient.googleCalendarRefreshToken, fetchAppointment)
                                    .catch(err => console.error("Error syncing patient calendar:", err));
                            }
                        }).catch(err => console.error("Error finding patient for calendar sync:", err));

                        // 2. Doctor event
                        const docId = fetchAppointment.doctor?._id || fetchAppointment.doctor;
                        if (docId) {
                            Doctor.findById(docId).then(doctor => {
                                if (doctor && doctor.googleCalendarRefreshToken) {
                                    googleCalendarService.createCalendarEvent(doctor.googleCalendarRefreshToken, fetchAppointment)
                                        .catch(err => console.error("Error syncing doctor calendar:", err));
                                }
                            }).catch(err => console.error("Error finding doctor for calendar sync:", err));
                        }
                    } catch (calErr) {
                        console.error("Error in calendar sync block:", calErr);
                    }
                }
            } catch (error) {
                throw error;
            }

            // Fire-and-forget: generate pre-visit AI summary asynchronously
            const appointmentObjectId = newAppointment._id as Types.ObjectId;
            this.summaryService.createPreVisitSummary(appointmentObjectId).catch(err => {
                console.error("Failed to generate pre-visit summary:", err);
            });
        }

        return newAppointment;
    }

    async findAppointmentById(id: string): Promise<PopulatedAppointment | null> {
        return await this.appointmentRepository.findById(id);
    }

    async findAppointmentByUserId(userId: string): Promise<IAppointment[]> {
        const userIdObj = new Types.ObjectId(userId);
        return await this.appointmentRepository.findByUserId(userIdObj);
    }

    async findAppointmentByDoctorId(doctorId: string): Promise<IAppointment[]> {
        const doctorIdObj = new Types.ObjectId(doctorId);
        return await this.appointmentRepository.findByDoctorId(doctorIdObj);
    }

    async getStatusOfAppointment(id: string): Promise<string | null> {
        return await this.appointmentRepository.getStatus(id);
    }

    async setStatusOfAppointment(id: string, newStatus: string): Promise<IAppointment | null> {
        return await this.appointmentRepository.setStatus(id, newStatus);
    }

    async getAllAppointments(): Promise<IAppointment[]> {
        return await this.appointmentRepository.getAll();
    }

    async deleteAppointment(id: string): Promise<void> {
        await this.appointmentRepository.delete(id);
    }
}