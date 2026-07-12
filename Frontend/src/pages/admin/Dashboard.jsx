import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { 
  FaUserMd, FaHourglassHalf, FaUsers, FaCalendarAlt, 
  FaClipboardList, FaChartLine, FaCheck, FaTimes 
} from 'react-icons/fa';
import { toast } from 'react-toastify';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { doctors, appointments, approveDoctorProfile, rejectDoctorProfile } = useApp();

  if (!user) return <Loader size="large" />;

  const pendingDoctors = doctors.filter(doc => !doc.approved);
  const activeDoctors = doctors.filter(doc => doc.approved);
  const totalPatientsCount = 120; // Simulated patients in db
  const totalBookingsCount = appointments.length;

  const handleApprove = async (docId) => {
    try {
      await approveDoctorProfile(docId);
      toast.success("Doctor profile approved! Notification sent.");
    } catch (err) {
      toast.error("Failed to approve doctor.");
    }
  };

  const handleReject = async (docId) => {
    if (window.confirm("Are you sure you want to decline this doctor application?")) {
      try {
        await rejectDoctorProfile(docId);
        toast.info("Doctor application declined and deleted.");
      } catch (err) {
        toast.error("Failed to reject doctor.");
      }
    }
  };

  return (
    <div className="admin-dashboard animate-fade-in">
      {/* Metrics Row */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', fontSize: '1.5rem' }}
            >
              <FaUserMd />
            </div>
            <div>
              <span className="text-muted small">Active Doctors</span>
              <h3 className="fw-bold text-dark mb-0">{activeDoctors.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#D97706', fontSize: '1.5rem' }}
            >
              <FaHourglassHalf />
            </div>
            <div>
              <span className="text-muted small">Pending Approvals</span>
              <h3 className="fw-bold text-dark mb-0">{pendingDoctors.length}</h3>
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
              <span className="text-muted small">Registered Patients</span>
              <h3 className="fw-bold text-dark mb-0">{totalPatientsCount}</h3>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-sm-6">
          <div className="card-custom p-4 h-100 d-flex align-items-center gap-3">
            <div 
              className="d-flex align-items-center justify-content-center flex-shrink-0"
              style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '1.5rem' }}
            >
              <FaCalendarAlt />
            </div>
            <div>
              <span className="text-muted small">Total Bookings</span>
              <h3 className="fw-bold text-dark mb-0">{totalBookingsCount}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Panel: Doctor Approvals */}
        <div className="col-lg-8">
          <div className="card-custom p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
              <h3 className="h5 fw-bold text-dark mb-0">Doctor Registration Approvals</h3>
              <Link to="/admin/approvals" className="small text-decoration-none text-primary">Manage approvals</Link>
            </div>

            {pendingDoctors.length === 0 ? (
              <EmptyState 
                title="No pending doctor registrations" 
                message="All doctor profiles are active and approved. Any new registration will appear here." 
              />
            ) : (
              <div className="d-flex flex-column gap-3">
                {pendingDoctors.map((doc) => (
                  <div key={doc.id} className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={doc.photo} 
                        alt={doc.name} 
                        className="rounded-circle"
                        style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 className="h6 fw-bold text-dark mb-1">{doc.name}</h4>
                        <span className="text-muted small d-block">{doc.specialization} ({doc.qualification})</span>
                        <span className="text-secondary small fw-medium" style={{ fontSize: '0.75rem' }}>Hospital: {doc.hospital}</span>
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button 
                        onClick={() => handleApprove(doc.id)} 
                        className="btn btn-sm btn-success text-white py-1 px-2 d-flex align-items-center gap-1"
                      >
                        <FaCheck /> Approve
                      </button>
                      <button 
                        onClick={() => handleReject(doc.id)} 
                        className="btn btn-sm btn-outline-danger py-1 px-2 d-flex align-items-center gap-1"
                      >
                        <FaTimes /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Admin Quick Actions */}
        <div className="col-lg-4">
          <div className="card-custom p-4 mb-4">
            <h3 className="h6 fw-bold text-dark mb-3 border-bottom pb-2">Quick Actions</h3>
            <div className="d-flex flex-column gap-2">
              <Link to="/admin/appointments" className="btn btn-secondary-custom justify-content-start text-start w-100 py-2">
                <FaClipboardList className="me-2" /> Monitor Bookings
              </Link>
              <Link to="/admin/analytics" className="btn btn-secondary-custom justify-content-start text-start w-100 py-2">
                <FaChartLine className="me-2" /> View Clinic Analytics
              </Link>
              <Link to="/admin/doctors" className="btn btn-secondary-custom justify-content-start text-start w-100 py-2">
                <FaUserMd className="me-2" /> Manage Doctors List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
