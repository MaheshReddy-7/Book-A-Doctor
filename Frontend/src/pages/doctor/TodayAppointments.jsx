import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { FaCalendarDay, FaCheck, FaTimes, FaFileMedical } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const TodayAppointments = () => {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus } = useApp();

  if (!user) return <Loader size="large" />;

  const todayStr = "2026-07-08"; // Mock current date
  const todayApts = appointments.filter(apt => apt.doctorId === user.id && apt.date === todayStr);

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await updateAppointmentStatus(aptId, newStatus);
      toast.success(`Appointment status updated to: ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update appointment status.");
    }
  };

  return (
    <div className="today-appointments animate-fade-in">
      <div className="card-custom p-4 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
          <FaCalendarDay className="text-primary" /> Today's Checkups ({todayApts.length})
        </h3>

        {todayApts.length === 0 ? (
          <EmptyState 
            title="No appointments scheduled for today" 
            message="Your calendar is clear. Check the 'Upcoming Slots' tab for future reservations." 
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Patient Name</th>
                  <th>Timeslot</th>
                  <th>Contact Details</th>
                  <th>Symptoms / Reasons</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todayApts.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div className="fw-semibold text-dark">{apt.patientName}</div>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>ID: {apt.id}</span>
                    </td>
                    <td><strong className="text-primary">{apt.time}</strong></td>
                    <td>
                      <div className="small">{apt.patientEmail}</div>
                      <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{apt.patientPhone}</div>
                    </td>
                    <td>
                      <span className="text-secondary d-inline-block text-truncate" style={{ maxWidth: '200px' }} title={apt.symptoms}>
                        {apt.symptoms}
                      </span>
                    </td>
                    <td><Badge status={apt.status} /></td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {apt.status === 'Pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                              className="btn btn-sm btn-success text-white py-1"
                              title="Confirm Checkup"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                              className="btn btn-sm btn-outline-danger py-1"
                              title="Decline Checkup"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {apt.status === 'Confirmed' && (
                          <Link 
                            to={`/doctor/upload-prescription?booking=${apt.id}`}
                            className="btn btn-sm btn-primary-custom py-1 px-2 d-flex align-items-center gap-1"
                            style={{ fontSize: '0.75rem' }}
                          >
                            <FaFileMedical /> Upload Rx
                          </Link>
                        )}
                        {apt.status === 'Completed' && (
                          <span className="text-success small fw-semibold">Consulted</span>
                        )}
                        {apt.status === 'Cancelled' && (
                          <span className="text-muted small">Declined</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default TodayAppointments;
