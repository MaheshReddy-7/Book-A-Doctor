import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { Rating } from '../../components/ui/Rating';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaTimesCircle, FaStar, FaFilePrescription, FaInfoCircle } from 'react-icons/fa';
import { reviews as defaultReviews } from '../../data/reviews';

export const AppointmentHistory = () => {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus } = useApp();
  
  // States
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAptForReview, setSelectedAptForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  if (!user) return <Loader size="large" />;

  const handleCancel = async (aptId) => {
    if (window.confirm("Are you sure you want to cancel this appointment request?")) {
      try {
        await updateAppointmentStatus(aptId, 'Cancelled');
        toast.success("Appointment has been cancelled.");
      } catch (err) {
        toast.error("Failed to cancel appointment.");
      }
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedAptForReview) return;
    
    // Add review to global list
    const newReview = {
      id: `rev_${Date.now()}`,
      doctorId: selectedAptForReview.doctorId,
      patientName: user.name,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0]
    };
    
    defaultReviews.unshift(newReview);
    toast.success("Thank you for your feedback! Review published.");
    
    // Reset state
    setSelectedAptForReview(null);
    setReviewRating(5);
    setReviewComment('');
  };

  // Filter patient bookings
  const patientApts = appointments.filter(apt => apt.patientId === user.id);
  const filteredApts = patientApts.filter(apt => {
    if (statusFilter === 'All') return true;
    return apt.status.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="appointment-history animate-fade-in">
      {/* Category Filter Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`btn btn-sm px-3 py-2 rounded-pill ${statusFilter === status ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
            style={{ fontSize: '0.8rem' }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings list */}
      {filteredApts.length === 0 ? (
        <EmptyState 
          title={`No ${statusFilter !== 'All' ? statusFilter.toLowerCase() : ''} appointments found`} 
          message="Your scheduled clinical consultations and past visits log will appear here." 
        />
      ) : (
        <div className="row g-4">
          {filteredApts.map((apt) => (
            <div key={apt.id} className="col-12 col-md-6">
              <div className="card-custom p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={apt.doctorPhoto} 
                        alt={apt.doctorName} 
                        className="rounded-circle"
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 className="h6 fw-bold text-dark mb-0">{apt.doctorName}</h4>
                        <span className="text-muted small">{apt.doctorSpecialization}</span>
                      </div>
                    </div>
                    <Badge status={apt.status} />
                  </div>

                  <div className="p-3 bg-light rounded-4 mb-3" style={{ fontSize: '0.85rem' }}>
                    <div className="d-flex align-items-center gap-2 mb-2 text-dark font-semibold fw-bold">
                      <FaCalendarAlt className="text-primary" /> {apt.date} at {apt.time}
                    </div>
                    <div className="text-secondary">
                      <strong className="text-dark small">Symptoms: </strong>
                      {apt.symptoms}
                    </div>
                    {apt.medicalReport && (
                      <div className="text-secondary small mt-1">
                        <strong className="text-dark">Attached file: </strong>{apt.medicalReport}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                  <span className="text-muted small">ID: {apt.id}</span>
                  
                  <div className="d-flex gap-2">
                    {/* Action buttons based on status */}
                    {(apt.status === 'Pending' || apt.status === 'Confirmed') && (
                      <button 
                        onClick={() => handleCancel(apt.id)}
                        className="btn btn-sm btn-link text-danger text-decoration-none d-flex align-items-center gap-1 p-0"
                      >
                        <FaTimesCircle /> Cancel
                      </button>
                    )}

                    {apt.status === 'Completed' && (
                      <>
                        {apt.prescription && (
                          <button 
                            onClick={() => setSelectedPrescription(apt.prescription)}
                            className="btn btn-sm btn-outline-primary py-1 px-2 d-flex align-items-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <FaFilePrescription /> Prescription
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedAptForReview(apt)}
                          className="btn btn-sm btn-primary-custom py-1 px-2 d-flex align-items-center gap-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <FaStar /> Review
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Dialog Modal */}
      {selectedAptForReview && (
        <div className="modal-backdrop bg-dark bg-opacity-50 position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
          <div className="card-custom p-4 bg-white shadow-lg mx-3" style={{ maxWidth: '450px', width: '100%' }}>
            <h3 className="fw-bold h5 text-dark mb-3 border-bottom pb-2">Review Consultation</h3>
            <p className="text-muted small">Share your clinical experience with <strong>{selectedAptForReview.doctorName}</strong>.</p>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-3 text-center">
                <label className="form-label-custom d-block">Select Star Rating</label>
                <Rating 
                  interactive={true} 
                  rating={reviewRating} 
                  onChange={(val) => setReviewRating(val)} 
                  reviewsCount={undefined} 
                />
              </div>

              <div className="mb-4">
                <label className="form-label-custom">Review Comments</label>
                <textarea
                  required
                  className="form-control form-control-custom"
                  rows="3"
                  placeholder="Tell us about the doctor's communication, clinic environment..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                ></textarea>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedAptForReview(null)}
                  className="btn btn-sm btn-secondary-custom"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-sm btn-primary-custom"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="modal-backdrop bg-dark bg-opacity-50 position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
          <div className="card-custom p-4 bg-white shadow-lg mx-3" style={{ maxWidth: '500px', width: '100%' }}>
            <h3 className="fw-bold h5 text-dark mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
              <FaFilePrescription className="text-primary" /> Medical Prescription
            </h3>
            
            <div className="mb-3">
              <div className="text-muted small">Diagnosis:</div>
              <div className="fw-bold text-dark">{selectedPrescription.diagnoses}</div>
            </div>

            <div className="mb-3">
              <div className="text-muted small mb-2">Prescribed Medicines:</div>
              <div className="d-flex flex-column gap-2">
                {selectedPrescription.medicines.map((med, idx) => (
                  <div key={idx} className="p-2 rounded bg-light border border-light" style={{ fontSize: '0.8rem' }}>
                    <div className="fw-bold text-dark">{med.name}</div>
                    <div className="text-secondary">Dosage: {med.dosage} | Duration: {med.duration}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-muted small">Special Instructions:</div>
              <p className="text-secondary small italic mb-0" style={{ fontStyle: 'italic' }}>
                "{selectedPrescription.instructions}"
              </p>
            </div>

            <div className="border-top pt-3 d-flex justify-content-between align-items-center">
              <div className="small text-muted">Signed: <strong>{selectedPrescription.signedBy}</strong></div>
              <button 
                type="button" 
                onClick={() => setSelectedPrescription(null)}
                className="btn btn-sm btn-secondary-custom px-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AppointmentHistory;
