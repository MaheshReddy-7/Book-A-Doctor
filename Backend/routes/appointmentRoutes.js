import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { appointmentValidator, validateMongoId } from '../validations/schema.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(appointmentController.getAppointments)
  .post(authorize(ROLES.PATIENT), appointmentValidator, handleValidationErrors, appointmentController.createAppointment);

router.route('/:id')
  .get(validateMongoId('id'), handleValidationErrors, appointmentController.getAppointmentById)
  .put(validateMongoId('id'), handleValidationErrors, appointmentController.updateAppointment)
  .delete(authorize(ROLES.ADMIN), validateMongoId('id'), handleValidationErrors, appointmentController.deleteAppointment);

export default router;
