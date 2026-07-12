import * as appointmentService from '../services/appointmentService.js';
import Appointment from '../models/Appointment.js';
import { ROLES } from '../constants/roles.js';

export const createAppointment = async (req, res, next) => {
  try {
    if (req.user.role !== ROLES.PATIENT) {
      return res.status(403).json({
        success: false,
        message: 'Only patients can book appointments'
      });
    }

    const { doctor, date, time, symptoms, notes } = req.body;
    const appointment = await appointmentService.createAppointment(
      req.user._id,
      doctor,
      date,
      time,
      symptoms,
      notes
    );

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
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

export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await appointmentService.getAppointmentDetails(
      req.params.id,
      req.user._id,
      req.user.role
    );
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required'
      });
    }

    let appointment;

    if (status === 'cancelled') {
      // Cancellation can be requested by Patient, Doctor or Admin
      appointment = await appointmentService.cancelAppointmentByUser(
        appointmentId,
        req.user._id,
        req.user.role
      );
    } else {
      // Doctor accepting or rejecting or completing
      if (req.user.role !== ROLES.DOCTOR) {
        return res.status(403).json({
          success: false,
          message: 'Only doctors can accept, reject or complete appointments'
        });
      }
      appointment = await appointmentService.updateAppointmentStatusByDoctor(
        appointmentId,
        req.user._id,
        status
      );
    }

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status} successfully`,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppointment = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    
    // Only Admin can hard delete an appointment record
    if (req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can delete appointment records'
      });
    }

    const appointment = await Appointment.findByIdAndDelete(appointmentId);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
