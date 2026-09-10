'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  User, Palette, Bell, Shield, Save, CheckCircle2, RefreshCw, Sun, Moon,
  Check, Key, Zap, Database, Trophy, Star, Target, BookOpen, Award, Brain,
  Flame, ShieldCheck, Plus, QrCode, Printer, Hash, X, Sparkles, Filter, ExternalLink
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { skills } from '@/data/mockData';

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const {
    currentUser, currentUserIndex, switchOfficer, officers,
    apiKey, setApiKey,
    language, setLanguage,
    defaultDifficulty, setDefaultDifficulty,
    notifPrefs, toggleNotifPref,
    theme, toggleTheme, setThemeMode,
    resetToZero, setShowGuideModal,
    quizHistory, enrolledCourses, gapData,
    portfolioItems, addPortfolioItem, verifyPortfolioItem,
    availableLanguages, t, tSkill
  } = useApp();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileSaved, setProfileSaved] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  // Evidence state
  const [selectedCompetency, setSelectedCompetency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showLogModal, setShowLogModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompetency, setNewCompetency] = useState('Survey Design');
  const [newType, setNewType] = useState('Field Report');
  const [newSummary, setNewSummary] = useState('');

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['profile', 'achievements', 'evidence', 'settings'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (currentUser?.name) {
      setProfileName(currentUser.name);
    }
  }, [currentUser]);

  // Achievements dynamic logic
  const quizCount = quizHistory.length;
  const hasAced = quizHistory.some(q => q.scorePercent === 100);
  const gapReduced = gapData?.gapList?.some(g => g.percentage >= 80) || false;
  const modulesComplete = quizCount;

  const achievementsList = [
    { icon: Star, title: "First Quiz Completed", desc: "Completed your first diagnostic assessment", unlocked: quizCount >= 1, xp: 100 },
    { icon: Flame, title: "7-Day Streak", desc: "Maintained a 7-day learning streak", unlocked: currentUser.streak >= 7, xp: 250 },
    { icon: Target, title: "Gap Closer", desc: "Reached 80%+ proficiency in any skill area", unlocked: gapReduced, xp: 500 },
    { icon: BookOpen, title: "Module Master", desc: "Completed 5 learning modules", unlocked: modulesComplete >= 5, xp: 300 },
    { icon: Brain, title: "Course Explorer", desc: "Enrolled in 3 or more iGOT courses", unlocked: enrolledCourses.length >= 3, xp: 200 },
    { icon: Award, title: "Quiz Ace", desc: "Scored 100% on any assessment", unlocked: hasAced, xp: 750 },
    { icon: Zap, title: "Quiz Machine", desc: "Completed 5 quizzes", unlocked: quizCount >= 5, xp: 400 },
    { icon: Trophy, title: "Department Leader", desc: "Reached top rank in your cadre leaderboard", unlocked: currentUser.xp >= 4000, xp: 1000 },
  ];

  const totalXP = achievementsList.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const unlockedCount = achievementsList.filter(a => a.unlocked).length;

  // Evidence filter logic
  const filteredEvidence = (portfolioItems || []).filter(item => {
    const matchesComp = selectedCompetency === 'All' || item.competency === selectedCompetency;
    const matchesStatus = selectedStatus === 'All' ||
      (selectedStatus === 'Verified' && item.status.includes('Verified')) ||
      (selectedStatus === 'Pending' && item.status.includes('Pending'));
    return matchesComp && matchesStatus;
  });

  const verifiedCount = (portfolioItems || []).filter(i => i.status.includes('Verified')).length;

  const handleCreateEvidence = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    addPortfolioItem({
      title: newTitle.trim(),
      competency: newCompetency,
      type: newType,
      summary: newSummary.trim()
    });

    setNewTitle('');
    setNewSummary('');
    setShowLogModal(false);
  };

  const handleSaveApiKey = () => {
    setApiKey(localApiKey);
    try {
      localStorage.setItem('pariksha_gemini_key', localApiKey);
    } catch (e) {}
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestApiKey = async () => {
    if (!localApiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API key first' });
      return;
    }
    setTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(localApiKey.trim())}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Respond with OK' }] }]
        })
      });

      if (res.ok) {
        setTestResult({ success: true, message: 'Connection successful! Gemini API is active.' });
        setApiKey(localApiKey.trim());
        try { localStorage.setItem('pariksha_gemini_key', localApiKey.trim()); } catch (e) {}
      } else {
        const data = await res.json();
        setTestResult({ success: false, message: data.error?.message || 'Invalid API key or quota exceeded' });
      }
    } catch (err) {
      setTestResult({ success: false, message: `Connection error: ${err.message}` });
    } finally {
      setTestingKey(false);
    }
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 40 }}>
      {/* 4-Tab Navigation Bar */}
      <div className="card mb-6" style={{
        padding: '4px', background: 'var(--bg-surface)',
        display: 'flex', gap: 4, borderRadius: 'var(--radius-lg)',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none'
      }}>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            textAlign: 'center', fontWeight: activeTab === 'profile' ? 700 : 600, fontSize: 13,
            border: 'none', cursor: 'pointer',
            background: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'profile' ? '#fff' : 'var(--text-secondary)',
            transition: 'all 150ms ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
          }}
        >
          <User size={15} /> {t('tab_profile', 'Officer Profile')}
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            textAlign: 'center', fontWeight: activeTab === 'achievements' ? 700 : 600, fontSize: 13,
            border: 'none', cursor: 'pointer',
            background: activeTab === 'achievements' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'achievements' ? '#fff' : 'var(--text-secondary)',
            transition: 'all 150ms ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
          }}
        >
          <Trophy size={15} /> {t('tab_achievements', 'Achievements')} ({unlockedCount})
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            textAlign: 'center', fontWeight: activeTab === 'evidence' ? 700 : 600, fontSize: 13,
            border: 'none', cursor: 'pointer',
            background: activeTab === 'evidence' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'evidence' ? '#fff' : 'var(--text-secondary)',
            transition: 'all 150ms ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
          }}
        >
          <ShieldCheck size={15} /> {t('tab_evidence', 'Skill Evidence')} ({portfolioItems?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          style={{
            flex: 1, padding: '10px 12px', borderRadius: 'var(--radius-md)',
            textAlign: 'center', fontWeight: activeTab === 'settings' ? 700 : 600, fontSize: 13,
            border: 'none', cursor: 'pointer',
            background: activeTab === 'settings' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'settings' ? '#fff' : 'var(--text-secondary)',
            transition: 'all 150ms ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
          }}
        >
          <Palette size={15} /> {t('tab_settings', 'Preferences & AI')}
        </button>
      </div>

      {resetToast && (
        <div className="card mb-4" style={{
          padding: '12px 16px',
          background: 'var(--warning-subtle, rgba(245, 158, 11, 0.1))',
          border: '1px solid var(--warning)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', gap: 10,
          color: 'var(--text-primary)'
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--warning)' }} />
          <span>Platform reset to Day 0! All XP, streaks, and competency ratings reset fresh.</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: PROFILE & PERSONAS                                 */}
      {/* ========================================================= */}
      {activeTab === 'profile' && (
        <div className="fade-in">
          {/* Profile Card */}
          <div className="card mb-6" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div className="header-avatar" style={{ width: 64, height: 64, fontSize: 26 }}>
                {currentUser.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 200 }}>
                {editingProfile ? (
                  <div>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      style={{ width: '100%', marginBottom: 8, fontSize: 16, fontWeight: 700 }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-primary btn-sm" onClick={handleSaveProfile}>
                        <Save size={14} /> Save Name
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingProfile(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{profileName}</h2>
                      <button
                        onClick={() => setEditingProfile(true)}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 12, padding: '2px 8px' }}
                      >
                        Edit
                      </button>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: '4px 0 0' }}>
                      {currentUser.role} • {currentUser.department} ({currentUser.cadre || 'SSS'} Cadre)
                    </p>
                  </div>
                )}
              </div>

              {/* Stats badges */}
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ textAlign: 'center', padding: '10px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>XP</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{currentUser.xp.toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>STREAK</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>{currentUser.streak}d 🔥</div>
                </div>
              </div>
            </div>

            {profileSaved && (
              <div style={{ marginTop: 12, color: 'var(--success)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} /> Profile name updated successfully
              </div>
            )}
          </div>

          {/* Active Officer Persona Switcher */}
          <div className="card mb-6" style={{ border: '1px solid var(--primary)', background: 'var(--primary-subtle)' }}>
            <div className="flex-between mb-3">
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} /> {t('officer_persona_title', 'Active Officer Persona (Multi-User Simulation)')}
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  {t('officer_persona_sub', 'Switch between statistical cadres to see how radar charts, diagnostic gaps, and recommendations dynamically adapt:')}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
              {officers.slice(0, 6).map((off, idx) => {
                const isSelected = currentUserIndex === idx;
                return (
                  <div
                    key={off.id}
                    onClick={() => switchOfficer(idx)}
                    style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--bg-card)' : 'var(--bg-surface)',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="header-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>
                          {off.avatar}
                        </div>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--text-primary)', margin: 0 }}>{off.name}</p>
                          <p style={{ fontSize: 10.5, color: 'var(--text-secondary)', margin: 0 }}>{off.cadre}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={11} />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                      <span>{off.role.split(' ')[0]}</span>
                      <span>{off.department}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ACHIEVEMENTS & XP                                  */}
      {/* ========================================================= */}
      {activeTab === 'achievements' && (
        <div className="fade-in">
          {/* Progress Banner */}
          <div className="card mb-6" style={{ padding: 20 }}>
            <div className="flex-between" style={{ marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Achievement Milestones</h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>{unlockedCount} of {achievementsList.length} badges unlocked</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span className="tag tag-easy" style={{ fontSize: 12 }}>
                  <Award size={14} /> +{totalXP} XP Earned
                </span>
              </div>
            </div>
            <div className="progress-bar-track" style={{ height: 10 }}>
              <div className="progress-bar-fill" style={{ width: `${(unlockedCount / achievementsList.length) * 100}%`, height: '100%' }} />
            </div>
          </div>

          {/* Grid of Badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
            {achievementsList.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="card" style={{
                  opacity: a.unlocked ? 1 : 0.45,
                  textAlign: 'center',
                  padding: 22,
                  borderColor: a.unlocked ? 'var(--primary)' : 'var(--border-light)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {a.unlocked && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'var(--success)', color: 'white',
                      borderRadius: '50%', width: 20, height: 20,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11,
                    }}>✓</div>
                  )}
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%',
                    background: a.unlocked ? 'var(--primary-glow)' : 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <Icon size={24} style={{ color: a.unlocked ? 'var(--primary)' : 'var(--text-tertiary)' }} />
                  </div>
                  <h4 style={{ fontSize: 14.5, fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>{a.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>{a.desc}</p>
                  <span className="tag tag-priority" style={{ fontSize: 10.5 }}>+{a.xp} XP</span>
                  {!a.unlocked && <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '6px 0 0' }}>🔒 In Progress</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: SKILL EVIDENCE & APAR DOSSIER                      */}
      {/* ========================================================= */}
      {activeTab === 'evidence' && (
        <div className="fade-in">
          {/* Passport / Credential Header */}
          <div className="evidence-passport mb-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span className="tag tag-priority" style={{ fontSize: 11 }}>
                    <ShieldCheck size={13} /> {t('apar_dossier', 'Official APAR Competency Dossier')}
                  </span>
                  <span className="tag tag-easy" style={{ fontSize: 11 }}>{t('verifiable_cred', 'Verifiable Credentials')}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {currentUser.name}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  {currentUser.role} • {currentUser.department} (MOSPI-EMP-{currentUser.id || '9401'})
                </p>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('verified_seals', 'Verified Seals')}</span>
                    <p style={{ fontSize: 13, fontWeight: 700, margin: '2px 0 0', color: 'var(--success)' }}>
                      {verifiedCount} of {(portfolioItems || []).length} {t('verified', 'Verified')}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('integrity_hash', 'Integrity Hash')}</span>
                    <p style={{ fontSize: 12, margin: '2px 0 0' }}>
                      <span className="hash-pill">0x7c9a41...e82b</span>
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setShowLogModal(true)} className="btn btn-primary btn-sm">
                  <Plus size={15} /> {t('log_artifact', 'Log Evidence Artifact')}
                </button>
                <button onClick={() => window.print()} className="btn btn-outline btn-sm">
                  <Printer size={14} /> {t('export_dossier', 'Export Dossier')}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="card mb-4" style={{ padding: '10px 14px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
                {['All', ...skills].map(skill => (
                  <button
                    key={skill}
                    onClick={() => setSelectedCompetency(skill)}
                    className={`btn btn-sm ${selectedCompetency === skill ? 'btn-primary' : 'btn-outline'}`}
                    style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: 11.5, padding: '4px 10px' }}
                  >
                    {skill === 'All' ? t('filter_all', 'All') : tSkill(skill).split(' ').slice(0, 2).join(' ')}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                {['All', 'Verified', 'Pending'].map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`btn btn-sm ${selectedStatus === status ? 'btn-secondary' : 'btn-ghost'}`}
                    style={{ fontSize: 11.5, padding: '4px 8px' }}
                  >
                    {status === 'All' ? t('filter_all', 'All') : status === 'Verified' ? t('verified', 'Verified') : t('pending', 'Pending')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredEvidence.map(item => {
              const isVerified = item.status.includes('Verified');
              return (
                <div key={item.id} className="card" style={{ padding: 18 }}>
                  <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={`tag ${isVerified ? 'tag-easy' : 'tag-priority'}`} style={{ fontSize: 11 }}>
                        {isVerified ? '✓ ' : '⏳ '}{item.status}
                      </span>
                      <span className="tag" style={{ fontSize: 11, background: 'var(--bg-elevated)' }}>
                        {item.type}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                        Competency: <strong style={{ color: 'var(--text-primary)' }}>{item.competency}</strong>
                      </span>
                    </div>
                    <span className="hash-pill">{item.credentialId}</span>
                  </div>

                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: '6px 0', color: 'var(--text-primary)' }}>
                    {item.title}
                  </h4>

                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0 0 10px' }}>
                    {item.summary}
                  </p>

                  <div className="flex-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 8, flexWrap: 'wrap', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                      <Hash size={12} />
                      <span>Hash: <code>{item.hash}</code></span>
                      <span>• Signer: {item.verifiedBy}</span>
                    </div>

                    {!isVerified && (
                      <button
                        onClick={() => verifyPortfolioItem(item.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--success)', borderColor: 'var(--success)', fontSize: 11.5, padding: '3px 8px' }}
                      >
                        <CheckCircle2 size={13} /> Endorse as Supervisor
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal to log evidence */}
          {showLogModal && (
            <div className="modal-backdrop">
              <div className="modal-content" style={{ maxWidth: 500 }}>
                <div className="modal-header">
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Log Verifiable Evidence Artifact</h3>
                  <button onClick={() => setShowLogModal(false)} className="btn btn-ghost btn-sm"><X size={16} /></button>
                </div>
                <form onSubmit={handleCreateEvidence} style={{ marginTop: 14 }}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Artifact Title</label>
                    <input
                      type="text"
                      placeholder="e.g. NSS 79th Round Data Validation Script"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Competency</label>
                      <select
                        value={newCompetency}
                        onChange={(e) => setNewCompetency(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', fontSize: 12.5 }}
                      >
                        {skills.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Artifact Type</label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', fontSize: 12.5 }}
                      >
                        <option value="Field Report">Field Report</option>
                        <option value="Code Pipeline">Code Pipeline</option>
                        <option value="Survey Manual">Survey Manual</option>
                        <option value="Analysis Notebook">Analysis Notebook</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Summary & Evidence Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Describe the statistical artifact, methodology, and direct impact..."
                      value={newSummary}
                      onChange={(e) => setNewSummary(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', fontSize: 13 }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-ghost btn-sm">Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm">Submit Artifact</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PREFERENCES & AI CONFIG                            */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="fade-in">
          {/* Gemini API Key */}
          <div className="card mb-6">
            <div className="card-header mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Key size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Gemini AI API Key</h3>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Used for live AI quiz generation, explainable evaluation, and real-time competency feedback.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                style={{ flex: 1, minWidth: 240, fontFamily: 'monospace' }}
              />
              <button
                onClick={handleSaveApiKey}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Save size={14} /> Save
              </button>
              <button
                onClick={handleTestApiKey}
                disabled={testingKey}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Zap size={14} /> {testingKey ? 'Testing...' : 'Test Connection'}
              </button>
            </div>

            {saved && (
              <div style={{ color: 'var(--success)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckCircle2 size={14} /> API Key saved successfully
              </div>
            )}

            {testResult && (
              <div style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12,
                background: testResult.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: testResult.success ? 'var(--success)' : 'var(--danger)',
                border: `1px solid ${testResult.success ? 'var(--success)' : 'var(--danger)'}`
              }}>
                {testResult.message}
              </div>
            )}
          </div>

          {/* Interface & Theme Preferences */}
          <div className="card mb-6">
            <div className="card-header mb-4">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Palette size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Interface Preferences</h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {/* Theme Mode */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Theme Mode
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <Moon size={14} /> Dark
                  </button>
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <Sun size={14} /> Light
                  </button>
                </div>
              </div>

              {/* Language */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {t('language_select', 'Language')} / भाषा (22 Indian Languages + En)
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: 13 }}
                >
                  {(availableLanguages || []).map(l => (
                    <option key={l.code} value={l.code}>
                      {l.nativeName} ({l.name}) — {l.script}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assessment Difficulty */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Default Difficulty
                </label>
                <select
                  value={defaultDifficulty}
                  onChange={(e) => setDefaultDifficulty(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Actions / Reset Platform */}
          <div className="card" style={{ border: '1px solid var(--border-light)' }}>
            <div className="card-header mb-3">
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>System & Diagnostics</h3>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowGuideModal(true)}
                className="btn btn-outline btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <BookOpen size={14} /> {t('guide', 'Open Software Guide')}
              </button>
              <button
                onClick={() => {
                  resetToZero();
                  setResetToast(true);
                  setTimeout(() => setResetToast(false), 3500);
                }}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warning)', borderColor: 'var(--warning)' }}
              >
                <RefreshCw size={14} /> {t('reset_day0', 'Reset Platform to Day 0')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
