import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaThLarge, FaCalendarAlt, FaCalendarCheck, FaUsers, 
  FaClipboardList, FaFileMedical, FaUser, FaCog, 
  FaBell, FaClock, FaCheckSquare, FaChartBar, FaUserMd 
} from 'react-icons/fa';

export const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const role = user.role;

  const getLinks = () => {
    switch (role) {
      case 'patient':
        return [
          { name: 'Dashboard', path: '/patient/dashboard', icon: FaThLarge },
          { name: 'Book Appointment', path: '/patient/book-appointment', icon: FaCalendarAlt },
          { name: 'Appointment History', path: '/patient/appointments', icon: FaClipboardList },
          { name: 'Reports', path: '/patient/reports', icon: FaFileMedical },
          { name: 'Notifications', path: '/patient/notifications', icon: FaBell },
          { name: 'Profile', path: '/patient/profile', icon: FaUser },
          { name: 'Settings', path: '/patient/settings', icon: FaCog },
        ];
      case 'doctor':
        return [
          { name: 'Dashboard', path: '/doctor/dashboard', icon: FaThLarge },
          { name: "Today's Visits", path: '/doctor/today-appointments', icon: FaCalendarCheck },
          { name: 'Upcoming Slots', path: '/doctor/upcoming-appointments', icon: FaClock },
          { name: 'My Patients', path: '/doctor/patients', icon: FaUsers },
          { name: 'Availability Shift', path: '/doctor/availability', icon: FaClipboardList },
          { name: 'Upload Rx', path: '/doctor/upload-prescription', icon: FaFileMedical },
          { name: 'Notifications', path: '/doctor/notifications', icon: FaBell },
          { name: 'Profile Profile', path: '/doctor/profile', icon: FaUser },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: FaThLarge },
          { name: 'Doctors Directory', path: '/admin/doctors', icon: FaUserMd },
          { name: 'Pending Approvals', path: '/admin/approvals', icon: FaCheckSquare },
          { name: 'User Directory', path: '/admin/users', icon: FaUsers },
          { name: 'Appointments log', path: '/admin/appointments', icon: FaCalendarAlt },
          { name: 'Financial Reports', path: '/admin/reports', icon: FaFileMedical },
          { name: 'Platform Analytics', path: '/admin/analytics', icon: FaChartBar },
          { name: 'System Notifications', path: '/admin/notifications', icon: FaBell },
        ];
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside 
      className={`sidebar-custom py-4 px-3 flex-shrink-0 d-flex flex-column transition-normal ${isCollapsed ? 'collapsed' : ''}`}
      style={{
        backgroundColor: '#0F172A',
        minHeight: 'calc(100vh - 78px)',
        width: isCollapsed ? '80px' : '260px'
      }}
    >
      <ul className="nav nav-pills flex-column gap-2 mb-auto">
        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <li key={idx} className="nav-item">
              <NavLink 
                to={link.path}
                className={({ isActive }) => `nav-link d-flex align-items-center gap-3 py-2 px-3 ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (window.innerWidth < 992) {
                    toggleSidebar();
                  }
                }}
              >
                <span className="fs-5 d-flex align-items-center"><Icon /></span>
                {!isCollapsed && <span className="small">{link.name}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
      
      {!isCollapsed && (
        <div className="mt-auto p-3 text-center border-top border-secondary border-opacity-10">
          <div className="text-muted" style={{ fontSize: '0.7rem' }}>Logged in as:</div>
          <div className="fw-semibold text-white text-truncate small">{user.name}</div>
          <span className="badge bg-primary bg-opacity-20 text-primary-hover border border-primary border-opacity-10 mt-1" style={{ fontSize: '0.65rem' }}>
            {role.toUpperCase()}
          </span>
        </div>
      )}
    </aside>
  );
};
