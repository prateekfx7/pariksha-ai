'use client';
import { useState } from 'react';
import {
  ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw, FileText, Search,
  ArrowRight, Check, Sparkles, Filter, ExternalLink, BookOpen, Layers
} from 'lucide-react';
import { auditCourseLibrary, auditTextForOutdatedContent, REGULATORY_CIRCULARS_DB } from '@/lib/outdatedContentDetector';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

const SAMPLE_LEGACY_BANK = [
  {
    id: 'legacy-1',
    question: 'Under Rule 13 of CCS (Conduct) Rules, what is the maximum gift value a Group A officer may accept from near relatives on weddings without government sanction?',
    options: ['Rs. 5,000', 'Rs. 25,000', 'Rs. 1,000', 'Rs. 500'],
    correctAnswer: 0,
    explanation: 'Previously under CCS Conduct rules 1964, the ceiling was Rs. 5,000 for Group A officers.'
  },
  {
    id: 'legacy-2',
    question: 'According to Section 43A of the Information Technology Act and SPDI Rules 2011, what is required for sensitive personal data handling by public bodies?',
    options: ['Reasonable security practices and procedures', 'Direct transfer to third-party without audit', 'Public disclosure of server keys', 'No regulation applies to government data'],
    correctAnswer: 0,
    explanation: 'Section 43A of the Information Technology Act 2000 governed sensitive personal data before 2023.'
  },
  {
    id: 'legacy-3',
    question: 'Under GFR 2017 Rule 149, what is the monetary ceiling for direct purchase of commercial off-the-shelf goods on GeM without comparison?',
    options: ['Rs. 25,000 through any seller', 'Rs. 50,000 through any seller meeting specs', 'Rs. 2,50,000 with committee approval', 'Rs. 10,000 max'],
    correctAnswer: 0,
    explanation: 'Old GFR Rule 149 stipulated Rs. 25,000 direct purchase threshold.'
  },
  {
    id: 'legacy-4',
    question: 'Under the Persons with Disabilities (Equal Opportunities) Act 1995, how many categories of benchmark disabilities are recognized for public employment?',
    options: ['Seven categories of disability', 'Twenty-one categories of disability', 'Fourteen categories of disability', 'Five categories of disability'],
    correctAnswer: 0,
    explanation: 'The 1995 PwD Act recognized seven disability types before the 2016 overhaul.'
  },
  {
    id: 'legacy-5',
    question: 'What is the official base year series currently utilized by MoSPI for calculating Index of Industrial Production (IIP)?',
    options: ['Base Year 2011-12', 'Base Year 2004-05', 'Base Year 1993-94', 'Base Year 1980-81'],
    correctAnswer: 0,
    explanation: 'MoSPI revised the industrial series base year to 2011-12 in May 2017.'
  }
];

export default function ContentAuditPage() {
  const { generatedQuizzes } = useApp();
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'rules' | 'paste'
  const [questions, setQuestions] = useState(SAMPLE_LEGACY_BANK);
  const [pasteText, setPasteText] = useState('');
  const [auditResult, setAuditResult] = useState(() => auditCourseLibrary(SAMPLE_LEGACY_BANK));
  const [approvedItems, setApprovedItems] = useState({});
  const [modernizedItems, setModernizedItems] = useState({});

  const handleRunAudit = (bankToAudit) => {
    const res = auditCourseLibrary(bankToAudit);
    setAuditResult(res);
  };

  const handleLoadActiveQuizzes = () => {
    const allQs = generatedQuizzes.flatMap(q => q.questions || []);
    if (allQs.length > 0) {
      setQuestions(allQs);
      handleRunAudit(allQs);
    }
  };

  const handleLoadSampleLegacy = () => {
    setQuestions(SAMPLE_LEGACY_BANK);
    handleRunAudit(SAMPLE_LEGACY_BANK);
  };

  const handleScanPastedText = () => {
    if (!pasteText.trim()) return;
    const dummyItem = [{ question: pasteText, options: [], explanation: '' }];
    setQuestions(dummyItem);
    handleRunAudit(dummyItem);
  };

  const handleModernizeQuestion = (itemIndex, circularId) => {
    const circular = REGULATORY_CIRCULARS_DB.find(c => c.id === circularId);
    if (!circular) return;

    setModernizedItems(prev => ({
      ...prev,
      [itemIndex]: {
        updatedStem: `(Updated per ${circular.circularRef}) ${circular.modernProvision}`,
        citation: circular.circularRef
      }
    }));
  };

  const handleApproveItem = (itemIndex) => {
    setApprovedItems(prev => ({
      ...prev,
      [itemIndex]: true
    }));
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1100, margin: '0 auto', paddingBottom: 50 }}>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span className="tag tag-priority" style={{ fontSize: 11 }}>
              <ShieldCheck size={13} /> Mission Karmayogi Content Assurance
            </span>
            <span className="tag tag-easy" style={{ fontSize: 11 }}>
              Opportunity #4 & Problem #12
            </span>
          </div>
          <h1 className="section-title">AI Content Quality & Outdated-Content Detector</h1>
          <p className="section-subtitle">
            Continuous automated monitoring of civil service course banks against updated DoPT, GFR 2024, and statutory gazette notifications.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/admin" className="btn btn-outline btn-sm">
            Back to Analytics
          </Link>
          <Link href="/quiz-generator" className="btn btn-primary btn-sm">
            AI Generator
          </Link>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
        marginBottom: 24
      }}>
        <div className="card" style={{ padding: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Content Health Index
          </span>
          <div style={{ fontSize: 28, fontWeight: 900, color: auditResult.libraryHealthScore >= 80 ? 'var(--success)' : '#ef4444', marginTop: 4 }}>
            {auditResult.libraryHealthScore}/100
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            {auditResult.status.replace(/_/g, ' ')}
          </p>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Audited Questions / Modules
          </span>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
            {auditResult.totalAudited}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Across active question bank
          </p>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Obsolete Circulars Flagged
          </span>
          <div style={{ fontSize: 28, fontWeight: 900, color: auditResult.totalOutdatedFlags > 0 ? '#f59e0b' : 'var(--success)', marginTop: 4 }}>
            {auditResult.totalOutdatedFlags}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Need DoPT/GFR regulatory alignment
          </p>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Human SME Approvals
          </span>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6', marginTop: 4 }}>
            {Object.keys(approvedItems).length}
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
            Approved for iGOT publishing
          </p>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="card mb-6" style={{
        padding: 4, background: 'var(--bg-surface)',
        display: 'flex', gap: 6, borderRadius: 'var(--radius-lg)'
      }}>
        <button
          onClick={() => setActiveTab('audit')}
          className="btn btn-sm"
          style={{
            flex: 1,
            background: activeTab === 'audit' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'audit' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          <ShieldCheck size={14} /> Audit Results ({auditResult.flaggedItems.length} Issues)
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className="btn btn-sm"
          style={{
            flex: 1,
            background: activeTab === 'paste' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'paste' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          <FileText size={14} /> Custom Text / Syllabus Inspector
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className="btn btn-sm"
          style={{
            flex: 1,
            background: activeTab === 'rules' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'rules' ? '#fff' : 'var(--text-secondary)',
            fontWeight: 700
          }}
        >
          <BookOpen size={14} /> Regulatory Circular Knowledge Base ({REGULATORY_CIRCULARS_DB.length})
        </button>
      </div>

      {/* TAB 1: AUDIT RESULTS */}
      {activeTab === 'audit' && (
        <div>
          {/* Controls Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={handleLoadSampleLegacy} className="btn btn-outline btn-sm">
                Load Sample Legacy Civil Service Bank
              </button>
              <button onClick={handleLoadActiveQuizzes} className="btn btn-ghost btn-sm">
                Scan Active App Quizzes ({generatedQuizzes.length})
              </button>
            </div>
            <button onClick={() => handleRunAudit(questions)} className="btn btn-primary btn-sm">
              <RefreshCw size={13} /> Re-Scan Bank
            </button>
          </div>

          {auditResult.flaggedItems.length === 0 ? (
            <div className="card" style={{ padding: 36, textAlign: 'center', background: 'var(--bg-surface)' }}>
              <CheckCircle2 size={40} color="#22c55e" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                All Content Verified Compliant
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '6px auto 0', maxWidth: 460 }}>
                No obsolete rules, repealed acts, or outdated thresholds detected in this bank. Ready for publication to iGOT Karmayogi.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {auditResult.flaggedItems.map((flagged) => {
                const isApproved = approvedItems[flagged.index];
                const modernized = modernizedItems[flagged.index];

                return (
                  <div
                    key={flagged.index}
                    className="card"
                    style={{
                      padding: 18,
                      borderLeft: isApproved ? '4px solid #22c55e' : '4px solid #f59e0b',
                      background: 'var(--bg-surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: isApproved ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: isApproved ? '#22c55e' : '#f59e0b',
                        }}>
                          {isApproved ? 'SME APPROVED' : 'OUTDATED RULE DETECTED'}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)' }}>
                          Item #{flagged.index}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {!isApproved && (
                          <button
                            onClick={() => handleApproveItem(flagged.index)}
                            className="btn btn-outline btn-sm"
                            style={{ padding: '3px 10px', fontSize: 11 }}
                          >
                            <Check size={12} color="#22c55e" />
                            <span>Approve for iGOT</span>
                          </button>
                        )}
                        {isApproved && (
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={13} /> Verified by SME
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Stem */}
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 12px' }}>
                      {flagged.itemTitle}
                    </p>

                    {/* Modernized Preview if Applied */}
                    {modernized && (
                      <div style={{
                        padding: 12,
                        borderRadius: 6,
                        background: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        marginBottom: 12
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#22c55e', textTransform: 'uppercase' }}>
                          Modernized Text Draft
                        </span>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                          {modernized.updatedStem}
                        </p>
                      </div>
                    )}

                    {/* Detected Flags List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {flagged.flags.map((flag) => (
                        <div
                          key={flag.id}
                          style={{
                            padding: 12,
                            borderRadius: 6,
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)' }}>
                              {flag.title}
                            </span>
                            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                              Ref: {flag.circularRef}
                            </span>
                          </div>

                          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 6px' }}>
                            <strong>Modern Regulation:</strong> {flag.modernProvision}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                            <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>
                              <strong>Recommendation:</strong> {flag.recommendation}
                            </span>
                            {!modernized && (
                              <button
                                onClick={() => handleModernizeQuestion(flagged.index, flag.circularId)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: '2px 8px', fontSize: 11, color: 'var(--primary)' }}
                              >
                                <Sparkles size={12} /> Auto-Modernize Question
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CUSTOM TEXT INSPECTOR */}
      {activeTab === 'paste' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 8px', color: 'var(--text-primary)' }}>
            Inspect Syllabus, Rule Draft, or Course Content
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 14px' }}>
            Paste any course module text, exam question draft, or administrative instruction to verify compliance with latest circulars.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={6}
            placeholder="Paste text here (e.g., 'Group A officers are restricted to Rs. 5000 gifts under Rule 13...')"
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: 13,
              marginBottom: 12
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleScanPastedText}
              disabled={!pasteText.trim()}
              className="btn btn-primary btn-sm"
            >
              <Search size={13} /> Run Regulatory Inspection
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: REGULATORY CIRCULARS KNOWLEDGE BASE */}
      {activeTab === 'rules' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
          {REGULATORY_CIRCULARS_DB.map(circ => (
            <div key={circ.id} className="card" style={{ padding: 16, background: 'var(--bg-surface)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                {circ.category}
              </span>
              <h4 style={{ fontSize: 14, fontWeight: 800, margin: '6px 0 4px', color: 'var(--text-primary)' }}>
                {circ.title}
              </h4>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: '0 0 10px' }}>
                Official Ref: {circ.circularRef}
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                {circ.modernProvision}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
