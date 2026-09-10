'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight, BookOpen, Brain, Database, Zap, Target,
  Sparkles, Play, ChevronDown, ChevronUp, CheckCircle2,
  TrendingUp, BarChart3, FileQuestion, GraduationCap, Award
} from 'lucide-react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useApp } from '@/context/AppContext';
import { skills } from '@/data/mockData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function DashboardPage() {
  const {
    currentUser,
    gapData,
    quizHistory,
    theme,
    setShowGuideModal,
    getSkillDecayStatus,
    refreshSkill,
    decaySimulationDays,
    setDecaySimulationDays,
  } = useApp();

  const [animateIn, setAnimateIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDecayEngine, setShowDecayEngine] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
    const checkWidth = () => setIsMobile(window.innerWidth < 640);
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const completedModules = quizHistory.length;
  const isDayZero = quizHistory.length === 0;
  const isLight = theme === 'light';
  const textColor = isLight ? '#0f172a' : '#f5f0eb';
  const textMuted = isLight ? '#64748b' : '#9a938c';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(58, 53, 48, 0.5)';
  const tooltipBg = isLight ? '#ffffff' : '#282420';
  const tooltipTitle = isLight ? '#0f172a' : '#f5f0eb';
  const tooltipBody = isLight ? '#475569' : '#9a938c';
  const tooltipBorder = isLight ? '#e2e8f0' : '#3a3530';

  const topGapSkill = gapData?.gapList?.[0] || null;

  const shortSkillMap = {
    "Survey Design": "Survey",
    "GIS & Spatial Analysis": "GIS & Spatial",
    "Data Science & Analytics": "Data Science",
    "AI & Machine Learning": "AI & ML",
    "Statistical Methods": "Stats Methods",
    "Data Governance": "Governance"
  };

  const radarLabels = skills.map(s => isMobile ? (shortSkillMap[s] || s) : s);

  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Current Level',
        data: skills.map(s => gapData.gaps[s]?.current || 0),
        backgroundColor: 'rgba(240, 90, 40, 0.25)',
        borderColor: '#f05a28',
        borderWidth: 2.5,
        pointBackgroundColor: '#f05a28',
        pointBorderColor: isLight ? '#ffffff' : '#fff',
        pointBorderWidth: 2,
        pointRadius: isMobile ? 3 : 5,
        pointHoverRadius: 7,
      },
      {
        label: 'Target Requirement',
        data: skills.map(s => gapData.gaps[s]?.required || 0),
        backgroundColor: isLight ? 'rgba(100, 116, 139, 0.08)' : 'rgba(154, 147, 140, 0.08)',
        borderColor: isLight ? '#64748b' : '#9a938c',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: isLight ? '#64748b' : '#9a938c',
        pointBorderColor: '#fff',
        pointBorderWidth: 1,
        pointRadius: isMobile ? 3 : 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          color: textMuted,
          backdropColor: 'transparent',
          font: { size: isMobile ? 9 : 10 }
        },
        pointLabels: {
          color: textColor,
          font: { size: isMobile ? 10 : 12, weight: '700' },
        },
        grid: { color: gridColor },
        angleLines: { color: gridColor },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textMuted,
          padding: 14,
          usePointStyle: true,
          font: { size: 11, weight: '600' },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipTitle,
        bodyColor: tooltipBody,
        borderColor: tooltipBorder,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className={animateIn ? 'fade-in' : ''} style={{ maxWidth: 1180, margin: '0 auto' }}>
      {/* 1. Welcoming Hero Bar */}
      <div className="card mb-6" style={{
        padding: '24px 28px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="hero-greeting" style={{ margin: 0 }}>
                {isDayZero ? `Welcome, ${currentUser.name}` : `Namaste, ${currentUser.name.split(' ')[0]}`}
              </span>
              <span className="tag tag-priority" style={{ fontSize: 11 }}>
                {currentUser.role}
              </span>
              {isDayZero && (
                <span className="tag" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', fontSize: 10 }}>
                  Day 0 Baseline
                </span>
              )}
            </div>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {isDayZero ? 'Calibrate Your Statistical Competencies' : 'Your Competency Command Center'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, margin: '6px 0 0', maxWidth: 620, lineHeight: 1.5 }}>
              {isDayZero
                ? 'Answer diagnostic questions to calibrate your radar chart and generate personalized iGOT Karmayogi learning pathways.'
                : `You've completed ${completedModules} assessment${completedModules === 1 ? '' : 's'}. Track your skill calibration, take 2-minute refreshers, and close competency deficits.`}
            </p>
          </div>

          {/* Officer Quick Stats Pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              textAlign: 'center',
              minWidth: 90
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>OVERALL</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)' }}>
                {gapData.overallScore}%
              </div>
            </div>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              textAlign: 'center',
              minWidth: 90
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>XP EARNED</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>
                {currentUser.xp.toLocaleString()}
              </div>
            </div>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              textAlign: 'center',
              minWidth: 90
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>STREAK</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)' }}>
                {currentUser.streak}d 🔥
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Next Recommended Action Card (Clear single priority) */}
      <div className="card mb-6" style={{
        background: isDayZero
          ? 'linear-gradient(135deg, rgba(240, 90, 40, 0.08) 0%, var(--bg-card) 100%)'
          : 'var(--bg-card)',
        border: '1.5px solid var(--primary)',
        padding: '18px 22px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
            <div style={{
              width: 48, height: 48,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--primary-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0
            }}>
              {isDayZero ? <Target size={24} /> : <Zap size={24} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span className="tag tag-priority" style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800 }}>
                  {isDayZero ? 'Next Recommended Step' : 'Priority Action'}
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>• ~5 min</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {isDayZero
                  ? 'Take Your 5-Minute Baseline Diagnostic Quiz'
                  : `Target Largest Skill Deficit: ${topGapSkill?.skill || 'Statistical Methods'}`}
              </h3>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0', lineHeight: 1.4 }}>
                {isDayZero
                  ? 'Calibrate all 6 statistical competencies and unlock personalized recommendations based on your actual score.'
                  : `Current rating: ${topGapSkill?.current || 0}/100. Target required: ${topGapSkill?.required || 60}. Earn +150 XP.`}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link
              href={isDayZero ? '/quiz/quiz-1' : '/quiz'}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}
            >
              <Play size={16} />
              {isDayZero ? 'Start 1st Assessment' : 'Take Diagnostic'}
            </Link>
            <Link
              href="/recommendations"
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
            >
              <GraduationCap size={15} /> Explore Courses
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Competency Radar & Gap Status */}
      <div className="card mb-6" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Competency Radar & Target Benchmarks
            </h3>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Orange area shows your evaluated rating; dashed outline represents target proficiency for your cadre.
            </p>
          </div>
          {isDayZero && (
            <span className="tag tag-priority" style={{ fontSize: 11 }}>
              Baseline Calibrating
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.1fr 1fr', gap: 24, alignItems: 'center' }}>
          {/* Radar Chart */}
          <div style={{ height: 320, position: 'relative' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>

          {/* Skill Breakdown List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {skills.map((s) => {
              const current = gapData.gaps[s]?.current || 0;
              const required = gapData.gaps[s]?.required || 60;
              const isMet = current >= required;
              const gap = required - current;

              return (
                <div key={s} style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: isMet ? 'var(--success)' : 'var(--primary)' }}>
                        {current}/100 <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>req {required}</span>
                      </span>
                    </div>
                    <div className="progress-bar-track" style={{ height: 6 }}>
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(100, current)}%`,
                          background: isMet ? 'var(--success)' : 'var(--primary)',
                          height: '100%'
                        }}
                      />
                    </div>
                  </div>

                  <span className={`tag ${isMet ? 'tag-easy' : 'tag-priority'}`} style={{ fontSize: 10.5, flexShrink: 0 }}>
                    {isMet ? 'Target Met' : `Gap: -${gap}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Quick Actions Grid — 4 Large Tap-Friendly Cards */}
      <div className="mb-6">
        <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
          Quick Action Hub
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {/* Card 1: Take Assessment */}
          <Link
            href="/quiz"
            className="card"
            style={{
              padding: 20,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{
                width: 42, height: 42, borderRadius: 'var(--radius-md)',
                background: 'rgba(240, 90, 40, 0.12)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
              }}>
                <FileQuestion size={22} />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Take Assessment
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Diagnostic MCQs, scenario drills, and competency tests with instant grading.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: 'var(--primary)', fontSize: 12.5, fontWeight: 600 }}>
              <span>Browse Quizzes</span> <ArrowUpRight size={14} />
            </div>
          </Link>

          {/* Card 2: Recommended Courses */}
          <Link
            href="/recommendations"
            className="card"
            style={{
              padding: 20,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{
                width: 42, height: 42, borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.12)', color: '#10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
              }}>
                <GraduationCap size={22} />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Learning Hub
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Personalized iGOT courses, 2-minute micro-drills, and practical labs.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#10b981', fontSize: 12.5, fontWeight: 600 }}>
              <span>View Courses</span> <ArrowUpRight size={14} />
            </div>
          </Link>

          {/* Card 3: AI Quiz Generator */}
          <Link
            href="/quiz-generator"
            className="card"
            style={{
              padding: 20,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{
                width: 42, height: 42, borderRadius: 'var(--radius-md)',
                background: 'rgba(99, 102, 241, 0.12)', color: '#6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
              }}>
                <Sparkles size={22} />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Generate Quiz from PDF
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Upload official circulars or survey manuals to generate assessments in seconds.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#6366f1', fontSize: 12.5, fontWeight: 600 }}>
              <span>Open Generator</span> <ArrowUpRight size={14} />
            </div>
          </Link>

          {/* Card 4: Cadre Analytics */}
          <Link
            href="/admin"
            className="card"
            style={{
              padding: 20,
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease',
              cursor: 'pointer'
            }}
          >
            <div>
              <div style={{
                width: 42, height: 42, borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
              }}>
                <BarChart3 size={22} />
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Cadre Heatmap
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Admin department-wide competency heatmaps and training demand analytics.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, color: '#f59e0b', fontSize: 12.5, fontWeight: 600 }}>
              <span>View Analytics</span> <ArrowUpRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      {/* 5. Competency Freshness & Forgetting Curve (Collapsible for Clean UX) */}
      <div className="card mb-6" style={{ padding: '16px 22px', background: 'var(--bg-surface)' }}>
        <div
          onClick={() => setShowDecayEngine(!showDecayEngine)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Zap size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <h4 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Skill Freshness & Forgetting Curve Engine
              </h4>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                {showDecayEngine ? 'Simulating Ebbinghaus retention model' : 'Click to inspect skill retention model & live inactivity decay simulator'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {showDecayEngine ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{showDecayEngine ? 'Hide' : 'Expand Simulator'}</span>
          </button>
        </div>

        {showDecayEngine && (
          <div className="fade-in" style={{ marginTop: 18, borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
            {/* Slider */}
            <div style={{ background: 'var(--bg-elevated)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 16, border: '1px solid var(--border-light)' }}>
              <div className="flex-between" style={{ fontSize: 12, marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  ⏳ Inactivity Decay Simulator: <strong>{decaySimulationDays} days elapsed</strong>
                </span>
                <span style={{ color: 'var(--text-tertiary)' }}>
                  Slide to test live Ebbinghaus decay
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={7}
                value={decaySimulationDays}
                onChange={(e) => setDecaySimulationDays(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
              <div className="flex-between" style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 4 }}>
                <span>0 Days (Active)</span>
                <span>14 Days (Grace Period)</span>
                <span>30 Days (Fading)</span>
                <span>60+ Days (High Risk)</span>
              </div>
            </div>

            {/* Skill Freshness Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
              {skills.map(s => {
                const dec = getSkillDecayStatus(s);
                return (
                  <div
                    key={s}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card)',
                      border: dec.status === 'at_risk' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{s}</span>
                        <span className={`decay-badge ${dec.status}`} style={{ fontSize: 9 }}>
                          {dec.status === 'fresh' ? 'Fresh' : dec.status === 'fading' ? `-${dec.decayPct}%` : `-${dec.decayPct}% Risk`}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                        Score: {dec.effectiveScore}% ({dec.daysInactive}d inactive)
                      </span>
                    </div>

                    <button
                      onClick={() => refreshSkill(s)}
                      className="refresher-btn"
                      title="Take quick 1-click drill to restore skill"
                    >
                      ⚡ Refresh
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
