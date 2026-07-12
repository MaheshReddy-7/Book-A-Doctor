import React from 'react';

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', // 'primary', 'secondary', 'accent', 'danger', 'outline-primary'
  disabled = false, 
  loading = false,
  className = '',
  icon: Icon = null,
  size = 'md', // 'sm', 'md', 'lg'
  ...props 
}) => {
  const getBtnClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary-custom';
      case 'secondary':
        return 'btn-secondary-custom';
      case 'accent':
        return 'btn-accent-custom';
      case 'danger':
        return 'btn btn-danger px-4 py-2';
      case 'outline-primary':
        return 'btn btn-outline-primary px-4 py-2';
      default:
        return 'btn-primary-custom';
    }
  };

  const getPaddingClass = () => {
    if (variant === 'primary' || variant === 'secondary' || variant === 'accent') return '';
    if (size === 'sm') return 'btn-sm py-1 px-3';
    if (size === 'lg') return 'btn-lg py-3 px-5';
    return '';
  };

  const buttonStyle = {
    borderRadius: 'var(--radius-md)',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${getBtnClass()} ${getPaddingClass()} ${className}`}
      style={buttonStyle}
      {...props}
    >
      {loading && (
        <span 
          className="spinner-border spinner-border-sm" 
          role="status" 
          aria-hidden="true"
          style={{ width: '1rem', height: '1rem' }}
        />
      )}
      {!loading && Icon && <Icon />}
      {children}
    </button>
  );
};
