import { IAdmin } from "../interface/IAdmin";
import Admin from "../model/Admin";

export class AdminRepository {
    async create(admin: Partial<IAdmin>): Promise<IAdmin | null> {
        const newAdmin = new Admin(admin);
        return await newAdmin.save();
    }

    async findById(id: string): Promise<IAdmin | null> {
        return await Admin.findOne({ id }).select('-password -resetToken -resetTokenExpiry').exec();
    }

    async findByIdWithPassword(id: string): Promise<IAdmin | null> {
        return await Admin.findOne({ id }).exec();
    }

    async findByEmail(email: string): Promise<IAdmin | null> {
        return await Admin.findOne({ email }).exec();
    }

    async update(id: string, updatedAdmin: Partial<IAdmin>): Promise<IAdmin | null> {
        return await Admin.findOneAndUpdate({ id }, { $set: updatedAdmin }, { new: true, runValidators: true }).exec();
    }

    async getAll(): Promise<IAdmin[]> {
        return await Admin.find().select('-password -resetToken -resetTokenExpiry').exec();
    }

    async delete(id: string): Promise<void> {
        await Admin.findOneAndDelete({ id });
    }
}
