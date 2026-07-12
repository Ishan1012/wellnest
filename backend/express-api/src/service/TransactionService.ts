import Razorpay from 'razorpay';
import crypto from 'crypto';
import { TransactionRepository } from '../repository/TransactionRepository';
import { AppointmentRepository } from '../repository/AppointmentRepository';
import { ITransaction } from '../interface/ITransaction';

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private appointmentRepository: AppointmentRepository;
  private razorpayInstance: any;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.appointmentRepository = new AppointmentRepository();
    
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    
    this.razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });
  }

  async createOrder(appointmentId: string, userId: string): Promise<any> {
    const amount = 200; // Fixed fee: ₹200 (Razorpay takes amount in paise, so 200 * 100 = 20000 paise)
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${appointmentId}`
    };

    try {
      const order = await this.razorpayInstance.orders.create(options);
      
      // Save pending transaction
      await this.transactionRepository.create({
        appointmentId,
        userId,
        orderId: order.id,
        amount,
        currency: "INR",
        status: 'pending'
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
      };
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  }

  async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<boolean> {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      // 1. Update transaction status
      const txn = await this.transactionRepository.updateStatus(orderId, 'paid', paymentId);
      if (txn) {
        // 2. Update appointment status to paid and confirm it
        await this.appointmentRepository.setPaymentStatus(txn.appointmentId, 'paid');
        await this.appointmentRepository.setStatus(txn.appointmentId, 'Confirmed');
      }
      return true;
    } else {
      await this.transactionRepository.updateStatus(orderId, 'failed');
      return false;
    }
  }

  async getTransactionByAppointmentId(appointmentId: string): Promise<ITransaction | null> {
    return await this.transactionRepository.findByAppointmentId(appointmentId);
  }
}
