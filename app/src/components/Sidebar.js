'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, BrainCircuit, PenTool,
  BarChart3, Settings, Bell, Trophy, Zap, MessageSquare, X, HelpCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/recommendations', label: 'Recommendations', icon: BookOpen },
  { href: '/quiz-generator', label: 'Quiz Generator', icon: BrainCircuit },
  { href: '/quiz', label: 'Take Quiz', icon: PenTool },
  { href: '/admin', label: 'Admin Analytics', icon: BarChart3 },
  { href: '/collaboration', label: 'Discussion Hub', icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { unreadCount, mobileSidebarOpen, toggleMobileSidebar, setShowGuideModal } = useApp();

  const secondaryNav = [
    { href: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null },
    { href: '/achievements', label: 'Achievements', icon: Trophy, badge: null },
    { href: '/settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const handleNavClick = () => {
    if (mobileSidebarOpen) toggleMobileSidebar();
  };

  return (
    <aside className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }} onClick={handleNavClick}>
          <div className="sidebar-logo" style={{ borderBottom: 'none', padding: '4px 0 16px', margin: 0 }}>
            <div className="sidebar-logo-text">
              Pariksha <span>AI</span>
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
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
              <Icon />
              {item.label}
            </Link>
          );
        })}

        <hr className="divider" style={{ margin: '12px 0' }} />

        {secondaryNav.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }} onClick={handleNavClick}>
              <Icon />
              {item.label}
              {item.badge && (
                <span style={{
                  marginLeft: 'auto',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  minWidth: 20,
                  textAlign: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <button
          onClick={() => { setShowGuideModal(true); if (mobileSidebarOpen) toggleMobileSidebar(); }}
          className="nav-item"
          style={{
            width: '100%',
            textAlign: 'left',
            background: 'var(--primary-subtle)',
            color: 'var(--primary)',
            border: '1px solid var(--border-light)',
            cursor: 'pointer',
            marginTop: 10,
            fontWeight: 600
          }}
        >
          <HelpCircle />
          Software Guide
        </button>
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-footer">
        <div className="sidebar-upgrade">
          <Zap size={24} style={{ marginBottom: 4 }} />
          <p>iGOT Karmayogi Synced</p>
          <span>MoSPI Official Framework</span>
        </div>
      </div>
    </aside>
  );
}
