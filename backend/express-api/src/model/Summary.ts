import { model, Schema } from "mongoose";
import { ISummary } from "../interface/ISummary";

const summarySchema = new Schema<ISummary>({
    appointmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Appointments',
        required: true,
        unique: true
    },
    preVisitSummary: { type: String },
    urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical']
    },
    doctorNotes: { type: String },
    prescription: { type: String },
    postVisitSummary: { type: String }
}, { timestamps: true });

const Summary = model<ISummary>('Summary', summarySchema);

export default Summary;
