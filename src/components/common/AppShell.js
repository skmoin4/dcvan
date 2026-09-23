'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import WelcomeVideoModal from './WelcomeVideoModal';

const AppShell = ({ children }) => {
  const pathname = usePathname();
  const showFooter = pathname === '/';

  return (
    <AuthProvider>
      <WelcomeVideoModal />
      <div className="flex min-h-screen flex-col bg-white text-slate-900">
        <Navbar />
        <main className="flex-grow">{children}</main>
        {showFooter && <Footer />}
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: '12px', fontWeight: 600, fontSize: '14px' },
          success: { iconTheme: { primary: '#fa6a00', secondary: '#fff' } },
        }}
      />
    </AuthProvider>
  );
};

export default AppShell;
