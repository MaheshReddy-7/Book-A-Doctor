import api from './api';
import { appointments as defaultAppointments } from '../data/appointments';

const USE_MOCK = true;
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const getAppointmentsCollection = () => {
  let list = localStorage.getItem('appointments_collection');
  if (!list) {
    localStorage.setItem('appointments_collection', JSON.stringify(defaultAppointments));
    return defaultAppointments;
  }
  return JSON.parse(list);
};

const saveAppointmentsCollection = (collection) => {
  localStorage.setItem('appointments_collection', JSON.stringify(collection));
};

export const appointmentService = {
  getBookings: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(500);
      let collection = getAppointmentsCollection();
      
      if (filters.patientId) {
        collection = collection.filter(apt => apt.patientId === filters.patientId);
      }
      if (filters.doctorId) {
        collection = collection.filter(apt => apt.doctorId === filters.doctorId);
      }
      if (filters.status) {
        collection = collection.filter(apt => apt.status.toLowerCase() === filters.status.toLowerCase());
      }
      
      // Sort by date (newest first)
      collection.sort((a, b) => new Date(b.date + 'T' + convertTo24h(b.time)) - new Date(a.date + 'T' + convertTo24h(a.time)));
      
      return collection;
    } else {
      const response = await api.get('/appointments', { params: filters });
      const list = response.data?.data?.appointments || [];
      return list.map(apt => ({
        ...apt,
        id: apt._id,
        patientId: apt.patient?._id || apt.patient,
        patientName: apt.patient?.fullName,
        patientEmail: apt.patient?.email,
        patientPhone: apt.patient?.phone,
        doctorId: apt.doctor?._id || apt.doctor,
        doctorName: apt.doctor?.user?.fullName || apt.doctorName,
        doctorSpecialization: apt.doctor?.specialization || apt.doctorSpecialization,
        doctorPhoto: apt.doctor?.user?.profileImage ? `http://localhost:5000/${apt.doctor.user.profileImage}` : apt.doctorPhoto || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        date: new Date(apt.date).toISOString().split('T')[0],
        status: apt.status.charAt(0).toUpperCase() + apt.status.slice(1)
      }));
    }
  },

  createBooking: async (bookingData) => {
    if (USE_MOCK) {
      await delay(600);
      let collection = getAppointmentsCollection();
      
      const newBooking = {
        id: `apt_${Date.now()}`,
        patientId: bookingData.patientId || "pat_1",
        patientName: bookingData.patientName || "John Doe",
        patientEmail: bookingData.patientEmail || "patient@bookadoctor.com",
        patientPhone: bookingData.patientPhone || "+1 (555) 019-2834",
        doctorId: bookingData.doctorId,
        doctorName: bookingData.doctorName,
        doctorSpecialization: bookingData.doctorSpecialization,
        doctorPhoto: bookingData.doctorPhoto || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        date: bookingData.date,
        time: bookingData.time,
        symptoms: bookingData.symptoms,
        status: "Pending",
        medicalReport: bookingData.medicalReportName || null,
        notes: bookingData.notes || "",
        prescription: null,
        createdAt: new Date().toISOString()
      };
      
      collection.unshift(newBooking);
      saveAppointmentsCollection(collection);
      
      addMockNotification(bookingData.doctorId, "doctor", "New Appointment Booked", 
        `${bookingData.patientName} has requested an appointment on ${bookingData.date} at ${bookingData.time}.`
      );
      
      return newBooking;
    } else {
      const payload = {
        doctor: bookingData.doctorId,
        date: bookingData.date,
        time: bookingData.time,
        symptoms: bookingData.symptoms,
        notes: bookingData.notes
      };
      const response = await api.post('/appointments', payload);
      return response.data?.data;
    }
  },

  updateStatus: async (id, status) => {
    if (USE_MOCK) {
      await delay(400);
      let collection = getAppointmentsCollection();
      let idx = collection.findIndex(apt => apt.id === id);
      if (idx !== -1) {
        collection[idx].status = status;
        saveAppointmentsCollection(collection);
        
        addMockNotification(collection[idx].patientId, "patient", `Appointment ${status}`, 
          `Your appointment with ${collection[idx].doctorName} on ${collection[idx].date} is now ${status}.`
        );
        
        return collection[idx];
      }
      throw new Error('Appointment not found');
    } else {
      const statusLower = status.toLowerCase();
      const response = await api.put(`/appointments/${id}`, { status: statusLower });
      return response.data?.data;
    }
  },

  uploadPrescription: async (id, prescriptionData) => {
    if (USE_MOCK) {
      await delay(500);
      let collection = getAppointmentsCollection();
      let idx = collection.findIndex(apt => apt.id === id);
      if (idx !== -1) {
        collection[idx].status = "Completed";
        collection[idx].prescription = {
          diagnoses: prescriptionData.diagnoses,
          medicines: prescriptionData.medicines,
          instructions: prescriptionData.instructions,
          signedBy: collection[idx].doctorName,
          dateAdded: new Date().toISOString().split('T')[0]
        };
        saveAppointmentsCollection(collection);
        
        addMockNotification(collection[idx].patientId, "patient", "Prescription Uploaded", 
          `${collection[idx].doctorName} has uploaded your prescription for the consultation on ${collection[idx].date}.`
        );
        
        return collection[idx];
      }
      throw new Error('Appointment not found');
    } else {
      const response = await api.post('/prescriptions', {
        appointment: id,
        diagnoses: prescriptionData.diagnoses,
        medicines: prescriptionData.medicines,
        instructions: prescriptionData.instructions
      });
      return response.data?.data;
    }
  }
};

// Helper function to convert 12h to 24h for sorting
function convertTo24h(time12h) {
  if (!time12h) return '00:00';
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
  return `${hours}:${minutes}`;
}

// Helper to write mock notifications dynamically
function addMockNotification(userId, role, title, message) {
  const currentNotifs = JSON.parse(localStorage.getItem('notifications_collection') || '[]');
  const newNotif = {
    id: `not_${Date.now()}`,
    userId,
    role,
    title,
    message,
    time: "Just now",
    isRead: false
  };
  currentNotifs.unshift(newNotif);
  localStorage.setItem('notifications_collection', JSON.stringify(currentNotifs));
}
export { getAppointmentsCollection };
