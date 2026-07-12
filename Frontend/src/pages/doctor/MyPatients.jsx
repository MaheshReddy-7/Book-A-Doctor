import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { SearchBar } from '../../components/ui/SearchBar';
import { FaUser, FaPhone, FaCalendarAlt, FaFileMedicalAlt, FaHistory } from 'react-icons/fa';

export const MyPatients = () => {
  const { user } = useAuth();
  const { appointments } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  if (!user) return <Loader size="large" />;

  const doctorId = user.id;

  // Filter appointments for this doctor
  const doctorApts = appointments.filter(apt => apt.doctorId === doctorId);

  // Group unique patients
  const patientsMap = {};
  doctorApts.forEach(apt => {
    if (!patientsMap[apt.patientId]) {
      patientsMap[apt.patientId] = {
        id: apt.patientId,
        name: apt.patientName,
        email: apt.patientEmail,
        phone: apt.patientPhone,
        consultsCount: 0,
        lastConsultDate: apt.date,
        history: []
      };
    }
    patientsMap[apt.patientId].consultsCount++;
    patientsMap[apt.patientId].history.push(apt);
    if (new Date(apt.date) > new Date(patientsMap[apt.patientId].lastConsultDate)) {
      patientsMap[apt.patientId].lastConsultDate = apt.date;
    }
  });

  const uniquePatients = Object.values(patientsMap);

  // Filter based on search
  const filteredPatients = uniquePatients.filter(pat => 
    pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pat.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pat.phone.includes(searchQuery)
  );

  return (
    <div className="my-patients animate-fade-in">
      <div className="mb-4">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={false}
          placeholder="Search patients by name, email or phone..."
        />
      </div>

      {filteredPatients.length === 0 ? (
        <EmptyState 
          title="No patients found" 
          message="Any patient who books a slot with your clinic profile will be listed in this panel." 
          icon={FaUser} 
        />
      ) : (
        <div className="row g-4">
          {filteredPatients.map((pat) => (
            <div key={pat.id} className="col-12 col-md-6">
              <div className="card-custom p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center gap-3 mb-3 border-bottom pb-2">
                    <div 
                      className="d-flex align-items-center justify-content-center text-primary fs-5"
                      style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
                    >
                      <FaUser />
                    </div>
                    <div>
                      <h4 className="h6 fw-bold text-dark mb-0">{pat.name}</h4>
                      <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{pat.email}</span>
                    </div>
                  </div>

                  <div className="small text-secondary mb-3">
                    <div className="mb-1"><FaPhone className="text-muted me-1" /> {pat.phone}</div>
                    <div className="mb-1"><FaCalendarAlt className="text-muted me-1" /> Last Visit: <strong>{pat.lastConsultDate}</strong></div>
                    <div><FaFileMedicalAlt className="text-muted me-1" /> Total consults: <strong>{pat.consultsCount}</strong></div>
                  </div>
                </div>

                <div className="text-end">
                  <button 
                    onClick={() => setSelectedPatient(pat)}
                    className="btn btn-sm btn-outline-primary py-1 px-3 d-flex align-items-center gap-1 ms-auto"
                    style={{ fontSize: '0.8rem' }}
                  >
                    <FaHistory /> Review Medical History
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient History Modal */}
      {selectedPatient && (
        <div className="modal-backdrop bg-dark bg-opacity-50 position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050 }}>
          <div className="card-custom p-4 bg-white shadow-lg mx-3" style={{ maxWidth: '600px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h3 className="fw-bold h5 text-dark mb-3 border-bottom pb-2 d-flex align-items-center gap-2">
              <FaHistory className="text-primary" /> Medical History: {selectedPatient.name}
            </h3>

            <div className="mb-4">
              <div className="text-secondary small fw-semibold mb-2">Previous Checkups with you:</div>
              <div className="d-flex flex-column gap-3">
                {selectedPatient.history.map((apt, idx) => (
                  <div key={idx} className="p-3 bg-secondary bg-opacity-5 rounded-4 border border-light">
                    <div className="d-flex justify-content-between mb-2">
                      <strong className="text-dark small">{apt.date} at {apt.time}</strong>
                      <span className="badge bg-primary bg-opacity-10 text-primary-hover border border-primary border-opacity-10 small">{apt.status}</span>
                    </div>
                    <p className="text-secondary small mb-2"><strong className="text-dark">Symptoms: </strong>{apt.symptoms}</p>
                    
                    {apt.prescription && (
                      <div className="p-2 bg-white rounded border border-light small mt-2">
                        <div className="fw-bold text-dark mb-1">Diagnosis: {apt.prescription.diagnoses}</div>
                        <ul className="mb-0 ps-3">
                          {apt.prescription.medicines.map((m, mIdx) => (
                            <li key={mIdx} className="text-secondary small">{m.name} - {m.dosage} ({m.duration})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-end">
              <button 
                type="button" 
                onClick={() => setSelectedPatient(null)}
                className="btn btn-sm btn-secondary-custom px-4"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default MyPatients;
