import { Request, Response } from "express";
import { AppointmentService } from "../service/AppointmentService";
import { AuthRequest } from "../middleware/auth";
import Doctor from "../model/Doctor";
import Appointment from "../model/Appointment";

const appointmentService: AppointmentService = new AppointmentService();

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        console.log("DEBUG [createAppointment] req.user is:", req.user);
        console.log("DEBUG [createAppointment] req.body is:", req.body);
        const userId = req.user?.userId || (req.user as any)?.id || (req.user as any)?.userId;
        console.log("DEBUG [createAppointment] resolved userId:", userId);
        const appointment = await appointmentService.createAppointment(userId, req.body);

        if(!appointment) {
            return res.status(400).json({ success: false, message: "Unable to create the appointment!" });
        }

        return res.status(201).json({ success: true, appointment });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const findAppointmentById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(403).json({ success: false, message: "appointment id is required!" });
        }
        const appointment = await appointmentService.findAppointmentById(id);

        if(!appointment) {
            return res.status(400).json({ success: false, message: "Unable to find the appointment!" });
        }

        return res.status(201).json({ success: true, appointment });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const findAppointmentByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;

        if(!userId) {
            return res.status(403).json({ success: false, message: "userId is required!" });
        }
        const appointments = await appointmentService.findAppointmentByUserId(userId);

        if(!appointments || appointments.length === 0) {
            return res.status(400).json({ success: false, message: "Unable to find any appointments of given patient!" });
        }

        return res.status(201).json({ success: true, appointments });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const findAppointmentByDoctorId = async (req: Request, res: Response) => {
    try {
        const doctorId = req.params.doctorId;

        if(!doctorId) {
            return res.status(403).json({ success: false, message: "doctorId is required!" });
        }
        const appointments = await appointmentService.findAppointmentByDoctorId(doctorId);

        if(!appointments || appointments.length === 0) {
            return res.status(400).json({ success: false, message: "Unable to find any appointments of given doctor!" });
        }

        return res.status(201).json({ success: true, appointments });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const getStatusOfAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(403).json({ success: false, message: "appointment id is required!" });
        }
        const status = await appointmentService.getStatusOfAppointment(id);

        if(!status) {
            return res.status(400).json({ success: false, message: "Unable to find the appointment!" });
        }

        return res.status(201).json({ success: true, status });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const setStatusOfAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const status: string = req.body.status;

        if(!id) {
            return res.status(403).json({ success: false, message: "appointment id is required!" });
        }
        const newAppointment = await appointmentService.setStatusOfAppointment(id, status);

        if(!newAppointment) {
            return res.status(400).json({ success: false, message: "Unable to find the appointment!" });
        }

        return res.status(201).json({ success: true, appointment: newAppointment });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await appointmentService.getAllAppointments();

        if(!appointments || appointments.length === 0) {
            return res.status(400).json({ success: false, message: "Unable to find the appointments!" });
        }

        return res.status(201).json({ success: true, appointments });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if(!id) {
            return res.status(403).json({ success: false, message: "appointment id is required!" });
        }
        await appointmentService.deleteAppointment(id);

        return res.status(201).json({ success: true, message: "Appointment deleted successfully" });
    } catch (error) {
        if(error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const getMyAppointmentsForDoctor = async (req: AuthRequest, res: Response) => {
    try {
        const doctorId = req.user?.userId;

        const doctor = await Doctor.findOne({ id: doctorId }).exec();
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found!" });
        }

        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('doctor')
            .sort({ createdAt: -1 })
            .exec();

        return res.status(200).json({ success: true, appointments });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};