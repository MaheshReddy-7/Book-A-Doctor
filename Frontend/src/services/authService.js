import api from './api';
import { patients } from '../data/patients';
import { doctors } from '../data/doctors';

const USE_MOCK = true;

// Helper to simulate network lag
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await delay(600);
      
      // Default credentials check
      if (email === 'patient@bookadoctor.com' && password === 'Password123') {
        const patient = patients.find(p => p.email === email);
        const user = { ...patient, role: 'patient', token: 'mock-jwt-token-patient' };
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      
      if (email === 'doctor@bookadoctor.com' && password === 'Password123') {
        const doctor = doctors.find(d => d.id === 'doc_1');
        const user = { ...doctor, email, role: 'doctor', token: 'mock-jwt-token-doctor' };
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      
      if (email === 'admin@bookadoctor.com' && password === 'Password123') {
        const user = {
          id: 'admin_1',
          name: 'Platform Admin',
          email: 'admin@bookadoctor.com',
          role: 'admin',
          token: 'mock-jwt-token-admin',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150'
        };
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      
      // Dynamic patient registration check (from local memory if registered during session)
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      const match = registeredUsers.find(u => u.email === email && u.password === password);
      if (match) {
        const user = { ...match, token: 'mock-jwt-token-dynamic' };
        delete user.password;
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      
      throw new Error('Invalid email or password. Use Password123 as the default password.');
    } else {
      const response = await api.post('/auth/login', { email, password });
      const payload = response.data;
      if (payload.success && payload.data) {
        const { user, token, doctorProfile } = payload.data;
        const loggedInUser = {
          ...user,
          id: user._id,
          name: user.fullName,
          token,
          ...doctorProfile,
          availability: doctorProfile ? {
            days: doctorProfile.availableDays || [],
            slots: doctorProfile.availableTime ? generateSlots(doctorProfile.availableTime) : ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"]
          } : undefined
        };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return loggedInUser;
      }
      throw new Error(payload.message || 'Login failed');
    }
  },

  register: async (userData) => {
    if (USE_MOCK) {
      await delay(600);
      const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
      if (registeredUsers.some(u => u.email === userData.email) || userData.email === 'patient@bookadoctor.com') {
        throw new Error('Email address is already in use.');
      }
      
      const newPatient = {
        id: `pat_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'patient',
        dob: userData.dob || '1995-01-01',
        gender: userData.gender || 'Male',
        bloodGroup: userData.bloodGroup || 'O+',
        address: userData.address || '123 New St, Health City',
        allergies: 'None',
        chronicConditions: 'None',
        photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
        password: userData.password // stored temporarily for mock login
      };

      registeredUsers.push(newPatient);
      localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
      
      return { success: true, message: 'Registration successful! You can now log in.' };
    } else {
      let parsedAddress = {
        street: 'Clinic Street 1',
        city: 'TechCity',
        state: 'SiliconState',
        zipCode: '10101'
      };
      if (userData.address) {
        const parts = userData.address.split(',');
        if (parts.length >= 3) {
          const stateZip = parts[2].trim().split(' ');
          parsedAddress = {
            street: parts[0].trim(),
            city: parts[1].trim(),
            state: stateZip[0] || 'SiliconState',
            zipCode: stateZip[1] || '10101'
          };
        } else {
          parsedAddress.street = userData.address.trim();
        }
      }

      // Normalize phone number (strip formatting characters)
      let normalizedPhone = userData.phone || '';
      if (normalizedPhone) {
        const hasPlus = normalizedPhone.startsWith('+');
        const digits = normalizedPhone.replace(/\D/g, '');
        normalizedPhone = (hasPlus ? '+' : '') + digits;
      }

      const payload = {
        ...userData,
        fullName: userData.name,
        gender: userData.gender?.toLowerCase() || 'other',
        phone: normalizedPhone,
        address: parsedAddress,
        role: 'patient'
      };
      const response = await api.post('/auth/register', payload);
      return response.data;
    }
  },

  registerDoctor: async (doctorData) => {
    if (USE_MOCK) {
      await delay(800);
      
      // Store in a local list of pending doctors so the admin can review
      const pendingDoctors = JSON.parse(localStorage.getItem('pending_doctors') || '[]');
      const newDoctor = {
        id: `doc_${Date.now()}`,
        name: `Dr. ${doctorData.name}`,
        specialization: doctorData.specialization,
        specializationKey: doctorData.specialization.toLowerCase().replace(' ', ''),
        qualification: doctorData.qualification,
        experience: parseInt(doctorData.experience) || 1,
        hospital: doctorData.hospital,
        rating: 5.0,
        reviewsCount: 0,
        fee: parseInt(doctorData.fee) || 100,
        photo: doctorData.photo || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        about: doctorData.about || "Experienced specialist focusing on patient care.",
        availability: {
          days: doctorData.availableDays || ["Monday", "Wednesday"],
          slots: ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"]
        },
        approved: false // requires admin approval
      };

      pendingDoctors.push(newDoctor);
      localStorage.setItem('pending_doctors', JSON.stringify(pendingDoctors));
      return { success: true, message: 'Application submitted! Awaiting administrator approval.' };
    } else {
      // Normalize phone number
      let normalizedPhone = doctorData.phone || '';
      if (normalizedPhone) {
        const hasPlus = normalizedPhone.startsWith('+');
        const digits = normalizedPhone.replace(/\D/g, '');
        normalizedPhone = (hasPlus ? '+' : '') + digits;
      } else {
        normalizedPhone = '+1000000000';
      }

      const payload = {
        fullName: doctorData.name,
        email: doctorData.email,
        password: doctorData.password,
        phone: normalizedPhone,
        gender: doctorData.gender ? doctorData.gender.toLowerCase() : 'other',
        dob: doctorData.dob || new Date('1990-01-01'),
        address: {
          street: 'Clinic Street 1',
          city: 'TechCity',
          state: 'SiliconState',
          zipCode: '10101'
        },
        role: 'doctor',
        qualification: doctorData.qualification,
        specialization: doctorData.specialization,
        experience: doctorData.experience,
        hospital: doctorData.hospital,
        consultationFee: doctorData.fee
      };
      const response = await api.post('/auth/register', payload);
      return response.data;
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  updateProfile: async (profileData) => {
    if (USE_MOCK) {
      await delay(500);
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      const updatedUser = { ...currentUser, ...profileData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Also update in registered list if patient
      if (currentUser.role === 'patient') {
        const registeredUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const idx = registeredUsers.findIndex(u => u.id === currentUser.id);
        if (idx !== -1) {
          registeredUsers[idx] = { ...registeredUsers[idx], ...profileData };
          localStorage.setItem('registered_users', JSON.stringify(registeredUsers));
        }
      }
      return updatedUser;
    } else {
      const response = await api.put('/users/profile', profileData);
      const payload = response.data;
      if (payload.success && payload.data) {
        const { user: updatedUser, doctorProfile } = payload.data;
        const token = localStorage.getItem('token');
        const loggedInUser = {
          ...updatedUser,
          id: updatedUser._id,
          name: updatedUser.fullName,
          token,
          ...doctorProfile,
          availability: doctorProfile ? {
            days: doctorProfile.availableDays || [],
            slots: doctorProfile.availableTime ? generateSlots(doctorProfile.availableTime) : ["09:00 AM", "10:00 AM", "02:00 PM", "03:00 PM"]
          } : undefined
        };
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return loggedInUser;
      }
      throw new Error(payload.message || 'Profile update failed');
    }
  }
};

function generateSlots(availableTime) {
  const slots = [];
  const startHour = parseInt(availableTime.start?.split(':')[0]) || 9;
  const endHour = parseInt(availableTime.end?.split(':')[0]) || 17;
  for (let h = startHour; h < endHour; h++) {
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const formattedHour = String(displayHour).padStart(2, '0');
    slots.push(`${formattedHour}:00 ${period}`);
  }
  return slots;
}
