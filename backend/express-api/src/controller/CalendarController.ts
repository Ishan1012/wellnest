import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { GoogleCalendarService } from "../service/GoogleCalendarService";

const googleCalendarService = new GoogleCalendarService();

export const getConnectUrl = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId || (req.user as any)?.id;
        const role = req.user?.role;
        if (!userId || !role) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const url = googleCalendarService.generateAuthUrl(userId, role);
        return res.status(200).json({ success: true, url });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const handleCallback = async (req: Request, res: Response) => {
    try {
        const { code, state } = req.query;
        if (!code || !state) {
            return res.status(400).send("Callback missing code or state parameters.");
        }

        const redirectUrl = await googleCalendarService.handleCallback(code as string, state as string);
        return res.redirect(redirectUrl);
    } catch (error: any) {
        return res.status(500).send(`Authentication failed: ${error.message}`);
    }
};

export const getStatus = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId || (req.user as any)?.id;
        const role = req.user?.role;
        if (!userId || !role) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const connected = await googleCalendarService.isConnected(userId, role);
        return res.status(200).json({ success: true, connected });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const disconnectCalendar = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId || (req.user as any)?.id;
        const role = req.user?.role;
        if (!userId || !role) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        const result = await googleCalendarService.disconnectCalendar(userId, role);
        return res.status(200).json({ success: true, message: "Disconnected successfully", disconnected: result });
    } catch (error: any) {
        return res.status(500).json({ success: false, error: error.message });
    }
};
