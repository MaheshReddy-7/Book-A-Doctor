import * as doctorService from '../services/doctorService.js';
import Doctor from '../models/Doctor.js';

export const getDoctors = async (req, res, next) => {
  try {
    const { search, specialization, minFee, maxFee, availableDay, page, limit } = req.query;
    const result = await doctorService.getApprovedDoctors(
      { search, specialization, minFee, maxFee, availableDay },
      { page, limit }
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorDetails(req.params.id);
    res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

// Create or update doctor profile (by the Doctor user themselves)
export const createOrUpdateDoctorProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can access this endpoint'
      });
    }

    const updatedProfile = await doctorService.updateDoctorProfileData(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

// Admin or Doctor update
export const updateDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Authorization check: User must be Admin, or must be the doctor user owner of the profile
    if (req.user.role !== 'admin' && doctor.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this doctor profile'
      });
    }

    const updatedProfile = await doctorService.updateDoctorProfileData(doctor.user, req.body);
    res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

// Delete doctor profile (Admin only)
export const deleteDoctorById = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    await doctorService.deleteDoctorProfile(doctorId);
    
    res.status(200).json({
      success: true,
      message: 'Doctor profile and associated user account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
