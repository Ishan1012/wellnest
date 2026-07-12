import { Document } from "mongoose";

export interface IAdmin extends Document {
    id: string;
    name: string;
    email: string;
    password?: string;
    profileUrl?: string;
    resetToken?: string | undefined;
    resetTokenExpiry?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
}
