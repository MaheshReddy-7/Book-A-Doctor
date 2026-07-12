import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { toast } from 'react-toastify';
import { FaFileMedical, FaFilePrescription, FaDownload, FaPrint, FaRegFilePdf } from 'react-icons/fa';

export const PatientReports = () => {
  const { user } = useAuth();
  const { appointments } = useApp();
  const [activeTab, setActiveTab] = useState('prescriptions');

  if (!user) return <Loader size="large" />;

  const patientApts = appointments.filter(apt => apt.patientId === user.id);
  const completedApts = patientApts.filter(apt => apt.status === 'Completed');
  
  // Filter prescriptions
  const prescriptions = completedApts.filter(apt => apt.prescription).map(apt => ({
    id: apt.id,
    doctorName: apt.doctorName,
    specialization: apt.doctorSpecialization,
    date: apt.date,
    ...apt.prescription
  }));

  // Filter uploaded documents
  const uploadedDocs = patientApts.filter(apt => apt.medicalReport).map(apt => ({
    id: apt.id,
    fileName: apt.medicalReport,
    doctorName: apt.doctorName,
    date: apt.date,
    notes: apt.symptoms
  }));

  const handleAction = (type, title) => {
    toast.info(`Simulating ${type} for: ${title}`);
  };

  return (
    <div className="patient-reports animate-fade-in">
      <div className="card-custom p-4 bg-white border border-light">
        {/* Navigation tabs */}
        <div className="d-flex border-bottom mb-4">
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`btn border-0 pb-3 rounded-0 fw-bold ${activeTab === 'prescriptions' ? 'border-bottom border-primary border-3 text-primary' : 'text-secondary'}`}
            style={{ fontSize: '0.9rem' }}
          >
            Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`btn border-0 pb-3 rounded-0 fw-bold ${activeTab === 'documents' ? 'border-bottom border-primary border-3 text-primary' : 'text-secondary'}`}
            style={{ fontSize: '0.9rem' }}
          >
            Uploaded Medical Files ({uploadedDocs.length})
          </button>
        </div>

        {activeTab === 'prescriptions' && (
          <div>
            {prescriptions.length === 0 ? (
              <EmptyState 
                title="No prescriptions found" 
                message="Your clinic prescriptions will show up here once diagnostic checks are completed by your doctors." 
                icon={FaFilePrescription} 
              />
            ) : (
              <div className="d-flex flex-column gap-3">
                {prescriptions.map((p) => (
                  <div key={p.id} className="p-4 bg-secondary bg-opacity-5 rounded-4 border border-light animate-slide-up">
                    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center border-bottom pb-3 mb-3 gap-2">
                      <div>
                        <h4 className="h5 fw-bold text-dark mb-0">{p.diagnoses}</h4>
                        <span className="text-muted small">Consulted <strong>{p.doctorName}</strong> ({p.specialization}) on {p.date}</span>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button 
                          onClick={() => handleAction('print', p.diagnoses)} 
                          className="btn btn-sm btn-outline-secondary py-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <FaPrint /> Print Rx
                        </button>
                        <button 
                          onClick={() => handleAction('download', p.diagnoses)} 
                          className="btn btn-sm btn-primary-custom py-1"
                          style={{ fontSize: '0.75rem' }}
                        >
                          <FaDownload /> Download
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="text-secondary fw-semibold small mb-2">Prescribed Medicines:</div>
                      <div className="table-responsive">
                        <table className="table table-bordered table-sm bg-white small mb-0">
                          <thead className="bg-light">
                            <tr>
                              <th>Medicine Name</th>
                              <th>Dosage</th>
                              <th>Duration</th>
                            </tr>
                          </thead>
                          <tbody>
                            {p.medicines.map((med, idx) => (
                              <tr key={idx}>
                                <td className="fw-semibold text-dark">{med.name}</td>
                                <td>{med.dosage}</td>
                                <td>{med.duration}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <div className="text-secondary fw-semibold small mb-1">Instructions:</div>
                      <p className="text-secondary small italic mb-0" style={{ fontStyle: 'italic' }}>
                        "{p.instructions}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            {uploadedDocs.length === 0 ? (
              <EmptyState 
                title="No reports attached" 
                message="Any health records attached during appointment booking checks will list here." 
                icon={FaFileMedical} 
              />
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Document Name</th>
                      <th>Clinic consult</th>
                      <th>Upload Date</th>
                      <th>Description</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedDocs.map((doc) => (
                      <tr key={doc.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <FaRegFilePdf className="text-danger fs-5" />
                            <span className="fw-semibold text-dark">{doc.fileName}</span>
                          </div>
                        </td>
                        <td>{doc.doctorName}</td>
                        <td>{doc.date}</td>
                        <td><span className="text-muted text-truncate d-inline-block" style={{ maxWidth: '180px' }}>{doc.notes}</span></td>
                        <td className="text-end">
                          <button 
                            onClick={() => handleAction('download', doc.fileName)} 
                            className="btn btn-sm btn-link text-primary p-0 border-0 text-decoration-none fw-semibold"
                          >
                            <FaDownload /> Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default PatientReports;
