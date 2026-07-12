import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <Link className="d-flex align-items-center gap-2 fw-bold text-white text-decoration-none mb-3 fs-4" to="/">
              <span style={{ 
                color: 'white', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                padding: '8px', 
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaHeartbeat />
              </span>
              <span>Book a Doctor</span>
            </Link>
            <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
              Book a Doctor is a leading digital healthcare platform designed to bridge the gap between patients and specialized medical care. Find certified experts and schedule appointments easily.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-muted hover-text-white transition-fast fs-5"><FaTwitter /></a>
              <a href="#" className="text-muted hover-text-white transition-fast fs-5"><FaFacebookF /></a>
              <a href="#" className="text-muted hover-text-white transition-fast fs-5"><FaLinkedinIn /></a>
              <a href="#" className="text-muted hover-text-white transition-fast fs-5"><FaInstagram /></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="fw-semibold text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/" className="text-muted text-decoration-none hover-text-white transition-fast">Home</Link></li>
              <li><Link to="/doctors" className="text-muted text-decoration-none hover-text-white transition-fast">Search Doctors</Link></li>
              <li><Link to="/about" className="text-muted text-decoration-none hover-text-white transition-fast">About Us</Link></li>
              <li><Link to="/faq" className="text-muted text-decoration-none hover-text-white transition-fast">FAQ</Link></li>
              <li><Link to="/contact" className="text-muted text-decoration-none hover-text-white transition-fast">Contact Support</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="fw-semibold text-white mb-3">Departments</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/doctors" className="text-muted text-decoration-none hover-text-white transition-fast">Cardiology</Link></li>
              <li><Link to="/doctors" className="text-muted text-decoration-none hover-text-white transition-fast">Pediatrics</Link></li>
              <li><Link to="/doctors" className="text-muted text-decoration-none hover-text-white transition-fast">Dermatology</Link></li>
              <li><Link to="/doctors" className="text-muted text-decoration-none hover-text-white transition-fast">Neurology</Link></li>
              <li><Link to="/doctors" className="text-muted text-decoration-none hover-text-white transition-fast">General Medicine</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5 className="fw-semibold text-white mb-3">Join Our Newsletter</h5>
            <p className="text-muted small mb-3">Subscribe to get clinic news, tips, and diagnostic updates.</p>
            <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
              <input 
                type="email" 
                className="form-control bg-secondary bg-opacity-10 border-0 text-white small px-3" 
                placeholder="Enter email address"
                style={{ borderRadius: '8px' }}
              />
              <button type="submit" className="btn btn-primary-custom px-3" style={{ borderRadius: '8px' }}>Join</button>
            </form>
          </div>
        </div>

        <hr className="my-4 border-secondary border-opacity-30" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <p className="text-muted small mb-0">&copy; 2026 Book a Doctor. All rights reserved.</p>
          <div className="d-flex gap-3 small">
            <a href="#" className="text-muted text-decoration-none hover-text-white transition-fast">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-none hover-text-white transition-fast">Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        .hover-text-white:hover {
          color: #FFFFFF !important;
        }
      `}</style>
    </footer>
  );
};
