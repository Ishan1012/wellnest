import { Router } from "express";
import { requireAdmin, requireAdminRoleOrDoctorRole, verifyToken } from "../middleware/authMiddleware";
import { 
    createAppointment, 
    deleteAppointment, 
    findAppointmentByDoctorId, 
    findAppointmentById, 
    findAppointmentByUserId, 
    getAllAppointments, 
    getStatusOfAppointment, 
    setStatusOfAppointment,
    getMyAppointmentsForDoctor
} from "../controller/AppointmentController";

const router = Router();

router.post('/', verifyToken, createAppointment);
router.get('/doctor/me', verifyToken, getMyAppointmentsForDoctor);
router.get('/:id', verifyToken, findAppointmentById);
router.get('/user/:userId', verifyToken, findAppointmentByUserId);
router.get('/patient/:doctorId', verifyToken, findAppointmentByDoctorId);
router.get('/status/:id', verifyToken, getStatusOfAppointment);
router.put('/status/:id', verifyToken, setStatusOfAppointment);
router.get('/', verifyToken, requireAdmin, getAllAppointments);
router.delete('/:id', verifyToken, requireAdminRoleOrDoctorRole, deleteAppointment);

export default router;