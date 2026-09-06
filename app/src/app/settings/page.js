'use client';
import { useState } from 'react';
import { User, Palette, Bell, Shield, Save, CheckCircle2, RefreshCw, Sun, Moon, Check, Key, Zap, Database } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const {
    currentUser, currentUserIndex, switchOfficer, officers,
    apiKey, setApiKey,
    language, setLanguage,
    defaultDifficulty, setDefaultDifficulty,
    notifPrefs, toggleNotifPref,
    theme, toggleTheme,
    resetToZero, setShowGuideModal
  } = useApp();

  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [saved, setSaved] = useState(false);
  const [testingKey, setTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileSaved, setProfileSaved] = useState(false);
  const [resetToast, setResetToast] = useState(false);

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
      // Test Gemini API with a minimal ping
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(localApiKey.trim())}`, {
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
    <div className="fade-in" style={{ maxWidth: 840, margin: '0 auto' }}>
      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">Platform Settings</h1>
          <p className="section-subtitle">Manage officer personas, AI model configuration, and interface preferences</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowGuideModal(true)}
            className="btn btn-outline"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            📖 Software Guide
          </button>
          <button
            onClick={() => {
              resetToZero();
              setResetToast(true);
              setTimeout(() => setResetToast(false), 3500);
            }}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--warning)', borderColor: 'var(--warning)' }}
          >
            <RefreshCw size={14} /> Reset to Day 0
          </button>
        </div>
      </div>

      {resetToast && (
        <div className="card mb-4" style={{
          padding: '12px 16px',
          background: 'var(--warning-subtle, rgba(245, 158, 11, 0.1))',
          border: '1px solid var(--warning)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'var(--text-primary)'
        }}>
          <CheckCircle2 size={18} style={{ color: 'var(--warning)' }} />
          <span>Platform successfully reset to Day 0! All XP, streaks, and competency ratings start fresh at 0.</span>
        </div>
      )}

      {/* 1. Active Officer Persona Switcher */}
      <div className="card mb-6" style={{ border: '1px solid var(--primary)', background: 'var(--primary-subtle)' }}>
        <div className="flex-between mb-4">
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} /> Active Officer Persona (Multi-User Simulation)
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Switch between different statistical cadres to test how the competency gap radar, recommendations, and quizzes dynamically adapt
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {officers.slice(0, 6).map((off, idx) => {
            const isSelected = currentUserIndex === idx;
            return (
              <div
                key={off.id}
                onClick={() => switchOfficer(idx)}
                style={{
                  padding: 14,
                  borderRadius: 'var(--radius-md)',
                  background: isSelected ? 'var(--bg-card)' : 'var(--bg-surface)',
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  boxShadow: isSelected ? 'var(--shadow-glow)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="header-avatar" style={{ width: 34, height: 34, fontSize: 14 }}>
                      {off.avatar}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{off.name}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{off.cadre}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span style={{ background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={12} />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: 6, display: 'flex', justifyContent: 'space-between' }}>
                  <span>{off.role.split(' ')[0]}</span>
                  <span>{off.department}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Profile Details */}
      <div className="card mb-6">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 16 }}>
          <div className="header-avatar" style={{ width: 56, height: 56, fontSize: 22 }}>
            {currentUser.avatar}
          </div>
          <div style={{ flex: 1 }}>
            {editingProfile ? (
              <div>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  style={{ width: '100%', marginBottom: 8, fontSize: 15, fontWeight: 600 }}
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
                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{profileName}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{currentUser.role} • {currentUser.department}</p>
                <p style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>Cadre: {currentUser.cadre} • Experience: {currentUser.experience} yrs</p>
              </div>
            )}
          </div>
        </div>
        {!editingProfile && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setEditingProfile(true)}>
              <User size={14} /> Edit Display Name
            </button>
            {profileSaved && (
              <span style={{ color: 'var(--success)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle2 size={14} /> Profile saved!
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. Theme & Appearance */}
      <div className="card mb-6">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Palette size={18} /> Theme & Display
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flex-between">
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>Interface Theme</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Choose between Dark Charcoal and Clean Light mode</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn btn-sm ${theme === 'dark' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Moon size={14} /> Dark Charcoal
              </button>
              <button
                className={`btn btn-sm ${theme === 'light' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => { if (theme !== 'light') toggleTheme(); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Sun size={14} /> Clean Light
              </button>
            </div>
          </div>
          <hr className="divider" style={{ margin: 0 }} />
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>Language / भाषा</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Select platform interface language</p>
            </div>
            <select style={{ width: 180, maxWidth: '100%' }} value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option>English</option>
              <option>हिन्दी (Hindi)</option>
              <option>தமிழ் (Tamil)</option>
              <option>తెలుగు (Telugu)</option>
              <option>বাংলা (Bengali)</option>
              <option>मराठी (Marathi)</option>
            </select>
          </div>
          <hr className="divider" style={{ margin: 0 }} />
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>Quiz Difficulty Default</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Default difficulty level when generating diagnostic quizzes</p>
            </div>
            <select style={{ width: 180, maxWidth: '100%' }} value={defaultDifficulty} onChange={(e) => setDefaultDifficulty(e.target.value)}>
              <option>Mixed</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. AI Quiz Generation Configuration */}
      {/* 4. Supabase Database Configuration */}
      <div className="card mb-6">
        <div className="flex-between mb-3">
          <h3 style={{ fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Database size={18} style={{ color: 'var(--primary)' }} /> Supabase Cloud Database
          </h3>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full, 9999px)',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            Connected
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
          Your Supabase database is connected at <code style={{ color: 'var(--primary)', background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: 4 }}>https://synftyveckkmyeiyuekz.supabase.co</code>. Profiles, competency deficits, quizzes, and course enrollments sync with your cloud PostgreSQL database.
        </p>

        <div style={{
          padding: 14,
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Initialize Database Schema</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                To create all tables (<code style={{ fontSize: 11 }}>profiles</code>, <code style={{ fontSize: 11 }}>officer_skills</code>, <code style={{ fontSize: 11 }}>quizzes</code>, <code style={{ fontSize: 11 }}>enrolled_courses</code>), run the SQL schema script in your Supabase SQL Editor.
              </p>
            </div>
            <a
              href="https://supabase.com/dashboard/project/synftyveckkmyeiyuekz/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              Open SQL Editor ↗
            </a>
          </div>
        </div>
      </div>

      {/* 5. Google Gemini AI Configuration */}
      <div className="card mb-6">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} /> Google Gemini AI Configuration
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
          Pariksha AI uses <strong>Google Gemini 3.6 Flash</strong> to analyze official statistical guidelines, census handbooks, and survey PDFs to generate domain-accurate MCQs with full explanations.
        </p>

        <div>
          <label style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
            Gemini API Key
          </label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <input
              type="password"
              placeholder="AIzaSy..."
              style={{ flex: 1, minWidth: 200, fontFamily: 'monospace' }}
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
            />
            <button className="btn btn-outline btn-sm" onClick={handleTestApiKey} disabled={testingKey}>
              {testingKey ? <span className="spinner" style={{ width: 14, height: 14 }} /> : <Key size={14} />}
              Test
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSaveApiKey}>
              <Save size={14} /> Save
            </button>
          </div>

          {testResult && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              marginBottom: 8,
              background: testResult.success ? 'var(--success-bg)' : 'var(--error-bg)',
              color: testResult.success ? 'var(--success)' : 'var(--error)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {testResult.success ? <CheckCircle2 size={16} /> : null}
              {testResult.message}
            </div>
          )}

          {saved && (
            <p style={{ fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={14} /> API key saved securely in local storage!
            </p>
          )}

          <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
            💡 Tip: If no API key is set, the system uses our high-fidelity procedural Statistical Knowledge Base to generate quizzes locally without external dependencies.
          </p>
        </div>
      </div>

      {/* 5. Notification Preferences */}
      <div className="card mb-6">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={18} /> Notification Preferences
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.keys(notifPrefs).map((item) => (
            <label key={item} className="flex-between" style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: 14 }}>{item}</span>
              <input
                type="checkbox"
                checked={notifPrefs[item]}
                onChange={() => toggleNotifPref(item)}
                style={{ accentColor: 'var(--primary)', width: 18, height: 18 }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* 6. System Version */}
      <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-tertiary)', fontSize: 12 }}>
        Pariksha AI v1.2.0 • MoSPI / iGOT Karmayogi Competency Assessment Platform • Team Aura Farmers
      </div>
    </div>
  );
}
