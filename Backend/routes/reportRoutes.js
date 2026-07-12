import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { validateMongoId } from '../validations/schema.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('report'), reportController.uploadReport);
router.get('/:id', validateMongoId('id'), handleValidationErrors, reportController.getReportById);
router.delete('/:id', validateMongoId('id'), handleValidationErrors, reportController.deleteReport);

export default router;
