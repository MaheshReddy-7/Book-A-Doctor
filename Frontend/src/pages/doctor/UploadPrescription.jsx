import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Loader } from '../../components/ui/Loader';
import { FaFileMedical, FaUser, FaNotesMedical, FaPlus, FaTrash, FaClipboardCheck } from 'react-icons/fa';

export const UploadPrescription = () => {
  const { user } = useAuth();
  const { appointments, addPrescription } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Prefilled params
  const prefilledAptId = searchParams.get('booking');

  // Form states
  const [selectedAptId, setSelectedAptId] = useState(prefilledAptId || '');
  const [selectedApt, setSelectedApt] = useState(null);
  const [diagnoses, setDiagnoses] = useState('');
  const [instructions, setInstructions] = useState('');
  
  // Dynamic medicines array
  const [medicines, setMedicines] = useState([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDuration, setMedDuration] = useState('');

  useEffect(() => {
    if (selectedAptId) {
      const apt = appointments.find(a => a.id === selectedAptId);
      setSelectedApt(apt || null);
    } else {
      setSelectedApt(null);
    }
  }, [selectedAptId, appointments]);

  if (!user) return <Loader size="large" />;

  const confirmedApts = appointments.filter(apt => 
    apt.doctorId === user.id && 
    (apt.status === 'Confirmed' || apt.status === 'Pending')
  );

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!medName || !medDosage || !medDuration) {
      toast.warning("Please fill name, dosage, and duration for the medication.");
      return;
    }

    setMedicines([...medicines, { name: medName, dosage: medDosage, duration: medDuration }]);
    setMedName('');
    setMedDosage('');
    setMedDuration('');
    toast.success("Medicine added to prescription sheet.");
  };

  const handleRemoveMedicine = (idx) => {
    setMedicines(medicines.filter((_, i) => i !== idx));
    toast.info("Medicine removed.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAptId) {
      toast.error("Please select a patient booking slot.");
      return;
    }
    if (!diagnoses) {
      toast.error("Please enter a diagnostic conclusion.");
      return;
    }
    if (medicines.length === 0) {
      toast.error("Please add at least one medication.");
      return;
    }

    try {
      await addPrescription(selectedAptId, {
        diagnoses,
        medicines,
        instructions
      });
      toast.success("Prescription uploaded successfully!");
      navigate('/doctor/dashboard');
    } catch (err) {
      toast.error("Failed to upload prescription.");
    }
  };

  return (
    <div className="upload-prescription animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="card-custom p-4 p-md-5 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-3 d-flex align-items-center gap-2">
          <FaFileMedical className="text-primary" /> Upload Patient Prescription
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Choose Booking */}
            <div className="col-12 mb-3">
              <label className="form-label-custom">Select Patient Checkup Slot</label>
              <select
                className="form-select form-control-custom"
                value={selectedAptId}
                onChange={(e) => setSelectedAptId(e.target.value)}
              >
                <option value="">Choose consultation booking...</option>
                {confirmedApts.map((apt) => (
                  <option key={apt.id} value={apt.id}>
                    {apt.patientName} - {apt.date} ({apt.time}) [{apt.status}]
                  </option>
                ))}
              </select>
            </div>

            {/* Display Selected Booking Details */}
            {selectedApt && (
              <div className="col-12 p-3 bg-secondary bg-opacity-5 rounded-4 border border-light mb-3 animate-slide-up">
                <h4 className="fw-bold h6 text-dark mb-2 d-flex align-items-center gap-2">
                  <FaUser className="text-primary" /> Patient: {selectedApt.patientName}
                </h4>
                <p className="small text-secondary mb-1">Email: {selectedApt.patientEmail} | Phone: {selectedApt.patientPhone}</p>
                <div className="mt-2 text-secondary small">
                  <strong className="text-dark d-flex align-items-center gap-2 mb-1"><FaNotesMedical /> Symptoms Checked:</strong>
                  <p className="bg-white p-2 rounded border border-light mb-0 italic" style={{ fontStyle: 'italic' }}>
                    "{selectedApt.symptoms}"
                  </p>
                </div>
              </div>
            )}

            {/* Diagnoses details */}
            <div className="col-12">
              <label className="form-label-custom">Diagnostic Conclusions / Findings</label>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="E.g. Acute Viral Pharyngitis, Contact Dermatitis"
                value={diagnoses}
                onChange={(e) => setDiagnoses(e.target.value)}
                disabled={!selectedApt}
              />
            </div>

            {/* Prescription sheet dynamic builder */}
            <div className="col-12 border-top pt-4 mb-3">
              <label className="form-label-custom d-block mb-3">Prescription Items</label>

              <div className="row g-2 align-items-end mb-3">
                <div className="col-md-5">
                  <label className="small text-secondary mb-1">Medication Name</label>
                  <input
                    type="text"
                    className="form-control form-control-custom bg-light bg-opacity-50"
                    placeholder="Paracetamol 650mg"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    disabled={!selectedApt}
                  />
                </div>
                <div className="col-md-3">
                  <label className="small text-secondary mb-1">Dosage / Instructions</label>
                  <input
                    type="text"
                    className="form-control form-control-custom bg-light bg-opacity-50"
                    placeholder="1 tab after meals"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                    disabled={!selectedApt}
                  />
                </div>
                <div className="col-md-3 col-8">
                  <label className="small text-secondary mb-1">Duration</label>
                  <input
                    type="text"
                    className="form-control form-control-custom bg-light bg-opacity-50"
                    placeholder="5 Days"
                    value={medDuration}
                    onChange={(e) => setMedDuration(e.target.value)}
                    disabled={!selectedApt}
                  />
                </div>
                <div className="col-md-1 col-4">
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    disabled={!selectedApt}
                    className="btn btn-primary-custom w-100 justify-content-center py-2"
                    title="Add Medication"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Medicines List rendering */}
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th className="text-end" style={{ width: '80px' }}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted small italic">No medications added to the sheet yet.</td>
                      </tr>
                    ) : (
                      medicines.map((med, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold text-dark">{med.name}</td>
                          <td>{med.dosage}</td>
                          <td>{med.duration}</td>
                          <td className="text-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(idx)}
                              className="btn btn-sm btn-link text-danger p-0 border-0 text-decoration-none"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Special instructions */}
            <div className="col-12">
              <label className="form-label-custom">Special Instructions</label>
              <textarea
                className="form-control form-control-custom"
                rows="3"
                placeholder="Suggest bed rest, warm fluids, review parameters..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                disabled={!selectedApt}
              ></textarea>
            </div>

            <div className="col-12 border-top pt-4 text-end">
              <button
                type="submit"
                disabled={!selectedApt}
                className="btn btn-primary-custom px-4 shadow"
              >
                <FaClipboardCheck /> Upload and Complete Consultation
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default UploadPrescription;
