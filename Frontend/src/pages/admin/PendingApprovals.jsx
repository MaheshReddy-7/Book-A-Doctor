import React from 'react';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { toast } from 'react-toastify';
import { FaCheckSquare, FaCheck, FaTimes } from 'react-icons/fa';

export const PendingApprovals = () => {
  const { doctors, approveDoctorProfile, rejectDoctorProfile, loading } = useApp();

  if (loading) return <Loader size="large" />;

  const pendingDoctors = doctors.filter(doc => !doc.approved);

  const handleApprove = async (docId) => {
    try {
      await approveDoctorProfile(docId);
      toast.success("Doctor profile approved!");
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
    <div className="pending-approvals animate-fade-in">
      <div className="card-custom p-4 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
          <FaCheckSquare className="text-primary" /> Pending Registrations ({pendingDoctors.length})
        </h3>

        {pendingDoctors.length === 0 ? (
          <EmptyState 
            title="All applications reviewed" 
            message="There are no doctor credentials awaiting registration approval at the moment." 
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Qualifications</th>
                  <th>Hospital Location</th>
                  <th>Fees</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingDoctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={doc.photo} 
                          alt={doc.name} 
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-semibold text-dark">{doc.name}</div>
                          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Experience: {doc.experience} Years</span>
                        </div>
                      </div>
                    </td>
                    <td>{doc.specialization}</td>
                    <td>{doc.qualification}</td>
                    <td>{doc.hospital}</td>
                    <td><strong className="text-primary">${doc.fee}</strong></td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button 
                          onClick={() => handleApprove(doc.id)} 
                          className="btn btn-sm btn-success text-white py-1 px-2 d-flex align-items-center gap-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button 
                          onClick={() => handleReject(doc.id)} 
                          className="btn btn-sm btn-outline-danger py-1 px-2 d-flex align-items-center gap-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <FaTimes /> Decline
                        </button>
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
export default PendingApprovals;
