import { Request, Response } from "express";
import { Types } from "mongoose";
import { SummaryService } from "../service/SummaryService";
import Appointment from "../model/Appointment";

const summaryService = new SummaryService();

export const getSummary = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.params;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required!" });
        }

        // Find appointment by custom id to get its ObjectId
        const appointment = await Appointment.findOne({ id: appointmentId }).exec();
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found!" });
        }

        const summary = await summaryService.getSummaryByAppointmentObjectId(appointment._id as Types.ObjectId);

        if (!summary) {
            return res.status(404).json({ success: false, message: "No summary found for this appointment." });
        }

        return res.status(200).json({ success: true, summary });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const submitDoctorNotes = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.params;
        const { doctorNotes, prescription, reportUrl } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required!" });
        }

        if (!doctorNotes) {
            return res.status(400).json({ success: false, message: "Doctor notes are required!" });
        }

        const summary = await summaryService.addDoctorNotes(
            appointmentId,
            doctorNotes,
            prescription || "",
            reportUrl
        );

        if (!summary) {
            return res.status(500).json({ success: false, message: "Failed to save doctor notes." });
        }

        // Update appointment status to Completed
        const appointmentObj = await Appointment.findOne({ id: appointmentId }).exec();
        if (appointmentObj) {
            appointmentObj.status = "Completed";
            await appointmentObj.save();
        }

        return res.status(200).json({
            success: true,
            message: "Doctor notes saved and post-visit summary generated!",
            summary
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
