import { Schema, model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ITransaction } from '../interface/ITransaction';

const transactionSchema = new Schema<ITransaction>({
  id: {
    type: String,
    default: () => "TXN" + uuidv4().replace(/-/g, "").slice(0, 10),
    unique: true
  },
  appointmentId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  paymentId: {
    type: String,
    default: ""
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
