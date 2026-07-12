import express from 'express';
import * as doctorController from '../controllers/doctorController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { updateProfileValidator, validateMongoId } from '../validations/schema.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

// Public routes
router.get('/', doctorController.getDoctors);
router.get('/:id', validateMongoId('id'), handleValidationErrors, doctorController.getDoctorById);

// Protected routes
router.post('/', protect, authorize(ROLES.DOCTOR), updateProfileValidator, handleValidationErrors, doctorController.createOrUpdateDoctorProfile);
router.put('/:id', protect, validateMongoId('id'), handleValidationErrors, updateProfileValidator, handleValidationErrors, doctorController.updateDoctorById);
router.delete('/:id', protect, authorize(ROLES.ADMIN), validateMongoId('id'), handleValidationErrors, doctorController.deleteDoctorById);

export default router;
