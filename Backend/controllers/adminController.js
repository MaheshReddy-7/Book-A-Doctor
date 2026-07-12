import * as adminService from '../services/adminService.js';
import * as appointmentService from '../services/appointmentService.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, search, page, limit } = req.query;
    const result = await adminService.getUsersListForAdmin({ role, search }, { page, limit });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const blockUser = async (req, res, next) => {
  try {
    const user = await adminService.updateAccountStatus(req.params.id, 'blocked');
    res.status(200).json({
      success: true,
      message: 'User account has been blocked successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const activateUser = async (req, res, next) => {
  try {
    const user = await adminService.updateAccountStatus(req.params.id, 'active');
    res.status(200).json({
      success: true,
      message: 'User account has been activated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingDoctors = async (req, res, next) => {
  try {
    const list = await adminService.getPendingDoctorsList();
    res.status(200).json({
      success: true,
      data: list
    });
  } catch (error) {
    next(error);
  }
};

export const approveDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.updateDoctorApproval(req.params.id, 'approved');
    res.status(200).json({
      success: true,
      message: 'Doctor profile has been approved successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

export const rejectDoctor = async (req, res, next) => {
  try {
    const doctor = await adminService.updateDoctorApproval(req.params.id, 'rejected');
    res.status(200).json({
      success: true,
      message: 'Doctor profile has been rejected successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

export const deleteDoctor = async (req, res, next) => {
  try {
    await adminService.deleteDoctorProfile(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Doctor profile and associated user account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const result = await appointmentService.getAppointmentsList(
      req.user._id,
      req.user.role,
      { page, limit, status }
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
