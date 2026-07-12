import React from 'react';
import { FaShieldAlt, FaBriefcaseMedical, FaHeartbeat } from 'react-icons/fa';

export const About = () => {
  return (
    <div className="container py-5 animate-fade-in">
      <div className="text-center max-w-xl mx-auto mb-5">
        <span className="badge-custom badge-custom-primary mb-2">Our Story</span>
        <h1 className="fw-bold text-dark display-5">About Book a Doctor</h1>
        <p className="text-secondary fs-5">Empowering people with seamless access to elite healthcare.</p>
      </div>

      <div className="row g-5 align-items-center mb-5">
        <div className="col-lg-6">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=500&h=350" 
            alt="Healthcare professionals" 
            className="img-fluid rounded-4 shadow-lg"
          />
        </div>
        <div className="col-lg-6">
          <h2 className="fw-bold text-dark h3 mb-3">Our Mission</h2>
          <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
            We believe that scheduling a consultation with a clinical expert should be instant, clear, and stress-free. Book a Doctor was founded to bridge the divide between local clinics and digital patient portals.
          </p>
          <p className="text-secondary mb-4" style={{ lineHeight: '1.7' }}>
            By providing real-time calendar slot allocations, automated medical file uploads, and digital prescription tracking, we assist thousands of families daily in securing critical clinical attention.
          </p>
          
          <div className="row g-3">
            <div className="col-sm-6">
              <div className="d-flex align-items-center gap-2 text-dark fw-bold">
                <FaHeartbeat className="text-primary" /> Dedicated Care Team
              </div>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-center gap-2 text-dark fw-bold">
                <FaShieldAlt className="text-primary" /> HIPAA Encrypted
              </div>
            </div>
            <div className="col-sm-6">
              <div className="d-flex align-items-center gap-2 text-dark fw-bold">
                <FaBriefcaseMedical className="text-primary" /> Licensed Doctors Only
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
