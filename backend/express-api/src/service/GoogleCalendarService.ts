import { google } from "googleapis";
import Doctor from "../model/Doctor";
import Patient from "../model/Patient";
import { PopulatedAppointment } from "../interface/IAppointment";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALENDAR_REDIRECT_URI = `${process.env.BASE_URL || "http://localhost:5000"}/api/v1/calendar/callback`;

export class GoogleCalendarService {
    private getOAuth2Client() {
        return new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            CALENDAR_REDIRECT_URI
        );
    }

    generateAuthUrl(userId: string, role: string): string {
        const oauth2Client = this.getOAuth2Client();
        const state = JSON.stringify({ userId, role });
        
        return oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/calendar.events"],
            state: state,
            prompt: "consent"
        });
    }

    async handleCallback(code: string, stateStr: string): Promise<string> {
        try {
            const state = JSON.parse(stateStr);
            const { userId, role } = state;
            if (!userId || !role) {
                throw new Error("Invalid state parameter");
            }

            const oauth2Client = this.getOAuth2Client();
            const { tokens } = await oauth2Client.getToken(code);
            const refreshToken = tokens.refresh_token;

            if (!refreshToken) {
                throw new Error("No refresh token received. Try disconnecting and reconnecting.");
            }

            if (role === "Patient") {
                await Patient.findOneAndUpdate({ id: userId }, { googleCalendarRefreshToken: refreshToken });
            } else if (role === "Doctor") {
                await Doctor.findOneAndUpdate({ id: userId }, { googleCalendarRefreshToken: refreshToken });
            }

            return `${process.env.REDIRECT_URI || "http://localhost:3000"}/profile?calendar=connected`;
        } catch (error: any) {
            console.error("Error in Google Calendar callback:", error);
            return `${process.env.REDIRECT_URI || "http://localhost:3000"}/profile?calendar=error&message=${encodeURIComponent(error.message)}`;
        }
    }

    async disconnectCalendar(userId: string, role: string): Promise<boolean> {
        if (role === "Patient") {
            const res = await Patient.findOneAndUpdate({ id: userId }, { $unset: { googleCalendarRefreshToken: "" } });
            return !!res;
        } else if (role === "Doctor") {
            const res = await Doctor.findOneAndUpdate({ id: userId }, { $unset: { googleCalendarRefreshToken: "" } });
            return !!res;
        }
        return false;
    }

    async isConnected(userId: string, role: string): Promise<boolean> {
        if (role === "Patient") {
            const user = await Patient.findOne({ id: userId });
            return !!user?.googleCalendarRefreshToken;
        } else if (role === "Doctor") {
            const user = await Doctor.findOne({ id: userId });
            return !!user?.googleCalendarRefreshToken;
        }
        return false;
    }

    async createCalendarEvent(refreshToken: string, appointment: PopulatedAppointment): Promise<void> {
        try {
            const oauth2Client = this.getOAuth2Client();
            oauth2Client.setCredentials({ refresh_token: refreshToken });

            const calendar = google.calendar({ version: "v3", auth: oauth2Client });

            const startDateTime = this.parseAppointmentDateTime(appointment.date, appointment.time);
            const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

            const doctorName = appointment.doctor?.name || "Doctor";
            const patientName = appointment.patientInfo.name || "Patient";

            const summary = `WellNest Appointment: ${appointment.type}`;
            const description = `Medical Consultation Appointment\n\nAppointment ID: ${appointment.id}\nPatient: ${patientName}\nDoctor: Dr. ${doctorName}\nReason/Concern: ${appointment.patientInfo.concern}\n\nManaged by WellNest.`;

            await calendar.events.insert({
                calendarId: "primary",
                requestBody: {
                    summary: summary,
                    description: description,
                    start: {
                        dateTime: startDateTime.toISOString(),
                        timeZone: "UTC",
                    },
                    end: {
                        dateTime: endDateTime.toISOString(),
                        timeZone: "UTC",
                    },
                    reminders: {
                        useDefault: false,
                        overrides: [
                            { method: "email", minutes: 24 * 60 },
                            { method: "popup", minutes: 30 },
                        ],
                    },
                },
            });
            console.log(`Successfully added calendar event for ${appointment.id}`);
        } catch (error) {
            console.error("Error creating Google Calendar event:", error);
        }
    }

    async createLeaveEvent(refreshToken: string, dateStr: string, doctorName: string): Promise<void> {
        try {
            const oauth2Client = this.getOAuth2Client();
            oauth2Client.setCredentials({ refresh_token: refreshToken });

            const calendar = google.calendar({ version: "v3", auth: oauth2Client });

            const startDate = new Date(dateStr);
            const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
            const end = endDate.toISOString().split("T")[0] || dateStr;

            await calendar.events.insert({
                calendarId: "primary",
                requestBody: {
                    summary: `Out of Office: Dr. ${doctorName} on Leave`,
                    description: `Scheduled leave day. All appointments cancelled.\nManaged by WellNest.`,
                    start: {
                        date: dateStr,
                    },
                    end: {
                        date: end,
                    },
                },
            });
            console.log(`Successfully added leave event for Dr. ${doctorName} on ${dateStr}`);
        } catch (error) {
            console.error("Error creating leave event on Google Calendar:", error);
        }
    }

    async removeAppointmentEvent(refreshToken: string, appointment: any): Promise<void> {
        try {
            const oauth2Client = this.getOAuth2Client();
            oauth2Client.setCredentials({ refresh_token: refreshToken });

            const calendar = google.calendar({ version: "v3", auth: oauth2Client });

            const dateParts = appointment.date.split("-").map((num: string) => parseInt(num, 10) || 1);
            const year = dateParts[0] || 2026;
            const month = dateParts[1] || 1;
            const day = dateParts[2] || 1;
            
            const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
            const endOfDay = new Date(year, month - 1, day, 23, 59, 59);

            const response = await calendar.events.list({
                calendarId: "primary",
                timeMin: startOfDay.toISOString(),
                timeMax: endOfDay.toISOString(),
                singleEvents: true
            });

            const events = response.data.items || [];
            for (const event of events) {
                if (event.id && event.description && event.description.includes(`Appointment ID: ${appointment.id}`)) {
                    await calendar.events.delete({
                        calendarId: "primary",
                        eventId: event.id
                    });
                    console.log(`Successfully removed calendar event ${event.id} for appointment ${appointment.id}`);
                }
            }
        } catch (error) {
            console.error("Error removing Google Calendar event:", error);
        }
    }

    private parseAppointmentDateTime(dateStr: string, timeStr: string): Date {
        const timeParts = (timeStr || "12:00 PM").split(" ");
        const timeVal = timeParts[0] || "12:00";
        const modifier = timeParts[1] || "PM";
        
        const subParts = timeVal.split(":");
        const hoursStr = subParts[0] || "12";
        const minutesStr = subParts[1] || "00";

        let hours = parseInt(hoursStr, 10) || 12;
        const minutes = parseInt(minutesStr, 10) || 0;

        if (modifier === "PM" && hours < 12) {
            hours += 12;
        }
        if (modifier === "AM" && hours === 12) {
            hours = 0;
        }

        const dateParts = (dateStr || "2026-01-01").split("-").map(num => parseInt(num, 10) || 1);
        const year = dateParts[0] || 2026;
        const month = dateParts[1] || 1;
        const day = dateParts[2] || 1;
        
        return new Date(year, month - 1, day, hours, minutes);
    }
}
