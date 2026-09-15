'use client';
import { useState, useMemo } from 'react';
import {
  X, Download, FileSpreadsheet, FileText, Sparkles, Copy, Check,
  ShieldCheck, AlertTriangle, ExternalLink, Bookmark, CheckCircle2,
  Database, RefreshCw, Layers, Terminal, ChevronRight, HelpCircle, ArrowRight
} from 'lucide-react';
import {
  generateIGotBulkCsv,
  generateAikenFormat,
  generateIGotTaxonomy,
  validateIGotPreFlight,
  generatePublisherBookmarkletCode,
  saveQuizToStagingVault,
  updateVaultItemStatus
} from '@/lib/igotBridge';
import { auditQuizPQI } from '@/lib/pqiAuditor';
import PortalStatusBadge from './PortalStatusBadge';

export default function IGotPublisherModal({ quiz, onClose }) {
  const [activeTab, setActiveTab] = useState('template'); // 'template' | 'tags' | 'companion' | 'speedpaste' | 'validator'
  const [copiedKey, setCopiedKey] = useState(null);
  const [vaultSaved, setVaultSaved] = useState(false);
  const [activeQIndex, setActiveQIndex] = useState(0);
  const [copiedQElements, setCopiedQElements] = useState({});

  if (!quiz) return null;

  const taxonomy = useMemo(() => generateIGotTaxonomy(quiz), [quiz]);
  const validation = useMemo(() => validateIGotPreFlight(quiz), [quiz]);
  const pqi = useMemo(() => auditQuizPQI(quiz), [quiz]);
  const bookmarkletCode = useMemo(() => generatePublisherBookmarkletCode(quiz), [quiz]);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadCsv = () => {
    const csvContent = generateIGotBulkCsv(quiz);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `iGOT_Bulk_Questions_${quiz.skill.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    updateVaultItemStatus(quiz.id, 'EXPORTED_CSV');
  };

  const handleDownloadAiken = () => {
    const aikenContent = generateAikenFormat(quiz);
    const blob = new Blob([aikenContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `iGOT_Aiken_Assessment_${quiz.skill.replace(/[^a-z0-9]/gi, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveToVault = () => {
    const ok = saveQuizToStagingVault(quiz, 'Staged for iGOT Karmayogi bulk publishing');
    if (ok) {
      setVaultSaved(true);
      setTimeout(() => setVaultSaved(false), 3000);
    }
  };

  const currentQ = (quiz.questions && quiz.questions[activeQIndex]) || null;

  const handleCopyQPart = (text, partKey) => {
    navigator.clipboard.writeText(text);
    setCopiedQElements(prev => ({ ...prev, [`${activeQIndex}_${partKey}`]: true }));
    setTimeout(() => {
      setCopiedQElements(prev => ({ ...prev, [`${activeQIndex}_${partKey}`]: false }));
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 960,
          width: '94vw',
          maxHeight: '92vh',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.45)',
          border: '1.5px solid var(--border)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f05a28 0%, #d94818 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: 14,
                boxShadow: '0 3px 10px rgba(240, 90, 40, 0.3)'
              }}>
                iG
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                iGOT Karmayogi Publisher & Resiliency Bridge
              </h2>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 6,
                background: validation.isValid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: validation.isValid ? '#22c55e' : '#ef4444',
                border: `1px solid ${validation.isValid ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
              }}>
                {validation.statusBadge} ({validation.score}/100)
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 6,
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                PQI Grade {pqi.grade} ({pqi.pqiScore}/100)
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '4px 0 0' }}>
              Solving iGOT central portal bottlenecks • MoSPI Assessment: <strong>{quiz.title}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <PortalStatusBadge />
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 6
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          padding: '4px 16px 0',
          overflowX: 'auto',
          gap: 6
        }}>
          {[
            { id: 'template', label: '1. Bulk Upload Files', icon: FileSpreadsheet, badge: 'Solves Bottleneck #3' },
            { id: 'tags', label: '2. Smart Tag Harmonizer', icon: Sparkles, badge: 'Solves Bottleneck #1' },
            { id: 'companion', label: '3. Browser Copilot', icon: Terminal, badge: 'Solves Bottleneck #4' },
            { id: 'speedpaste', label: '4. Speed-Paste Mode', icon: Layers, badge: 'Manual Fallback' },
            { id: 'validator', label: '5. Quality Gate & Vault', icon: ShieldCheck, badge: 'Solves Bottleneck #2' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 14px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          
          {/* TAB 1: BULK UPLOAD FILES */}
          {activeTab === 'template' && (
            <div className="fade-in">
              <div style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(20, 24, 33, 0.4) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ maxWidth: 620 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                      100% Native Sunbird / iGOT Bulk Ingestion Template
                    </h3>
                    <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                      Bypasses tedious question-by-question manual form typing. Download this ready-to-import spreadsheet and upload it directly via iGOT&apos;s native &ldquo;<strong>Upload Questions via CSV</strong>&rdquo; button in 2 clicks.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      onClick={handleDownloadCsv}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '8px 16px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <Download size={15} />
                      <span>Download iGOT CSV</span>
                    </button>
                    <button
                      onClick={handleDownloadAiken}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                    >
                      <FileText size={15} />
                      <span>Aiken Format (.txt)</span>
                    </button>
                    <button
                      onClick={() => copyToClipboard(generateIGotBulkCsv(quiz), 'csv_raw')}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '8px 12px' }}
                    >
                      {copiedKey === 'csv_raw' ? <Check size={15} color="#22c55e" /> : <Copy size={15} />}
                      <span>{copiedKey === 'csv_raw' ? 'Copied CSV' : 'Copy CSV'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Template Schema Preview Table */}
              <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  CSV Ingestion Preview ({quiz.questions?.length || 0} Questions Pre-Formatted)
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  Compatible with iGOT Karmayogi v4.2+ & Sunbird LMS
                </span>
              </div>

              <div style={{
                overflowX: 'auto',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)'
              }}>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-secondary)' }}>#</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Question Text</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Key</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Competency Code</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Bloom&apos;s Level</th>
                      <th style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-secondary)' }}>Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(quiz.questions || []).map((q, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                          Q{idx + 1}
                        </td>
                        <td style={{ padding: '10px 12px', maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                          {q.question}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: 4,
                            background: 'var(--primary-glow)',
                            color: 'var(--primary)'
                          }}>
                            {typeof q.correctAnswer === 'number' ? String.fromCharCode(65 + q.correctAnswer) : q.correctAnswer}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: 11 }}>
                          {taxonomy.frameworkCode}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                          {taxonomy.bloomsLevel}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className={`tag ${quiz.difficulty === 'Easy' ? 'tag-easy' : quiz.difficulty === 'Hard' ? 'tag-hard' : 'tag-medium'}`} style={{ fontSize: 11 }}>
                            {quiz.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
                  <strong>Publisher Tip:</strong> On iGOT Karmayogi Course Builder, navigate to <em>Assessments → Import Questions → Choose File</em> and select this CSV.
                </p>
                <button onClick={handleSaveToVault} className="btn btn-outline btn-sm">
                  <Database size={14} />
                  <span>{vaultSaved ? 'Saved to Offline Vault!' : 'Save Draft to Staging Vault'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SMART TAG & COMPETENCY HARMONIZER */}
          {activeTab === 'tags' && (
            <div className="fade-in">
              <div style={{
                background: 'linear-gradient(135deg, rgba(240, 90, 40, 0.08) 0%, rgba(20, 24, 33, 0.4) 100%)',
                border: '1px solid rgba(240, 90, 40, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                marginBottom: 20
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                  iGOT MoSPI Taxonomy & Bulk Tag Harmonizer
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                  Solves the <em>Manual Tag Entry</em> limitation where iGOT lacks multi-tag copy-paste. All required MoSPI domain competencies, Bloom&apos;s levels, and search tags are normalized and formatted for 1-click batch insertion.
                </p>
              </div>

              {/* Taxonomy Metadata Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 20 }}>
                <div className="card" style={{ padding: 14, background: 'var(--bg-surface)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>MoSPI Domain</span>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: '4px 0 0', color: 'var(--text-primary)' }}>{taxonomy.domain}</p>
                </div>
                <div className="card" style={{ padding: 14, background: 'var(--bg-surface)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Competency Framework Code</span>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: '4px 0 0', color: 'var(--primary)', fontFamily: 'monospace' }}>{taxonomy.frameworkCode}</p>
                </div>
                <div className="card" style={{ padding: 14, background: 'var(--bg-surface)' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>MoSPI Cadre Level</span>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: '4px 0 0', color: 'var(--text-primary)' }}>{taxonomy.competencyLevel}</p>
                </div>
              </div>

              {/* Tag Chips Preview */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    Auto-Extracted Tags ({taxonomy.allTags.length} Tags)
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>Click any tag to copy individually</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 14, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  {taxonomy.allTags.map((tag, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(tag, `tag_${i}`)}
                      style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full, 9999px)',
                        fontSize: 12,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        transition: 'all 120ms ease'
                      }}
                    >
                      <span>{tag}</span>
                      {copiedKey === `tag_${i}` ? <Check size={12} color="#22c55e" /> : <Copy size={11} color="var(--text-tertiary)" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bulk Formats Copy Box */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
                <div className="card" style={{ padding: 14, background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Comma-Separated (CSV)</span>
                    <button
                      onClick={() => copyToClipboard(taxonomy.commaSeparated, 'tags_csv')}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '3px 9px', fontSize: 11.5 }}
                    >
                      {copiedKey === 'tags_csv' ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={taxonomy.commaSeparated}
                    style={{
                      width: '100%', height: 64, fontSize: 11.5,
                      background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)', borderRadius: 6, padding: 8, resize: 'none'
                    }}
                  />
                </div>

                <div className="card" style={{ padding: 14, background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Newline Separated</span>
                    <button
                      onClick={() => copyToClipboard(taxonomy.newlineSeparated, 'tags_nl')}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '3px 9px', fontSize: 11.5 }}
                    >
                      {copiedKey === 'tags_nl' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={taxonomy.newlineSeparated}
                    style={{
                      width: '100%', height: 64, fontSize: 11.5,
                      background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                      border: '1px solid var(--border)', borderRadius: 6, padding: 8, resize: 'none'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BROWSER COPILOT & BOOKMARKLET */}
          {activeTab === 'companion' && (
            <div className="fade-in">
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(20, 24, 33, 0.4) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                marginBottom: 20
              }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                  Pariksha iGOT Publisher Companion (Client-Side Session Copilot)
                </h3>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Solves the <em>Lack of Upload Automation</em> and <em>No Back-End Control</em> bottlenecks. Because you operate under a reviewer/publisher role with no server access, this assistive tool runs safely <strong>inside your authenticated browser tab on iGOT Karmayogi</strong>.
                </p>
              </div>

              {/* Zero-Install Bookmarklet Card */}
              <div className="card mb-5" style={{ padding: 18, background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--primary)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Bookmark size={18} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                      Zero-Install Publisher Bookmarklet
                    </h4>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                      Drag this pill to your browser bookmarks bar. Works in Chrome, Edge, Safari, Firefox.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: 14,
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px dashed var(--primary)',
                  marginBottom: 14,
                  flexWrap: 'wrap'
                }}>
                  <a
                    href={bookmarkletCode}
                    onClick={(e) => {
                      if (!e.defaultPrevented) {
                        alert('To install: Drag this button to your Bookmarks Toolbar! Then click it whenever you are on igotkarmayogi.gov.in');
                        e.preventDefault();
                      }
                    }}
                    className="btn btn-primary"
                    style={{
                      padding: '8px 18px',
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'grab',
                      boxShadow: '0 4px 12px var(--primary-glow)'
                    }}
                    title="Drag me to your Bookmarks Bar!"
                  >
                    Pariksha iGOT Companion
                  </a>

                  <div style={{ flex: 1, minWidth: 200, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <strong>Drag this button</strong> to your Bookmarks Bar.
                    When you are on any iGOT course or quiz editing page, click it to open a floating auto-injector widget!
                  </div>

                  <button
                    onClick={() => copyToClipboard(bookmarkletCode, 'bmark_code')}
                    className="btn btn-outline btn-sm"
                  >
                    {copiedKey === 'bmark_code' ? 'Code Copied!' : 'Copy Code Snippet'}
                  </button>
                </div>

                {/* Step-by-step workflow */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                  <div style={{ padding: 10, background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}>STEP 1</span>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Drag bookmarklet to your browser bookmarks bar.</p>
                  </div>
                  <div style={{ padding: 10, background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}>STEP 2</span>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Login to <strong>igotkarmayogi.gov.in</strong> publisher workspace.</p>
                  </div>
                  <div style={{ padding: 10, background: 'var(--bg-card)', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}>STEP 3</span>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>Click the bookmarklet to inject all {taxonomy.allTags.length} tags with 1 click.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SPEED-PASTE MANUAL FALLBACK */}
          {activeTab === 'speedpaste' && currentQ && (
            <div className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Rapid Speed-Paste Assistant (Question {activeQIndex + 1} of {quiz.questions?.length || 0})
                  </h3>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                    Click individual fields to copy. Use arrow keys to step through questions without leaving the flow.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    disabled={activeQIndex === 0}
                    onClick={() => setActiveQIndex(i => Math.max(0, i - 1))}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '5px 10px' }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: '0 6px', color: 'var(--text-secondary)' }}>
                    {activeQIndex + 1} / {quiz.questions?.length || 0}
                  </span>
                  <button
                    disabled={activeQIndex >= (quiz.questions?.length || 1) - 1}
                    onClick={() => setActiveQIndex(i => Math.min((quiz.questions?.length || 1) - 1, i + 1))}
                    className="btn btn-primary btn-sm"
                    style={{ padding: '5px 12px' }}
                  >
                    Next Question
                  </button>
                </div>
              </div>

              {/* Question Box with Copy Target */}
              <div className="card mb-4" style={{ padding: 16, background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Question Prompt
                  </span>
                  <button
                    onClick={() => handleCopyQPart(currentQ.question, 'qtext')}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '3px 8px', fontSize: 11 }}
                  >
                    {copiedQElements[`${activeQIndex}_qtext`] ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                    <span>{copiedQElements[`${activeQIndex}_qtext`] ? 'Copied Prompt' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.45 }}>
                  {currentQ.question}
                </p>
              </div>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10, marginBottom: 16 }}>
                {(currentQ.options || []).map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isCorrect = optIdx === currentQ.correctAnswer;
                  const isCopied = copiedQElements[`${activeQIndex}_opt_${optIdx}`];
                  return (
                    <div
                      key={optIdx}
                      className="card"
                      style={{
                        padding: 12,
                        background: isCorrect ? 'var(--success-bg, rgba(34, 197, 94, 0.08))' : 'var(--bg-surface)',
                        border: isCorrect ? '1px solid var(--success, #22c55e)' : '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 8
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: isCorrect ? 'var(--success)' : 'var(--text-tertiary)' }}>
                          Option ({letter}) {isCorrect && '(Correct)'}
                        </span>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {opt}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyQPart(opt, `opt_${optIdx}`)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: 4 }}
                        title={`Copy Option ${letter}`}
                      >
                        {isCopied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {currentQ.explanation && (
                <div className="card mb-4" style={{ padding: 14, background: 'var(--bg-surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      Evaluator Explanation & Citation
                    </span>
                    <button
                      onClick={() => handleCopyQPart(currentQ.explanation, 'expl')}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '2px 8px', fontSize: 11 }}
                    >
                      {copiedQElements[`${activeQIndex}_expl`] ? <Check size={12} color="#22c55e" /> : <Copy size={12} />}
                      <span>{copiedQElements[`${activeQIndex}_expl`] ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PRE-FLIGHT VALIDATION & OFFLINE VAULT */}
          {activeTab === 'validator' && (
            <div className="fade-in">
              <div style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(20, 24, 33, 0.4) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px 20px',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
                      Pre-Flight Zero-Trust Validation & Resilience Vault
                    </h3>
                    <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                      Guarantees 0% rejection rate from iGOT&apos;s strict backend schema and prevents draft loss during portal downtime.
                    </p>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    background: validation.isValid ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1.5px solid ${validation.isValid ? '#22c55e' : '#ef4444'}`,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: validation.isValid ? '#22c55e' : '#ef4444', lineHeight: 1 }}>
                      {validation.score}/100
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: validation.isValid ? '#22c55e' : '#ef4444' }}>
                      Schema Score
                    </span>
                  </div>
                </div>
              </div>

              {/* CBC Psychometric Quality Index (PQI) Seal */}
              <div className="card mb-5" style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(34, 197, 94, 0.08) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: pqi.color, color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, fontSize: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                    }}>
                      {pqi.grade}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                          CBC Psychometric Quality Index (PQI)
                        </h4>
                        <span style={{
                          fontSize: 10, fontWeight: 800, padding: '2px 7px',
                          borderRadius: 4, background: pqi.color, color: '#fff', textTransform: 'uppercase'
                        }}>
                          {pqi.seal}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '3px 0 0' }}>
                        Distractor plausibility verified • Double-negatives scanned • MoSPI circular citations certified
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 14 }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>PQI Rating</span>
                      <div style={{ fontSize: 18, fontWeight: 900, color: pqi.color }}>{pqi.pqiScore}/100</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>High-Caliber Items</span>
                      <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>{pqi.highQualityItems}/{pqi.totalItems}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validation Checklist */}
              <div className="card mb-5" style={{ padding: 18, background: 'var(--bg-surface)' }}>
                <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                  Automated Pre-Flight Inspection Findings
                </h4>

                {validation.issues.length === 0 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'rgba(34, 197, 94, 0.1)', borderRadius: 8 }}>
                    <CheckCircle2 size={18} color="#22c55e" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>
                      All questions passed strict iGOT Karmayogi validation! Zero errors, character limits verified, and answer keys aligned.
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {validation.issues.map((issue, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: 10,
                          borderRadius: 8,
                          background: issue.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          border: `1px solid ${issue.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10
                        }}
                      >
                        <AlertTriangle size={16} color={issue.type === 'error' ? '#ef4444' : '#f59e0b'} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ fontSize: 12.5, lineHeight: 1.4 }}>
                          <strong style={{ color: issue.type === 'error' ? '#ef4444' : '#f59e0b' }}>
                            {issue.message}
                          </strong>
                          <p style={{ margin: '2px 0 0', color: 'var(--text-tertiary)' }}>
                            Resolution: {issue.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Offline Staging Vault Controls */}
              <div className="card" style={{ padding: 18, background: 'var(--bg-surface)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Local Staging Vault Status
                    </h4>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: '2px 0 0' }}>
                      Persists drafts in your local browser even if the government server disconnects.
                    </p>
                  </div>
                  <button onClick={handleSaveToVault} className="btn btn-primary btn-sm">
                    <Database size={14} />
                    <span>{vaultSaved ? 'Saved to Vault!' : 'Save Current Snapshot'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              Official MoSPI Cadre Publishing Toolkit • SIH26101
            </span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={handleDownloadCsv}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 16px', fontWeight: 700 }}
            >
              <Download size={14} /> Download iGOT CSV
            </button>
            <button
              onClick={onClose}
              className="btn btn-outline btn-sm"
              style={{ padding: '8px 14px' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
