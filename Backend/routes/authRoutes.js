import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} from '../validations/schema.js';

const router = express.Router();

router.post('/register', registerValidator, handleValidationErrors, authController.register);
router.post('/login', loginValidator, handleValidationErrors, authController.login);
router.post('/logout', authController.logout);
router.post('/change-password', protect, changePasswordValidator, handleValidationErrors, authController.changePassword);
router.post('/forgot-password', forgotPasswordValidator, handleValidationErrors, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, handleValidationErrors, authController.resetPassword);

export default router;
