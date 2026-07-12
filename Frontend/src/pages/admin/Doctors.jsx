import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { SearchBar } from '../../components/ui/SearchBar';
import { toast } from 'react-toastify';
import { FaUserMd, FaBan, FaCheck } from 'react-icons/fa';

export const AdminDoctors = () => {
  const { doctors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulated status toggle collections
  const [disabledDocs, setDisabledDocs] = useState([]);

  const approvedDoctors = doctors.filter(doc => doc.approved);

  const handleToggleActive = (docId, docName) => {
    if (disabledDocs.includes(docId)) {
      setDisabledDocs(disabledDocs.filter(id => id !== docId));
      toast.success(`${docName} profile is now ACTIVE.`);
    } else {
      setDisabledDocs([...disabledDocs, docId]);
      toast.warning(`${docName} profile is now SUSPENDED.`);
    }
  };

  const filteredDocs = approvedDoctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-doctors animate-fade-in">
      <div className="mb-4">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={false}
          placeholder="Search doctors by name, hospital, specialization..."
        />
      </div>

      <div className="card-custom p-4 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-2 d-flex align-items-center gap-2">
          <FaUserMd className="text-primary" /> Active Platform Doctors ({filteredDocs.length})
        </h3>

        {filteredDocs.length === 0 ? (
          <EmptyState 
            title="No doctors found" 
            message="No registered clinic specialists match the search criteria." 
          />
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle small mb-0">
              <thead className="table-light">
                <tr>
                  <th>Doctor Details</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th>Hospital Location</th>
                  <th>Fees</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => {
                  const isSuspended = disabledDocs.includes(doc.id);
                  return (
                    <tr key={doc.id} style={{ opacity: isSuspended ? 0.6 : 1 }}>
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
                            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>ID: {doc.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{doc.specialization}</td>
                      <td>{doc.qualification}</td>
                      <td>{doc.hospital}</td>
                      <td><strong className="text-primary">${doc.fee}</strong></td>
                      <td>
                        <Badge status={isSuspended ? 'inactive' : 'active'} />
                      </td>
                      <td className="text-end">
                        <button
                          onClick={() => handleToggleActive(doc.id, doc.name)}
                          className={`btn btn-sm ${isSuspended ? 'btn-success text-white' : 'btn-outline-danger'} py-1 px-2`}
                          style={{ fontSize: '0.75rem' }}
                        >
                          {isSuspended ? (
                            <><FaCheck /> Enable</>
                          ) : (
                            <><FaBan /> Suspend</>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDoctors;
