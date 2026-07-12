import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserCog, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const DevRoleSwitcher = () => {
  const { user, devSwitchRole } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleRoleChange = (role) => {
    devSwitchRole(role);
    toast.success(`Switched role to: ${role.toUpperCase()}`, {
      position: "bottom-left",
      autoClose: 1500
    });
    setIsOpen(false);
  };

  const getRoleLabel = () => {
    if (!user) return 'Guest (Logged Out)';
    return user.role.toUpperCase();
  };

  return (
    <div className="dev-role-switcher glass-panel p-2 rounded-4 shadow-lg border border-primary border-opacity-20 animate-fade-in" style={{ width: '220px' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="btn btn-sm btn-primary-custom w-100 d-flex justify-content-between align-items-center"
      >
        <span className="d-flex align-items-center gap-2">
          <FaUserCog />
          <span className="small">Dev Switcher</span>
        </span>
        {isOpen ? <FaChevronDown /> : <FaChevronUp />}
      </button>
      
      {isOpen && (
        <div className="mt-2 pt-2 border-top border-secondary border-opacity-10 d-flex flex-column gap-1 animate-slide-up">
          <div className="text-muted small px-2 pb-1">
            Current: <strong className="text-primary">{getRoleLabel()}</strong>
          </div>
          <button 
            onClick={() => handleRoleChange('guest')} 
            className={`btn btn-sm text-start py-1 px-2 rounded ${!user ? 'bg-secondary bg-opacity-10 text-primary' : 'text-dark'}`}
            style={{ fontSize: '0.8rem' }}
          >
            Guest (Logged Out)
          </button>
          <button 
            onClick={() => handleRoleChange('patient')} 
            className={`btn btn-sm text-start py-1 px-2 rounded ${user?.role === 'patient' ? 'bg-secondary bg-opacity-10 text-primary fw-semibold' : 'text-dark'}`}
            style={{ fontSize: '0.8rem' }}
          >
            Patient (John Doe)
          </button>
          <button 
            onClick={() => handleRoleChange('doctor')} 
            className={`btn btn-sm text-start py-1 px-2 rounded ${user?.role === 'doctor' ? 'bg-secondary bg-opacity-10 text-primary fw-semibold' : 'text-dark'}`}
            style={{ fontSize: '0.8rem' }}
          >
            Doctor (Dr. Bennett)
          </button>
          <button 
            onClick={() => handleRoleChange('admin')} 
            className={`btn btn-sm text-start py-1 px-2 rounded ${user?.role === 'admin' ? 'bg-secondary bg-opacity-10 text-primary fw-semibold' : 'text-dark'}`}
            style={{ fontSize: '0.8rem' }}
          >
            Administrator
          </button>
        </div>
      )}
    </div>
  );
};
