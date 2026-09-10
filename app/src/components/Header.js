'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Sun, Moon, Bell, RefreshCw, Users, LogOut, Zap, Flame, X, Globe, Sparkles } from 'lucide-react';
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
    theme, toggleTheme, logout,
    officers, currentUserIndex, switchOfficer,
    resetToZero,
    language, setLanguage, availableLanguages, t
  } = useApp();

  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const [results, setResults] = useState([]);

  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const userMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const router = useRouter();

  const currentLangObj = (availableLanguages || []).find(l => l.code === language) || { code: 'en', name: 'English', nativeName: 'English' };

  const filteredLanguages = (availableLanguages || []).filter(l => {
    if (!langSearch.trim()) return true;
    const q = langSearch.toLowerCase();
    return l.name.toLowerCase().includes(q) || l.nativeName.toLowerCase().includes(q) || l.code.toLowerCase().includes(q);
  });

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
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
    };

    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
      if ((e.key === '/' && !isEditing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowLangMenu(false);
        setShowUserMenu(false);
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
        {/* 📱 MOBILE ONLY: Brand Logo */}
        <Link href="/dashboard" className="header-logo header-mobile-only hide-desktop" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }} aria-label="Pariksha AI Home">
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
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
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <span>Pariksha</span>
            <span style={{ color: 'var(--primary)' }}>AI</span>
          </div>
        </Link>

        {/* 💻 DESKTOP & TABLETS: Command Search Bar */}
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
            placeholder={t('search_placeholder', 'Search courses, skills, quizzes...')}
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
              fontSize: 13,
              color: 'inherit',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                padding: '0 4px',
                color: 'var(--text-tertiary)',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <X size={14} />
            </button>
          )}
          <kbd className="header-search-kbd hide-mobile" style={{ flexShrink: 0 }}>/</kbd>

          {/* Search Results Dropdown */}
          {showSearch && results.length > 0 && (
            <div className="search-dropdown">
              <div className="search-dropdown-header">
                <span>Quick Results</span>
                <span className="search-count">{results.length} found</span>
              </div>
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="search-result-item"
                  onClick={() => handleResultClick(item.href)}
                >
                  <div className="search-result-icon">
                    <Search size={13} />
                  </div>
                  <div className="search-result-info">
                    <span className="search-result-label">{item.label}</span>
                    <span className="search-result-type">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showSearch && searchQuery && results.length === 0 && (
            <div className="search-no-results">
              No results found for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>

        {/* Header Right Controls */}
        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 🌐 Indian Languages Selector (Visible on ALL devices) */}
          <div ref={langMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLangMenu(prev => !prev)}
              className="header-icon-btn"
              title={t('language_select', 'Language')}
              aria-label="Select Language"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px',
                fontSize: 11.5,
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                cursor: 'pointer',
                height: 32,
                color: 'var(--text-primary)'
              }}
            >
              <Globe size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontWeight: 700, maxWidth: 64, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentLangObj.nativeName ? currentLangObj.nativeName.split('/')[0].trim() : 'EN'}
              </span>
              <ChevronDown size={11} style={{ opacity: 0.7 }} />
            </button>

            {showLangMenu && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: 270,
                maxWidth: 'calc(100vw - 20px)',
                maxHeight: 380,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                padding: 10,
                zIndex: 350,
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '4px 6px 8px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                    🌐 Indian Languages (22 + En)
                  </span>
                  <span style={{ fontSize: 9.5, color: 'var(--text-tertiary)' }}>8th Schedule</span>
                </div>
                <input
                  type="text"
                  placeholder="Search language..."
                  value={langSearch}
                  onChange={(e) => setLangSearch(e.target.value)}
                  style={{
                    margin: '8px 0',
                    padding: '6px 8px',
                    fontSize: 12,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-surface)',
                    width: '100%'
                  }}
                />
                <div style={{ overflowY: 'auto', maxHeight: 250, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {filteredLanguages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLanguage(l.code); setShowLangMenu(false); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: language === l.code ? 'var(--primary-subtle)' : 'transparent',
                        color: language === l.code ? 'var(--primary)' : 'var(--text-primary)',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 12,
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <span style={{ fontWeight: 700 }}>{l.nativeName}</span>
                        <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginLeft: 6 }}>({l.name})</span>
                      </div>
                      {language === l.code && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 💻 DESKTOP ONLY: Utility Actions (Theme, Notifications) */}
          <div className="header-actions-group header-desktop-only hide-mobile">
            <button
              onClick={toggleTheme}
              className="header-icon-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={15} className="icon-sun" /> : <Moon size={15} className="icon-moon" />}
            </button>

            <Link
              href="/notifications"
              className="header-icon-btn"
              title={t('nav_notifications', 'Notifications')}
              aria-label="Notifications"
            >
              <Bell size={15} />
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
              <ChevronDown size={12} className={`header-user-chevron ${showUserMenu ? 'open' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '115%',
                right: 0,
                width: 280,
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
                      <p style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--text-primary)', margin: 0 }}>{currentUser.name}</p>
                      <p style={{ fontSize: 11.5, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{currentUser.role}</p>
                    </div>
                    <span className="tag tag-priority" style={{ fontSize: 9.5, fontWeight: 700, flexShrink: 0 }}>MoSPI</span>
                  </div>
                  {/* XP & Streak stats */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    padding: '6px 10px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: 11.5
                  }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 700 }}>
                      <Zap size={13} /> {currentUser.xp.toLocaleString()} XP
                    </span>
                    <span style={{ height: 10, width: 1, background: 'var(--border)' }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--warning)', fontWeight: 700 }}>
                      <Flame size={13} /> {currentUser.streak}d streak
                    </span>
                  </div>
                </div>

                {/* Persona Switcher */}
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>
                    Switch Officer Persona
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 120, overflowY: 'auto' }}>
                    {officers.slice(0, 5).map((off, idx) => (
                      <button
                        key={off.id}
                        onClick={() => { switchOfficer(idx); setShowUserMenu(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: currentUserIndex === idx ? 'var(--primary-subtle)' : 'transparent',
                          color: currentUserIndex === idx ? 'var(--primary)' : 'var(--text-primary)',
                          border: 'none',
                          textAlign: 'left',
                          fontSize: 11.5,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 700 }}>{off.avatar}</span>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{off.name}</span>
                        </div>
                        {currentUserIndex === idx && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions List */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    onClick={toggleTheme}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12.5,
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
                      {theme === 'dark' ? <Sun size={13} style={{ color: 'var(--warning)' }} /> : <Moon size={13} style={{ color: 'var(--primary)' }} />}
                      <span>{t('theme_switch', 'Switch Theme')}</span>
                    </div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{theme}</span>
                  </button>

                  <Link
                    href="/achievements"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12.5,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textDecoration: 'none'
                    }}
                  >
                    <Zap size={13} style={{ color: 'var(--warning)' }} /> {t('nav_achievements', 'Achievements')}
                  </Link>

                  <Link
                    href="/portfolio"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12.5,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textDecoration: 'none'
                    }}
                  >
                    <Users size={13} /> {t('nav_evidence', 'Skill Evidence')}
                  </Link>

                  <button
                    onClick={() => { resetToZero(); setShowUserMenu(false); }}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12.5,
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
                    <RefreshCw size={13} /> {t('reset_day0', 'Reset to Day 0')}
                  </button>

                  <Link
                    href="/settings"
                    onClick={() => setShowUserMenu(false)}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12.5,
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      textDecoration: 'none'
                    }}
                  >
                    <Users size={13} /> {t('nav_settings', 'Settings')}
                  </Link>

                  <button
                    onClick={() => { logout(); setShowUserMenu(false); }}
                    style={{
                      padding: '7px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 12.5,
                      color: 'var(--error)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <LogOut size={13} /> Sign Out
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
