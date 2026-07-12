import React from 'react';
import { FaInbox } from 'react-icons/fa';

export const EmptyState = ({ 
  title = "No data found", 
  message = "There are no records matching the current criteria.", 
  icon: Icon = FaInbox,
  actionButton = null 
}) => {
  return (
    <div 
      className="card-custom text-center p-5 animate-fade-in my-3"
      style={{ borderStyle: 'dashed', borderWidth: '2px', backgroundColor: 'transparent' }}
    >
      <div 
        className="d-flex align-items-center justify-content-center mx-auto mb-4"
        style={{ 
          width: '70px', 
          height: '70px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          color: 'var(--primary)',
          fontSize: '2rem'
        }}
      >
        <Icon />
      </div>
      <h3 className="h5 fw-bold text-dark mb-2">{title}</h3>
      <p className="text-secondary mx-auto mb-4" style={{ maxWidth: '350px' }}>{message}</p>
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};
