import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { 
  FaCalendarCheck, FaHourglassHalf, FaFilePrescription, 
  FaCreditCard, FaArrowRight, FaPlusCircle, FaRegFilePdf, FaRegBell 
} from 'react-icons/fa';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { appointments, notifications } = useApp();

  if (!user) return <Loader size="large" />;

  // Filter appointments for this patient
  const patientApts = appointments.filter(apt => apt.patientId === user.id);
  const upcomingApts = patientApts.filter(apt => apt.status === 'Confirmed' || apt.status === 'Pending').slice(0, 2);
  const completedApts = patientApts.filter(apt => apt.status === 'Completed');
  const recentPrescriptions = completedApts.filter(apt => apt.prescription).slice(0, 2);

  // Stats calculation
  const totalBookings = patientApts.length;
  const pendingBookings = patientApts.filter(apt => apt.status === 'Pending').length;
  const activeBookings = patientApts.filter(apt => apt.status === 'Confirmed').length;
  const totalFeesPaid = completedApts.length * 100; // Mock calculation based on $100 avg

  return (
    <div className="patient-dashboard animate-fade-in">
      <div className="row g-4 mb-4">
        {/* Stat Card 1 */}
        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', fontSize: '1.5rem' }}
            >
              <FaCalendarCheck />
            </div>
            <div>
              <span className="text-muted small">Total Bookings</span>
              <h3 className="fw-bold text-dark mb-0">{totalBookings}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#D97706', fontSize: '1.5rem' }}
            >
              <FaHourglassHalf />
            </div>
            <div>
              <span className="text-muted small">Pending Requests</span>
              <h3 className="fw-bold text-dark mb-0">{pendingBookings}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '1.5rem' }}
            >
              <FaCalendarCheck />
            </div>
            <div>
              <span className="text-muted small">Active/Confirmed</span>
              <h3 className="fw-bold text-dark mb-0">{activeBookings}</h3>
            </div>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)', fontSize: '1.5rem' }}
            >
              <FaCreditCard />
            </div>
            <div>
              <span className="text-muted small">Consult Fees Paid</span>
              <h3 className="fw-bold text-dark mb-0">${totalFeesPaid}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Upcoming checkups */}
        <div className="col-lg-8">
          <div className="card-custom p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="h5 fw-bold text-dark mb-0">Upcoming Consultations</h3>
              <Link to="/patient/appointments" className="small text-decoration-none text-primary">View all appointments</Link>
            </div>

            {upcomingApts.length === 0 ? (
              <EmptyState 
                title="No upcoming checkups" 
                message="Schedule an appointment with one of our clinical specialists to get started." 
                actionButton={
                  <Link to="/patient/book-appointment" className="btn btn-primary-custom">
                    <FaPlusCircle /> Book Now
                  </Link>
                }
              />
            ) : (
              <div className="d-flex flex-column gap-3">
                {upcomingApts.map((apt) => (
                  <div key={apt.id} className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={apt.doctorPhoto} 
                        alt={apt.doctorName} 
                        className="rounded-circle"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 className="h6 fw-bold text-dark mb-1">{apt.doctorName}</h4>
                        <span className="text-muted small d-block">{apt.doctorSpecialization}</span>
                        <span className="text-secondary small fw-medium" style={{ fontSize: '0.75rem' }}>{apt.date} at {apt.time}</span>
                      </div>
                    </div>
                    <div className="d-flex flex-row flex-sm-column align-items-sm-end gap-2">
                      <Badge status={apt.status} />
                      <Link to="/patient/appointments" className="btn btn-sm btn-outline-secondary py-1" style={{ fontSize: '0.75rem' }}>Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="row g-3">
            <div className="col-sm-6">
              <Link to="/patient/book-appointment" className="text-decoration-none">
                <div className="card-custom p-4 h-100 bg-primary text-white d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold h5 mb-1">Book Appointment</h4>
                    <p className="small text-white-50 mb-0">Search and pick available shifts</p>
                  </div>
                  <FaPlusCircle className="fs-3 opacity-80" />
                </div>
              </Link>
            </div>
            <div className="col-sm-6">
              <Link to="/patient/profile" className="text-decoration-none">
                <div className="card-custom p-4 h-100 bg-accent text-white d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="fw-bold h5 mb-1">Modify Profile</h4>
                    <p className="small text-white-50 mb-0">Change contact details</p>
                  </div>
                  <FaArrowRight className="fs-3 opacity-80" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Prescriptions and Notifications */}
        <div className="col-lg-4">
          {/* Recent prescriptions */}
          <div className="card-custom p-4 mb-4">
            <h3 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">Recent Prescriptions</h3>
            {recentPrescriptions.length === 0 ? (
              <p className="text-muted small mb-0 py-2">Consultations with prescriptions will appear here once checkups are completed.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentPrescriptions.map((apt) => (
                  <Link key={apt.id} to="/patient/reports" className="text-decoration-none">
                    <div className="p-2 rounded-3 border border-light hover-bg d-flex align-items-center gap-3 transition-fast">
                      <div className="text-primary fs-4"><FaFilePrescription /></div>
                      <div className="flex-grow-1 min-w-0">
                        <h4 className="h6 fw-bold text-dark text-truncate mb-0" style={{ fontSize: '0.85rem' }}>{apt.prescription.diagnoses}</h4>
                        <span className="text-muted small" style={{ fontSize: '0.75rem' }}>by {apt.doctorName}</span>
                      </div>
                      <FaRegFilePdf className="text-danger" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activities list snippet */}
          <div className="card-custom p-4">
            <h3 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">Recent Alerts</h3>
            {notifications.filter(n => n.role === 'patient' && n.userId === user.id).length === 0 ? (
              <p className="text-muted small mb-0 py-2">No alerts yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {notifications.filter(n => n.role === 'patient' && n.userId === user.id).slice(0, 3).map((notif) => (
                  <div key={notif.id} className="p-2 rounded-3 border-bottom border-light">
                    <div className="fw-semibold text-dark small" style={{ fontSize: '0.8rem' }}>{notif.title}</div>
                    <div className="text-muted small text-truncate" style={{ fontSize: '0.7rem' }}>{notif.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PatientDashboard;
