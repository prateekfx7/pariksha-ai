'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, BrainCircuit, BarChart3, User } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const navTabs = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/recommendations', label: 'Learn', icon: BookOpen },
    { href: '/quiz', label: 'Quizzes', icon: BrainCircuit },
    { href: '/admin', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Profile', icon: User },
  ];

  const isTabActive = (href) => {
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
    if (href === '/settings') {
      return pathname === '/settings' ||
        pathname === '/achievements' ||
        pathname === '/portfolio' ||
        pathname === '/notifications';
    }
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {navTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = isTabActive(tab.href);
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
    </nav>
  );
}
