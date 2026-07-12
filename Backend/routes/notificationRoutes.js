import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { validateMongoId } from '../validations/schema.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

router.get('/', notificationController.getNotifications);
router.put('/read/:id', validateMongoId('id'), handleValidationErrors, notificationController.markRead);
router.delete('/:id', validateMongoId('id'), handleValidationErrors, notificationController.deleteNotification);

export default router;
