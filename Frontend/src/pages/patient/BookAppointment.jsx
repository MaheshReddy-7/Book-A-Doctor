import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { FaUserMd, FaCalendarAlt, FaClock, FaHeartbeat, FaNotesMedical, FaPaperclip } from 'react-icons/fa';

export const BookAppointment = () => {
  const { user } = useAuth();
  const { doctors, createBooking } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const prefilledDocId = searchParams.get('doctor');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      patientName: user?.name || '',
      patientEmail: user?.email || '',
      patientPhone: user?.phone || '',
      doctorId: prefilledDocId || '',
      date: '',
      time: '',
      symptoms: '',
      notes: ''
    }
  });

  const watchDoctorId = watch('doctorId');

  // Load available time slots when a doctor is selected
  useEffect(() => {
    if (watchDoctorId) {
      const doc = doctors.find(d => d.id === watchDoctorId);
      setSelectedDoctor(doc || null);
      // Reset date and time if doctor changed
      setValue('time', '');
    } else {
      setSelectedDoctor(null);
    }
  }, [watchDoctorId, doctors, setValue]);

  // Handle mock file uploads
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      toast.info(`Attached file: ${file.name}`);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedDoctor) {
      toast.error("Please select a doctor.");
      return;
    }
    
    setLoading(true);
    try {
      const bookingPayload = {
        ...data,
        patientId: user.id,
        doctorName: selectedDoctor.name,
        doctorSpecialization: selectedDoctor.specialization,
        doctorPhoto: selectedDoctor.photo,
        medicalReportName: fileName || null
      };

      await createBooking(bookingPayload);
      toast.success("Appointment request submitted successfully!");
      navigate('/patient/appointments');
    } catch (err) {
      toast.error(err.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const activeDoctors = doctors.filter(d => d.approved);

  return (
    <div className="container py-4 max-w-md animate-fade-in" style={{ maxWidth: '780px' }}>
      <div className="card-custom p-4 p-md-5 bg-white border border-light shadow-lg">
        <div className="text-center mb-4 pb-2 border-bottom">
          <span style={{ 
            color: 'white', 
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
            padding: '10px', 
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }} className="mb-3">
            <FaHeartbeat />
          </span>
          <h1 className="h3 fw-bold text-dark mb-1">Book a Consultation</h1>
          <p className="text-secondary small">Provide symptoms, pick times, and attach checkup records</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            {/* Step 1: Select Doctor */}
            <div className="col-12">
              <label className="form-label-custom">Select Specialist</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaUserMd /></span>
                <select
                  className={`form-select form-control-custom ps-5 ${errors.doctorId ? 'is-invalid border-danger' : ''}`}
                  {...register('doctorId', { required: 'Please select a doctor' })}
                >
                  <option value="">Choose a clinical specialist...</option>
                  {activeDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} - {doc.specialization} (${doc.fee})
                    </option>
                  ))}
                </select>
                {errors.doctorId && <div className="invalid-feedback text-danger small mt-1">{errors.doctorId.message}</div>}
              </div>
            </div>

            {/* Doctor Info Sub-Pane */}
            {selectedDoctor && (
              <div className="col-12 p-3 bg-secondary bg-opacity-5 rounded-4 border border-light animate-slide-up">
                <div className="d-flex align-items-center gap-3">
                  <img 
                    src={selectedDoctor.photo} 
                    alt={selectedDoctor.name} 
                    className="rounded-circle"
                    style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 className="fw-bold h6 text-dark mb-0">{selectedDoctor.name}</h4>
                    <span className="text-secondary small d-block">{selectedDoctor.hospital}</span>
                    <span className="text-accent small fw-bold" style={{ fontSize: '0.7rem' }}>
                      Shifts: {selectedDoctor.availability.days.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Date & Slots */}
            <div className="col-md-6">
              <label className="form-label-custom">Appointment Date</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaCalendarAlt /></span>
                <input
                  type="date"
                  className={`form-control form-control-custom ps-5 ${errors.date ? 'is-invalid border-danger' : ''}`}
                  {...register('date', { required: 'Date is required' })}
                />
                {errors.date && <div className="invalid-feedback text-danger small mt-1">{errors.date.message}</div>}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Available Timeslot</label>
              <div className="position-relative">
                <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted"><FaClock /></span>
                <select
                  disabled={!selectedDoctor}
                  className={`form-select form-control-custom ps-5 ${errors.time ? 'is-invalid border-danger' : ''}`}
                  {...register('time', { required: 'Please select a timeslot' })}
                >
                  <option value="">{selectedDoctor ? 'Choose slot...' : 'Select doctor first...'}</option>
                  {selectedDoctor?.availability.slots.map((slot, idx) => (
                    <option key={idx} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.time && <div className="invalid-feedback text-danger small mt-1">{errors.time.message}</div>}
              </div>
            </div>

            {/* Step 3: Patient Information */}
            <div className="col-md-6">
              <label className="form-label-custom">Patient Name</label>
              <input
                type="text"
                className={`form-control form-control-custom ${errors.patientName ? 'is-invalid border-danger' : ''}`}
                {...register('patientName', { required: 'Patient name is required' })}
              />
              {errors.patientName && <div className="text-danger small mt-1">{errors.patientName.message}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label-custom">Phone Number</label>
              <input
                type="text"
                className={`form-control form-control-custom ${errors.patientPhone ? 'is-invalid border-danger' : ''}`}
                {...register('patientPhone', { required: 'Phone is required' })}
              />
              {errors.patientPhone && <div className="text-danger small mt-1">{errors.patientPhone.message}</div>}
            </div>

            {/* Step 4: Symptoms description */}
            <div className="col-12">
              <label className="form-label-custom">Describe Symptoms</label>
              <div className="position-relative">
                <span className="position-absolute top-0 start-0 pt-3 ps-3 text-muted"><FaNotesMedical /></span>
                <textarea
                  className={`form-control form-control-custom ps-5 ${errors.symptoms ? 'is-invalid border-danger' : ''}`}
                  rows="3"
                  placeholder="E.g. Headache since 3 days, throat redness, dry cough..."
                  {...register('symptoms', { required: 'Please describe symptoms' })}
                ></textarea>
                {errors.symptoms && <div className="invalid-feedback text-danger small mt-1">{errors.symptoms.message}</div>}
              </div>
            </div>

            {/* Step 5: Report Attachment */}
            <div className="col-12">
              <label className="form-label-custom">Upload Medical Report (Optional)</label>
              <div className="border rounded-4 p-3 text-center border-secondary border-opacity-25" style={{ borderStyle: 'dashed' }}>
                <input 
                  type="file" 
                  id="medicalReport" 
                  className="d-none" 
                  onChange={handleFileChange} 
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <label htmlFor="medicalReport" className="cursor-pointer mb-0 text-secondary small" style={{ cursor: 'pointer' }}>
                  <FaPaperclip className="me-2 text-primary fs-5" />
                  {fileName ? (
                    <strong className="text-success">{fileName} (Attached)</strong>
                  ) : (
                    "Click to attach previous ECG logs, Lab records, or diagnostic PDFs"
                  )}
                </label>
              </div>
            </div>

            {/* Additional notes */}
            <div className="col-12">
              <label className="form-label-custom">Additional Notes</label>
              <textarea
                className="form-control form-control-custom"
                rows="2"
                placeholder="Allergies details, requests, or special notes..."
                {...register('notes')}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="col-12 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-custom w-100 py-3 justify-content-center shadow"
              >
                {loading ? 'Submitting Request...' : 'Confirm Consultation Booking'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default BookAppointment;
