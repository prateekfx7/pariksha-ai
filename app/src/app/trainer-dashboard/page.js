'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Users, Award, BarChart3, AlertTriangle, CheckCircle2, ShieldCheck,
  FileSpreadsheet, Sparkles, Download, ArrowRight, Clock, BookOpen,
  Filter, Search, Check, X, RefreshCw, Send, SlidersHorizontal,
  ChevronRight, ExternalLink, HelpCircle
} from 'lucide-react';
import { IGOT_TOPIC_BANKS, generateQuestionBankForTopic } from '@/lib/igotQuestionBanks';
import { CIVIL_SERVICE_ROLES, SUBJECT_DOMAINS, RAW_IGOT_COURSES, CATALOG_STATS } from '@/lib/coursesCatalog';

export default function TrainerDashboardPage() {
  // Active Tab: 'cohorts' | 'bank_generator' | 'sme_review' | 'curriculum_assign'
  const [activeTab, setActiveTab] = useState('cohorts');

  // Cohort States
  const [cohorts, setCohorts] = useState([
    {
      id: 'c-101',
      name: 'SSS 42nd Batch (JSO & SSO Induction)',
      ministry: 'MoSPI / Subordinate Statistical Service',
      enrolled: 184,
      completedCount: 142,
      completionRate: 77,
      status: 'Warning',
      bottleneckModule: 'Multi-Stage Sampling & Multipliers (NSS 80th Round)',
      dropoutRisk: 'Medium',
      assignedCurriculum: 'Official Statistics Core & GFR 2024 Mandate',
      lastActive: '12 mins ago'
    },
    {
      id: 'c-102',
      name: 'ISS Probationers 2024 (Grade IV Foundation)',
      ministry: 'NSSTA Greater Noida / MoSPI',
      enrolled: 48,
      completedCount: 45,
      completionRate: 94,
      status: 'Healthy',
      bottleneckModule: 'None - Ahead of Schedule',
      dropoutRisk: 'Low',
      assignedCurriculum: 'National Accounts SNA 2008 & Econometrics',
      lastActive: '3 mins ago'
    },
    {
      id: 'c-103',
      name: 'Central Secretariat CSS Section Officers Batch 19',
      ministry: 'DoPT / ISTM New Delhi',
      enrolled: 312,
      completedCount: 172,
      completionRate: 55,
      status: 'Critical Alert',
      bottleneckModule: 'GFR 2024 Rule 149 & GeM Reverse Bidding Thresholds',
      dropoutRisk: 'High',
      assignedCurriculum: 'CSMOP 16th Ed & Public Procurement Mastery',
      lastActive: '1 hour ago'
    },
    {
      id: 'c-104',
      name: 'Aspirational District Planning Officers (DPDOs)',
      ministry: 'NITI Aayog & State Planning Boards',
      enrolled: 112,
      completedCount: 92,
      completionRate: 82,
      status: 'Healthy',
      bottleneckModule: 'SDG Delta Saturation Indices',
      dropoutRisk: 'Low',
      assignedCurriculum: 'Evidence-Based Planning & Outcome Budgeting',
      lastActive: '28 mins ago'
    }
  ]);

  const [notification, setNotification] = useState(null);

  // Bank Generator States (Volume 50 to 250)
  const [selectedTopic, setSelectedTopic] = useState('Conduct & Ethics');
  const [targetVolume, setTargetVolume] = useState(50);
  const [isHotsMode, setIsHotsMode] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState('mixed');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // SME Human-In-The-Loop Review Queue States
  const [reviewQueue, setReviewQueue] = useState([
    {
      id: 'rev-201',
      topic: 'Conduct & Ethics',
      question: 'Under Rule 13 of CCS (Conduct) Rules 1964 as amended in 2019, what is the reporting threshold for gifts from relatives on ceremonial occasions for Group A officers?',
      options: ['Exceeding ₹25,000', 'Exceeding ₹5,000', 'Exceeding ₹10,000', 'Exceeding ₹1,500'],
      correctAnswer: 0,
      bloomLevel: 'Analyzing (HOTS)',
      complianceStatus: 'GFR 2024 / DoPT 2019 Verified',
      similarityScore: '0.04 (Unique)',
      status: 'pending' // 'approved' | 'rejected' | 'pending'
    },
    {
      id: 'rev-202',
      topic: 'Administrative Skills',
      question: 'Under CSMOP 16th Edition, which colour of note sheet is designated strictly for recording Routine or Inter-Departmental Notes?',
      options: ['White Note Sheet', 'Green Note Sheet', 'Yellow Note Sheet', 'Pink Note Sheet'],
      correctAnswer: 0,
      bloomLevel: 'Understanding',
      complianceStatus: 'CSMOP 16th Ed Compliant',
      similarityScore: '0.08 (Unique)',
      status: 'pending'
    },
    {
      id: 'rev-203',
      topic: 'Governance & Policy',
      question: 'Under GFR 2024 Rule 149, which procurement platform is statutorily mandatory for all Central Ministries for common-use goods and services?',
      options: ['Government e-Marketplace (GeM)', 'Central Public Procurement Portal (CPPP)', 'State Nodal Portal', 'Physical Tender Box'],
      correctAnswer: 0,
      bloomLevel: 'Evaluating (HOTS)',
      complianceStatus: 'GFR 2024 Rule 149 Verified',
      similarityScore: '0.02 (Unique)',
      status: 'pending'
    },
    {
      id: 'rev-204',
      topic: 'Sector-Specific (MoSPI)',
      question: 'Which method does MoSPI mandate to calculate constant price GVA to eliminate distorted deflator spikes during energy shocks?',
      options: ['Double Deflation Method', 'Single Price Deflation', 'Simple Unweighted Mean', 'Direct Volume Extrapolation'],
      correctAnswer: 0,
      bloomLevel: 'Analyzing (HOTS)',
      complianceStatus: 'MoSPI NAD 2024 Standards',
      similarityScore: '0.05 (Unique)',
      status: 'pending'
    }
  ]);

  // Curriculum Assigner State
  const [selectedCohortForAssign, setSelectedCohortForAssign] = useState(cohorts[0].id);
  const [selectedRoleForAssign, setSelectedRoleForAssign] = useState('jso');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  // Dispatch Remedial Drill
  const handleDispatchRemedial = (cohortName) => {
    setNotification(`Remedial 10-minute micro-drill dispatched to ${cohortName} officers via iGOT push notifications.`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Generate Questions
  const handleGenerateHighVolume = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const questions = generateQuestionBankForTopic(selectedTopic, targetVolume, isHotsMode, difficultyFilter);
      setGeneratedQuestions(questions);
      setIsGenerating(false);
      setNotification(`Successfully generated ${questions.length} questions for ${selectedTopic} compliant with DoPT/MoSPI standards.`);
      setTimeout(() => setNotification(null), 4000);
    }, 600);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (generatedQuestions.length === 0) return;
    const header = ['ID', 'Question', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Option Index', 'Difficulty', 'Explanation'];
    const rows = generatedQuestions.map(q => [
      q.id,
      `"${q.question.replace(/"/g, '""')}"`,
      `"${q.options[0] ? q.options[0].replace(/"/g, '""') : ''}"`,
      `"${q.options[1] ? q.options[1].replace(/"/g, '""') : ''}"`,
      `"${q.options[2] ? q.options[2].replace(/"/g, '""') : ''}"`,
      `"${q.options[3] ? q.options[3].replace(/"/g, '""') : ''}"`,
      q.correctAnswer,
      q.difficulty,
      `"${(q.explanation || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pariksha_ai_igot_bank_${selectedTopic.toLowerCase().replace(/\s+/g, '_')}_${generatedQuestions.length}q.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Push generated questions to SME Review
  const handlePushToSmeReview = () => {
    if (generatedQuestions.length === 0) return;
    const itemsToAdd = generatedQuestions.slice(0, 10).map((q, idx) => ({
      id: `batch-${Date.now()}-${idx}`,
      topic: selectedTopic,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      bloomLevel: q.isHOTS ? 'Analyzing (HOTS)' : 'Understanding',
      complianceStatus: 'Statutory Standards Vetted',
      similarityScore: '0.03 (Unique)',
      status: 'pending'
    }));
    setReviewQueue(prev => [...itemsToAdd, ...prev]);
    setActiveTab('sme_review');
    setNotification(`Pushed ${itemsToAdd.length} high-priority questions to the SME Review Queue.`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Approve / Reject in SME Review
  const handleReviewAction = (id, newStatus) => {
    setReviewQueue(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
  };

  // Assign Curriculum
  const handleAssignCurriculum = () => {
    setAssignedSuccess(true);
    setNotification('Curriculum successfully mapped and synchronized with the iGOT Karmayogi batch roster.');
    setTimeout(() => {
      setAssignedSuccess(false);
      setNotification(null);
    }, 4000);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', paddingBottom: 60 }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'var(--primary)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13.5,
          fontWeight: 600
        }}>
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Banner & Context Header */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="tag tag-priority" style={{ fontSize: 11 }}>
                <ShieldCheck size={12} /> Capacity Building Commission (CBC)
              </span>
              <span className="tag tag-easy" style={{ fontSize: 11 }}>
                DoPT & MoSPI Central Training Wing
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
              Trainer & SME Evaluator Command Center
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14, maxWidth: 740, lineHeight: 1.5 }}>
              Monitor civil servant batch completion telemetry, generate high-volume assessment question banks (50 to 250 items), and vet items through the Human-in-the-Loop SME Review Workbench.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              href="/admin/content-audit"
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
            >
              <SlidersHorizontal size={15} /> Regulatory Audit
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13 }}
            >
              Learner View <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Telemetry Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16,
          marginTop: 24,
          paddingTop: 20,
          borderTop: '1px solid var(--border)'
        }}>
          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
              Active Officer Cohorts
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>
              656 <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Enrolled (4 Batches)</span>
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
              Average Completion Rate
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--success)' }}>
              81.4% <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Target: 75%</span>
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
              Critical Drop-Off Warning
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#f59e0b' }}>
              1 Batch <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>CSS Section Officers</span>
            </div>
          </div>

          <div style={{ padding: '12px 16px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11.5, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
              iGOT Course Library
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
              {CATALOG_STATS.totalCourses.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Courses Aligned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border)',
        marginBottom: 24,
        overflowX: 'auto',
        paddingBottom: 2
      }}>
        <button
          onClick={() => setActiveTab('cohorts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'cohorts' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'cohorts' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Users size={16} /> Cohort Telemetry & Drop-Offs
        </button>

        <button
          onClick={() => setActiveTab('bank_generator')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'bank_generator' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'bank_generator' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Sparkles size={16} /> High-Volume Bank Generator (50-250 Qs)
        </button>

        <button
          onClick={() => setActiveTab('sme_review')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'sme_review' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'sme_review' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <ShieldCheck size={16} /> SME Review Workbench
          <span style={{
            fontSize: 11,
            padding: '1px 7px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary)',
            color: '#fff'
          }}>
            {reviewQueue.filter(r => r.status === 'pending').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('curriculum_assign')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'curriculum_assign' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'curriculum_assign' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <BookOpen size={16} /> 5,500+ Course Assigner
        </button>
      </div>

      {/* TAB 1: Cohort Telemetry & Drop-Off Alerts */}
      {activeTab === 'cohorts' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Civil Service Batch Telemetry</h2>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                Real-time completion tracking with predictive bottleneck detection
              </p>
            </div>
            <button
              onClick={() => {
                setNotification('Synced live telemetry with DoPT / iGOT Karmayogi API.');
                setTimeout(() => setNotification(null), 3000);
              }}
              className="btn btn-outline"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}
            >
              <RefreshCw size={13} /> Refresh Sync
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
            {cohorts.map(cohort => {
              const isCritical = cohort.status === 'Critical Alert';
              const isWarning = cohort.status === 'Warning';
              return (
                <div
                  key={cohort.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: isCritical ? '1px solid rgba(239, 68, 68, 0.4)' : isWarning ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 20,
                    boxShadow: isCritical ? '0 4px 20px rgba(239, 68, 68, 0.08)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {cohort.ministry}
                      </span>
                      <span className={`tag ${isCritical ? 'tag-hard' : isWarning ? 'tag-medium' : 'tag-easy'}`} style={{ fontSize: 11 }}>
                        {isCritical && <AlertTriangle size={11} />}
                        {cohort.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                      {cohort.name}
                    </h3>
                    <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 16 }}>
                      Active Cadre Curriculum: <strong>{cohort.assignedCurriculum}</strong>
                    </div>

                    {/* Progress Indicator */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Batch Progress ({cohort.completedCount} / {cohort.enrolled} Officers)</span>
                        <span style={{ fontWeight: 800, color: isCritical ? 'var(--danger)' : isWarning ? '#f59e0b' : 'var(--success)' }}>
                          {cohort.completionRate}%
                        </span>
                      </div>
                      <div style={{ height: 8, background: 'var(--bg-card)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${cohort.completionRate}%`,
                          background: isCritical ? 'var(--danger)' : isWarning ? '#f59e0b' : 'var(--success)',
                          borderRadius: 4
                        }} />
                      </div>
                    </div>

                    {/* Bottleneck Alert Box */}
                    <div style={{
                      background: isCritical ? 'rgba(239, 68, 68, 0.06)' : isWarning ? 'rgba(245, 158, 11, 0.06)' : 'var(--bg-card)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      marginBottom: 16
                    }}>
                      <div style={{ fontWeight: 700, color: isCritical ? 'var(--danger)' : 'var(--text-primary)', marginBottom: 2 }}>
                        Identified Drop-Off Bottleneck:
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        {cohort.bottleneckModule}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => handleDispatchRemedial(cohort.name)}
                      className="btn btn-primary"
                      style={{ flex: 1, fontSize: 12.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <Send size={13} /> Dispatch Remedial Drill
                    </button>
                    <button
                      onClick={() => {
                        setNotification(`Detailed cohort attendance log exported for ${cohort.name}.`);
                        setTimeout(() => setNotification(null), 3000);
                      }}
                      className="btn btn-outline"
                      style={{ fontSize: 12.5, padding: '0 12px' }}
                      title="Export Attendance Log"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: High-Volume Bank Generator (50 to 250 Questions) */}
      {activeTab === 'bank_generator' && (
        <div>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 24,
            marginBottom: 24
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px 0' }}>
              High-Volume Question Bank Production Engine
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
              Generate 50 to 250 standardized questions per topic formatted for direct bulk upload to iGOT Karmayogi or offline print assessments.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  iGOT Assessment Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 13.5
                  }}
                >
                  {Object.keys(IGOT_TOPIC_BANKS).map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Batch Target Volume
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[25, 50, 100, 200, 250].map(vol => (
                    <button
                      key={vol}
                      type="button"
                      onClick={() => setTargetVolume(vol)}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        fontSize: 12,
                        fontWeight: 700,
                        borderRadius: 'var(--radius-md)',
                        border: targetVolume === vol ? '1px solid var(--primary)' : '1px solid var(--border)',
                        background: targetVolume === vol ? 'rgba(30, 58, 138, 0.15)' : 'var(--bg-card)',
                        color: targetVolume === vol ? 'var(--primary)' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {vol} Qs
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Cognitive Depth (Bloom's HOTS)
                </label>
                <button
                  type="button"
                  onClick={() => setIsHotsMode(!isHotsMode)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isHotsMode ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border)',
                    background: isHotsMode ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-card)',
                    color: isHotsMode ? '#8b5cf6' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer'
                  }}
                >
                  <Award size={15} />
                  {isHotsMode ? 'HOTS Scenario-Based Active' : 'Standard Knowledge Mode'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleGenerateHighVolume}
                  disabled={isGenerating}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: 42,
                    fontSize: 13.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  {isGenerating ? <RefreshCw size={15} className="spin" /> : <Sparkles size={15} />}
                  {isGenerating ? 'Generating Bank...' : `Generate ${targetVolume} Questions`}
                </button>
              </div>
            </div>

            {/* Regulatory standard indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              fontSize: 12.5,
              color: 'var(--text-secondary)'
            }}>
              <ShieldCheck size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <span>
                All questions automatically audited for <strong>GFR 2024 Rule 149</strong>, <strong>DoPT 2019 O.M.</strong>, <strong>DPDP Act 2023</strong>, and <strong>MoSPI official statistical methodologies</strong>.
              </span>
            </div>
          </div>

          {/* Generated Questions View */}
          {generatedQuestions.length > 0 && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                flexWrap: 'wrap',
                gap: 12
              }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                    Generated Bank: {generatedQuestions.length} Items ({selectedTopic})
                  </h3>
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    Ready for batch export or SME review dispatch
                  </span>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={handleExportCSV}
                    className="btn btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                  >
                    <Download size={14} /> Export iGOT CSV
                  </button>
                  <button
                    onClick={handlePushToSmeReview}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}
                  >
                    <ShieldCheck size={14} /> Send to SME Review Workbench
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {generatedQuestions.slice(0, 15).map((item, index) => (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 16
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--primary)' }}>Q{index + 1}</span>
                        {item.isHOTS && (
                          <span className="tag tag-priority" style={{ fontSize: 10 }}>HOTS Scenario</span>
                        )}
                        <span className={`tag ${item.difficulty === 'Hard' ? 'tag-hard' : item.difficulty === 'Medium' ? 'tag-medium' : 'tag-easy'}`} style={{ fontSize: 10 }}>
                          {item.difficulty}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>ID #{item.id}</span>
                    </div>

                    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                      {item.question}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 8, marginBottom: 10 }}>
                      {item.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === item.correctAnswer;
                        return (
                          <div
                            key={oIdx}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 'var(--radius-sm)',
                              border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)',
                              background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                              fontSize: 12.5,
                              color: isCorrect ? 'var(--success)' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6
                            }}
                          >
                            {isCorrect ? <Check size={13} /> : <span style={{ opacity: 0.5 }}>{String.fromCharCode(65 + oIdx)}.</span>}
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {item.explanation && (
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', borderTop: '1px dashed var(--border)', paddingTop: 8 }}>
                        <strong>Rationale:</strong> {item.explanation}
                      </div>
                    )}
                  </div>
                ))}
                {generatedQuestions.length > 15 && (
                  <div style={{ textAlign: 'center', padding: '12px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                    Showing first 15 of {generatedQuestions.length} generated items. Export CSV to view the entire bank.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SME Human-in-the-Loop Review Workbench */}
      {activeTab === 'sme_review' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Human-in-the-Loop SME Review Workbench</h2>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                Mandatory subject matter vetting before publishing assessment items to the central iGOT repository
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="tag tag-easy" style={{ fontSize: 11.5 }}>
                Approved: {reviewQueue.filter(r => r.status === 'approved').length}
              </span>
              <span className="tag tag-hard" style={{ fontSize: 11.5 }}>
                Rejected: {reviewQueue.filter(r => r.status === 'rejected').length}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviewQueue.map(item => {
              const isApproved = item.status === 'approved';
              const isRejected = item.status === 'rejected';
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: isApproved ? '1px solid rgba(16, 185, 129, 0.4)' : isRejected ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 20,
                    opacity: isRejected ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <span className="tag tag-priority" style={{ fontSize: 11 }}>{item.topic}</span>
                      <span className="tag tag-info" style={{ fontSize: 11 }}>Bloom: {item.bloomLevel}</span>
                      <span className="tag tag-easy" style={{ fontSize: 11 }}>{item.complianceStatus}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Jaccard Overlap: {item.similarityScore}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {isApproved && (
                        <span className="tag tag-easy" style={{ fontSize: 12 }}>
                          <CheckCircle2 size={13} /> Approved by SME
                        </span>
                      )}
                      {isRejected && (
                        <span className="tag tag-hard" style={{ fontSize: 12 }}>
                          <X size={13} /> Rejected
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            onClick={() => handleReviewAction(item.id, 'approved')}
                            className="btn btn-primary"
                            style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            onClick={() => handleReviewAction(item.id, 'rejected')}
                            className="btn btn-outline"
                            style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, color: 'var(--danger)' }}
                          >
                            <X size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
                    {item.question}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 8 }}>
                    {item.options.map((opt, optIndex) => {
                      const isCorrect = optIndex === item.correctAnswer;
                      return (
                        <div
                          key={optIndex}
                          style={{
                            padding: '8px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: isCorrect ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)',
                            background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-card)',
                            fontSize: 12.5,
                            color: isCorrect ? 'var(--success)' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                          }}
                        >
                          {isCorrect ? <Check size={13} /> : <span style={{ opacity: 0.5 }}>{String.fromCharCode(65 + optIndex)}.</span>}
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: 5,500+ Course Assigner */}
      {activeTab === 'curriculum_assign' && (
        <div>
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: 24,
            marginBottom: 24
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px 0' }}>
              Batch Curriculum & 5,500+ Course Assigner
            </h2>
            <p style={{ margin: '0 0 20px 0', fontSize: 13.5, color: 'var(--text-secondary)' }}>
              Select a civil service batch and assign role-tailored mandatory and elective learning pathways directly from the national Karmayogi repository.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Target Officer Cohort
                </label>
                <select
                  value={selectedCohortForAssign}
                  onChange={(e) => setSelectedCohortForAssign(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 13.5
                  }}
                >
                  {cohorts.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 6, color: 'var(--text-secondary)' }}>
                  Civil Service Cadre / Designation
                </label>
                <select
                  value={selectedRoleForAssign}
                  onChange={(e) => setSelectedRoleForAssign(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: 13.5
                  }}
                >
                  {CIVIL_SERVICE_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleAssignCurriculum}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: 42,
                    fontSize: 13.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <CheckCircle2 size={15} />
                  Assign & Sync with iGOT Roster
                </button>
              </div>
            </div>
          </div>

          {/* Available courses from 5,500+ library */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              Curated Courses for {CIVIL_SERVICE_ROLES.find(r => r.id === selectedRoleForAssign)?.title}
            </h3>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
              Total National Repository: 5,642 Accredited Courses
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 14 }}>
            {RAW_IGOT_COURSES.filter(c => c.targetRoles.includes(selectedRoleForAssign) || c.targetRoles.includes('general_admin')).map(course => (
              <div
                key={course.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{course.code}</span>
                    <span className="tag tag-priority" style={{ fontSize: 10 }}>{course.level}</span>
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    {course.title}
                  </h4>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>
                    {course.ministry}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                    {course.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {course.duration}
                  </span>
                  <span className="tag tag-easy" style={{ fontSize: 10 }}>
                    CBP Accredited
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
