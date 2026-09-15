'use client';
import { ShieldCheck, UserCheck, GraduationCap, Users, ArrowRight, X, FileText, Award, BarChart3, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function RoleSelectionModal() {
  const { showRoleModal, setShowRoleModal, portalRole, setPortalRole } = useApp();
  const router = useRouter();

  if (!showRoleModal) return null;

  const handleSelectRole = (role) => {
    setPortalRole(role);
    setShowRoleModal(false);
    if (role === 'trainer') {
      router.push('/trainer-dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowRoleModal(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 720,
          padding: 'clamp(20px, 4vw, 32px)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        <div className="flex-between mb-4">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="tag tag-priority" style={{ fontSize: 11 }}>
                <ShieldCheck size={12} /> Mission Karmayogi Architecture
              </span>
              <span className="tag tag-easy" style={{ fontSize: 11 }}>
                DoPT Aligned
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Select Operational Profile
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
              Choose your portal role to calibrate your dashboard, course catalog, and analytical toolset.
            </p>
          </div>

          <button
            onClick={() => setShowRoleModal(false)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              padding: 4
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginTop: 12 }}>
          {/* OPTION 1: LEARNER */}
          <div
            onClick={() => handleSelectRole('learner')}
            className="card"
            style={{
              padding: 22,
              cursor: 'pointer',
              border: portalRole === 'learner' ? '2px solid var(--primary)' : '1px solid var(--border)',
              background: portalRole === 'learner' ? 'rgba(240, 90, 40, 0.04)' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 150ms ease'
            }}
          >
            <div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(240, 90, 40, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14
              }}>
                <GraduationCap size={24} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Civil Services Learner
                </h3>
                {portalRole === 'learner' && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'var(--primary)', color: '#fff' }}>
                    ACTIVE
                  </span>
                )}
              </div>

              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.45 }}>
                For statistical officers and civil servants pursuing competency development, mandatory courses, and verifiable credentials.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#22c55e" />
                  <span>AI Role Profiler for 5,500+ Course Library</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#22c55e" />
                  <span>Adaptive Tests & Socratic Oral Viva</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#22c55e" />
                  <span>Offline-Resilient QR Certificate Vault</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleSelectRole('learner'); }}
              className="btn btn-primary btn-sm mt-4"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Enter as Learner <ArrowRight size={14} />
            </button>
          </div>

          {/* OPTION 2: TRAINER & SME */}
          <div
            onClick={() => handleSelectRole('trainer')}
            className="card"
            style={{
              padding: 22,
              cursor: 'pointer',
              border: portalRole === 'trainer' ? '2px solid #3b82f6' : '1px solid var(--border)',
              background: portalRole === 'trainer' ? 'rgba(59, 130, 246, 0.04)' : 'var(--bg-surface)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 150ms ease'
            }}
          >
            <div>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14
              }}>
                <Users size={24} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Trainer & SME Evaluator
                </h3>
                {portalRole === 'trainer' && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: '#3b82f6', color: '#fff' }}>
                    ACTIVE
                  </span>
                )}
              </div>

              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 16px', lineHeight: 1.45 }}>
                For training directors, faculty, and SME reviewers overseeing officer cohorts, question banks, and content quality.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#3b82f6" />
                  <span>Batch Cohort Analytics & Drop-off Alerts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#3b82f6" />
                  <span>50–250 Question Bank Generator Scale</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircle2 size={14} color="#3b82f6" />
                  <span>Human-in-the-Loop SME Review Queue</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); handleSelectRole('trainer'); }}
              className="btn btn-outline btn-sm mt-4"
              style={{ width: '100%', justifyContent: 'center', borderColor: '#3b82f6', color: '#3b82f6' }}
            >
              Enter as Trainer / SME <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', textAlign: 'center', margin: '20px 0 0' }}>
          Notice: You can switch operational views at any time via the quick-toggle in the top navigation bar.
        </p>
      </div>
    </div>
  );
}
