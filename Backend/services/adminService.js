import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Appointment from '../models/Appointment.js';
import { ROLES, ACCOUNT_STATUS, APPROVAL_STATUS, APPOINTMENT_STATUS } from '../constants/roles.js';
import { createNotification } from './notificationService.js';

export const getDashboardStats = async () => {
  const [
    totalPatients,
    totalDoctors,
    pendingDoctors,
    totalAppointments,
    statusCounts,
    revenueData
  ] = await Promise.all([
    User.countDocuments({ role: ROLES.PATIENT }),
    Doctor.countDocuments({ approvalStatus: APPROVAL_STATUS.APPROVED }),
    Doctor.countDocuments({ approvalStatus: APPROVAL_STATUS.PENDING }),
    Appointment.countDocuments(),
    Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Appointment.aggregate([
      {
        $match: {
          status: { $in: [APPOINTMENT_STATUS.COMPLETED, APPOINTMENT_STATUS.ACCEPTED] }
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorDetails'
        }
      },
      { $unwind: '$doctorDetails' },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$doctorDetails.consultationFee' }
        }
      }
    ])
  ]);

  const appointmentsByStatus = {
    pending: 0,
    accepted: 0,
    rejected: 0,
    cancelled: 0,
    completed: 0
  };

  statusCounts.forEach(item => {
    if (appointmentsByStatus[item._id] !== undefined) {
      appointmentsByStatus[item._id] = item.count;
    }
  });

  const estimatedRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  return {
    totalPatients,
    totalDoctors,
    pendingDoctors,
    totalAppointments,
    appointmentsByStatus,
    estimatedRevenue
  };
};

export const getUsersListForAdmin = async (filters = {}, pagination = {}) => {
  const { role, search } = filters;
  const { page = 1, limit = 10 } = pagination;
  const skip = (page - 1) * limit;

  const query = {};
  if (role) {
    query.role = role;
  }
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    users,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};

export const updateAccountStatus = async (userId, status) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === ROLES.ADMIN) {
    throw new Error('Cannot block/activate an administrator');
  }

  user.status = status;
  await user.save();

  await createNotification(
    userId,
    `Account Status Updated`,
    `Your account status has been updated to '${status}' by the administrator.`,
    'system'
  );

  return user;
};

export const deleteUserAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === ROLES.ADMIN) {
    throw new Error('Cannot delete an administrator account');
  }

  // If it's a doctor, delete the doctor profile as well
  if (user.role === ROLES.DOCTOR) {
    await Doctor.findOneAndDelete({ user: userId });
  }

  // Delete User
  await User.findByIdAndDelete(userId);
  return true;
};

export const getPendingDoctorsList = async () => {
  return await Doctor.find({ approvalStatus: APPROVAL_STATUS.PENDING })
    .populate('user', 'fullName email phone gender dob address profileImage');
};

export const updateDoctorApproval = async (doctorId, status) => {
  if (![APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.REJECTED].includes(status)) {
    throw new Error('Invalid approval status');
  }

  const doctor = await Doctor.findById(doctorId).populate('user');
  if (!doctor) {
    throw new Error('Doctor profile not found');
  }

  doctor.approvalStatus = status;
  await doctor.save();

  // Notify the Doctor user
  await createNotification(
    doctor.user._id,
    `Doctor Profile ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    `Your doctor application status has been marked as ${status} by the administrator.`,
    'profile'
  );

  return doctor;
};

export const deleteDoctorProfile = async (doctorId) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error('Doctor profile not found');
  }

  const userId = doctor.user;

  // Delete Doctor profile
  await Doctor.findByIdAndDelete(doctorId);

  // Downgrade or delete associated user? To be safe, we also delete the user account to clean up fully.
  await User.findByIdAndDelete(userId);

  return true;
};
