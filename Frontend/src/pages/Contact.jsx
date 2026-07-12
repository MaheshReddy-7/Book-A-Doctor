import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you for reaching out! A support ticket has been created.");
    e.target.reset();
  };

  return (
    <div className="container py-5 animate-fade-in">
      <div className="text-center mb-5">
        <span className="badge-custom badge-custom-primary mb-2">Help Center</span>
        <h1 className="fw-bold text-dark display-5">Contact Us</h1>
        <p className="text-secondary">Have queries? Reach our team and we'll reply shortly.</p>
      </div>

      <div className="row g-5">
        <div className="col-lg-5">
          <div className="card-custom p-4 h-100">
            <h3 className="fw-bold text-dark mb-4">Direct Details</h3>
            
            <div className="d-flex align-items-center gap-3 mb-4">
              <div 
                className="d-flex align-items-center justify-content-center text-primary fs-4"
                style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
              >
                <FaEnvelope />
              </div>
              <div>
                <h4 className="h6 text-muted mb-0 fw-semibold">Email support</h4>
                <p className="text-dark fw-bold mb-0">support@bookadoctor.com</p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 mb-4">
              <div 
                className="d-flex align-items-center justify-content-center text-primary fs-4"
                style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
              >
                <FaPhone />
              </div>
              <div>
                <h4 className="h6 text-muted mb-0 fw-semibold">Call helpline</h4>
                <p className="text-dark fw-bold mb-0">+1 (555) 234-5678</p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div 
                className="d-flex align-items-center justify-content-center text-primary fs-4"
                style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: 'rgba(37, 99, 235, 0.05)' }}
              >
                <FaMapMarkerAlt />
              </div>
              <div>
                <h4 className="h6 text-muted mb-0 fw-semibold">Headquarters</h4>
                <p className="text-dark fw-bold mb-0">742 Evergreen Terrace, Springfield</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="glass-panel p-4 rounded-4 shadow-sm border border-light">
            <h3 className="fw-bold text-dark h5 mb-3">Send Us a Direct Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">First Name</label>
                  <input type="text" required className="form-control form-control-custom" placeholder="John" />
                </div>
                <div className="col-md-6">
                  <label className="form-label-custom">Last Name</label>
                  <input type="text" required className="form-control form-control-custom" placeholder="Doe" />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Email Address</label>
                  <input type="email" required className="form-control form-control-custom" placeholder="john@example.com" />
                </div>
                <div className="col-12">
                  <label className="form-label-custom">Message</label>
                  <textarea required className="form-control form-control-custom" rows="4" placeholder="Detail your queries..."></textarea>
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary-custom w-100 justify-content-center">Send Email</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
