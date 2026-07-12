import React from 'react';
import { toast } from 'react-toastify';
import { FaLock, FaBell, FaGlobe } from 'react-icons/fa';

export const PatientSettings = () => {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Security settings updated successfully!");
    e.target.reset();
  };

  return (
    <div className="patient-settings animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="card-custom p-4 p-md-5 bg-white border border-light">
        <h3 className="h5 fw-bold text-dark mb-4 border-bottom pb-3">Account Settings</h3>

        <form onSubmit={handleSave}>
          <div className="row g-3">
            {/* Step 1: Password change */}
            <div className="col-12 mb-3">
              <h4 className="h6 fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                <FaLock /> Update Account Password
              </h4>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Current Password</label>
                  <input type="password" required className="form-control form-control-custom" placeholder="••••••••" />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">New Password</label>
                  <input type="password" required className="form-control form-control-custom" placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* Step 2: System preferences */}
            <div className="col-12 border-top pt-4 mb-3">
              <h4 className="h6 fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                <FaBell /> System Preferences
              </h4>
              
              <div className="form-check form-switch mb-2">
                <input className="form-check-input" type="checkbox" id="emailNotifs" defaultChecked />
                <label className="form-check-label text-secondary small" htmlFor="emailNotifs">
                  Send email notifications for appointment status changes
                </label>
              </div>

              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="smsNotifs" />
                <label className="form-check-label text-secondary small" htmlFor="smsNotifs">
                  Send SMS reminder codes 24h before consultations
                </label>
              </div>
            </div>

            <div className="col-12 mt-4 text-end">
              <button type="submit" className="btn btn-primary-custom px-4">
                Update Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PatientSettings;
