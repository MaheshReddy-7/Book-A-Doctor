import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { updateProfileValidator } from '../validations/schema.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(userController.getProfile)
  .put(upload.single('profileImage'), updateProfileValidator, handleValidationErrors, userController.updateProfile)
  .delete(userController.deleteProfile);

export default router;
