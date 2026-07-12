import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { DevRoleSwitcher } from '../components/common/DevRoleSwitcher';
import { Loader } from '../components/ui/Loader';
import { FaBars, FaTimes } from 'react-icons/fa';

export const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar on page change for mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: 'var(--background)' }}>
        <Loader size="large" />
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role validation check: verify url matches user role
  const pathPrefix = location.pathname.split('/')[1]; // e.g. 'patient' from '/patient/dashboard'
  if (pathPrefix && pathPrefix !== user.role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <div className="d-flex flex-column min-height-vh-100" style={{ minHeight: '100vh' }}>
      <Navbar />
      
      <div className="dashboard-container flex-grow-1">
        {/* Desktop Sidebar & Mobile Sidebar Wrapper */}
        <div className={`sidebar-wrapper ${isMobileOpen ? 'show' : ''}`}>
          <Sidebar 
            isCollapsed={isSidebarCollapsed} 
            toggleSidebar={toggleMobileSidebar} 
          />
        </div>

        {/* Dashboard Content Panel */}
        <div className="dashboard-content d-flex flex-column">
          {/* Dashboard Actions Bar */}
          <div className="glass-panel py-2 px-4 border-0 border-bottom border-light d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              {/* Desktop Toggle Button */}
              <button 
                onClick={toggleSidebar} 
                className="btn btn-sm btn-secondary-custom d-none d-lg-flex"
                style={{ padding: '8px 12px' }}
              >
                <FaBars />
              </button>
              {/* Mobile Toggle Button */}
              <button 
                onClick={toggleMobileSidebar} 
                className="btn btn-sm btn-secondary-custom d-flex d-lg-none"
                style={{ padding: '8px 12px' }}
              >
                {isMobileOpen ? <FaTimes /> : <FaBars />}
              </button>
              
              <h2 className="fs-5 fw-bold text-dark mb-0 capitalize-text">
                {user.role} Dashboard
              </h2>
            </div>
            
            <div className="text-secondary small d-none d-sm-block">
              Welcome back, <strong className="text-primary">{user.name}</strong>
            </div>
          </div>

          <div className="p-4 flex-grow-1 overflow-x-hidden animate-slide-up">
            <Outlet />
          </div>
        </div>
      </div>
      
      <DevRoleSwitcher />

      <style>{`
        .sidebar-wrapper {
          transition: all var(--transition-normal);
        }
        @media (max-width: 991.98px) {
          .sidebar-wrapper {
            position: fixed;
            left: -260px;
            top: 78px;
            bottom: 0;
            z-index: 1010;
          }
          .sidebar-wrapper.show {
            left: 0;
          }
          .dashboard-content {
            margin-left: 0 !important;
          }
        }
        .capitalize-text {
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
};
