import mongoose from 'mongoose';
import { APPROVAL_STATUS } from '../constants/roles.js';

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    trim: true,
    index: true
  },
  experience: {
    type: Number,
    required: [true, 'Experience (in years) is required'],
    min: [0, 'Experience cannot be negative']
  },
  hospital: {
    type: String,
    required: [true, 'Hospital name is required'],
    trim: true
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: [0, 'Consultation fee cannot be negative']
  },
  about: {
    type: String,
    trim: true,
    default: ''
  },
  availableDays: {
    type: [String],
    default: []
  },
  availableTime: {
    start: {
      type: String,
      default: '09:00'
    },
    end: {
      type: String,
      default: '17:00'
    }
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  approvalStatus: {
    type: String,
    enum: Object.values(APPROVAL_STATUS),
    default: APPROVAL_STATUS.PENDING,
    index: true
  }
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
