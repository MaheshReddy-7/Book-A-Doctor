import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { reviews as defaultReviews } from '../data/reviews';
import { Loader } from '../components/ui/Loader';
import { Rating } from '../components/ui/Rating';
import { FaUserMd, FaHospital, FaClock, FaDollarSign, FaRegCalendarCheck, FaGraduationCap } from 'react-icons/fa';

export const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDoctorDetails = async () => {
      setLoading(true);
      try {
        const doc = await doctorService.getDoctorById(id);
        setDoctor(doc);
        
        // Filter reviews for this doctor
        const filteredReviews = defaultReviews.filter(r => r.doctorId === id);
        setReviewsList(filteredReviews);
      } catch (err) {
        setError(err.message || 'Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctorDetails();
  }, [id]);

  if (loading) return <Loader size="large" className="py-5" />;
  if (error) return <div className="container py-5 text-center text-danger fw-semibold">{error}</div>;
  if (!doctor) return <div className="container py-5 text-center text-muted">Doctor profile not found.</div>;

  return (
    <div className="container py-5 animate-fade-in">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/doctors" className="text-decoration-none">Doctors</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{doctor.name}</li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Main Details Panel */}
        <div className="col-lg-8">
          {/* Header Card */}
          <div className="card-custom p-4 mb-4">
            <div className="d-flex flex-column flex-sm-row gap-4 align-items-center align-items-sm-start text-center text-sm-start">
              <img 
                src={doctor.photo} 
                alt={doctor.name} 
                className="rounded-4 shadow-sm"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <span className="badge bg-primary bg-opacity-10 text-primary-hover border border-primary border-opacity-10 small mb-2">
                  {doctor.specialization}
                </span>
                <h1 className="h3 fw-bold text-dark mb-2">{doctor.name}</h1>
                <p className="text-secondary mb-2 d-flex align-items-center justify-content-center justify-content-sm-start gap-2">
                  <FaHospital className="text-primary" /> {doctor.hospital}
                </p>
                <p className="text-secondary small mb-3 d-flex align-items-center justify-content-center justify-content-sm-start gap-2">
                  <FaGraduationCap className="text-accent" /> {doctor.qualification}
                </p>
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-sm-start gap-3">
                  <Rating rating={doctor.rating} reviewsCount={doctor.reviewsCount || reviewsList.length} />
                  <span className="text-muted small">|</span>
                  <span className="text-secondary small fw-semibold">{doctor.experience} Years Experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="card-custom p-4 mb-4">
            <h2 className="h5 fw-bold text-dark mb-3 border-bottom pb-2">About Doctor</h2>
            <p className="text-secondary mb-0" style={{ lineHeight: '1.7', fontSize: '0.95rem' }}>
              {doctor.about}
            </p>
          </div>

          {/* Reviews List */}
          <div className="card-custom p-4">
            <h2 className="h5 fw-bold text-dark mb-4 border-bottom pb-2">Patient Feedback ({reviewsList.length})</h2>
            
            {reviewsList.length === 0 ? (
              <p className="text-muted small mb-0">No patient reviews have been posted for this doctor yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h4 className="h6 fw-bold text-dark mb-0">{rev.patientName}</h4>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{rev.date}</span>
                    </div>
                    <Rating rating={rev.rating} reviewsCount={undefined} className="mb-2" />
                    <p className="text-secondary small mb-0" style={{ fontStyle: 'italic' }}>
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Schedule & Availability Checkout Pane */}
        <div className="col-lg-4">
          <div className="card-custom p-4 glass-panel position-sticky" style={{ top: '100px' }}>
            <h3 className="h5 fw-bold text-dark mb-3 border-bottom pb-2">Consultation Booking</h3>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-secondary small">Consultation Fee</span>
              <span className="fw-bold text-primary fs-4">${doctor.fee}</span>
            </div>

            <div className="p-3 bg-white rounded-4 shadow-sm border border-light mb-4">
              <h4 className="fw-bold text-dark h6 mb-3 d-flex align-items-center gap-2">
                <FaRegCalendarCheck className="text-accent" /> Available Days
              </h4>
              <div className="d-flex flex-wrap gap-2">
                {doctor.availability.days.map((day, idx) => (
                  <span 
                    key={idx} 
                    className="badge bg-secondary bg-opacity-10 text-dark small py-2 px-3 fw-semibold rounded"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white rounded-4 shadow-sm border border-light mb-4">
              <h4 className="fw-bold text-dark h6 mb-3 d-flex align-items-center gap-2">
                <FaClock className="text-primary" /> Shift Hours
              </h4>
              <div className="row g-2">
                {doctor.availability.slots.map((slot, idx) => (
                  <div key={idx} className="col-6">
                    <span 
                      className="d-block text-center py-2 bg-light text-secondary rounded small fw-medium"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {slot}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Link 
              to={`/patient/book-appointment?doctor=${doctor.id}`} 
              className="btn btn-primary-custom w-100 py-3 justify-content-center text-decoration-none shadow"
            >
              Book Consultation Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DoctorDetails;
