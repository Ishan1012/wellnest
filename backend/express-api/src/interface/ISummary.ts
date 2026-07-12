import { Document, Types } from "mongoose";

export interface ISummary extends Document {
    appointmentId: Types.ObjectId;
    preVisitSummary?: string | undefined;
    urgencyLevel?: "low" | "medium" | "high" | "critical" | undefined;
    doctorNotes?: string | undefined;
    prescription?: string | undefined;
    postVisitSummary?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
}
