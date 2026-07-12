import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Doctor from "../model/Doctor";
import Patient from "../model/Patient";
import Appointment from "../model/Appointment";
import Admin from "../model/Admin";
import transporter from "../config/NodeMailer";
import { Message } from "../utils/Message";

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await Patient.countDocuments();
        const totalAppointments = await Appointment.countDocuments();

        return res.status(200).json({
            success: true,
            stats: {
                totalDoctors,
                totalPatients,
                totalAppointments
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getDoctors = async (req: Request, res: Response) => {
    try {
        const doctors = await Doctor.find().select('-password -resetToken -resetTokenExpiry').exec();
        return res.status(200).json({ success: true, doctors });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getPatients = async (req: Request, res: Response) => {
    try {
        const patients = await Patient.find().select('-password -resetToken -resetTokenExpiry').exec();
        return res.status(200).json({ success: true, patients });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const getAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await Appointment.find().populate('doctor', '-password -resetToken -resetTokenExpiry').sort({ createdAt: -1 }).exec();
        return res.status(200).json({ success: true, appointments });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const addDoctorByAdmin = async (req: Request, res: Response) => {
    try {
        const { name, email, password, specialty, experience } = req.body;

        if (!name || !email || !password || !specialty || !experience) {
            return res.status(400).json({ success: false, message: "All fields are required (name, email, password, specialty, experience)!" });
        }

        const existingDoc = await Doctor.findOne({ email });
        const existingPat = await Patient.findOne({ email });
        const existingAdm = await Admin.findOne({ email });

        if (existingDoc || existingPat || existingAdm) {
            return res.status(400).json({ success: false, message: "Email already exists in the system!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newDoctor = new Doctor({
            name,
            email,
            password: hashedPassword,
            specialty,
            experience,
            verificationToken,
            isVerified: false,
            detailsComplete: false
        });

        await newDoctor.save();

        const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${newDoctor.verificationToken}`;
        
        let emailSent = true;
        let emailErrorMsg = "";

        try {
            await transporter.sendMail({
                from: `no reply <${process.env.EMAIL_ID}>`,
                to: newDoctor.email,
                subject: 'Welcome to WellNest - Verify Your Doctor Account',
                html: Message(verificationUrl),
            });
        } catch (emailError) {
            emailSent = false;
            emailErrorMsg = (emailError as Error).message;
            console.error("Failed to send welcome email to doctor: ", emailError);
        }

        return res.status(201).json({
            success: true,
            message: emailSent 
                ? "Doctor added successfully and verification email sent!"
                : `Doctor added successfully, but failed to send verification email: ${emailErrorMsg}`,
            doctor: {
                id: newDoctor.id,
                name: newDoctor.name,
                email: newDoctor.email,
                specialty: newDoctor.specialty,
                experience: newDoctor.experience
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const updateDoctorStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['active', 'inactive', 'blocked', 'suspended', 'deleted'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value!" });
        }

        const doctor = await Doctor.findOneAndUpdate({ id }, { $set: { status } }, { new: true }).exec();
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found!" });
        }

        return res.status(200).json({ success: true, message: `Doctor status updated to ${status}`, doctor });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};

export const updatePatientStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['active', 'inactive', 'blocked', 'suspended', 'deleted'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status value!" });
        }

        const patient = await Patient.findOneAndUpdate({ id }, { $set: { status } }, { new: true }).exec();
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found!" });
        }

        return res.status(200).json({ success: true, message: `Patient status updated to ${status}`, patient });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
