import React from 'react';

export const Badge = ({ status = 'pending', text, className = '' }) => {
  const normalizedStatus = status.toLowerCase();
  
  const getBadgeClass = () => {
    switch (normalizedStatus) {
      case 'confirmed':
      case 'approved':
      case 'active':
        return 'badge-custom-success';
      case 'pending':
        return 'badge-custom-warning';
      case 'completed':
        return 'badge-custom-primary';
      case 'cancelled':
      case 'rejected':
      case 'inactive':
        return 'badge-custom-danger';
      default:
        return 'badge-custom-primary';
    }
  };

  return (
    <span className={`badge-custom ${getBadgeClass()} ${className}`}>
      {text || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
