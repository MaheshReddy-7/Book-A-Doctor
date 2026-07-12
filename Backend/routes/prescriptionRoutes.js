import express from 'express';
import * as prescriptionController from '../controllers/prescriptionController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { validateMongoId } from '../validations/schema.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.post('/', authorize(ROLES.DOCTOR), upload.single('prescription'), prescriptionController.createPrescription);
router.get('/:id', validateMongoId('id'), handleValidationErrors, prescriptionController.getPrescriptionById);
router.put('/:id', authorize(ROLES.DOCTOR), validateMongoId('id'), handleValidationErrors, upload.single('prescription'), prescriptionController.updatePrescription);

export default router;
