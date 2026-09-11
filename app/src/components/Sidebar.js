'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, BrainCircuit,
  BarChart3, MessageSquare, X, Zap, Settings as SettingsIcon
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileSidebarOpen, toggleMobileSidebar, t } = useApp();

  const mainNavItems = [
    { href: '/dashboard', label: t('nav_dashboard', 'Dashboard'), icon: LayoutDashboard },
    { href: '/recommendations', label: t('nav_learn', 'Learn'), icon: BookOpen },
    { href: '/quiz', label: t('nav_quizzes', 'Quizzes'), icon: BrainCircuit },
    { href: '/admin', label: t('nav_analytics', 'Analytics'), icon: BarChart3 },
    { href: '/collaboration', label: t('nav_community', 'Community'), icon: MessageSquare },
  ];

  const handleNavClick = () => {
    if (mobileSidebarOpen) toggleMobileSidebar();
  };

  // Determine if a nav item is active, including sub-routes
  const isNavActive = (href) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    if (href === '/recommendations') {
      return pathname === '/recommendations' ||
        pathname === '/micro-learning' ||
        pathname === '/practical-tasks' ||
        pathname === '/readiness';
    }
    if (href === '/quiz') {
      return pathname === '/quiz' ||
        pathname.startsWith('/quiz/') ||
        pathname === '/quiz-generator';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }} onClick={handleNavClick}>
          <div className="sidebar-logo" style={{ borderBottom: 'none', padding: '0 0 20px', margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
              flexShrink: 0
            }}>
              <img src="/logo.png" alt="Pariksha AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{
              fontFamily: "'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}>
              <span>Pariksha</span>
              <span style={{ color: 'var(--primary)' }}>AI</span>
            </div>
          </div>
        </Link>
        {mobileSidebarOpen && (
          <button
            type="button"
            onClick={toggleMobileSidebar}
            style={{
              color: 'var(--text-tertiary)',
              padding: 8,
              cursor: 'pointer',
              marginBottom: 16,
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)'
            }}
            aria-label="Close navigation menu"
          >
            <X size={22} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {mainNavItems.map(item => {
          const Icon = item.icon;
          const isActive = isNavActive(item.href);
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-footer">
        <Link
          href="/settings"
          className={`nav-item ${pathname === '/settings' ? 'active' : ''}`}
          onClick={handleNavClick}
          style={{ padding: '9px 12px', fontSize: 13.5 }}
        >
          <SettingsIcon size={17} />
          {t('nav_settings', 'Settings')}
        </Link>

        <Link
          href="/portfolio"
          className="sidebar-sync-card"
          onClick={handleNavClick}
          title="MoSPI Official Competency Framework & iGOT Karmayogi Synced"
        >
          <div className="sidebar-sync-icon">
            <Zap size={16} />
          </div>
          <div className="sidebar-sync-info">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
              <span className="sidebar-sync-title">iGOT Karmayogi</span>
              <span className="sidebar-sync-badge">
                <span className="sidebar-sync-dot" /> Synced
              </span>
            </div>
            <span className="sidebar-sync-sub">MoSPI Official Framework</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
