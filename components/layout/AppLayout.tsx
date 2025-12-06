// src/components/layout/AppLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, userName }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Ouvert par défaut
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 769;
      setIsMobile(mobile);
      
      // On mobile, start with sidebar closed
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        // On desktop, start with sidebar open
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.appLayout}>
      <Header 
        userName={userName} 
        isSidebarOpen={isSidebarOpen}
        onMenuToggle={handleMenuToggle}
      />
      
      <Sidebar isOpen={isSidebarOpen} />
      
      <main className={`${styles.mainContent} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;