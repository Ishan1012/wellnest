import { Request, Response } from "express";
import { DoctorService } from "../service/DoctorService";
import { AuthRequest } from "../middleware/auth";
import Doctor from "../model/Doctor";
import Appointment from "../model/Appointment";
import transporter from "../config/NodeMailer";

const doctorService: DoctorService = new DoctorService();

export const getDoctorBySpecialty = async (req: Request, res: Response) => {
    try {
        const { specialty } = req.params;

        if (!specialty) {
            return res.status(403).json({ success: false, message: "specialty is required!" });
        }

        const doctors = await doctorService.findDoctorsBySpecialty(specialty);

        if(!doctors) {
            return res.status(400).json({ success: false, message: "Unable to find doctors of given specialty!" });
        }

        return res.status(201).json({ success: true, doctors });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const isDoctorVerified = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(403).json({ success: false, message: "doctor id is required!" });
        }

        const verified = await doctorService.isDoctorVerified(id);

        if(!verified) {
            return res.status(400).json({ success: false, message: "Unable to find doctor of given id!" });
        }

        return res.status(201).json({ success: true, verified });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const isDoctorPhoneVerified = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(403).json({ success: false, message: "doctor id is required!" });
        }

        const phoneVerified = await doctorService.isDoctorPhoneVerified(id);

        if(!phoneVerified) {
            return res.status(400).json({ success: false, message: "Unable to find doctor of given id!" });
        }

        return res.status(201).json({ success: true, phoneVerified });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const getAvailabilityAndTimeSlots = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(403).json({ success: false, message: "doctor id is required!" });
        }

        const availabilityAndTimeSlots = await doctorService.getAvailabilityAndTimeSlots(id);

        if(!availabilityAndTimeSlots) {
            return res.status(400).json({ success: false, message: "Unable to find doctor of given id!" });
        }

        return res.status(201).json({ success: true, response: availabilityAndTimeSlots });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const updateDoctor = async (req: AuthRequest, res: Response) => {
    try {
        const id = req.user?.userId;
        const role = req.user?.role;
        const updatedDoctor = req.body;

        if (role !== "Doctor") {
            return res.status(403).json({ success: false, message: "Unauthorized access!" });
        }
        if(!id || !updatedDoctor) {
            return res.status(403).json({ success: false, message: "id and updateDoctor is required!" });
        }

        let doctor: any = await doctorService.updateDoctor(id, updatedDoctor);

        // Getting new deatils of doctor
        doctor = await doctorService.findDoctorById(id);

        if(!doctor) {
            return res.status(400).json({ success: false, message: "Unable to find the doctor!" });
        }

        return res.status(201).json({ success: true, doctor });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const getAllDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await doctorService.getAllDoctors();

        if(!doctors || doctors.length === 0) {
            return res.status(400).json({ success: false, message: "Unable to find the doctors!" });
        }

        return res.status(201).json({ success: true, doctors });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const getAllRegisteredDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await doctorService.getAllRegisteredDoctors();
        
        if(!doctors || doctors.length === 0) {
            return res.status(400).json({ success: false, message: "Unable to find the doctors!" });
        }
        
        return res.status(201).json({ success: true, doctors });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const scheduleDoctorLeave = async (req: AuthRequest, res: Response) => {
    try {
        const { date } = req.body;
        const doctorId = req.user?.userId;

        if (!date) {
            return res.status(400).json({ success: false, message: "Leave date is required!" });
        }

        const doctor = await Doctor.findOne({ id: doctorId });
        if (!doctor) {
            return res.status(403).json({ success: false, message: "Only doctors can schedule leaves!" });
        }

        const appointments = await Appointment.find({
            doctor: doctor._id,
            date: date,
            status: { $in: ['Scheduled', 'Confirmed', 'Rescheduled'] }
        }).exec();

        for (const appointment of appointments) {
            const patientEmail = appointment.patientInfo.email;
            const patientName = appointment.patientInfo.name;

            try {
                await transporter.sendMail({
                    from: `no reply <${process.env.EMAIL_ID}>`,
                    to: patientEmail,
                    subject: `Appointment Cancelled - Dr. ${doctor.name} on Leave`,
                    html: `
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td align="center">
                                    <table width="500" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff; font-family: system-ui; border-radius: 10px; padding: 20px; border: 1px solid #e5e7eb;">
                                        <tr>
                                            <td>
                                                <h2 style="color: #b91c1c; margin-top: 0;">Important Update Regarding Your Appointment</h2>
                                                <p>Dear ${patientName},</p>
                                                <p>We regret to inform you that your scheduled appointment (ID: <strong>${appointment.id}</strong>) with <strong>Dr. ${doctor.name}</strong> on <strong>${date}</strong> at <strong>${appointment.time}</strong> has been cancelled because the doctor will be on leave on that day.</p>
                                                <p>We apologize for any inconvenience caused. You can log in to your portal to reschedule the appointment or book another slot.</p>
                                                <br>
                                                <p>Best regards,<br>WellNest Team</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    `
                });
            } catch (mailError) {
                console.error(`Failed to send email to patient ${patientEmail} about leave cancellation: `, mailError);
            }

            appointment.status = 'Cancelled';
            await appointment.save();
        }

        return res.status(200).json({
            success: true,
            message: `Leave scheduled successfully for ${date}. Notified ${appointments.length} patients.`,
            notifiedPatientsCount: appointments.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};