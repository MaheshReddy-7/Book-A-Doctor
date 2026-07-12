import mongoose from 'mongoose';

const medicalReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  fileName: {
    type: String,
    required: [true, 'File name is required'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL/Path is required']
  },
  fileType: {
    type: String,
    required: [true, 'File type is required'],
    trim: true
  }
}, {
  timestamps: true
});

const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);
export default MedicalReport;
