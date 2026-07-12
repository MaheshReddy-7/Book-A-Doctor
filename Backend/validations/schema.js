import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { ROLES } from '../constants/roles.js';

export const validateMongoId = (fieldName) => {
  return [
    param(fieldName)
      .custom((value) => mongoose.Types.ObjectId.isValid(value))
      .withMessage(`Invalid ID format for parameter: ${fieldName}`)
  ];
};

export const registerValidator = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email is already in use');
      }
      return true;
    }),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage('Invalid phone number format. Should be 7 to 15 digits'),

  body('gender')
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('dob')
    .notEmpty()
    .withMessage('Date of birth is required')
    .isISO8601()
    .withMessage('Date of birth must be a valid date (YYYY-MM-DD)')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      if (selectedDate >= today) {
        throw new Error('Date of birth must be in the past');
      }
      return true;
    }),

  body('address')
    .notEmpty()
    .withMessage('Address is required'),
  
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street name is required'),

  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City name is required'),

  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State name is required'),

  body('address.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),

  body('role')
    .optional()
    .isIn(Object.values(ROLES))
    .withMessage('Invalid user role'),

  // If registering as a doctor, validate these extra fields if provided
  body('qualification')
    .if(body('role').equals(ROLES.DOCTOR))
    .trim()
    .notEmpty()
    .withMessage('Qualification is required for doctors'),

  body('specialization')
    .if(body('role').equals(ROLES.DOCTOR))
    .trim()
    .notEmpty()
    .withMessage('Specialization is required for doctors'),

  body('experience')
    .if(body('role').equals(ROLES.DOCTOR))
    .notEmpty()
    .withMessage('Experience is required for doctors')
    .isInt({ min: 0 })
    .withMessage('Experience must be a positive integer'),

  body('hospital')
    .if(body('role').equals(ROLES.DOCTOR))
    .trim()
    .notEmpty()
    .withMessage('Hospital name is required for doctors'),

  body('consultationFee')
    .if(body('role').equals(ROLES.DOCTOR))
    .notEmpty()
    .withMessage('Consultation fee is required for doctors')
    .isFloat({ min: 0 })
    .withMessage('Consultation fee must be a positive number')
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('New password must contain at least one number')
];

export const forgotPasswordValidator = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Must be a valid email address')
];

export const resetPasswordValidator = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
];

export const updateProfileValidator = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage('Invalid phone number format'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('dob')
    .optional()
    .isISO8601()
    .withMessage('Date of birth must be a valid date'),

  body('address.street').optional().trim().notEmpty().withMessage('Street cannot be empty'),
  body('address.city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('address.state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('address.zipCode').optional().trim().notEmpty().withMessage('Zip code cannot be empty'),

  // Doctor optional fields if user is updating doctor profile
  body('qualification').optional().trim().notEmpty().withMessage('Qualification cannot be empty'),
  body('specialization').optional().trim().notEmpty().withMessage('Specialization cannot be empty'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive integer'),
  body('hospital').optional().trim().notEmpty().withMessage('Hospital cannot be empty'),
  body('consultationFee').optional().isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number'),
  body('about').optional().trim(),
  body('availableDays').optional().isArray().withMessage('Available days must be an array of strings'),
  body('availableTime.start').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be in HH:MM format'),
  body('availableTime.end').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be in HH:MM format')
];

export const appointmentValidator = [
  body('doctor')
    .notEmpty()
    .withMessage('Doctor ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid Doctor ID format'),

  body('date')
    .notEmpty()
    .withMessage('Appointment date is required')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        throw new Error('Appointment date cannot be in the past');
      }
      return true;
    }),

  body('time')
    .notEmpty()
    .withMessage('Appointment time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),

  body('symptoms')
    .trim()
    .notEmpty()
    .withMessage('Symptoms description is required'),

  body('notes')
    .optional()
    .trim()
];

export const prescriptionValidator = [
  body('appointment')
    .notEmpty()
    .withMessage('Appointment ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid Appointment ID format'),
  body('notes')
    .optional()
    .trim()
];
