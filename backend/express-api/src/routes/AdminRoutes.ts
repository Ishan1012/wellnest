import { Router } from "express";
import {
    getStats,
    getDoctors,
    getPatients,
    getAppointments,
    addDoctorByAdmin,
    updateDoctorStatus,
    updatePatientStatus
} from "../controller/AdminController";
import { verifyToken, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

// Apply auth middleware to all admin routes
router.use(verifyToken);
router.use(requireAdmin);

router.get("/stats", getStats);
router.get("/doctors", getDoctors);
router.get("/patients", getPatients);
router.get("/appointments", getAppointments);
router.post("/doctor", addDoctorByAdmin);
router.patch("/doctor/:id/status", updateDoctorStatus);
router.patch("/patient/:id/status", updatePatientStatus);

export default router;
