import api from './api';
import { doctors as defaultDoctors } from '../data/doctors';

const USE_MOCK = true;
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const getDoctorsCollection = () => {
  let list = localStorage.getItem('doctors_collection_v2');
  if (!list) {
    localStorage.setItem('doctors_collection_v2', JSON.stringify(defaultDoctors));
    return defaultDoctors;
  }
  
  // Auto-migration: if default list grows, overwrite local storage to seed new profiles
  try {
    const parsed = JSON.parse(list);
    if (Array.isArray(parsed) && parsed.length < defaultDoctors.length) {
      localStorage.setItem('doctors_collection_v2', JSON.stringify(defaultDoctors));
      return defaultDoctors;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem('doctors_collection_v2', JSON.stringify(defaultDoctors));
    return defaultDoctors;
  }
};

const saveDoctorsCollection = (collection) => {
  localStorage.setItem('doctors_collection_v2', JSON.stringify(collection));
};

export const doctorService = {
  getDoctors: async (filters = {}) => {
    if (USE_MOCK) {
      await delay(500);
      let collection = getDoctorsCollection();
      
      // Admin should see both approved and pending, patients should only see approved
      const showApprovedOnly = filters.approvedOnly !== false;
      let result = collection.filter(doc => doc.approved === showApprovedOnly);
      
      // Apply filters
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(doc => 
          doc.name.toLowerCase().includes(searchLower) || 
          doc.hospital.toLowerCase().includes(searchLower) ||
          doc.specialization.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.specialization && filters.specialization !== 'All') {
        result = result.filter(doc => doc.specializationKey === filters.specialization.toLowerCase());
      }
      
      if (filters.maxFee) {
        result = result.filter(doc => doc.fee <= parseInt(filters.maxFee));
      }

      if (filters.experience) {
        result = result.filter(doc => doc.experience >= parseInt(filters.experience));
      }
      
      // Apply sorting
      if (filters.sortBy) {
        if (filters.sortBy === 'experience') {
          result.sort((a, b) => b.experience - a.experience);
        } else if (filters.sortBy === 'rating') {
          result.sort((a, b) => b.rating - a.rating);
        } else if (filters.sortBy === 'fee-low') {
          result.sort((a, b) => a.fee - b.fee);
        } else if (filters.sortBy === 'fee-high') {
          result.sort((a, b) => b.fee - a.fee);
        }
      }
      
      return result;
    } else {
      const response = await api.get('/doctors', { params: filters });
      const list = response.data?.data?.doctors || [];
      return list.map(doc => ({
        ...doc,
        id: doc._id,
        name: doc.user?.fullName || doc.name,
        email: doc.user?.email,
        phone: doc.user?.phone,
        specializationKey: doc.specialization?.toLowerCase().replace(' ', ''),
        fee: doc.consultationFee,
        photo: doc.user?.profileImage 
          ? (doc.user.profileImage.startsWith('http') ? doc.user.profileImage : `http://localhost:5000/${doc.user.profileImage}`)
          : doc.photo || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        approved: doc.approvalStatus === 'approved'
      }));
    }
  },

  getDoctorById: async (id) => {
    if (USE_MOCK) {
      await delay(300);
      const collection = getDoctorsCollection();
      const doc = collection.find(d => d.id === id);
      
      // Check in pending application list too
      if (!doc) {
        const pendingDoctors = JSON.parse(localStorage.getItem('pending_doctors') || '[]');
        const pendingDoc = pendingDoctors.find(d => d.id === id);
        if (pendingDoc) return pendingDoc;
        throw new Error('Doctor not found');
      }
      return doc;
    } else {
      const response = await api.get(`/doctors/${id}`);
      const doc = response.data?.data;
      if (!doc) return null;
      return {
        ...doc,
        id: doc._id,
        name: doc.user?.fullName || doc.name,
        email: doc.user?.email,
        phone: doc.user?.phone,
        specializationKey: doc.specialization?.toLowerCase().replace(' ', ''),
        fee: doc.consultationFee,
        photo: doc.user?.profileImage 
          ? (doc.user.profileImage.startsWith('http') ? doc.user.profileImage : `http://localhost:5000/${doc.user.profileImage}`)
          : doc.photo || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        approved: doc.approvalStatus === 'approved'
      };
    }
  },

  getPendingApprovals: async () => {
    if (USE_MOCK) {
      await delay(400);
      const collection = getDoctorsCollection();
      const unapprovedFromDb = collection.filter(d => !d.approved);
      
      // Also get from registration signups
      const pendingSignups = JSON.parse(localStorage.getItem('pending_doctors') || '[]');
      
      return [...unapprovedFromDb, ...pendingSignups];
    } else {
      const response = await api.get('/admin/doctors/pending');
      const list = response.data?.data || [];
      return list.map(doc => ({
        ...doc,
        id: doc._id,
        name: doc.user?.fullName || doc.name,
        email: doc.user?.email,
        phone: doc.user?.phone,
        fee: doc.consultationFee,
        photo: doc.user?.profileImage 
          ? (doc.user.profileImage.startsWith('http') ? doc.user.profileImage : `http://localhost:5000/${doc.user.profileImage}`)
          : doc.photo || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        approved: doc.approvalStatus === 'approved'
      }));
    }
  },

  approveDoctor: async (id) => {
    if (USE_MOCK) {
      await delay(500);
      let collection = getDoctorsCollection();
      
      // Find in db
      let idx = collection.findIndex(d => d.id === id);
      if (idx !== -1) {
        collection[idx].approved = true;
        saveDoctorsCollection(collection);
        return { success: true, message: 'Doctor profile approved successfully!' };
      }
      
      // Find in pending signups
      let pendingSignups = JSON.parse(localStorage.getItem('pending_doctors') || '[]');
      let pendingDocIdx = pendingSignups.findIndex(d => d.id === id);
      if (pendingDocIdx !== -1) {
        const approvedDoc = pendingSignups[pendingDocIdx];
        approvedDoc.approved = true;
        
        // Add to active collection and remove from signups
        collection.push(approvedDoc);
        pendingSignups.splice(pendingDocIdx, 1);
        
        saveDoctorsCollection(collection);
        localStorage.setItem('pending_doctors', JSON.stringify(pendingSignups));
        return { success: true, message: 'Doctor application approved successfully!' };
      }
      
      throw new Error('Doctor not found');
    } else {
      const response = await api.put(`/admin/doctors/${id}/approve`);
      return response.data;
    }
  },

  rejectDoctor: async (id) => {
    if (USE_MOCK) {
      await delay(500);
      let collection = getDoctorsCollection();
      let idx = collection.findIndex(d => d.id === id);
      if (idx !== -1) {
        collection.splice(idx, 1);
        saveDoctorsCollection(collection);
        return { success: true, message: 'Doctor profile rejected and deleted.' };
      }
      
      let pendingSignups = JSON.parse(localStorage.getItem('pending_doctors') || '[]');
      let pendingDocIdx = pendingSignups.findIndex(d => d.id === id);
      if (pendingDocIdx !== -1) {
        pendingSignups.splice(pendingDocIdx, 1);
        localStorage.setItem('pending_doctors', JSON.stringify(pendingSignups));
        return { success: true, message: 'Doctor application rejected.' };
      }
      throw new Error('Doctor not found');
    } else {
      const response = await api.put(`/admin/doctors/${id}/reject`);
      return response.data;
    }
  },

  updateAvailability: async (id, availability) => {
    if (USE_MOCK) {
      await delay(400);
      let collection = getDoctorsCollection();
      let idx = collection.findIndex(d => d.id === id);
      if (idx !== -1) {
        collection[idx].availability = availability;
        saveDoctorsCollection(collection);
        
        // Also update stored active user if they are logged in as this doctor
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.id === id) {
          currentUser.availability = availability;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
        
        return collection[idx];
      }
      throw new Error('Doctor not found');
    } else {
      const availableDays = availability.days;
      let start = '09:00';
      let end = '17:00';
      if (availability.slots && availability.slots.length > 0) {
        const parseTime = (slotStr) => {
          const [time, period] = slotStr.split(' ');
          let [hours, minutes] = time.split(':');
          if (hours === '12' && period === 'AM') hours = '00';
          if (period === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12);
          return `${hours.padStart(2, '0')}:${minutes}`;
        };
        start = parseTime(availability.slots[0]);
        const lastSlot = availability.slots[availability.slots.length - 1];
        const lastTime = parseTime(lastSlot);
        const [lastHours, lastMinutes] = lastTime.split(':');
        const endHours = String((parseInt(lastHours) + 1) % 24).padStart(2, '0');
        end = `${endHours}:${lastMinutes}`;
      }
      
      const response = await api.put('/users/profile', {
        availableDays,
        availableTime: { start, end }
      });
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.availability = availability;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      return response.data;
    }
  }
};
