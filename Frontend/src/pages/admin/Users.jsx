import React, { useState } from 'react';
import { patients as defaultPatients } from '../../data/patients';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { FaUser, FaInfoCircle } from 'react-icons/fa';

export const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Combine default patients with any registered during the session
  const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
  const allPatients = [...defaultPatients, ...registeredUsers];

  const filteredPatients = allPatients.filter(pat => 
    pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pat.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pat.phone.includes(searchQuery)
  );

  return (
    <div className="admin-users animate-fade-in">
      <div className="mb-4">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={false}
          placeholder="Search patient accounts by name, email, phone..."
        />
      </div>

      <div className="card-custom p-4 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
          <FaUser className="text-primary" /> Patient Directory ({filteredPatients.length})
        </h3>

        {filteredPatients.length === 0 ? (
          <EmptyState 
            title="No patients found" 
            message="No registered patient account matches the filter keys." 
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Patient Details</th>
                  <th>Contact Phone</th>
                  <th>Birthdate</th>
                  <th>Gender</th>
                  <th>Blood Group</th>
                  <th>Home Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((pat) => (
                  <tr key={pat.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={pat.photo} 
                          alt={pat.name} 
                          className="rounded-circle"
                          style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                        />
                        <div>
                          <div className="fw-semibold text-dark">{pat.name}</div>
                          <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{pat.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{pat.phone}</td>
                    <td>{pat.dob}</td>
                    <td>{pat.gender}</td>
                    <td><strong className="text-accent">{pat.bloodGroup}</strong></td>
                    <td><span className="text-muted text-truncate d-inline-block" style={{ maxWidth: '160px' }} title={pat.address}>{pat.address}</span></td>
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
export default AdminUsers;
