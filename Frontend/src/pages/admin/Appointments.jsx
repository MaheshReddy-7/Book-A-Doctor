import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { FaCalendarAlt } from 'react-icons/fa';

export const AdminAppointments = () => {
  const { appointments } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredApts = appointments.filter(apt => {
    // Search filter
    const matchesSearch = 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.includes(searchQuery);

    // Status filter
    const matchesStatus = statusFilter === 'All' || apt.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-appointments animate-fade-in">
      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={false}
          placeholder="Search by Patient, Doctor name or Booking ID..."
        />
      </div>

      <div className="card-custom p-4 bg-white border border-light">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4 border-bottom pb-3">
          <h3 className="h5 fw-bold text-dark mb-0 d-flex align-items-center gap-2">
            <FaCalendarAlt className="text-primary" /> Bookings Ledger ({filteredApts.length})
          </h3>
          
          <div className="d-flex flex-wrap gap-1">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn btn-sm py-1 px-3 rounded-pill ${statusFilter === status ? 'btn-primary-custom' : 'btn-secondary-custom'}`}
                style={{ fontSize: '0.75rem' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredApts.length === 0 ? (
          <EmptyState 
            title="No appointments logged" 
            message="No consultation bookings match the selected status or name keys." 
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Patient Details</th>
                  <th>Assigned Doctor</th>
                  <th>Consultation Slot</th>
                  <th>Status</th>
                  <th>Medical Report</th>
                </tr>
              </thead>
              <tbody>
                {filteredApts.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong className="text-dark">{apt.id}</strong></td>
                    <td>
                      <div className="fw-semibold text-dark">{apt.patientName}</div>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{apt.patientEmail}</span>
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{apt.doctorName}</div>
                      <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>{apt.doctorSpecialization}</span>
                    </td>
                    <td>
                      <div className="fw-bold text-primary">{apt.date}</div>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>Slot: {apt.time}</span>
                    </td>
                    <td><Badge status={apt.status} /></td>
                    <td>
                      {apt.medicalReport ? (
                        <span className="text-success fw-medium small text-truncate d-inline-block" style={{ maxWidth: '120px' }}>{apt.medicalReport}</span>
                      ) : (
                        <span className="text-muted small">None</span>
                      )}
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
export default AdminAppointments;
