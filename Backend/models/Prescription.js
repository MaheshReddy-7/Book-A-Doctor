import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
    unique: true // An appointment can have only one prescription
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prescriptionFile: {
    type: String
  },
  diagnoses: {
    type: String,
    trim: true,
    default: ''
  },
  medicines: [
    {
      name: String,
      dosage: String,
      duration: String
    }
  ],
  instructions: {
    type: String,
    trim: true,
    default: ''
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
