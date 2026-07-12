import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { AuthRequest } from "../middleware/auth";
import { AuthResponse } from "../interface/AuthResponse";
import { VerificationPage } from "../utils/Message";
import { VerificationResponse } from "../interface/VerificationResponse";

const authService: AuthService = new AuthService();

export const signup = async (req: Request, res: Response) => {
    try {
        const createdUser: VerificationResponse | null = await authService.signUp(req.body);

        if (!createdUser) {
            return res.status(400).json({ success: false, message: "Email already exists or unable to create user!" });
        }

        const responseUser: AuthResponse = {
            token: createdUser.token,
            email: createdUser.email,
            name: createdUser.name,
            profile: createdUser.profile
        }

        return res.status(201).json({ success: true, message: "User is created successfully!", user: responseUser });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const userDetails: AuthResponse | null = await authService.signIn(email, password);

        if (!userDetails) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        return res.status(200).json({ success: true, message: "User is logged in successfully!", userDetails });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const signInByGoogle = async (req: Request, res: Response) => {
    const { code, role } = req.body;

    try {
        const userDetails: AuthResponse | null = await authService.signInByGoogle(code, role);

        if (!userDetails) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        return res.status(200).json({ success: true, message: "User is logged in successfully!", userDetails });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const verifyUser = async (req: AuthRequest, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(403).json({ success: false, message: "verificationToken is required!" });
        }

        const verified = await authService.verifyToken(token);

        if(verified) {
            res.status(200).send(VerificationPage());
        } else {
            return res.status(403).json({ success: false, message: "Invalid or expired token." });
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
}

export const me = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ success: false, message: "No user found!" });
        }

        if (!user.userId) {
            return res.status(401).json({ success: false, message: "No userId found!" });
        }

        if (user.role === "Patient") {
            const patient = await authService.getPatientById(user.userId);
            if (!patient) {
                return res.status(404).json({ success: false, message: "Patient not found!" });
            }
            return res.status(200).json({ success: true, user: patient });
        } else if (user.role === "Doctor") {
            const doctor = await authService.getDoctorById(user.userId);
            if (!doctor) {
                return res.status(404).json({ success: false, message: "Doctor not found!" });
            }
            return res.status(200).json({ success: true, user: doctor });
        } else if (user.role === "Admin") {
            const admin = await authService.getAdminById(user.userId);
            if (!admin) {
                return res.status(404).json({ success: false, message: "Admin not found!" });
            }
            return res.status(200).json({ success: true, user: admin });
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized user role!" });
        }
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required!" });
        }

        const sent = await authService.forgotPassword(email);
        if (!sent) {
            return res.status(404).json({ success: false, message: "No account found with this email!" });
        }

        return res.status(200).json({ success: true, message: "Password reset link sent to your email!" });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ success: false, message: "Token and password are required!" });
        }

        const updated = await authService.resetPassword(token, password);
        if (!updated) {
            return res.status(400).json({ success: false, message: "Invalid or expired password reset token!" });
        }

        return res.status(200).json({ success: true, message: "Password has been reset successfully!" });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        } else {
            return res.status(500).json({ success: false, message: "Internal server error", error: String(error) });
        }
    }
};
