import Transaction from "../model/Transaction";
import { ITransaction } from "../interface/ITransaction";

export class TransactionRepository {
  async create(record: Partial<ITransaction>): Promise<ITransaction | null> {
    const newRecord = new Transaction(record);
    return await newRecord.save();
  }

  async findByOrderId(orderId: string): Promise<ITransaction | null> {
    return await Transaction.findOne({ orderId }).exec();
  }

  async findByAppointmentId(appointmentId: string): Promise<ITransaction | null> {
    return await Transaction.findOne({ appointmentId }).exec();
  }

  async updateStatus(orderId: string, status: 'pending' | 'paid' | 'failed' | 'refunded', paymentId?: string): Promise<ITransaction | null> {
    const updateData: any = { status };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    return await Transaction.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true }
    ).exec();
  }
}
