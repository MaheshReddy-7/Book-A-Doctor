import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { FaHeartbeat, FaBell, FaUser, FaSignOutAlt, FaColumns, FaCircle } from 'react-icons/fa';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationAsRead } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Filter notifications for active user
  const activeNotifications = notifications.filter(notif => {
    if (user?.role === 'admin') return notif.role === 'admin';
    return notif.role === user?.role && notif.userId === user?.id;
  });

  const unreadCount = activeNotifications.filter(n => !n.isRead).length;

  const getDashboardPath = () => {
    if (!user) return '/';
    return `/${user.role}/dashboard`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-sticky py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary fs-4" to="/">
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

        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 fs-6">
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link px-3 ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`} to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link px-3 ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`} to="/doctors">Doctors</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link px-3 ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`} to="/about">About Us</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link px-3 ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`} to="/faq">FAQ</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({isActive}) => `nav-link px-3 ${isActive ? 'text-primary fw-bold' : 'text-secondary'}`} to="/contact">Contact</NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                {/* Notification Dropdown */}
                <div className="position-relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="btn btn-link text-secondary position-relative p-2 border-0 bg-transparent"
                    style={{ fontSize: '1.25rem' }}
                  >
                    <FaBell />
                    {unreadCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '0.65rem' }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div 
                      className="glass-panel position-absolute end-0 mt-3 p-3 rounded-4 shadow-lg animate-slide-up"
                      style={{ width: '320px', zIndex: 1100 }}
                    >
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                        <span className="fw-bold text-dark">Notifications</span>
                        <Link 
                          to={`/${user.role}/notifications`} 
                          onClick={() => setShowNotifications(false)}
                          className="small text-decoration-none text-primary"
                        >
                          View all
                        </Link>
                      </div>
                      
                      <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
                        {activeNotifications.length === 0 ? (
                          <div className="text-center py-3 text-muted small">No notifications yet.</div>
                        ) : (
                          activeNotifications.slice(0, 4).map((notif) => (
                            <div 
                              key={notif.id}
                              onClick={() => {
                                markNotificationAsRead(notif.id);
                                navigate(`/${user.role}/notifications`);
                                setShowNotifications(false);
                              }}
                              className={`p-2 rounded-3 mb-1 border-bottom border-light cursor-pointer transition-fast hover-bg ${!notif.isRead ? 'bg-primary bg-opacity-5' : ''}`}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="d-flex align-items-start gap-2">
                                {!notif.isRead && <FaCircle className="text-danger mt-1" style={{ fontSize: '6px' }} />}
                                <div className="flex-grow-1">
                                  <div className="fw-semibold text-dark small" style={{ fontSize: '0.85rem' }}>{notif.title}</div>
                                  <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem', maxWidth: '240px' }}>{notif.message}</div>
                                  <div className="text-muted small" style={{ fontSize: '0.65rem' }}>{notif.time}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Settings Dropdown */}
                <div className="dropdown">
                  <button 
                    className="btn btn-secondary-custom d-flex align-items-center gap-2 border-0 bg-transparent shadow-none" 
                    type="button" 
                    id="profileDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <img 
                      src={user.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"} 
                      alt={user.name} 
                      className="rounded-circle"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <span className="d-none d-md-inline text-dark small fw-semibold">{user.name}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg mt-2 p-2 rounded-4" aria-labelledby="profileDropdown">
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 text-secondary d-flex align-items-center gap-2" to={getDashboardPath()}>
                        <FaColumns className="text-primary" /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item rounded-3 py-2 text-secondary d-flex align-items-center gap-2" to={`/${user.role}/profile`}>
                        <FaUser className="text-primary" /> Edit Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider bg-light" /></li>
                    <li>
                      <button className="dropdown-item rounded-3 py-2 text-danger d-flex align-items-center gap-2 w-100 bg-transparent border-0 text-start" onClick={handleLogout}>
                        <FaSignOutAlt /> Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary-custom d-none d-lg-inline-flex">Log In</Link>
                <Link to="/register" className="btn btn-primary-custom">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
