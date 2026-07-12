import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { getSummary, submitDoctorNotes } from "../controller/SummaryController";

const router = Router();

router.get("/:appointmentId", verifyToken, getSummary);
router.post("/:appointmentId/doctor-notes", verifyToken, submitDoctorNotes);

export default router;
