import React from 'react';

export const Loader = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizeMap = {
    small: '1.5rem',
    medium: '2.5rem',
    large: '4rem'
  };

  const colorMap = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    accent: 'var(--accent)',
    white: '#FFFFFF'
  };

  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`} style={{ minHeight: '100px' }}>
      <div 
        className="spinner-border" 
        role="status" 
        style={{ 
          width: sizeMap[size], 
          height: sizeMap[size], 
          color: colorMap[color] || 'var(--primary)',
          borderWidth: '3px'
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export const Skeleton = ({ variant = 'text', width = '100%', height = '16px', className = '' }) => {
  const style = {
    width,
    height,
    backgroundColor: '#E2E8F0',
    borderRadius: variant === 'circle' ? '50%' : 'var(--radius-sm)'
  };

  return <div className={`skeleton ${className}`} style={style} />;
};

export const SkeletonCard = () => {
  return (
    <div className="card-custom p-4 mb-3">
      <div className="d-flex align-items-center gap-3 mb-3">
        <Skeleton variant="circle" width="55px" height="55px" />
        <div className="flex-grow-1">
          <Skeleton variant="text" width="60%" height="20px" className="mb-2" />
          <Skeleton variant="text" width="40%" height="14px" />
        </div>
      </div>
      <Skeleton variant="text" width="90%" height="14px" className="mb-2" />
      <Skeleton variant="text" width="80%" height="14px" className="mb-3" />
      <div className="d-flex justify-content-between">
        <Skeleton variant="text" width="30%" height="24px" />
        <Skeleton variant="text" width="25%" height="32px" />
      </div>
    </div>
  );
};
