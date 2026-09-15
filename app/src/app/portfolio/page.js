'use client';
import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Award, CheckCircle2, FileText, Code2, MapPin, Hash, QrCode, ExternalLink, Printer, Filter, X, Sparkles, Terminal, GraduationCap, ArrowRight, Download, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { skills } from '@/data/mockData';
import Link from 'next/link';

export default function PortfolioPage() {
  const { currentUser, portfolioItems, addPortfolioItem, verifyPortfolioItem } = useApp();

  const [portfolioTab, setPortfolioTab] = useState('dossier'); // 'dossier' | 'vault'
  const [selectedCompetency, setSelectedCompetency] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showLogModal, setShowLogModal] = useState(false);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('pariksha_certificate_vault') || '[]');
      if (stored.length > 0) {
        setCertificates(stored);
      } else {
        setCertificates([
          {
            id: 'IN-IGOT-2026-NSS79',
            quizId: 'quiz-1',
            title: 'NSSO 79th Round: Stratified Sampling & Household Survey Methodology',
            skill: 'Survey Design',
            recipient: currentUser?.name || 'Statistical Officer',
            role: currentUser?.role || 'Junior Statistical Officer (JSO)',
            cadre: currentUser?.cadre || 'Subordinate Statistical Service (SSS)',
            scorePercent: 92,
            completedAt: '12 Sep 2026',
            verificationCode: 'DoPT-OM-29082025-IN-IGOT-2026-NSS79'
          },
          {
            id: 'IN-IGOT-2026-DPDP',
            quizId: 'quiz-2',
            title: 'Digital Personal Data Protection Act 2023 & Citizen Microdata Privacy',
            skill: 'Digital Skills',
            recipient: currentUser?.name || 'Statistical Officer',
            role: currentUser?.role || 'Junior Statistical Officer (JSO)',
            cadre: currentUser?.cadre || 'Subordinate Statistical Service (SSS)',
            scorePercent: 96,
            completedAt: '10 Sep 2026',
            verificationCode: 'DoPT-OM-29082025-IN-IGOT-2026-DPDP'
          }
        ]);
      }
    } catch(e) {}
  }, [currentUser]);

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

  const handlePrintSingleCertificate = (cert) => {
    const certWindow = window.open('', '_blank');
    if (!certWindow) return;

    certWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Official Certificate — ${cert.id}</title>
        <style>
          @page { size: landscape; margin: 0; }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #fff;
            color: #1a1714;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 90vh;
          }
          .cert-frame {
            border: 8px double #f05a28;
            padding: 48px;
            max-width: 820px;
            width: 100%;
            text-align: center;
            background: #ffffff;
            box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            position: relative;
          }
          .emblem { font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
          .inst { font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 4px; }
          .sub { font-size: 13px; color: #475569; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px; }
          .title { font-size: 28px; font-weight: 900; color: #f05a28; margin: 0 0 16px; }
          .recipient { font-size: 24px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #e2e8f0; display: inline-block; padding-bottom: 4px; margin-bottom: 12px; }
          .meta { font-size: 14px; color: #334155; line-height: 1.6; max-width: 640px; margin: 0 auto 28px; }
          .footer-grid { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
          .sig-line { border-top: 1px solid #334155; width: 180px; margin-bottom: 4px; }
          .stamp { border: 2px solid #22c55e; color: #22c55e; padding: 6px 12px; font-weight: 800; border-radius: 4px; display: inline-block; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="cert-frame">
          <div class="emblem">Government of India • Ministry of Statistics & PI</div>
          <div class="inst">Mission Karmayogi Bharat</div>
          <div class="sub">National Programme for Civil Services Capacity Building</div>
          <div class="title">Certificate of Competency</div>
          <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">This is to certify that</div>
          <div class="recipient">${cert.recipient}</div>
          <div class="meta">
            Designation: <strong>${cert.role || 'Junior Statistical Officer'}</strong> (${cert.cadre || 'SSS'} Cadre)<br/>
            Has successfully demonstrated proficiency in <strong>${cert.title}</strong> under the competency domain <strong>${cert.skill}</strong> with a certified score of <strong>${cert.scorePercent}%</strong>.
          </div>
          <div class="stamp">Verified on iGOT Registry • Pass Grade</div>
          <div class="footer-grid">
            <div style="text-align: left;">
              <div>Certificate ID: <strong>${cert.id}</strong></div>
              <div>Ref: ${cert.verificationCode || 'DoPT-OM-29082025'}</div>
              <div>Issued: ${cert.completedAt}</div>
            </div>
            <div style="text-align: right;">
              <div class="sig-line"></div>
              <div>Capacity Building Commission (CBC)</div>
              <div>Government of India</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
    certWindow.document.close();
    certWindow.focus();
    setTimeout(() => { certWindow.print(); }, 250);
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

      {/* Portfolio Hub Tabs (Dossier vs Certificate Vault - Problem #4) */}
      <div className="card mb-6" style={{
        padding: 4, background: 'var(--bg-surface)',
        display: 'flex', gap: 6, borderRadius: 'var(--radius-lg)'
      }}>
        <button
          onClick={() => setPortfolioTab('dossier')}
          className="btn btn-sm"
          style={{
            flex: 1,
            background: portfolioTab === 'dossier' ? 'var(--primary)' : 'transparent',
            color: portfolioTab === 'dossier' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          <FileText size={14} /> Dossier Evidence Artifacts ({portfolioItems.length})
        </button>
        <button
          onClick={() => setPortfolioTab('vault')}
          className="btn btn-sm"
          style={{
            flex: 1,
            background: portfolioTab === 'vault' ? 'var(--primary)' : 'transparent',
            color: portfolioTab === 'vault' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          <Award size={14} /> Permanent Certificate Vault ({certificates.length})
        </button>
      </div>

      {portfolioTab === 'dossier' && (
        <>
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
                    {item.status}
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
      </>
      )}

      {/* TAB 2: PERMANENT CERTIFICATE VAULT (Problem #4 Fix) */}
      {portfolioTab === 'vault' && (
        <div className="fade-in">
          {/* Resilience Guarantee Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(20, 24, 33, 0.4) 100%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="tag tag-easy" style={{ fontSize: 11 }}>
                    <ShieldCheck size={12} /> Permanent Local Cache Active
                  </span>
                  <span className="tag" style={{ fontSize: 11, background: 'var(--bg-elevated)' }}>
                    Problem #4 & DoPT Resolution
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                  Offline-Resilient Certificate Vault
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, maxWidth: 680 }}>
                  Prevents certificate loss caused by central portal downtime. Credentials below are sealed locally with cryptographic tokens, scannable QR verification URLs, and 100% offline PDF/Print generation.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  fontSize: 12,
                  fontWeight: 800,
                  color: '#22c55e'
                }}>
                  {certificates.length} Sealed Credentials
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="card"
                style={{
                  padding: 20,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                        {cert.skill}
                      </span>
                      <h4 style={{ fontSize: 15, fontWeight: 800, margin: '4px 0 0', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                        {cert.title}
                      </h4>
                    </div>

                    <div style={{
                      width: 48, height: 48, borderRadius: 8,
                      background: '#fff', color: '#000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, border: '1px solid var(--border)'
                    }}>
                      <QrCode size={38} />
                    </div>
                  </div>

                  <div style={{
                    padding: 10,
                    borderRadius: 6,
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    marginBottom: 14,
                    fontSize: 12
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Credential ID:</span>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text-primary)' }}>{cert.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Awarded To:</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cert.recipient}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Score & Verification:</span>
                      <span style={{ fontWeight: 800, color: '#22c55e' }}>{cert.scorePercent}% • DoPT Compliant</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Issued Date:</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{cert.completedAt}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handlePrintSingleCertificate(cert)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Printer size={13} /> Print / Download PDF
                  </button>
                  <button
                    onClick={() => handlePrintSingleCertificate(cert)}
                    className="btn btn-outline btn-sm"
                    title="Retry download if offline"
                  >
                    <RefreshCw size={13} /> Retry
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
