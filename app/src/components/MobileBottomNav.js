'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, BrainCircuit, BarChart3, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useApp();

  const navTabs = [
    { href: '/dashboard', label: t('nav_dashboard', 'Dashboard'), icon: LayoutDashboard },
    { href: '/recommendations', label: t('nav_learn', 'Learn'), icon: BookOpen },
    { href: '/quiz', label: t('nav_quizzes', 'Quizzes'), icon: BrainCircuit },
    { href: '/admin', label: t('nav_analytics', 'Analytics'), icon: BarChart3 },
    { href: '/settings', label: t('nav_profile', 'Profile'), icon: User },
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
              <Icon size={19} />
              {isActive && <span className="mobile-nav-indicator" />}
            </div>
            <span className="mobile-nav-label" style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              fontSize: '10px'
            }}>
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
