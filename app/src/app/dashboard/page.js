'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Brain, Database, Shield, MessageSquare, Zap, Target, Sparkles, Play } from 'lucide-react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';
import { useApp } from '@/context/AppContext';
import { dashboardModules, currentModule, scheduledItems, skills } from '@/data/mockData';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const lessonIcons = {
  book: BookOpen,
  brain: Brain,
  database: Database,
  shield: Shield,
  message: MessageSquare,
};

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
    targetRole
  } = useApp();
  const [animateIn, setAnimateIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
        label: 'Required Level',
        data: skills.map(s => gapData.gaps[s]?.required || 0),
        backgroundColor: isLight ? 'rgba(100, 116, 139, 0.1)' : 'rgba(154, 147, 140, 0.1)',
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
          padding: 16,
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

  const gapBarData = {
    labels: isMobile ? skills.map(s => shortSkillMap[s] || s) : skills,
    datasets: [
      {
        label: 'Competency Deficit (Gap)',
        data: skills.map(s => gapData.gaps[s]?.gap || 0),
        backgroundColor: skills.map(s => {
          const gap = gapData.gaps[s]?.gap || 0;
          if (gap >= 30) return '#f05a28';
          if (gap >= 15) return '#f59e0b';
          return '#10b981';
        }),
        borderRadius: 6,
        barThickness: isMobile ? 14 : 18,
      },
    ],
  };

  const gapBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 60,
        grid: { color: isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(58, 53, 48, 0.3)' },
        ticks: { color: textMuted, font: { size: 10 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: isMobile ? 10.5 : 12, weight: '600' } },
      },
    },
    plugins: {
      legend: { display: false },
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
    <div className={animateIn ? 'fade-in' : ''}>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div>
          {isDayZero ? (
            <>
              <p className="hero-greeting">Welcome, {currentUser.name}!</p>
              <h1 className="hero-title">
                Start from Day 0<br />
                Calibrate Your Baseline<br />
                Competencies
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 16, maxWidth: 460, lineHeight: 1.5 }}>
                You begin with 0 XP and unassessed baseline skills. Complete your first diagnostic assessment to calibrate your competency radar and unlock personalized iGOT pathways.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/quiz" className="btn btn-primary">
                  Start 1st Assessment <ArrowUpRight size={16} />
                </Link>
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)' }}
                >
                  <BookOpen size={16} /> Software Guide
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="hero-greeting">Namaste, {currentUser.name.split(' ')[0]}!</p>
              <h1 className="hero-title">
                You've completed<br />
                {completedModules} assessment{completedModules === 1 ? '' : 's'}<br />
                on your journey
              </h1>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
                <Link href="/recommendations" className="btn btn-primary">
                  View Recommendations <ArrowUpRight size={16} />
                </Link>
                <button
                  onClick={() => setShowGuideModal(true)}
                  className="btn btn-outline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bg-card)' }}
                >
                  <BookOpen size={16} /> Software Guide
                </button>
              </div>
            </>
          )}
        </div>
        <div className="hero-cards">
          {dashboardModules.map((mod, i) => (
            <div key={mod.num} className="hero-module-card fade-in" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
              <span className="card-num">{mod.num}</span>
              <span className="card-title">{mod.title}</span>
              <span className="card-icon">{mod.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Best Action Card (Intuitive 1-Tap Officer Guidance) */}
      <div className="card mb-6" style={{
        background: isDayZero
          ? 'linear-gradient(135deg, rgba(240, 90, 40, 0.08) 0%, var(--bg-card) 100%)'
          : 'var(--bg-card)',
        border: '1.5px solid var(--primary)',
        padding: '14px 18px',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 240 }}>
            <div style={{
              width: 42, height: 42,
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-subtle)',
              border: '1px solid var(--primary-glow)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)',
              flexShrink: 0
            }}>
              {isDayZero ? <Target size={22} /> : <Zap size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span className="tag tag-priority" style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 800 }}>
                  {isDayZero ? 'Next Recommended Step' : 'Priority Action'}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>• ~5 min</span>
              </div>
              <h3 style={{ fontSize: 14.5, fontWeight: 700, margin: 0, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {isDayZero
                  ? 'Take Your 5-Minute Baseline Diagnostic Quiz'
                  : `Target Largest Skill Deficit: ${topGapSkill?.skill || 'Statistical Methods'}`}
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0', lineHeight: 1.4 }}>
                {isDayZero
                  ? 'Answer 5 diagnostic questions to calibrate your radar chart and unlock personalized iGOT courses.'
                  : `Current rating: ${topGapSkill?.current || 0}/100. Target required: ${topGapSkill?.required || 60}. Earn +150 XP.`}
              </p>
            </div>
          </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Link
                href={isDayZero ? '/quiz/quiz-1' : '/quiz'}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              >
                <Play size={14} />
                {isDayZero ? 'Start 1st Assessment' : 'Take Diagnostic'}
              </Link>
              <Link
                href="/micro-learning"
                className="btn btn-outline btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              >
                <Zap size={14} /> 2-Min Micro-Drill
              </Link>
              <Link
                href="/practical-tasks"
                className="btn btn-ghost btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
              >
                <Database size={14} /> Practical Lab
              </Link>
            </div>
        </div>
      </div>

      {/* Main Grid: Charts + Scheduled */}
      <div className="grid-sidebar">
        <div>
          {/* Charts Row */}
          <div className="grid-2 mb-6">
            <div className="chart-container fade-in fade-in-delay-1" style={{ position: 'relative' }}>
              <div className="flex-between mb-2">
                <h3>Competency Radar</h3>
                {isDayZero && (
                  <span className="tag tag-priority" style={{ fontSize: 10 }}>Day 0 Baseline</span>
                )}
              </div>
              <div style={{ height: 280 }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
              {isDayZero && (
                <div style={{
                  marginTop: 10,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-subtle)',
                  border: '1px solid var(--primary-glow)',
                  fontSize: 12,
                  color: 'var(--primary)',
                  textAlign: 'center'
                }}>
                  📍 Unassessed Baseline: Complete your first diagnostic quiz to calibrate your competencies.
                </div>
              )}
            </div>
            <div className="chart-container fade-in fade-in-delay-2">
              <h3>Skill Gap Analysis</h3>
              <div style={{ height: 300 }}>
                <Bar data={gapBarData} options={gapBarOptions} />
              </div>
            </div>
          </div>

          {/* Competency Freshness & Skill Decay Engine Widget */}
          <div className="card mb-6 fade-in fade-in-delay-2" style={{ padding: 22, background: 'var(--bg-surface)' }}>
            <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={18} style={{ color: 'var(--primary)' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
                    Competency Freshness & Forgetting Curve Model
                  </h3>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Unpracticed skills experience natural decay over time. Take 2-minute refreshers to maintain 100% calibration.
                </p>
              </div>
              <Link href="/micro-learning" className="btn btn-outline btn-sm">
                <Sparkles size={13} /> Launch Micro-Learning
              </Link>
            </div>

            {/* Inactivity Simulation Slider */}
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

          {/* Overall Score */}
          <div className="stats-row fade-in fade-in-delay-2">
            <div className="stat-card">
              <div className="stat-icon orange"><Brain size={22} /></div>
              <div className="stat-content">
                <h3>{gapData.overallScore}%</h3>
                <p>Overall Competency</p>
                <div className="stat-trend neutral" style={{ color: isDayZero ? 'var(--text-tertiary)' : 'var(--success)' }}>
                  {isDayZero ? '● Baseline Pending' : '↑ Calibrated'}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><BookOpen size={22} /></div>
              <div className="stat-content">
                <h3>{completedModules}</h3>
                <p>Modules Completed</p>
                <div className="stat-trend neutral" style={{ color: completedModules === 0 ? 'var(--text-tertiary)' : 'var(--success)' }}>
                  {completedModules === 0 ? '● 0 completed' : `↑ ${completedModules} done`}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><Database size={22} /></div>
              <div className="stat-content">
                <h3>{quizHistory.length}</h3>
                <p>Quizzes Taken</p>
                <div className="stat-trend neutral" style={{ color: quizHistory.length === 0 ? 'var(--text-tertiary)' : 'var(--success)' }}>
                  {quizHistory.length === 0 ? '● 0 taken' : `↑ ${quizHistory.length} taken`}
                </div>
              </div>
            </div>
          </div>

          {/* Current Module (Toko style) */}
          <div className="module-section fade-in fade-in-delay-3">
            <div className="module-header">
              <div>
                <span className="module-label">Module {currentModule.number}</span>
                <h3 className="module-title">{currentModule.title}</h3>
              </div>
              <div className="module-progress">
                <div className="progress-bar-track" style={{ width: 120 }}>
                  <div className="progress-bar-fill" style={{ width: `${currentModule.progress}%` }} />
                </div>
                <span className="module-progress-text">{currentModule.progress}%</span>
              </div>
            </div>
            <div className="lesson-list">
              {currentModule.lessons.map((lesson, i) => {
                const Icon = lessonIcons[lesson.icon] || BookOpen;
                return (
                  <Link key={i} href="/quiz" className="lesson-item" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div className="lesson-icon"><Icon size={20} /></div>
                    <div className="lesson-info">
                      <h4>{lesson.title}</h4>
                      <p>{lesson.desc}</p>
                    </div>
                    <ArrowUpRight size={16} style={{ marginLeft: 'auto', color: 'var(--text-tertiary)' }} />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scheduled Sidebar */}
        <div className="scheduled-section fade-in fade-in-delay-2">
          <div className="flex-between mb-4">
            <h3 style={{ fontStyle: 'italic' }}>Scheduled Learning</h3>
            <Link href="/recommendations" className="btn btn-ghost btn-sm">See all</Link>
          </div>

          <p className="scheduled-day-label">Today</p>
          <div className="scheduled-card">
            <h4>{scheduledItems[0].title}</h4>
            <p>{scheduledItems[0].time}</p>
            <div className="scheduled-card-footer">
              <div className="avatar-group">
                {scheduledItems[0].avatars.map((a, i) => (
                  <div key={i} className="avatar-sm" style={{
                    background: ['#f05a28', '#d44a1e', '#b83d18'][i]
                  }}>{a}</div>
                ))}
              </div>
              <span className="tag tag-group">● Group</span>
            </div>
          </div>

          <p className="scheduled-day-label">Tomorrow</p>
          {scheduledItems.slice(1).map(item => (
            <div key={item.id} className="scheduled-card">
              <h4>{item.title}</h4>
              <p>{item.time}</p>
              <div className="scheduled-card-footer">
                <span />
                <span className={`tag tag-${item.type}`}>● {item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
