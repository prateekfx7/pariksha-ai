'use client';
import { useState } from 'react';
import { Eye, EyeOff, Zap, ArrowRight, UserPlus, LogIn, CheckCircle2, ShieldCheck } from 'lucide-react';
import { signInWithSupabase, signUpWithSupabase } from '@/lib/supabaseService';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export default function LoginPage({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Census Operations');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const departments = [
    "Census Operations", "National Sample Survey", "Economic Statistics",
    "Agricultural Statistics", "Industrial Statistics", "Social Statistics",
    "Health Statistics", "Price Statistics", "Trade Statistics", "Labour Statistics"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }
    if (isSignup && !name.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      if (isSupabaseConfigured) {
        if (isSignup) {
          const data = await signUpWithSupabase(email, password, { name, department });
          if (data?.session) {
            // Immediate sign-in session created
            onLogin({
              email: data.user.email,
              name: data.user.user_metadata?.name || name,
              department: data.user.user_metadata?.department || department,
              id: data.user.id,
            });
          } else {
            // Confirmation email sent
            setSuccessMsg('Account created successfully! Please check your email inbox to confirm your account, or sign in if email auto-confirm is enabled.');
            setIsSignup(false);
          }
        } else {
          // Supabase Sign In
          const data = await signInWithSupabase(email, password);
          if (data?.user) {
            onLogin({
              email: data.user.email,
              name: data.user.user_metadata?.name || name || 'Statistical Officer',
              department: data.user.user_metadata?.department || department,
              id: data.user.id,
            });
          }
        }
      } else {
        throw new Error('Supabase database is not configured. Please check your environment variables.');
      }
    } catch (err) {
      console.error('Supabase Auth error:', err);
      // Give clean, user-friendly error translations
      let message = err.message || 'Authentication failed. Please verify your credentials.';
      if (message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please check your credentials or create an account.';
      } else if (message.includes('Email not confirmed')) {
        message = 'Your email is not confirmed yet. Please check your email inbox or disable email confirmation in Supabase Auth settings.';
      } else if (message.includes('User already registered')) {
        message = 'An account with this email already exists. Please sign in instead.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: 20,
    }}>
      <div className="login-box">
        {/* Left Panel — Branding */}
        <div className="login-left-panel" style={{
          background: 'linear-gradient(145deg, #14110f 0%, #1e1a16 55%, #341e12 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: '#ffffff',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 220, height: 220,
            background: 'radial-gradient(circle, rgba(240, 90, 40, 0.22), transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -40, left: -40,
            width: 180, height: 180,
            background: 'radial-gradient(circle, rgba(240, 90, 40, 0.15), transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          <div style={{ marginBottom: 24, zIndex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/logo.png" alt="Pariksha AI Logo" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
            <h2 style={{
              fontFamily: "'Bootzy TM', 'BootzyTM', sans-serif",
              fontSize: 32,
              fontWeight: 400,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '0.02em',
              lineHeight: 1.1
            }}>
              Pariksha <span style={{ color: 'var(--primary-light)' }}>AI</span>
            </h2>
          </div>

          <h1 style={{
            fontSize: 'clamp(22px, 5vw, 30px)',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: 14,
            color: '#ffffff',
            zIndex: 1
          }}>
            Diagnose the Gap.<br />
            <span style={{
              background: 'linear-gradient(135deg, #ff7a4d, #f05a28)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'var(--primary-light)'
            }}>
              Personalize the Path.
            </span>
          </h1>

          <p style={{
            color: 'rgba(255, 255, 255, 0.82)',
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 26,
            zIndex: 1
          }}>
            AI-powered competency assessment for India's Official Statistical System.
            Score skills, recommend courses, and generate quizzes — all on top of iGOT Karmayogi.
          </p>

          <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', gap: 12, zIndex: 1 }}>
            {[
              'Competency Gap Analysis with Radar Charts',
              'AI-Generated MCQs from any PDF/PPT',
              'Personalized iGOT Course Recommendations',
              'Department-wide Analytics Dashboard',
            ].map((feature, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'rgba(255, 255, 255, 0.92)',
                fontSize: 13.5,
                fontWeight: 500,
              }}>
                <div style={{
                  width: 24, height: 24,
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(240, 90, 40, 0.18)',
                  border: '1px solid rgba(240, 90, 40, 0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Zap size={12} style={{ color: 'var(--primary-light)' }} />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <p className="hide-mobile" style={{
            color: 'rgba(255, 255, 255, 0.45)',
            fontSize: 12,
            marginTop: 'auto',
            paddingTop: 26,
            zIndex: 1
          }}>
            SIH26101 • Team Aura Farmers • Built on Google Antigravity
          </p>
        </div>

        {/* Right Panel — Form */}
        <div className="login-right-panel" style={{
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            {isSupabaseConfigured && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 999,
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                <ShieldCheck size={12} /> Supabase Auth
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
            {isSignup ? 'Join Pariksha AI with your official credentials' : 'Sign in to access your competency dashboard'}
          </p>

          {successMsg && (
            <div style={{
              color: '#10b981',
              fontSize: 13,
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {isSignup && (
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Full Name</label>
                <input
                  type="text"
                  placeholder="Rajesh Kumar Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                placeholder="officer@mospi.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%' }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', paddingRight: 44 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignup && (
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  style={{ width: '100%' }}
                >
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            {error && (
              <p style={{ color: 'var(--error)', fontSize: 13, background: 'var(--error-bg)', padding: '10px 14px', borderRadius: 'var(--radius-md)' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}>
              {loading ? (
                <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> {isSignup ? 'Creating Account...' : 'Authenticating...'}</>
              ) : (
                <>{isSignup ? <><UserPlus size={18} /> Create Account with Supabase</> : <><LogIn size={18} /> Sign In with Supabase</>}</>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              {isSignup ? 'Already have an official account?' : "Don't have an account yet?"}{' '}
              <button
                onClick={() => { setIsSignup(!isSignup); setError(''); setSuccessMsg(''); }}
                style={{ color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}
              >
                {isSignup ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
