import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { createOrder, verifyPayment, getTransaction } from "../controller/TransactionController";

const router = Router();

router.post('/create-order', verifyToken, createOrder);
router.post('/verify', verifyToken, verifyPayment);
router.get('/:appointmentId', verifyToken, getTransaction);

export default router;
