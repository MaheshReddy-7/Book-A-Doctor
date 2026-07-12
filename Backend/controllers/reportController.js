import MedicalReport from '../models/MedicalReport.js';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import { ROLES } from '../constants/roles.js';
import fs from 'fs';
import path from 'path';

export const uploadReport = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.PATIENT) {
      return res.status(403).json({
        success: false,
        message: 'Only patients can upload medical reports'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { appointmentId } = req.body;

    const fileUrl = `uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;
    const fileName = req.file.originalname;

    const report = await MedicalReport.create({
      patient: req.user._id,
      appointment: appointmentId || null,
      fileName,
      fileUrl,
      fileType
    });

    res.status(201).json({
      success: true,
      message: 'Medical report uploaded successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getReportById = async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const report = await MedicalReport.findById(reportId).populate('patient', 'fullName email phone');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Medical report not found'
      });
    }

    // Authorization checks
    let authorized = false;

    if (req.user.role === ROLES.ADMIN) {
      authorized = true;
    } else if (req.user.role === ROLES.PATIENT && report.patient._id.toString() === req.user._id.toString()) {
      authorized = true;
    } else if (req.user.role === ROLES.DOCTOR) {
      // Check if this doctor has any appointment with the patient
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (doctor) {
        const appointmentExists = await Appointment.findOne({
          patient: report.patient._id,
          doctor: doctor._id
        });
        if (appointmentExists) {
          authorized = true;
        }
      }
    }

    if (!authorized) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this medical report'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const deleteReport = async (req, res, next) => {
  try {
    const reportId = req.params.id;
    const report = await MedicalReport.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Medical report not found'
      });
    }

    // Only patient themselves or Admin can delete the report
    if (req.user.role !== ROLES.ADMIN && report.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this medical report'
      });
    }

    // Delete the file from filesystem
    const filePath = path.resolve(report.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await MedicalReport.findByIdAndDelete(reportId);

    res.status(200).json({
      success: true,
      message: 'Medical report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
