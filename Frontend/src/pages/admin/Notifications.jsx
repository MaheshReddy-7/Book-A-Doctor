import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { EmptyState } from '../../components/ui/EmptyState';
import { Loader } from '../../components/ui/Loader';
import { FaBell, FaCheckDouble, FaCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';

export const AdminNotifications = () => {
  const { user } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  if (!user) return <Loader size="large" />;

  const adminNotifs = notifications.filter(n => n.role === 'admin');
  const unreadCount = adminNotifs.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead('admin', user.id);
    toast.success("All notifications marked as read.");
  };

  return (
    <div className="admin-notifications animate-fade-in">
      <div className="card-custom p-4 bg-white border border-light">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h3 className="h5 fw-bold text-dark mb-0">System Log alerts</h3>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead} 
              className="btn btn-sm btn-link text-primary text-decoration-none d-flex align-items-center gap-1 p-0 fw-semibold"
            >
              <FaCheckDouble /> Mark all as read
            </button>
          )}
        </div>

        {adminNotifs.length === 0 ? (
          <EmptyState 
            title="All caught up!" 
            message="No system updates or pending requests alerts were found." 
            icon={FaBell} 
          />
        ) : (
          <div className="d-flex flex-column gap-2">
            {adminNotifs.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => !notif.isRead && markNotificationAsRead(notif.id)}
                className={`p-3 rounded-4 border border-light cursor-pointer transition-fast hover-bg d-flex align-items-start justify-content-between gap-3 ${!notif.isRead ? 'bg-primary bg-opacity-5' : ''}`}
                style={{ cursor: !notif.isRead ? 'pointer' : 'default' }}
              >
                <div className="d-flex gap-2">
                  {!notif.isRead && <FaCircle className="text-danger mt-2 flex-shrink-0" style={{ fontSize: '8px' }} />}
                  <div>
                    <h4 className="h6 fw-bold text-dark mb-1">{notif.title}</h4>
                    <p className="text-secondary small mb-1">{notif.message}</p>
                    <span className="text-muted small" style={{ fontSize: '0.7rem' }}>{notif.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminNotifications;
