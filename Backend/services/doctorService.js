import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { APPROVAL_STATUS } from '../constants/roles.js';

export const getApprovedDoctors = async (filters = {}, pagination = {}) => {
  const { search, specialization, minFee, maxFee, availableDay } = filters;
  const { page = 1, limit = 10 } = pagination;

  const query = { approvalStatus: APPROVAL_STATUS.APPROVED };

  // 1. Filter by Specialization
  if (specialization) {
    query.specialization = { $regex: specialization, $options: 'i' };
  }

  // 2. Filter by consultation fee range
  if (minFee || maxFee) {
    query.consultationFee = {};
    if (minFee) query.consultationFee.$gte = Number(minFee);
    if (maxFee) query.consultationFee.$lte = Number(maxFee);
  }

  // 3. Filter by availability day
  if (availableDay) {
    query.availableDays = { $in: [availableDay] };
  }

  // 4. Name search (if search is provided, we look up User IDs with matching names)
  if (search) {
    const matchingUsers = await User.find({
      fullName: { $regex: search, $options: 'i' }
    }).select('_id');
    const userIds = matchingUsers.map(u => u._id);
    query.user = { $in: userIds };
  }

  const skip = (page - 1) * limit;

  const total = await Doctor.countDocuments(query);
  const doctors = await Doctor.find(query)
    .populate('user', 'fullName email phone gender dob address profileImage')
    .sort({ rating: -1, createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    doctors,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};

export const getDoctorDetails = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId).populate(
    'user',
    'fullName email phone gender dob address profileImage'
  );
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  return doctor;
};

export const getDoctorDetailsByUserId = async (userId) => {
  const doctor = await Doctor.findOne({ user: userId }).populate(
    'user',
    'fullName email phone gender dob address profileImage'
  );
  if (!doctor) {
    throw new Error('Doctor profile not found');
  }
  return doctor;
};

export const updateDoctorProfileData = async (userId, updateData) => {
  // Find the doctor record
  const doctor = await Doctor.findOne({ user: userId });
  if (!doctor) {
    throw new Error('Doctor profile not found');
  }

  const userFields = ['fullName', 'phone', 'gender', 'dob', 'address'];
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

  // 1. Update User fields
  const userUpdate = {};
  userFields.forEach(field => {
    if (updateData[field] !== undefined) {
      userUpdate[field] = updateData[field];
    }
  });

  if (Object.keys(userUpdate).length > 0) {
    await User.findByIdAndUpdate(userId, userUpdate, { new: true, runValidators: true });
  }

  // 2. Update Doctor fields
  doctorFields.forEach(field => {
    if (updateData[field] !== undefined) {
      if (field === 'availableTime') {
        doctor.availableTime = {
          ...doctor.availableTime,
          ...updateData.availableTime
        };
      } else {
        doctor[field] = updateData[field];
      }
    }
  });

  await doctor.save();

  return await Doctor.findOne({ user: userId }).populate(
    'user',
    'fullName email phone gender dob address profileImage'
  );
};
