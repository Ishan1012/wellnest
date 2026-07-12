import { Document, Types } from "mongoose";

export interface ITransaction extends Document {
  id: string;
  appointmentId: string;
  userId: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}
