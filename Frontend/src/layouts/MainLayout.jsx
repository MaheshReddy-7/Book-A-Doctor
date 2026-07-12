import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DevRoleSwitcher } from '../components/common/DevRoleSwitcher';

export const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-height-vh-100" style={{ minHeight: '100vh' }}>
      <Navbar />
      <main className="flex-grow-1 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
      <DevRoleSwitcher />
    </div>
  );
};
