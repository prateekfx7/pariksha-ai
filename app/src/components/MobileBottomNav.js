'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, PenTool, BrainCircuit, Menu } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { toggleMobileSidebar, unreadCount } = useApp();

  const navTabs = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/recommendations', label: 'Courses', icon: BookOpen },
    { href: '/quiz', label: 'Quizzes', icon: PenTool },
    { href: '/quiz-generator', label: 'AI Gen', icon: BrainCircuit },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {navTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href + '/'));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon-wrap">
              <Icon size={20} />
              {isActive && <span className="mobile-nav-indicator" />}
            </div>
            <span className="mobile-nav-label">{tab.label}</span>
          </Link>
        );
      })}

      {/* Menu Drawer Toggle Button */}
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="mobile-nav-item"
        aria-label="Open full menu"
      >
        <div className="mobile-nav-icon-wrap">
          <Menu size={20} />
          {unreadCount > 0 && (
            <span className="mobile-nav-badge" />
          )}
        </div>
        <span className="mobile-nav-label">Menu</span>
      </button>
    </nav>
  );
}
