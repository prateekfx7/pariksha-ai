'use client';
import { useState } from 'react';
import {
  Eye, EyeOff, ShieldCheck, CheckCircle2,
  GraduationCap, Users, UserPlus, LogIn
} from 'lucide-react';
import { signInWithSupabase, signUpWithSupabase } from '@/lib/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';
import { useApp } from '@/context/AppContext';

export default function LoginPage({ onLogin }) {
  const { t } = useApp();
  
  // Selected Role: 'officer' (Learner) | 'trainer' (Trainer & SME)
  const [selectedRole, setSelectedRole] = useState('officer');
  const [isSignup, setIsSignup] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('Census Operations');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const departments = [
    "Census Operations", "National Sample Survey (NSSO)", "Economic Statistics",
    "National Accounts Division", "Price & Industrial Statistics", "Capacity Building Wing",
    "Central Secretariat Service", "State Planning Board"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Please enter your full name.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured) {
        if (isSignup) {
          const roleTitle = selectedRole === 'trainer' ? 'Training Director / SME' : 'Civil Services Officer';
          const data = await signUpWithSupabase(email, password, {
            name,
            username: username || email.split('@')[0],
            department,
            role: roleTitle,
            portalRole: selectedRole
          });
          if (data?.session) {
            onLogin({
              email: data.user.email,
              name: data.user.user_metadata?.name || name,
              username: data.user.user_metadata?.username || username,
              department: data.user.user_metadata?.department || department,
              role: roleTitle,
              portalRole: selectedRole,
              id: data.user.id,
            });
          } else {
            setSuccessMsg('Account created successfully. Please confirm your email or sign in below.');
            setIsSignup(false);
          }
        } else {
          const data = await signInWithSupabase(email, password);
          if (data?.user) {
            onLogin({
              email: data.user.email,
              name: data.user.user_metadata?.name || name || (selectedRole === 'trainer' ? 'SME Evaluator' : 'Statistical Officer'),
              username: data.user.user_metadata?.username || username,
              department: data.user.user_metadata?.department || department,
              role: data.user.user_metadata?.role || (selectedRole === 'trainer' ? 'Training Director / SME' : 'Civil Services Officer'),
              portalRole: selectedRole,
              id: data.user.id,
            });
          }
        }
      } else {
        // Direct local authentication fallback
        onLogin({
          email,
          name: name || (selectedRole === 'trainer' ? 'Dr. Sunita Rao (SME)' : 'Rajesh Kumar (JSO)'),
          username: username || email.split('@')[0],
          department,
          role: selectedRole === 'trainer' ? 'Senior Training Director' : 'Junior Statistical Officer',
          portalRole: selectedRole,
          id: `usr-${Date.now()}`
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
      let message = err.message || 'Authentication failed. Please check your credentials.';
      if (message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please verify your credentials.';
      } else if (message.includes('Email not confirmed')) {
        message = 'Email confirmation pending. Please check your inbox or use 1-Click Access.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (roleToUse) => {
    if (roleToUse === 'trainer') {
      onLogin({
        id: 'demo-trainer-001',
        name: 'Dr. Sunita Rao',
        username: 'sunitarao.sme',
        email: 'trainer.sme@istm.gov.in',
        role: 'Senior Training Director & SME',
        department: 'Capacity Building & SME Review',
        portalRole: 'trainer'
      });
    } else {
      onLogin({
        id: 'demo-officer-001',
        name: 'Rajesh Kumar',
        username: 'rajeshkumar.jso',
        email: 'rajesh.kumar@mospi.gov.in',
        role: 'Junior Statistical Officer (JSO)',
        department: 'National Sample Survey Office',
        portalRole: 'learner'
      });
    }
  };

  return (
    <>
      <style>{`
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #141210;
          padding: 24px 16px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .login-card-container {
          width: 100%;
          max-width: 1040px;
          background-color: #ffffff;
          border-radius: 36px;
          box-shadow: 0 30px 70px -10px rgba(0, 0, 0, 0.55);
          display: grid;
          grid-template-columns: 1fr 1.05fr;
          padding: 14px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .login-visual-panel {
          background: linear-gradient(150deg, #c2410c 0%, #ea580c 26%, #f05a28 62%, #fb923c 100%);
          border-radius: 28px;
          padding: clamp(24px, 3.5vw, 44px);
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          color: #ffffff;
          position: relative;
          overflow: hidden;
          min-height: 560px;
          box-sizing: border-box;
        }

        .login-step-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 14px;
        }

        .login-mobile-step-pill {
          display: none;
        }

        .login-form-panel {
          background-color: #ffffff;
          padding: clamp(24px, 3.5vw, 44px);
          display: flex;
          flex-direction: column;
          justifyContent: center;
          box-sizing: border-box;
        }

        .login-form-2col-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* Responsive Breakpoint for Tablets and Mobile Phones (< 840px) */
        @media (max-width: 840px) {
          .login-wrapper {
            min-height: 100vh;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px 12px;
            box-sizing: border-box;
          }

          .login-card-container {
            grid-template-columns: 1fr;
            border-radius: 28px;
            padding: 8px;
            width: 100%;
            max-width: 440px;
            margin: auto;
            box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.45);
            align-self: center;
          }

          .login-visual-panel {
            min-height: auto !important;
            padding: 16px 18px !important;
            border-radius: 22px;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .login-visual-panel .visual-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
          }

          .login-visual-panel .visual-content-body {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }

          .login-visual-panel h1 {
            font-size: 20px !important;
            margin: 0 0 3px 0 !important;
            line-height: 1.2 !important;
          }

          .login-visual-panel .visual-desc-text {
            font-size: 11.5px !important;
            margin: 0 !important;
            line-height: 1.35 !important;
            opacity: 0.92;
          }

          .login-step-cards-grid {
            display: none !important;
          }

          .login-mobile-step-pill {
            display: none !important;
          }

          .login-form-panel {
            padding: 18px 16px 14px !important;
          }

          .login-form-panel h2 {
            font-size: 20px !important;
            margin-bottom: 2px !important;
          }

          .login-form-2col-row {
            grid-template-columns: 1fr !important;
            gap: 12px;
          }
        }
      `}</style>

      <div className="login-wrapper">
        {/* Outer Rounded Container */}
        <div className="login-card-container">
          
          {/* Left Visual Canvas */}
          <div className="login-visual-panel">
            {/* Ambient Highlights */}
            <div style={{
              position: 'absolute',
              top: -60,
              right: -60,
              width: 260,
              height: 260,
              background: 'radial-gradient(circle, rgba(254, 215, 170, 0.35) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: -60,
              left: -60,
              width: 240,
              height: 240,
              background: 'radial-gradient(circle, rgba(154, 52, 18, 0.5) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Brand Logo Header */}
            <div className="visual-header-row" style={{ display: 'flex', alignItems: 'center', gap: 10, zIndex: 2 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img src="/logo.png" alt="Pariksha AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{
                fontSize: 19,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span>Pariksha</span>
                <span style={{ color: '#fed7aa' }}>AI</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="visual-content-body" style={{ zIndex: 2, marginTop: 'auto', paddingTop: 24 }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                borderRadius: 999,
                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontSize: 11.5,
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: 12
              }}>
                <ShieldCheck size={13} />
                <span>Mission Karmayogi Ecosystem</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(26px, 3.5vw, 36px)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                margin: '0 0 10px 0',
                color: '#ffffff'
              }}>
                Start your Journey
              </h1>

              <p className="visual-desc-text" style={{
                fontSize: 13.5,
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.92)',
                margin: '0 0 24px 0',
                maxWidth: 380
              }}>
                Access cadre competencies, iGOT learning pathways, and official training assessments.
              </p>

              {/* Mobile Single Step Pill */}
              <div className="login-mobile-step-pill">
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  color: '#f05a28',
                  fontSize: 11,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  1
                </div>
                <span>Step 1: Select your role & sign in below</span>
              </div>

              {/* Desktop 3-Step Cards Grid */}
              <div className="login-step-cards-grid">
                {/* Step 1 */}
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 16,
                  padding: '14px 12px',
                  color: '#141210',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.16)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 105
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: '#f05a28',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12
                  }}>
                    1
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, lineHeight: 1.3 }}>
                    Select portal role
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: 16,
                  padding: '14px 12px',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 105
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.28)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12
                  }}>
                    2
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.3, opacity: 0.95 }}>
                    Verify credentials
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.28)',
                  borderRadius: 16,
                  padding: '14px 12px',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 105
                }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.28)',
                    color: '#ffffff',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 12
                  }}>
                    3
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, lineHeight: 1.3, opacity: 0.95 }}>
                    Access dashboard
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Canvas */}
          <div className="login-form-panel">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <h2 style={{
                fontSize: 'clamp(22px, 2.5vw, 26px)',
                fontWeight: 800,
                color: '#141210',
                margin: '0 0 4px 0',
                letterSpacing: '-0.02em'
              }}>
                {isSignup ? 'Join Us' : 'Sign In'}
              </h2>
              <p style={{ margin: 0, fontSize: 12.5, color: '#6b6560' }}>
                Select role and authenticate to proceed
              </p>
            </div>

            {/* Officer vs Trainer Role Switcher */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 6,
              padding: 4,
              backgroundColor: '#f6f4f1',
              borderRadius: 14,
              marginBottom: 18
            }}>
              <button
                type="button"
                onClick={() => setSelectedRole('officer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 8px',
                  borderRadius: 10,
                  border: selectedRole === 'officer' ? '1px solid rgba(240, 90, 40, 0.35)' : 'none',
                  backgroundColor: selectedRole === 'officer' ? '#ffffff' : 'transparent',
                  color: selectedRole === 'officer' ? '#f05a28' : '#6b6560',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'officer' ? '0 2px 8px rgba(240, 90, 40, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <GraduationCap size={15} />
                <span>Officer (Learner)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('trainer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 8px',
                  borderRadius: 10,
                  border: selectedRole === 'trainer' ? '1px solid rgba(139, 92, 246, 0.3)' : 'none',
                  backgroundColor: selectedRole === 'trainer' ? '#ffffff' : 'transparent',
                  color: selectedRole === 'trainer' ? '#8b5cf6' : '#6b6560',
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'trainer' ? '0 2px 8px rgba(139, 92, 246, 0.12)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <Users size={15} />
                <span>Trainer & SME</span>
              </button>
            </div>

            {/* Error / Success Feedback */}
            {successMsg && (
              <div style={{
                color: '#059669',
                fontSize: 12,
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '10px 12px',
                borderRadius: 12,
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <CheckCircle2 size={14} />
                <span>{successMsg}</span>
              </div>
            )}

            {error && (
              <div style={{
                color: '#dc2626',
                fontSize: 12,
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '10px 12px',
                borderRadius: 12,
                marginBottom: 14
              }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#2a2622', marginBottom: 5 }}>
                  Official Email Address
                </label>
                <input
                  type="email"
                  placeholder={selectedRole === 'trainer' ? 'trainer.sme@istm.gov.in' : 'officer@mospi.gov.in'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 13px',
                    borderRadius: 12,
                    border: '1px solid #e7e3df',
                    backgroundColor: '#fcfbfa',
                    color: '#141210',
                    fontSize: 13,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              {isSignup && (
                <div className="login-form-2col-row">
                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#2a2622', marginBottom: 5 }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Rajesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 13px',
                        borderRadius: 12,
                        border: '1px solid #e7e3df',
                        backgroundColor: '#fcfbfa',
                        color: '#141210',
                        fontSize: 13,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#2a2622', marginBottom: 5 }}>
                      Username / Cadre
                    </label>
                    <input
                      type="text"
                      placeholder="rajesh.sss"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 13px',
                        borderRadius: 12,
                        border: '1px solid #e7e3df',
                        backgroundColor: '#fcfbfa',
                        color: '#141210',
                        fontSize: 13,
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#2a2622', marginBottom: 5 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 13px',
                      borderRadius: 12,
                      border: '1px solid #e7e3df',
                      backgroundColor: '#fcfbfa',
                      color: '#141210',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#9a938c',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <div style={{ fontSize: 10.5, color: '#9a938c', marginTop: 4 }}>
                  At least 6 characters with letters and numbers
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 12,
                  border: 'none',
                  backgroundColor: '#f05a28',
                  color: '#ffffff',
                  fontSize: 14,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  marginTop: 4,
                  boxShadow: '0 4px 14px rgba(240, 90, 40, 0.35)',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {loading ? (
                  'Processing...'
                ) : isSignup ? (
                  'Continue to Setup'
                ) : (
                  `Continue as ${selectedRole === 'trainer' ? 'Trainer' : 'Officer'}`
                )}
              </button>
            </form>

            {/* Switcher: Sign in / Sign up */}
            <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12.5, color: '#6b6560' }}>
              <span>{isSignup ? 'Already have an account? ' : "Don't have an account yet? "}</span>
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError(''); setSuccessMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f05a28',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: 12.5,
                  padding: 0
                }}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </div>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '14px 0',
              color: '#9a938c',
              fontSize: 11.5
            }}>
              <div style={{ flex: 1, height: 1, backgroundColor: '#e7e3df' }} />
              <span style={{ padding: '0 10px', fontWeight: 600 }}>Or 1-Click Access</span>
              <div style={{ flex: 1, height: 1, backgroundColor: '#e7e3df' }} />
            </div>

            {/* 1-Click Demo Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleQuickLogin('officer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 8px',
                  borderRadius: 11,
                  border: '1px solid #e7e3df',
                  backgroundColor: '#ffffff',
                  color: '#141210',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <GraduationCap size={14} style={{ color: '#f05a28' }} />
                <span>Officer Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('trainer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px 8px',
                  borderRadius: 11,
                  border: '1px solid #e7e3df',
                  backgroundColor: '#ffffff',
                  color: '#141210',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                <Users size={14} style={{ color: '#8b5cf6' }} />
                <span>Trainer Demo</span>
              </button>
            </div>

            {/* Footer */}
            <div style={{
              fontSize: 10.5,
              color: '#9a938c',
              lineHeight: 1.35,
              textAlign: 'center',
              marginTop: 14
            }}>
              By signing in you confirm adherence to Civil Services Karmayogi Guidelines.
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
