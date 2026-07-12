import React, { createContext, useContext, useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { specializations as staticSpecs } from '../data/specializations';
import { notifications as defaultNotifs } from '../data/notifications';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [specializations] = useState(staticSpecs);
  const [loading, setLoading] = useState(true);

  // Initialize notifications from localStorage
  const loadNotifications = () => {
    let list = localStorage.getItem('notifications_collection');
    if (!list) {
      localStorage.setItem('notifications_collection', JSON.stringify(defaultNotifs));
      setNotifications(defaultNotifs);
    } else {
      setNotifications(JSON.parse(list));
    }
  };

  const refreshData = async () => {
    try {
      // Get all doctors (approved and pending)
      const allDocs = await doctorService.getDoctors({ approvedOnly: false });
      setDoctors(allDocs);

      // Get all appointments if logged in
      if (localStorage.getItem('token')) {
        const allApts = await appointmentService.getBookings();
        setAppointments(allApts);
      } else {
        setAppointments([]);
      }

      // Get notifications
      loadNotifications();
    } catch (error) {
      console.error("Failed to load application collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  const markNotificationAsRead = (id) => {
    const list = JSON.parse(localStorage.getItem('notifications_collection') || '[]');
    const idx = list.findIndex(n => n.id === id);
    if (idx !== -1) {
      list[idx].isRead = true;
      localStorage.setItem('notifications_collection', JSON.stringify(list));
      setNotifications(list);
    }
  };

  const markAllNotificationsAsRead = (role, userId) => {
    const list = JSON.parse(localStorage.getItem('notifications_collection') || '[]');
    const updated = list.map(n => {
      if (n.role === role && (n.userId === userId || role === 'admin')) {
        return { ...n, isRead: true };
      }
      return n;
    });
    localStorage.setItem('notifications_collection', JSON.stringify(updated));
    setNotifications(updated);
  };

  const createBooking = async (bookingData) => {
    const res = await appointmentService.createBooking(bookingData);
    await refreshData();
    return res;
  };

  const updateAppointmentStatus = async (id, status) => {
    const res = await appointmentService.updateStatus(id, status);
    await refreshData();
    return res;
  };

  const addPrescription = async (id, prescriptionData) => {
    const res = await appointmentService.uploadPrescription(id, prescriptionData);
    await refreshData();
    return res;
  };

  const approveDoctorProfile = async (id) => {
    const res = await doctorService.approveDoctor(id);
    await refreshData();
    return res;
  };

  const rejectDoctorProfile = async (id) => {
    const res = await doctorService.rejectDoctor(id);
    await refreshData();
    return res;
  };

  const updateDoctorAvailability = async (id, availability) => {
    const res = await doctorService.updateAvailability(id, availability);
    await refreshData();
    return res;
  };

  return (
    <AppContext.Provider
      value={{
        doctors,
        appointments,
        notifications,
        specializations,
        loading,
        refreshData,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        createBooking,
        updateAppointmentStatus,
        addPrescription,
        approveDoctorProfile,
        rejectDoctorProfile,
        updateDoctorAvailability
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
