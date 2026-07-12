import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateMongoId } from '../validations/schema.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);
router.use(authorize(ROLES.ADMIN));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id/block', validateMongoId('id'), handleValidationErrors, adminController.blockUser);
router.put('/users/:id/activate', validateMongoId('id'), handleValidationErrors, adminController.activateUser);

router.get('/doctors/pending', adminController.getPendingDoctors);
router.put('/doctors/:id/approve', validateMongoId('id'), handleValidationErrors, adminController.approveDoctor);
router.put('/doctors/:id/reject', validateMongoId('id'), handleValidationErrors, adminController.rejectDoctor);
router.delete('/doctors/:id', validateMongoId('id'), handleValidationErrors, adminController.deleteDoctor);

router.get('/appointments', adminController.getAppointments);

export default router;
