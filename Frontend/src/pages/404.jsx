import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaHome } from 'react-icons/fa';

export const PageNotFound = () => {
  return (
    <div className="container text-center py-5 d-flex flex-column align-items-center justify-content-center animate-fade-in" style={{ minHeight: '60vh' }}>
      <div 
        className="d-flex align-items-center justify-content-center text-primary mb-4"
        style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          fontSize: '3.5rem'
        }}
      >
        <FaHeartbeat className="animate-pulse-custom" />
      </div>
      <h1 className="display-3 fw-bold text-dark mb-2">404</h1>
      <h2 className="h4 fw-bold text-secondary mb-3">Page Not Found</h2>
      <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
        The path you are looking for has been moved or doesn't exist on this frontend. Use the button below to navigate to safety.
      </p>
      <Link to="/" className="btn btn-primary-custom">
        <FaHome /> Go to Homepage
      </Link>
    </div>
  );
};
export default PageNotFound;
