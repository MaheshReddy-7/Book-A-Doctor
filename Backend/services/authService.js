import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import { ROLES, APPROVAL_STATUS } from '../constants/roles.js';

// Helper to generate JWT Token
export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const registerUser = async (userData) => {
  const { fullName, email, password, phone, gender, dob, address, role } = userData;

  // 1. Create the User record
  const user = new User({
    fullName,
    email,
    password,
    phone,
    gender,
    dob,
    address,
    role: role || ROLES.PATIENT
  });

  await user.save();

  // 2. If registering as a doctor, initialize the Doctor collection document too
  if (user.role === ROLES.DOCTOR) {
    const { qualification, specialization, experience, hospital, consultationFee } = userData;
    const doctorProfile = new Doctor({
      user: user._id,
      qualification,
      specialization,
      experience,
      hospital,
      consultationFee,
      approvalStatus: APPROVAL_STATUS.PENDING
    });
    await doctorProfile.save();
  }

  const token = generateToken(user._id, user.role);

  // Exclude password from the returned user object
  user.password = undefined;

  return { user, token };
};

export const loginUser = async (email, password) => {
  // Find user and select password since it is excluded by default
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id, user.role);
  user.password = undefined;

  // If doctor, fetch doctor details too
  let doctorProfile = null;
  if (user.role === ROLES.DOCTOR) {
    doctorProfile = await Doctor.findOne({ user: user._id });
  }

  return { user, token, doctorProfile };
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();
  return true;
};

export const processForgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('No user found with this email address');
  }

  // Generate short-lived reset token (15 mins)
  const resetToken = jwt.sign({ email: user.email, type: 'reset' }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });

  // Return reset token for client application placeholder/API testing
  return {
    resetToken,
    message: 'Reset token generated successfully. For testing purposes, use this token in the /api/auth/reset-password request.'
  };
};

export const processResetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'reset') {
      throw new Error('Invalid reset token');
    }

    const user = await User.findOne({ email: decoded.email }).select('+password');
    if (!user) {
      throw new Error('User not found');
    }

    user.password = newPassword;
    await user.save();
    return true;
  } catch (error) {
    throw new Error(error.message || 'Token is invalid or has expired');
  }
};
