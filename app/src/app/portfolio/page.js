'use client';
import { useState } from 'react';
import { ShieldCheck, Plus, Award, CheckCircle2, FileText, Code2, MapPin, Hash, QrCode, ExternalLink, Printer, Filter, X, Sparkles, Terminal, GraduationCap, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { skills } from '@/data/mockData';
import Link from 'next/link';

export default function PortfolioPage() {
  const { currentUser, portfolioItems, addPortfolioItem, verifyPortfolioItem } = useApp();

  const [selectedCompetency, setSelectedCompetency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showLogModal, setShowLogModal] = useState(false);

  // Form state for logging new evidence
  const [newTitle, setNewTitle] = useState('');
  const [newCompetency, setNewCompetency] = useState('Survey Design');
  const [newType, setNewType] = useState('Field Report');
  const [newSummary, setNewSummary] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredItems = portfolioItems.filter(item => {
    const matchesComp = selectedCompetency === 'All' || item.competency === selectedCompetency;
    const matchesStatus = selectedStatus === 'All' ||
      (selectedStatus === 'Verified' && item.status.includes('Verified')) ||
      (selectedStatus === 'Pending' && item.status.includes('Pending'));
    return matchesComp && matchesStatus;
  });

  const handleCreateEvidence = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    setIsSubmitting(true);
    addPortfolioItem({
      title: newTitle.trim(),
      competency: newCompetency,
      type: newType,
      summary: newSummary.trim()
    });

    setNewTitle('');
    setNewSummary('');
    setIsSubmitting(false);
    setShowLogModal(false);
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const verifiedCount = portfolioItems.filter(i => i.status.includes('Verified')).length;

  return (
    <div className="fade-in" style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tag tag-priority" style={{ fontSize: 11 }}>
              <ShieldCheck size={13} /> Official APAR Competency Dossier
            </span>
            <span className="tag tag-easy" style={{ fontSize: 11 }}>
              Verifiable Credentials
            </span>
          </div>
          <h1 className="section-title">Skill Evidence Engine</h1>
          <p className="section-subtitle">
            Repository of verifiable field artifacts, analytical code pipelines, and supervisor-endorsed statistical competencies.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowLogModal(true)} className="btn btn-primary btn-sm">
            <Plus size={16} /> Log Evidence Artifact
          </button>
          <button onClick={handlePrintDossier} className="btn btn-outline btn-sm">
            <Printer size={14} /> Export Dossier
          </button>
        </div>
      </div>

      {/* Official Verifiable Competency Passport Card */}
      <div className="evidence-passport mb-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          {/* Officer Credentials Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-glow)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: 800,
                border: '1.5px solid var(--primary)'
              }}>
                {currentUser.avatar}
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {currentUser.name}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                  {currentUser.role} • {currentUser.department} ({currentUser.cadre || 'SSS'} Cadre)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Govt Service ID</span>
                <p style={{ fontSize: 13, fontWeight: 700, margin: '2px 0 0', fontFamily: 'monospace' }}>
                  MOSPI-EMP-{currentUser.id || '9401'}
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Verified Artifacts</span>
                <p style={{ fontSize: 13, fontWeight: 700, margin: '2px 0 0', color: 'var(--success)' }}>
                  {verifiedCount} of {portfolioItems.length} Sealed
                </p>
              </div>
              <div>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>APAR Integrity Hash</span>
                <p style={{ fontSize: 12, margin: '2px 0 0' }}>
                  <span className="hash-pill">0x7c9a41...e82b</span>
                </p>
              </div>
            </div>
          </div>

          {/* QR Verification Seal Badge */}
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px 16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6
          }}>
            <div style={{
              width: 54,
              height: 54,
              borderRadius: 'var(--radius-sm)',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}>
              <QrCode size={42} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.5px', color: 'var(--primary)' }}>
              VERIFIED DOSSIER
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-tertiary)' }}>
              iGOT Karmayogi Synced
            </span>
          </div>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="card mb-6" style={{ padding: '14px 18px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Competency Filter */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            {['All', ...skills].map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedCompetency(skill)}
                className={`btn btn-sm ${selectedCompetency === skill ? 'btn-primary' : 'btn-outline'}`}
                style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: 12 }}
              >
                {skill.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['All', 'Verified', 'Pending'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`btn btn-sm ${selectedStatus === status ? 'btn-secondary' : 'btn-ghost'}`}
                style={{ fontSize: 12 }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Evidence Artifacts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredItems.map(item => {
          const isVerified = item.status.includes('Verified');
          return (
            <div key={item.id} className="card" style={{ padding: 20, transition: 'transform 150ms ease' }}>
              <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`tag ${isVerified ? 'tag-easy' : 'tag-priority'}`} style={{ fontSize: 11 }}>
                    {isVerified ? '✓ ' : '⏳ '}{item.status}
                  </span>
                  <span className="tag" style={{ fontSize: 11, background: 'var(--bg-elevated)' }}>
                    {item.type}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    Domain: <strong style={{ color: 'var(--text-primary)' }}>{item.competency}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="hash-pill">{item.credentialId}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.date}</span>
                </div>
              </div>

              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '8px 0 6px', color: 'var(--text-primary)' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 14px' }}>
                {item.summary}
              </p>

              <div className="flex-between" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 10, flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-tertiary)' }}>
                  <Hash size={13} />
                  <span>Hash: <code>{item.hash}</code></span>
                  <span>• Signer: {item.verifiedBy}</span>
                </div>

                {!isVerified && (
                  <button
                    onClick={() => verifyPortfolioItem(item.id)}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--success)', borderColor: 'var(--success)' }}
                  >
                    <CheckCircle2 size={14} /> Endorse as Cadre Supervisor
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          portfolioItems.length === 0 ? (
            <div className="card" style={{ padding: 'clamp(24px, 5vw, 36px)', textAlign: 'center', background: 'var(--bg-surface)' }}>
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(240, 90, 40, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
                Day 0: Clean Slate Evidence Portfolio
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>
                Your Official APAR Competency Passport is currently unsealed. In accordance with MoSPI guidelines, credentials must be earned through verified practical execution or certified examination.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, textAlign: 'left', maxWidth: 840, margin: '0 auto 20px' }}>
                <Link href="/practical-tasks" className="card" style={{ padding: 18, textDecoration: 'none', color: 'inherit', border: '1px solid var(--border)', transition: 'transform 150ms ease, border-color 150ms ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: 'var(--primary)' }}>
                    <Terminal size={20} />
                    <strong style={{ fontSize: 14 }}>1. AI Practical Lab</strong>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
                    Solve authentic PLFS, ASI, or Neyman simulation challenges. Scoring &ge;70% automatically seals an AI-Audited Code/Analytical credential.
                  </p>
                  <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Launch Simulation <ArrowRight size={13} />
                  </span>
                </Link>

                <Link href="/quiz" className="card" style={{ padding: 18, textDecoration: 'none', color: 'inherit', border: '1px solid var(--border)', transition: 'transform 150ms ease, border-color 150ms ease' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: 'var(--success)' }}>
                    <GraduationCap size={20} />
                    <strong style={{ fontSize: 14 }}>2. Examination Cell</strong>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
                    Take an official 5-question MoSPI diagnostic quiz. Passing score (&ge;70%) automatically issues a verified Assessment Certificate.
                  </p>
                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Start Assessment <ArrowRight size={13} />
                  </span>
                </Link>

                <div
                  onClick={() => setShowLogModal(true)}
                  className="card"
                  style={{ padding: 18, cursor: 'pointer', border: '1px solid var(--border)', transition: 'transform 150ms ease, border-color 150ms ease' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: 'var(--info)' }}>
                    <FileText size={20} />
                    <strong style={{ fontSize: 14 }}>3. Log Fieldwork Artifact</strong>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
                    Manually register a verified district survey inspection memo, R/Python pipeline, or GIS shapefile for supervisor sign-off.
                  </p>
                  <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    Open Intake Form <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={48} />
              <h3>No Matching Artifacts</h3>
              <p>No evidence items match the selected domain or status filter. Try selecting "All".</p>
            </div>
          )
        )}
      </div>

      {/* Log Evidence Modal Dialog */}
      {showLogModal && (
        <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 'clamp(18px, 4vw, 28px)', maxWidth: 620 }}>
            <div className="flex-between mb-4">
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Log Competency Evidence Artifact</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  Submit proof of field survey, data cleaning, or econometric modeling for APAR validation.
                </p>
              </div>
              <button onClick={() => setShowLogModal(false)} style={{ color: 'var(--text-tertiary)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvidence}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Artifact Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., NSS 80th Round Rural Survey Supervision Memo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Competency Domain
                  </label>
                  <select
                    value={newCompetency}
                    onChange={(e) => setNewCompetency(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px' }}
                  >
                    {skills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                    Artifact Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px' }}
                  >
                    <option>Field Survey Report</option>
                    <option>Code / Analytical Script</option>
                    <option>Spatial / GIS Protocol</option>
                    <option>Assessment Certificate</option>
                    <option>Methodological Note</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>
                  Methodological Summary & Impact Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the objective, methodology applied, error controls instituted, and field outcome..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', resize: 'vertical' }}
                />
              </div>

              <div className="flex-between">
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Awards +50 XP upon automated verification
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => setShowLogModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    Seal in Dossier (+50 XP)
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
