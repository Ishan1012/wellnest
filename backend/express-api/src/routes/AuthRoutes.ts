import { Router } from "express";
import { me, signin, signInByGoogle, signup, verifyUser, forgotPassword, resetPassword } from "../controller/AuthController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signin/google', signInByGoogle);
router.get('/me', verifyToken, me);
router.get('/verify/:token', verifyUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;