'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoginPage from '@/components/LoginPage';

import SoftwareGuideModal from '@/components/SoftwareGuideModal';
import MobileBottomNav from '@/components/MobileBottomNav';

export default function AppShell({ children }) {
  const { isLoggedIn, login, mobileSidebarOpen, toggleMobileSidebar, showGuideModal, setShowGuideModal } = useApp();
  const pathname = usePathname();

  // Desktop productivity shortcuts: '/' for Search, 'Esc' to close drawers/modals
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if (
        (e.key === '/' || ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey))) &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)
      ) {
        e.preventDefault();
        const searchInput = document.querySelector('.header-search input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      if (e.key === 'Escape') {
        if (showGuideModal) setShowGuideModal(false);
        if (mobileSidebarOpen) toggleMobileSidebar();
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [showGuideModal, mobileSidebarOpen, toggleMobileSidebar, setShowGuideModal]);

  const isPublicRoute = pathname === '/landing' || pathname === '/';

  if (!isLoggedIn && !isPublicRoute) {
    return <LoginPage onLogin={login} />;
  }

  if (isPublicRoute) {
    return (
      <div className="public-layout">
        {children}
      </div>
    );
  }

  return (
    <div className="app-layout">
      {mobileSidebarOpen && (
        <div className="mobile-overlay" onClick={toggleMobileSidebar} />
      )}
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="page-content">
          {children}
        </main>
      </div>
      <MobileBottomNav />
      <SoftwareGuideModal />
    </div>
  );
}
