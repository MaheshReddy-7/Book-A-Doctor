import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    // If invalid credentials, set status code to 401
    const err = new Error(error.message);
    err.statusCode = 401;
    next(err);
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changeUserPassword(req.user._id, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.processForgotPassword(req.body.email);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 404;
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.processResetPassword(token, password);
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    const err = new Error(error.message);
    err.statusCode = 400;
    next(err);
  }
};
