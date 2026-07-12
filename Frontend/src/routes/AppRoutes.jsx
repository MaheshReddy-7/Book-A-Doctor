import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Public Pages
import { LandingPage } from '../pages/LandingPage';
import { Doctors } from '../pages/Doctors';
import { DoctorDetails } from '../pages/DoctorDetails';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';
import { FAQ } from '../pages/FAQ';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { DoctorRegistration } from '../pages/DoctorRegistration';
import { PageNotFound } from '../pages/404';

// Patient Pages
import { PatientDashboard } from '../pages/patient/Dashboard';
import { BookAppointment } from '../pages/patient/BookAppointment';
import { AppointmentHistory } from '../pages/patient/AppointmentHistory';
import { PatientNotifications } from '../pages/patient/Notifications';
import { PatientProfile } from '../pages/patient/Profile';
import { PatientReports } from '../pages/patient/Reports';
import { PatientSettings } from '../pages/patient/Settings';

// Doctor Pages
import { DoctorDashboard } from '../pages/doctor/Dashboard';
import { TodayAppointments } from '../pages/doctor/TodayAppointments';
import { UpcomingAppointments } from '../pages/doctor/UpcomingAppointments';
import { MyPatients } from '../pages/doctor/MyPatients';
import { Availability } from '../pages/doctor/Availability';
import { UploadPrescription } from '../pages/doctor/UploadPrescription';
import { DoctorNotifications } from '../pages/doctor/Notifications';
import { DoctorProfile } from '../pages/doctor/Profile';

// Admin Pages
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminDoctors } from '../pages/admin/Doctors';
import { PendingApprovals } from '../pages/admin/PendingApprovals';
import { AdminUsers } from '../pages/admin/Users';
import { AdminReports } from '../pages/admin/Reports';
import { AdminAppointments } from '../pages/admin/Appointments';
import { AdminAnalytics } from '../pages/admin/Analytics';
import { AdminNotifications } from '../pages/admin/Notifications';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="doctors/:id" element={<DoctorDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="register-doctor" element={<DoctorRegistration />} />
        <Route path="404" element={<PageNotFound />} />
      </Route>

      {/* Patient Protected Dashboard Layout */}
      <Route path="/patient" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/patient/dashboard" replace />} />
        <Route path="dashboard" element={<PatientDashboard />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="appointments" element={<AppointmentHistory />} />
        <Route path="notifications" element={<PatientNotifications />} />
        <Route path="profile" element={<PatientProfile />} />
        <Route path="reports" element={<PatientReports />} />
        <Route path="settings" element={<PatientSettings />} />
      </Route>

      {/* Doctor Protected Dashboard Layout */}
      <Route path="/doctor" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="today-appointments" element={<TodayAppointments />} />
        <Route path="upcoming-appointments" element={<UpcomingAppointments />} />
        <Route path="patients" element={<MyPatients />} />
        <Route path="availability" element={<Availability />} />
        <Route path="upload-prescription" element={<UploadPrescription />} />
        <Route path="notifications" element={<DoctorNotifications />} />
        <Route path="profile" element={<DoctorProfile />} />
      </Route>

      {/* Admin Protected Dashboard Layout */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="approvals" element={<PendingApprovals />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>

      {/* Fallback Catch-All Route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
