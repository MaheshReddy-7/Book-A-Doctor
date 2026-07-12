import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in already on mount
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUser(data);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const registerPatient = async (data) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerDoctor = async (data) => {
    setLoading(true);
    try {
      const res = await authService.registerDoctor(data);
      return res;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const updated = await authService.updateProfile(data);
      setUser(updated);
      return updated;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Dev utility to switch roles instantly for manual testing
  const devSwitchRole = (role) => {
    let mockUser = null;
    if (role === 'patient') {
      mockUser = {
        id: "pat_1",
        name: "John Doe (Patient)",
        email: "patient@bookadoctor.com",
        phone: "+1 (555) 019-2834",
        role: "patient",
        dob: "1990-05-15",
        gender: "Male",
        bloodGroup: "O+",
        address: "123 Elm Street, Metro City, NY 10001",
        allergies: "Penicillin, Peanuts",
        chronicConditions: "Mild Hypertension",
        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150"
      };
    } else if (role === 'doctor') {
      mockUser = {
        id: "doc_1",
        name: "Dr. Alexander Bennett",
        specialization: "Cardiology",
        specializationKey: "cardiology",
        qualification: "MD, DM (Cardiology), FACC",
        experience: 14,
        hospital: "Metro Cardiac & Vascular Center",
        rating: 4.9,
        reviewsCount: 124,
        fee: 150,
        email: "doctor@bookadoctor.com",
        photo: "/doctor1.jpg",
        role: "doctor",
        availability: {
          days: ["Monday", "Wednesday", "Friday"],
          slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]
        }
      };
    } else if (role === 'admin') {
      mockUser = {
        id: "admin_1",
        name: "Platform Admin",
        email: "admin@bookadoctor.com",
        role: "admin",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
      };
    }
    
    if (mockUser) {
      localStorage.setItem('token', `mock-jwt-token-${role}`);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
    } else {
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerPatient, registerDoctor, updateProfile, devSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
