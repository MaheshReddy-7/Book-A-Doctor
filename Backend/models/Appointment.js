import mongoose from 'mongoose';
import { APPOINTMENT_STATUS, PAYMENT_STATUS } from '../constants/roles.js';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    index: true
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required']
  },
  symptoms: {
    type: String,
    required: [true, 'Symptoms description is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: Object.values(APPOINTMENT_STATUS),
    default: APPOINTMENT_STATUS.PENDING
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.PENDING
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
