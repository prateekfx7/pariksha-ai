'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Sun, Moon, Bell, HelpCircle, Menu, RefreshCw, Users, LogOut, Zap, Flame, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { courses, skills } from '@/data/mockData';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const searchableItems = [
  { label: 'Dashboard', href: '/dashboard', type: 'Page' },
  { label: 'Recommendations', href: '/recommendations', type: 'Page' },
  { label: 'Quiz Generator', href: '/quiz-generator', type: 'Page' },
  { label: 'Take Quiz', href: '/quiz', type: 'Page' },
  { label: 'Admin Analytics', href: '/admin', type: 'Page' },
  { label: 'Discussion Hub', href: '/collaboration', type: 'Page' },
  { label: 'Settings', href: '/settings', type: 'Page' },
  { label: 'Notifications', href: '/notifications', type: 'Page' },
  { label: 'Achievements', href: '/achievements', type: 'Page' },
  ...courses.map(c => ({ label: c.title, href: '/recommendations', type: 'Course' })),
  ...skills.map(s => ({ label: s, href: '/dashboard', type: 'Skill' })),
];

export default function Header() {
  const {
    currentUser, unreadCount, searchQuery, setSearchQuery,
    toggleMobileSidebar, theme, toggleTheme, logout,
    officers, currentUserIndex, switchOfficer,
    setShowGuideModal, resetToZero
  } = useApp();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const userMenuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      const filtered = searchableItems.filter(item =>
        item.label.toLowerCase().includes(q)
      ).slice(0, 8);
      setResults(filtered);
      setShowSearch(true);
    } else {
      setResults([]);
      setShowSearch(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };

    const handleKeyDown = (e) => {
      // Focus search on '/' (when not typing in an input) or 'Cmd+K' / 'Ctrl+K'
      const tag = document.activeElement?.tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if ((e.key === '/' && !isEditing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        setShowSearch(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleResultClick = (href) => {
    setSearchQuery('');
    setShowSearch(false);
    router.push(href);
  };

  return (
    <header className="header">
      <div className="header-inner">
      {/* 📱 MOBILE ONLY: Brand Logo — Logo and title on mobile devices */}
      <Link href="/dashboard" className="header-logo header-mobile-only hide-desktop" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }} aria-label="Pariksha AI Home">
        <div style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          flexShrink: 0
        }}>
          <img src="/logo.png" alt="Pariksha AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{
          fontFamily: "'Helvetica', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          lineHeight: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          <span>Pariksha</span>
          <span style={{ color: 'var(--primary)' }}>AI</span>
        </div>
      </Link>

      {/* 💻 DESKTOP & LAPTOPS: Command Search Bar */}
      <div
        className="header-search"
        ref={searchRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          alignItems: 'center',
        }}
      >
        <Search size={15} className="header-search-icon" style={{ flexShrink: 0 }} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search courses, skills, quizzes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => { if (searchQuery && searchQuery.trim().length > 0) setShowSearch(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowSearch(false);
              inputRef.current?.blur();
            }
          }}
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            boxShadow: 'none',
            padding: '0 8px',
            margin: 0,
            borderRadius: 0,
            WebkitAppearance: 'none',
            appearance: 'none',
            flex: 1,
            minWidth: 0,
            height: '100%',
            lineHeight: 'normal',
            fontSize: 13.5,
            color: 'inherit',
          }}
          aria-label="Search courses, skills, quizzes"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setShowSearch(false); inputRef.current?.focus(); }}
            className="search-clear-btn"
            aria-label="Clear search input"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 'auto',
            }}
          >
            <X size={14} />
          </button>
        ) : (
          <div
            className="search-kbd-tag"
            onClick={() => inputRef.current?.focus()}
            title="Press ⌘K or / to search"
            role="button"
            tabIndex={-1}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginLeft: 'auto',
            }}
          >
            <kbd>⌘K</kbd>
          </div>
        )}

        {/* Search Dropdown Results */}
        {showSearch && results.length > 0 && (
          <div className="search-results-dropdown">
            {results.map((item, i) => (
              <div
                key={i}
                onClick={() => handleResultClick(item.href)}
                className="search-result-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                </div>
                <span className="tag tag-priority" style={{ fontSize: 10, flexShrink: 0, padding: '2px 7px' }}>{item.type}</span>
              </div>
            ))}
          </div>
        )}
        {showSearch && results.length === 0 && searchQuery && searchQuery.trim().length > 0 && (
          <div className="search-no-results">
            No results found for &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>

      {/* Header Right */}
      <div className="header-right">
        {/* 💻 DESKTOP ONLY: Utility Actions (Guide, Theme, Notifications) */}
        <div className="header-actions-group header-desktop-only hide-mobile">
          <button
            onClick={() => setShowGuideModal(true)}
            className="header-guide-btn"
            title="Open Pariksha AI Software Guide"
            aria-label="Software Guide"
          >
            <HelpCircle size={15} />
            <span>Guide</span>
          </button>

          <button
            onClick={toggleTheme}
            className="header-icon-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} className="icon-sun" /> : <Moon size={16} className="icon-moon" />}
          </button>

          <Link
            href="/notifications"
            className="header-icon-btn"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="header-badge-dot">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* 💻 DESKTOP ONLY: Vertical Divider */}
        <div className="header-divider header-desktop-only hide-mobile" />

        {/* 📱💻 Profile Avatar Button */}
        <div ref={userMenuRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className={`header-user-btn ${showUserMenu ? 'active' : ''}`}
            aria-label="Officer Profile Menu"
          >
            <div className="header-avatar-wrap">
              <div className="header-avatar">
                {currentUser.avatar || 'P'}
              </div>
              <span className="header-status-dot" />
            </div>
            <span className="header-user-name header-desktop-only hide-mobile">{currentUser.name}</span>
            <ChevronDown size={13} className={`header-user-chevron ${showUserMenu ? 'open' : ''}`} />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              width: 290,
              maxWidth: 'calc(100vw - 20px)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              padding: 12,
              zIndex: 300,
            }}>
              {/* User Profile Info */}
              <div style={{ paddingBottom: 10, borderBottom: '1px solid var(--border-light)', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{currentUser.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{currentUser.role}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{currentUser.department}</p>
                  </div>
                  <span className="tag tag-priority" style={{ fontSize: 10, fontWeight: 700, flexShrink: 0 }}>MoSPI Verified</span>
                </div>
                {/* XP & Streak stats */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  padding: '8px 12px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontSize: 12
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--primary)', fontWeight: 600 }}>
                    <Zap size={14} /> {currentUser.xp.toLocaleString()} XP
                  </span>
                  <span style={{ height: 12, width: 1, background: 'var(--border)' }} />
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--warning)', fontWeight: 600 }}>
                    <Flame size={14} /> {currentUser.streak}d streak
                  </span>
                </div>
              </div>

              {/* Persona Switcher */}
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Switch Officer Persona
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 150, overflowY: 'auto' }}>
                  {officers.slice(0, 5).map((off, idx) => (
                    <button
                      key={off.id}
                      onClick={() => { switchOfficer(idx); setShowUserMenu(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: currentUserIndex === idx ? 'var(--primary-subtle)' : 'transparent',
                        color: currentUserIndex === idx ? 'var(--primary)' : 'var(--text-primary)',
                        textAlign: 'left',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 700 }}>{off.avatar}</span>
                        <span>{off.name}</span>
                      </div>
                      {currentUserIndex === idx && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions List */}
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Theme Toggle in Menu */}
                <button
                  onClick={toggleTheme}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {theme === 'dark' ? <Sun size={14} style={{ color: 'var(--warning)' }} /> : <Moon size={14} style={{ color: 'var(--primary)' }} />}
                    <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{theme}</span>
                </button>

                {/* Notifications in Menu */}
                <Link
                  href="/notifications"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bell size={14} />
                    <span>Notifications</span>
                  </div>
                  {unreadCount > 0 && (
                    <span style={{
                      background: 'var(--primary)',
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 'var(--radius-full)',
                      padding: '2px 6px'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Guide Modal Trigger */}
                <button
                  onClick={() => { setShowGuideModal(true); setShowUserMenu(false); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <HelpCircle size={14} /> How to Use Software
                </button>

                {/* Open Navigation Drawer (Mobile helper) */}
                <button
                  onClick={() => { toggleMobileSidebar(); setShowUserMenu(false); }}
                  className="hide-desktop"
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Menu size={14} /> All Pages & Menu Drawer
                </button>

                {/* Reset to Day 0 */}
                <button
                  onClick={() => { resetToZero(); setShowUserMenu(false); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--warning)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <RefreshCw size={14} /> Reset to Day 0 (Start Fresh)
                </button>

                {/* Full Settings */}
                <Link
                  href="/settings"
                  onClick={() => setShowUserMenu(false)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Users size={14} /> Full Officer Settings
                </Link>

                {/* Sign Out */}
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 13,
                    color: 'var(--error)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
}
