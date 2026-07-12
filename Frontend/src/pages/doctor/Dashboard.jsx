import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { 
  FaCalendarDay, FaUsers, FaCoins, FaClock, 
  FaFileInvoiceDollar, FaCheck, FaTimes, FaFileMedical 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus } = useApp();

  if (!user) return <Loader size="large" />;

  const doctorId = user.id;

  // Filter appointments for this doctor
  const doctorApts = appointments.filter(apt => apt.doctorId === doctorId);
  
  // Today's appointments (simulate today is 2026-07-08 as in our mock dates)
  const todayStr = "2026-07-08";
  const todayApts = doctorApts.filter(apt => apt.date === todayStr);
  const upcomingApts = doctorApts.filter(apt => apt.date > todayStr && (apt.status === 'Confirmed' || apt.status === 'Pending'));
  const completedApts = doctorApts.filter(apt => apt.status === 'Completed');

  // Stats
  const todayCount = todayApts.length;
  const totalPatients = new Set(doctorApts.map(apt => apt.patientId)).size;
  const pendingApprovals = doctorApts.filter(apt => apt.status === 'Pending').length;
  const totalRevenue = completedApts.length * user.fee;

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await updateAppointmentStatus(aptId, newStatus);
      toast.success(`Appointment status updated to: ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update appointment status.");
    }
  };

  return (
    <div className="doctor-dashboard animate-fade-in">
      {/* Stat Cards */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', fontSize: '1.5rem' }}
            >
              <FaCalendarDay />
            </div>
            <div>
              <span className="text-muted small">Today's Visits</span>
              <h3 className="fw-bold text-dark mb-0">{todayCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent)', fontSize: '1.5rem' }}
            >
              <FaUsers />
            </div>
            <div>
              <span className="text-muted small">Total Patients</span>
              <h3 className="fw-bold text-dark mb-0">{totalPatients}</h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#D97706', fontSize: '1.5rem' }}
            >
              <FaClock />
            </div>
            <div>
              <span className="text-muted small">Pending Slots</span>
              <h3 className="fw-bold text-dark mb-0">{pendingApprovals}</h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '1.5rem' }}
            >
              <FaCoins />
            </div>
            <div>
              <span className="text-muted small">Total Earnings</span>
              <h3 className="fw-bold text-dark mb-0">${totalRevenue}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Side: Today's checkups */}
        <div className="col-lg-8">
          <div className="card-custom p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h3 className="h5 fw-bold text-dark mb-0">Scheduled Consultations (Today)</h3>
              <Link to="/doctor/today-appointments" className="small text-decoration-none text-primary">Manage Today</Link>
            </div>

            {todayApts.length === 0 ? (
              <EmptyState 
                title="No appointments scheduled today" 
                message="Your slot schedules are free. Any new patient checkup requests will alert you." 
              />
            ) : (
              <div className="d-flex flex-column gap-3">
                {todayApts.map((apt) => (
                  <div key={apt.id} className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h4 className="h6 fw-bold text-dark mb-0">{apt.patientName}</h4>
                        <Badge status={apt.status} />
                      </div>
                      <span className="text-muted small d-block mb-1">Slot: <strong>{apt.time}</strong></span>
                      <p className="text-secondary small mb-0" style={{ maxWidth: '400px' }}>
                        <strong className="text-dark">Symptoms: </strong>{apt.symptoms}
                      </p>
                    </div>

                    <div className="d-flex gap-2">
                      {apt.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                            className="btn btn-sm btn-success rounded-3 py-1 px-2 d-flex align-items-center gap-1 text-white"
                          >
                            <FaCheck /> Confirm
                          </button>
                          <button 
                            onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                            className="btn btn-sm btn-outline-danger rounded-3 py-1 px-2 d-flex align-items-center gap-1"
                          >
                            <FaTimes /> Decline
                          </button>
                        </>
                      )}
                      {apt.status === 'Confirmed' && (
                        <Link 
                          to={`/doctor/upload-prescription?booking=${apt.id}`}
                          className="btn btn-sm btn-primary-custom py-1 px-2 d-flex align-items-center gap-1"
                        >
                          <FaFileMedical /> Upload Rx
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consultation trends placeholder */}
          <div className="card-custom p-4">
            <h3 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">Consultation Analytics (Weekly)</h3>
            <div className="p-5 text-center bg-secondary bg-opacity-5 rounded-4 border border-light" style={{ minHeight: '180px' }}>
              <div className="d-flex align-items-end justify-content-center gap-4 h-100" style={{ height: '100px' }}>
                <div className="bg-primary rounded-top" style={{ width: '35px', height: '60px' }} title="Mon: 6 visits"></div>
                <div className="bg-primary rounded-top" style={{ width: '35px', height: '40px' }} title="Tue: 4 visits"></div>
                <div className="bg-primary rounded-top opacity-50" style={{ width: '35px', height: '80px' }} title="Wed: 8 visits"></div>
                <div className="bg-primary rounded-top" style={{ width: '35px', height: '20px' }} title="Thu: 2 visits"></div>
                <div className="bg-primary rounded-top" style={{ width: '35px', height: '90px' }} title="Fri: 9 visits"></div>
                <div className="bg-primary rounded-top" style={{ width: '35px', height: '10px' }} title="Sat: 1 visits"></div>
              </div>
              <div className="text-secondary small mt-3">Consultation statistics showing weekly visits. Today is Wednesday (highlighted).</div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Links */}
        <div className="col-lg-4">
          <div className="card-custom p-4 mb-4">
            <h3 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">Quick Actions</h3>
            <div className="d-flex flex-column gap-2">
              <Link to="/doctor/availability" className="btn btn-secondary-custom justify-content-start text-start w-100 py-2">
                Configure Active Days
              </Link>
              <Link to="/doctor/patients" className="btn btn-secondary-custom justify-content-start text-start w-100 py-2">
                Patients History
              </Link>
              <Link to="/doctor/profile" className="btn btn-secondary-custom justify-content-start text-start w-100 py-2">
                Edit Clinic Details
              </Link>
            </div>
          </div>

          <div className="card-custom p-4">
            <h3 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">Upcoming Consults</h3>
            {upcomingApts.length === 0 ? (
              <p className="text-muted small mb-0">No upcoming visits booked.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {upcomingApts.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="p-2 rounded-3 border border-light d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold text-dark small">{apt.patientName}</div>
                      <span className="text-muted small" style={{ fontSize: '0.7rem' }}>{apt.date} at {apt.time}</span>
                    </div>
                    <Badge status={apt.status} className="small" />
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
export default DoctorDashboard;
