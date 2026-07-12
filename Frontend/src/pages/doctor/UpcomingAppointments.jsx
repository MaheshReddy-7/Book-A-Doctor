import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const UpcomingAppointments = () => {
  const { user } = useAuth();
  const { appointments, updateAppointmentStatus } = useApp();

  if (!user) return <Loader size="large" />;

  const todayStr = "2026-07-08"; // Mock current date
  const upcomingApts = appointments.filter(apt => 
    apt.doctorId === user.id && 
    apt.date > todayStr && 
    (apt.status === 'Confirmed' || apt.status === 'Pending')
  );

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await updateAppointmentStatus(aptId, newStatus);
      toast.success(`Appointment status updated to: ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="upcoming-appointments animate-fade-in">
      <div className="card-custom p-4 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
          <FaClock className="text-primary" /> Upcoming consultations ({upcomingApts.length})
        </h3>

        {upcomingApts.length === 0 ? (
          <EmptyState 
            title="No upcoming consultations scheduled" 
            message="Any future booking slots requested by patients will list here." 
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Patient Name</th>
                  <th>Consultation Date</th>
                  <th>Timeslot</th>
                  <th>Details / Symptoms</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingApts.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div className="fw-semibold text-dark">{apt.patientName}</div>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{apt.patientEmail}</span>
                    </td>
                    <td><strong className="text-dark">{apt.date}</strong></td>
                    <td><strong className="text-primary">{apt.time}</strong></td>
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
                              title="Accept Appointment"
                            >
                              <FaCheck />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                              className="btn btn-sm btn-outline-danger py-1"
                              title="Decline Appointment"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        {apt.status === 'Confirmed' && (
                          <button 
                            onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                            className="btn btn-sm btn-outline-danger py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Cancel Appointment
                          </button>
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
export default UpcomingAppointments;
