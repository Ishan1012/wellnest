import { Router } from "express";
import { getConnectUrl, handleCallback, getStatus, disconnectCalendar } from "../controller/CalendarController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.get("/connect", verifyToken, getConnectUrl);
router.get("/callback", handleCallback);
router.get("/status", verifyToken, getStatus);
router.post("/disconnect", verifyToken, disconnectCalendar);

export default router;
