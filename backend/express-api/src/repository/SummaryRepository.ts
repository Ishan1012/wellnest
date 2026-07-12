import { Types } from "mongoose";
import { ISummary } from "../interface/ISummary";
import Summary from "../model/Summary";

export class SummaryRepository {
    async create(data: Partial<ISummary>): Promise<ISummary> {
        const summary = new Summary(data);
        return await summary.save();
    }

    async findByAppointmentObjectId(appointmentId: Types.ObjectId): Promise<ISummary | null> {
        return await Summary.findOne({ appointmentId }).exec();
    }

    async findByAppointmentId(appointmentId: string): Promise<ISummary | null> {
        return await Summary.findOne({ appointmentId: new Types.ObjectId(appointmentId) }).exec();
    }

    async update(appointmentId: Types.ObjectId, data: Partial<ISummary>): Promise<ISummary | null> {
        return await Summary.findOneAndUpdate(
            { appointmentId },
            { $set: data },
            { new: true, runValidators: true }
        ).exec();
    }

    async delete(appointmentId: Types.ObjectId): Promise<void> {
        await Summary.findOneAndDelete({ appointmentId });
    }
}
