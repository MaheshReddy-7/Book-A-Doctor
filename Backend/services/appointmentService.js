import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';
import { APPOINTMENT_STATUS, ROLES, APPROVAL_STATUS } from '../constants/roles.js';
import { createNotification } from './notificationService.js';

export const createAppointment = async (patientId, doctorId, dateStr, time, symptoms, notes) => {
  // 1. Check doctor existence and approval status
  const doctor = await Doctor.findById(doctorId).populate('user');
  if (!doctor || doctor.approvalStatus !== APPROVAL_STATUS.APPROVED) {
    throw new Error('Doctor is not available for bookings');
  }

  const appointmentDate = new Date(dateStr);
  appointmentDate.setHours(0, 0, 0, 0);

  // 2. Check for duplicate appointment (same doctor, same date, same time)
  const existingDocBooking = await Appointment.findOne({
    doctor: doctorId,
    date: appointmentDate,
    time,
    status: { $in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.ACCEPTED] }
  });
  if (existingDocBooking) {
    throw new Error('Doctor is already booked at this time slot');
  }

  // 3. Check if patient has already booked this doctor at the same time
  const existingPatientBooking = await Appointment.findOne({
    patient: patientId,
    date: appointmentDate,
    time,
    status: { $in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.ACCEPTED] }
  });
  if (existingPatientBooking) {
    throw new Error('You already have an appointment scheduled at this time slot');
  }

  const appointment = await Appointment.create({
    patient: patientId,
    doctor: doctorId,
    date: appointmentDate,
    time,
    symptoms,
    notes
  });

  // 4. Send notification to Doctor
  const patient = await User.findById(patientId);
  const docUser = doctor.user;
  await createNotification(
    docUser._id,
    'New Appointment Booked',
    `Patient ${patient.fullName} has booked an appointment for ${dateStr} at ${time}.`,
    'appointment'
  );

  return appointment;
};

export const getAppointmentsList = async (userId, role, filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, status } = filters;
  const skip = (page - 1) * limit;

  const query = {};
  if (status) {
    query.status = status;
  }

  // Filter based on roles
  if (role === ROLES.PATIENT) {
    query.patient = userId;
  } else if (role === ROLES.DOCTOR) {
    const doctor = await Doctor.findOne({ user: userId });
    if (!doctor) {
      return { appointments: [], total: 0, page, pages: 0 };
    }
    query.doctor = doctor._id;
  }

  const total = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate('patient', 'fullName email phone gender dob profileImage')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'fullName email phone profileImage' }
    })
    .sort({ date: -1, time: 1 })
    .skip(skip)
    .limit(Number(limit));

  // Query and attach associated prescriptions
  const appointmentIds = appointments.map(apt => apt._id);
  const prescriptions = await Prescription.find({ appointment: { $in: appointmentIds } });

  const appointmentsWithPrescriptions = appointments.map(apt => {
    const aptObj = apt.toObject();
    aptObj.prescription = prescriptions.find(p => p.appointment.toString() === apt._id.toString()) || null;
    return aptObj;
  });

  return {
    appointments: appointmentsWithPrescriptions,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit)
  };
};

export const getAppointmentDetails = async (appointmentId, userId, role) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate('patient', 'fullName email phone gender dob profileImage')
    .populate({
      path: 'doctor',
      populate: { path: 'user', select: 'fullName email phone profileImage' }
    });

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  // Access validation: Patient, Doctor linked to booking, or Admin
  if (role === ROLES.PATIENT && appointment.patient._id.toString() !== userId.toString()) {
    throw new Error('Unauthorized access to appointment details');
  }
  if (role === ROLES.DOCTOR && appointment.doctor.user.toString() !== userId.toString()) {
    throw new Error('Unauthorized access to appointment details');
  }

  const appointmentObj = appointment.toObject();
  appointmentObj.prescription = await Prescription.findOne({ appointment: appointmentId }) || null;

  return appointmentObj;
};

export const updateAppointmentStatusByDoctor = async (appointmentId, docUserId, status) => {
  // Find doctor profile for this user
  const doctor = await Doctor.findOne({ user: docUserId });
  if (!doctor) {
    throw new Error('Doctor profile not found');
  }

  const appointment = await Appointment.findOne({ _id: appointmentId, doctor: doctor._id });
  if (!appointment) {
    throw new Error('Appointment not found or not assigned to you');
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED || appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    throw new Error(`Cannot update status of a ${appointment.status} appointment`);
  }

  if (![APPOINTMENT_STATUS.ACCEPTED, APPOINTMENT_STATUS.REJECTED, APPOINTMENT_STATUS.COMPLETED].includes(status)) {
    throw new Error('Invalid status update by doctor');
  }

  appointment.status = status;
  await appointment.save();

  // Send notification to Patient
  await createNotification(
    appointment.patient,
    `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    `Doctor ${doctor.user ? (await User.findById(doctor.user)).fullName : ''} has ${status} your appointment request for ${appointment.date.toDateString()} at ${appointment.time}.`,
    'appointment'
  );

  return appointment;
};

export const cancelAppointmentByUser = async (appointmentId, userId, role) => {
  const appointment = await Appointment.findById(appointmentId).populate({
    path: 'doctor',
    populate: { path: 'user' }
  });
  if (!appointment) {
    throw new Error('Appointment not found');
  }

  if (appointment.status === APPOINTMENT_STATUS.CANCELLED || appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    throw new Error(`Appointment is already ${appointment.status}`);
  }

  let authorized = false;
  let notifierId = null;
  let notificationTitle = 'Appointment Cancelled';
  let notificationMessage = '';

  if (role === ROLES.PATIENT && appointment.patient.toString() === userId.toString()) {
    authorized = true;
    notifierId = appointment.doctor.user._id;
    const patientUser = await User.findById(userId);
    notificationMessage = `Patient ${patientUser.fullName} has cancelled the appointment scheduled on ${appointment.date.toDateString()} at ${appointment.time}.`;
  } else if (role === ROLES.DOCTOR && appointment.doctor.user._id.toString() === userId.toString()) {
    authorized = true;
    notifierId = appointment.patient;
    notificationMessage = `Doctor ${appointment.doctor.user.fullName} has cancelled your appointment scheduled on ${appointment.date.toDateString()} at ${appointment.time}.`;
  } else if (role === ROLES.ADMIN) {
    authorized = true;
    // Notify both patient and doctor
    await createNotification(
      appointment.patient,
      notificationTitle,
      `Administrator has cancelled your appointment on ${appointment.date.toDateString()} at ${appointment.time}.`,
      'appointment'
    );
    await createNotification(
      appointment.doctor.user._id,
      notificationTitle,
      `Administrator has cancelled the appointment on ${appointment.date.toDateString()} at ${appointment.time}.`,
      'appointment'
    );
  }

  if (!authorized) {
    throw new Error('Unauthorized to cancel this appointment');
  }

  appointment.status = APPOINTMENT_STATUS.CANCELLED;
  await appointment.save();

  if (notifierId) {
    await createNotification(notifierId, notificationTitle, notificationMessage, 'appointment');
  }

  return appointment;
};
