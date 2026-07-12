import bcrypt from "bcrypt";
import crypto from "crypto";
import { IPatient } from "../interface/IPatient";
import { DoctorService } from "./DoctorService";
import { JwtService } from "./JwtService";
import { PatientService } from "./PatientService";
import { AdminService } from "./AdminService";
import { IDoctor } from "../interface/IDoctor";
import { IAdmin } from "../interface/IAdmin";
import { AuthRequest } from "../middleware/auth";
import { AuthResponse } from "../interface/AuthResponse";
import { SignUpRequest, VerifyRequest } from "../interface/RoleRequests";
import { oauth2Client } from "../config/GoogleAuthconfig";
import axios from "axios";
import { VerificationResponse } from "../interface/VerificationResponse";
import { JwtPayload, verify } from "jsonwebtoken";
import { createTransport } from "nodemailer";
import { Message } from "../utils/Message";
import transporter from "../config/NodeMailer";
import Patient from "../model/Patient";
import Doctor from "../model/Doctor";
import Admin from "../model/Admin";

export class AuthService {
    private patientService: PatientService;
    private doctorService: DoctorService;
    private adminService: AdminService;
    private jwtService: JwtService;

    constructor() {
        this.patientService = new PatientService();
        this.doctorService = new DoctorService();
        this.adminService = new AdminService();
        this.jwtService = new JwtService();
    }

    async signUp(signUpRequest: SignUpRequest): Promise<VerificationResponse | null> {
        if (!signUpRequest.email || !signUpRequest.password || !signUpRequest.name) {
            throw new Error(`Missing required fields: \n name: ${!!signUpRequest.name}, email: ${!!signUpRequest.email}, or password: ${!!signUpRequest.password}`);
        }

        const doctor = await this.doctorService.findDoctorByEmail(signUpRequest.email);
        const patient = await this.patientService.findPatientByEmail(signUpRequest.email);
        const admin = await this.adminService.findAdminByEmail(signUpRequest.email);

        if (doctor || patient || admin) {
            return null;
        }

        const hashedPassword = await bcrypt.hash(signUpRequest.password as string, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Force role to Patient for self signups
        const createdPatient = await this.patientService.savePatient({
            name: signUpRequest.name,
            email: signUpRequest.email,
            password: hashedPassword,
            verificationToken
        });

        if (!createdPatient) {
            throw new Error("Unable to create new Patient!");
        }

        const token = this.jwtService.generateToken(createdPatient?.email, "Patient", createdPatient?.id);

        const verificationUrl = `${process.env.BASE_URL}/api/v1/auth/verify/${createdPatient.verificationToken}`;
        
        try {
            await transporter.sendMail({
                from: `no reply <${process.env.EMAIL_ID}>`,
                to: createdPatient.email,
                subject: 'Verify Your Email',
                html: Message(verificationUrl),
            });
        } catch (emailError) {
            console.error("Failed to send verification email to patient: ", emailError);
        }

        return { token: token, email: createdPatient.email, name: createdPatient.name, verificationToken };
    }

    async signIn(email: string, password: string): Promise<AuthResponse | null> {
        if (!email || !password) {
            throw new Error(`Following details not defined!\n Please provide following to proceed:\n email: ${!!email}, password: ${!!password}`);
        }

        const patient = await this.patientService.findPatientByEmail(email);
        const doctor = await this.doctorService.findDoctorByEmail(email);
        const admin = await this.adminService.findAdminByEmail(email);

        if (!patient && !doctor && !admin) {
            return null;
        }

        if (patient) {
            const isPasswordValid = await bcrypt.compare(password, patient.password as string);

            if (isPasswordValid) {
                const token = this.jwtService.generateToken(patient.email, "Patient", patient.id);
                return { token: token, email: patient.email, name: patient.name };
            }

            return null;
        } else if (doctor) {
            const isPasswordValid = await bcrypt.compare(password, doctor.password as string);

            if (isPasswordValid) {
                const token = this.jwtService.generateToken(doctor.email, "Doctor", doctor.id);
                return { token: token, email: doctor.email, name: doctor.name };
            }

            return null;
        } else if (admin) {
            const isPasswordValid = await bcrypt.compare(password, admin.password as string);

            if (isPasswordValid) {
                const token = this.jwtService.generateToken(admin.email, "Admin", admin.id);
                return { token: token, email: admin.email, name: admin.name };
            }

            return null;
        } else {
            throw new Error('Invalid user type');
        }
    }

    async getPatientById(patientId: string): Promise<Partial<IPatient> | null> {
        const patient = await this.patientService.findPatientById(patientId);

        if (!patient) {
            return null;
        }

        const patientObj = patient.toObject();
        return patientObj;
    }

    async getDoctorById(doctorId: string): Promise<Partial<IDoctor> | null> {
        const doctor = await this.doctorService.findDoctorById(doctorId);

        if (!doctor) {
            return null;
        }

        const doctorObj = doctor.toObject();
        const { _id, password, ...rest } = doctorObj;
        return rest;
    }

    async getAdminById(adminId: string): Promise<Partial<IAdmin> | null> {
        const admin = await this.adminService.findAdminById(adminId);

        if (!admin) {
            return null;
        }

        const adminObj = admin.toObject();
        const { password, ...rest } = adminObj;
        return rest;
    }

    async forgotPassword(email: string): Promise<boolean> {
        let user: any = null;

        user = await Patient.findOne({ email });
        if (!user) {
            user = await Doctor.findOne({ email });
        }
        if (!user) {
            user = await Admin.findOne({ email });
        }

        if (!user) {
            return false;
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        const resetUrl = `${process.env.REDIRECT_URI || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        
        await transporter.sendMail({
            from: `no reply <${process.env.EMAIL_ID}>`,
            to: user.email,
            subject: 'Reset Your Password',
            html: `
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <table width="500" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff; font-family: 'Comic Relief', system-ui; border-radius: 10px; padding: 20px; border: 1px solid #e5e7eb;">
                                <tr>
                                    <td align="center">
                                        <h1 style="font-size: 1.7rem; color: #065f46;">Reset Your Password</h1>
                                        <p style="margin-top: 10px; font-size: 1rem; text-align: center; color: #374151;">You requested to reset your password. Please click the button below to set a new password:</p>
                                        <br><br>
                                        <a style="text-decoration: none; color: #fff; background-color: #059669; padding: 15px 20px; font-size: 1.2rem; border-radius: 8px; font-weight: bold;" href="${resetUrl}" target="_blank">RESET PASSWORD</a>
                                        <br><br>
                                        <p style="margin-top: 20px; font-size: 0.8rem; color: #6b7280;">This link will expire in 1 hour.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            `
        });

        return true;
    }

    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        if (!token) return false;

        let user = await Patient.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
        if (!user) {
            user = await Doctor.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } }) as any;
        }
        if (!user) {
            user = await Admin.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } }) as any;
        }

        if (!user) {
            return false;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return true;
    }

    async signInByGoogle(code: string, role: string): Promise<AuthResponse | null> {
        const googleResponse = await oauth2Client.getToken({
            code,
            redirect_uri: "postmessage"
        });
        const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`);

        const { email, name, verified_email, picture } = userResponse.data;

        let userInfo;
        if (role === "Patient") {
            userInfo = await this.doctorService.findDoctorByEmail(email);
            if (!!userInfo) {
                role = "Doctor";
            }
            if (!userInfo) {
                userInfo = await this.patientService.findPatientByEmail(email);
            }
            if (!userInfo) {
                userInfo = await this.patientService.savePatient({
                    name,
                    email,
                    password: '',
                    isVerified: verified_email,
                    profileUrl: picture,
                    isOAuth: true
                });
            }
        } else if (role === "Doctor") {
            userInfo = await this.patientService.findPatientByEmail(email);
            if (!!userInfo) {
                role = "Patient";
            }
            if (!userInfo) {
                userInfo = await this.doctorService.findDoctorByEmail(email);
            }
            if (!userInfo) {
                userInfo = await this.doctorService.saveDoctor({
                    name,
                    email,
                    password: '',
                    isVerified: verified_email,
                    profileUrl: picture,
                    isOAuth: true
                });
            }
        } else {
            throw new Error('Invalid user role');
        }

        if (!userInfo || !userInfo.id) {
            throw new Error('Unable to save user in the database');
        }

        const token = this.jwtService.generateToken(email, role, userInfo.id);
        return { token, email, name, profile: userInfo.profileUrl || '' };
    }

    async verifyToken(token: string): Promise<boolean | null> {
        const doctor: IDoctor | null = await this.doctorService.getDoctorByVerificationToken(token);

        if (!doctor) {
            const patient: IPatient | null = await this.patientService.getPatientByVerificationToken(token);

            if (!patient) {
                return false;
            }

            patient.isVerified = true;
            patient.verificationToken = undefined;
            await patient.save();

            return true;
        } else {
            doctor.isVerified = true;
            doctor.verificationToken = undefined;
            await doctor.save();

            return true;
        }
    }
}