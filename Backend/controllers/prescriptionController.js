import Prescription from '../models/Prescription.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/User.js';
import { ROLES } from '../constants/roles.js';
import { createNotification } from '../services/notificationService.js';
import fs from 'fs';
import path from 'path';

export const createPrescription = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.DOCTOR) {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can upload prescriptions'
      });
    }

    const { appointment, notes, diagnoses, medicines, instructions } = req.body;

    if (!appointment) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }

    // Find Doctor details for current user
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    // Find Appointment details
    const apt = await Appointment.findById(appointment);
    if (!apt) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if the doctor is assigned to this appointment
    if (apt.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to add a prescription to this appointment'
      });
    }

    const prescriptionFile = req.file ? `uploads/${req.file.filename}` : '';

    const newPrescription = await Prescription.create({
      appointment,
      doctor: doctor._id,
      patient: apt.patient,
      prescriptionFile,
      diagnoses: diagnoses || '',
      medicines: medicines || [],
      instructions: instructions || '',
      notes: notes || ''
    });

    // Mark the appointment as completed
    apt.status = 'completed';
    await apt.save();

    // Notify patient
    await createNotification(
      apt.patient,
      'New Prescription Uploaded',
      `Doctor ${req.user.fullName} has uploaded a prescription for your appointment.`,
      'prescription'
    );

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded successfully',
      data: newPrescription
    });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionById = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'fullName email phone' }
      })
      .populate('patient', 'fullName email phone')
      .populate('appointment');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Authorization checks
    let authorized = false;

    if (req.user.role === ROLES.ADMIN) {
      authorized = true;
    } else if (req.user.role === ROLES.PATIENT && prescription.patient._id.toString() === req.user._id.toString()) {
      authorized = true;
    } else if (req.user.role === ROLES.DOCTOR && prescription.doctor.user.toString() === req.user._id.toString()) {
      authorized = true;
    }

    if (!authorized) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this prescription'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};

export const updatePrescription = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.DOCTOR) {
      return res.status(403).json({
        success: false,
        message: 'Only doctors can update prescriptions'
      });
    }

    const prescription = await Prescription.findById(req.params.id).populate('doctor');
    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Verify if this doctor is the creator
    if (prescription.doctor.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this prescription'
      });
    }

    const { notes } = req.body;
    if (notes !== undefined) {
      prescription.notes = notes;
    }

    // Handle updating upload file
    if (req.file) {
      // Delete old file from filesystem
      const oldFilePath = path.resolve(prescription.prescriptionFile);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      prescription.prescriptionFile = `uploads/${req.file.filename}`;
    }

    await prescription.save();

    res.status(200).json({
      success: true,
      message: 'Prescription updated successfully',
      data: prescription
    });
  } catch (error) {
    next(error);
  }
};
