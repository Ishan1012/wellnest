import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { TransactionService } from "../service/TransactionService";

const transactionService = new TransactionService();

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user?.userId || (req.user as any)?.id || (req.user as any)?.userId;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "appointmentId is required!" });
    }

    if (!userId) {
      return res.status(403).json({ success: false, message: "Unauthorized!" });
    }

    const orderDetails = await transactionService.createOrder(appointmentId, userId);
    return res.status(201).json({ success: true, ...orderDetails });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to create payment order", error: error.message });
  }
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({ success: false, message: "Missing required parameters (orderId, paymentId, signature)!" });
    }

    const verified = await transactionService.verifyPayment(orderId, paymentId, signature);

    if (verified) {
      return res.status(200).json({ success: true, message: "Payment verified and appointment confirmed!" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid payment signature!" });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to verify payment", error: error.message });
  }
};

export const getTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "appointmentId is required!" });
    }

    const transaction = await transactionService.getTransactionByAppointmentId(appointmentId);
    return res.status(200).json({ success: true, transaction });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: "Failed to retrieve transaction", error: error.message });
  }
};
