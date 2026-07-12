import { Router } from "express";
import { verifyToken } from "../middleware/authMiddleware";
import { 
    getAllDoctors, 
    getAllRegisteredDoctors, 
    getAvailabilityAndTimeSlots, 
    getDoctorBySpecialty, 
    isDoctorPhoneVerified, 
    isDoctorVerified, 
    updateDoctor,
    scheduleDoctorLeave
} from "../controller/DoctorController";

const router = Router();

router.get('/verified/:id', verifyToken, isDoctorVerified);
router.get('/verified/phone/:id', verifyToken, isDoctorPhoneVerified);
router.get('/available/:id', verifyToken, getAvailabilityAndTimeSlots);
router.get('/registered/', getAllRegisteredDoctors);
router.get('/:specialty', verifyToken, getDoctorBySpecialty);
router.put('/', verifyToken, updateDoctor);
router.get('/', verifyToken, getAllDoctors);
router.post('/leave', verifyToken, scheduleDoctorLeave);

export default router;