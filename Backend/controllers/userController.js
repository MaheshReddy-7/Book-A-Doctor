import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    let doctorProfile = null;
    if (user.role === 'doctor') {
      doctorProfile = await Doctor.findOne({ user: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        doctorProfile
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    // Parse nested address object if it's sent as a flat structure or string
    if (typeof updateData.address === 'string') {
      try {
        updateData.address = JSON.parse(updateData.address);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid address JSON format' });
      }
    }

    // Parse availability settings if updating doctor and sent as string
    if (typeof updateData.availableDays === 'string') {
      try {
        updateData.availableDays = JSON.parse(updateData.availableDays);
      } catch (err) {
        // ignore or handle
      }
    }
    if (typeof updateData.availableTime === 'string') {
      try {
        updateData.availableTime = JSON.parse(updateData.availableTime);
      } catch (err) {
        // ignore or handle
      }
    }

    // Handle profile image upload
    if (req.file) {
      updateData.profileImage = `uploads/${req.file.filename}`;
    }

    // Identify user-level and doctor-level updates
    const userFields = ['fullName', 'phone', 'gender', 'dob', 'address', 'profileImage'];
    const userUpdate = {};
    userFields.forEach(field => {
      if (updateData[field] !== undefined) {
        userUpdate[field] = updateData[field];
      }
    });

    // Update User database details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      userUpdate,
      { new: true, runValidators: true }
    );

    let updatedDoctor = null;
    if (req.user.role === 'doctor') {
      const doctorFields = [
        'qualification',
        'specialization',
        'experience',
        'hospital',
        'consultationFee',
        'about',
        'availableDays',
        'availableTime'
      ];
      
      const doctorUpdate = {};
      doctorFields.forEach(field => {
        if (updateData[field] !== undefined) {
          doctorUpdate[field] = updateData[field];
        }
      });

      if (Object.keys(doctorUpdate).length > 0) {
        updatedDoctor = await Doctor.findOneAndUpdate(
          { user: userId },
          { $set: doctorUpdate },
          { new: true, runValidators: true }
        );
      } else {
        updatedDoctor = await Doctor.findOne({ user: userId });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
        doctorProfile: updatedDoctor
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (req.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Administrator profiles cannot be self-deleted'
      });
    }

    // Delete linked Doctor profile
    if (req.user.role === 'doctor') {
      await Doctor.findOneAndDelete({ user: userId });
    }

    // Delete User
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
