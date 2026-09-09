'use client';
import { useState, useMemo } from 'react';
import { Target, TrendingUp, Award, CheckCircle2, AlertTriangle, ArrowRight, Shield, Zap, Sparkles, BookOpen, Layers, Printer, Play } from 'lucide-react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useApp } from '@/context/AppContext';
import { skills, requiredLevels, cadreHierarchy } from '@/data/mockData';
import Link from 'next/link';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function NextRoleReadinessPage() {
  const { currentUser, userSkills, theme, targetRole, setTargetRole } = useApp();

  const isLight = theme === 'light';
  const textColor = isLight ? '#0f172a' : '#f5f0eb';
  const textMuted = isLight ? '#64748b' : '#9a938c';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(58, 53, 48, 0.5)';
  const tooltipBg = isLight ? '#ffffff' : '#282420';

  // Available promotion target roles (Official MoSPI 7th CPC Cadre Hierarchy)
  const targetRoles = [
    "Junior Statistical Officer",
    "Senior Statistical Officer",
    "Assistant Director",
    "Deputy Director",
    "Joint Director",
    "Director",
    "Deputy Director General"
  ];

  // Benchmark required levels for target role
  const targetRequirements = requiredLevels[targetRole] || requiredLevels["Senior Statistical Officer"];
  const currentRequirements = requiredLevels[currentUser.role] || requiredLevels["Junior Statistical Officer"];

  // Calculate promotion readiness score
  const { readinessScore, skillComparisons, metCount, unmetCount } = useMemo(() => {
    let totalTarget = 0;
    let totalAchieved = 0;
    const comps = [];
    let met = 0;

    skills.forEach(skill => {
      const current = userSkills[skill] || 0;
      const targetReq = targetRequirements[skill] || 60;
      const deficit = Math.max(0, targetReq - current);
      const metStatus = current >= targetReq;
      if (metStatus) met++;

      totalTarget += targetReq;
      totalAchieved += Math.min(targetReq, current);

      comps.push({
        skill,
        current,
        target: targetReq,
        deficit,
        pct: Math.round((current / targetReq) * 100),
        isMet: metStatus
      });
    });

    comps.sort((a, b) => b.deficit - a.deficit);
    const score = Math.round((totalAchieved / totalTarget) * 100);

    return {
      readinessScore: score,
      skillComparisons: comps,
      metCount: met,
      unmetCount: skills.length - met
    };
  }, [userSkills, targetRequirements]);

  // Dual Radar data comparing Current Skills vs Target Role Requirements
  const radarData = {
    labels: skills.map(s => s.split(' ').slice(0, 2).join(' ')),
    datasets: [
      {
        label: `${currentUser.name} (Current)`,
        data: skills.map(s => userSkills[s] || 0),
        backgroundColor: 'rgba(240, 90, 40, 0.25)',
        borderColor: '#f05a28',
        borderWidth: 2.5,
        pointBackgroundColor: '#f05a28',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
      {
        label: `${targetRole} Benchmark`,
        data: skills.map(s => targetRequirements[s] || 0),
        backgroundColor: 'rgba(56, 189, 248, 0.12)',
        borderColor: '#38bdf8',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: '#38bdf8',
        pointBorderColor: '#fff',
        pointRadius: 4,
      }
    ]
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
          font: { size: 10 }
        },
        grid: { color: gridColor },
        pointLabels: {
          color: textColor,
          font: { size: 11, weight: '600' }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: textColor, font: { size: 11 } }
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: textColor,
        bodyColor: textMuted,
      }
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tag tag-priority" style={{ fontSize: 11 }}>
              <TrendingUp size={13} /> Career Cadre Progression
            </span>
            <span className="tag tag-easy" style={{ fontSize: 11 }}>
              MoSPI SSS & ISS Guidelines
            </span>
          </div>
          <h1 className="section-title">Next-Role Readiness Predictor</h1>
          <p className="section-subtitle">
            Algorithmic promotion readiness forecasting comparing your calibrated competencies against target cadre prerequisites.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handlePrintDossier} className="btn btn-outline btn-sm">
            <Printer size={14} /> Print Promotion Dossier
          </button>
        </div>
      </div>

      {/* Cadre Career Progression Track Bar */}
      <div className="card mb-6" style={{ padding: '16px 20px', background: 'var(--bg-surface)' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.5px' }}>
          Official Statistical Cadre Ladder:
        </p>
        <div className="cadre-path-bar">
          {cadreHierarchy.map((item, idx) => {
            const isCurrent = item.role === currentUser.role;
            const isTarget = item.role === targetRole;
            return (
              <div
                key={item.role}
                onClick={() => setTargetRole(item.role)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: isTarget ? 'var(--primary-glow)' : isCurrent ? 'var(--bg-elevated)' : 'transparent',
                  border: isTarget ? '1.5px solid var(--primary)' : isCurrent ? '1.5px solid var(--border)' : '1px solid transparent',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: isTarget ? 'var(--primary)' : isCurrent ? 'var(--text-secondary)' : 'var(--border-light)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700
                }}>
                  {item.rank}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: isTarget || isCurrent ? 700 : 500, margin: 0, color: isTarget ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {item.role}
                  </p>
                  <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>
                    {item.cadre} • {item.payLevel ? `${item.payLevel} • ` : ''}{isCurrent ? 'Current' : isTarget ? 'Target' : item.minExperience}
                  </span>
                </div>
                {idx < cadreHierarchy.length - 1 && (
                  <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', marginLeft: 6 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Readiness KPI Row & Dual Radar */}
      <div className="grid-2 mb-8">
        {/* Left: Animated Readiness Gauge & Status */}
        <div className="card" style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span className="tag tag-priority mb-3" style={{ alignSelf: 'center', fontSize: 11 }}>
            Target: {targetRole}
          </span>

          {/* Conic-gradient Circle Gauge */}
          <div
            className="readiness-meter-circle"
            style={{ '--readiness-pct': readinessScore }}
          >
            <span style={{ fontSize: 36, fontWeight: 800, color: readinessScore >= 80 ? 'var(--success)' : 'var(--primary)', lineHeight: 1 }}>
              {readinessScore}%
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4, fontWeight: 600 }}>
              Promotion Ready
            </span>
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
            {readinessScore >= 85 ? '🎉 Eligible for Cadre Board Review' : readinessScore >= 60 ? '⚡ In Promotion Acceleration Zone' : '📚 Core Competency Building Phase'}
          </h3>

          <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 380, margin: '0 auto 16px', lineHeight: 1.5 }}>
            {readinessScore >= 85
              ? `You satisfy the required competency benchmarks across official MoSPI standards for ${targetRole}.`
              : `You meet ${metCount} of 6 cadre prerequisites. Closing remaining gaps in ${skillComparisons[0]?.skill} will boost eligibility.`}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <div className="header-badge" style={{ fontSize: 12 }}>
              <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> {metCount} Benchmarks Met
            </div>
            <div className="header-badge" style={{ fontSize: 12 }}>
              <AlertTriangle size={14} style={{ color: 'var(--warning)' }} /> {unmetCount} Gaps Remaining
            </div>
          </div>
        </div>

        {/* Right: Comparative Dual Radar */}
        <div className="card" style={{ padding: 20 }}>
          <div className="flex-between mb-2">
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>
              Competency Overlay: Current vs Target
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>6-Axis MoSPI Radar</span>
          </div>
          <div style={{ height: 260 }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>
      </div>

      {/* Competency Gap Elimination Matrix & Roadmap */}
      <div className="card mb-6" style={{ padding: 24 }}>
        <div className="flex-between mb-4">
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>
              Cadre Benchmark Gap Elimination Roadmap
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Step-by-step action plan to reach 100% readiness for {targetRole}
            </p>
          </div>
          <span className="tag tag-easy" style={{ fontSize: 12 }}>
            Sorted by Highest Priority Deficit
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {skillComparisons.map(item => (
            <div
              key={item.skill}
              style={{
                padding: '16px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: item.isMet ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid var(--border-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 16
              }}
            >
              {/* Skill Info */}
              <div style={{ flex: '1 1 240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
                    {item.skill}
                  </h4>
                  {item.isMet ? (
                    <span className="tag tag-easy" style={{ fontSize: 11 }}>
                      ✓ Benchmark Met
                    </span>
                  ) : (
                    <span className="tag tag-priority" style={{ fontSize: 11 }}>
                      Deficit: -{item.deficit}%
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0 }}>
                  Current Score: <strong>{item.current}%</strong> • Required for {targetRole}: <strong>{item.target}%</strong>
                </p>
              </div>

              {/* Progress Bar */}
              <div style={{ flex: '1 1 200px', minWidth: 160 }}>
                <div className="flex-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span>Cadre Fulfillment</span>
                  <span style={{ fontWeight: 700 }}>{Math.min(100, item.pct)}%</span>
                </div>
                <div className="progress-bar-track" style={{ height: 8 }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${Math.min(100, item.pct)}%`,
                      background: item.isMet ? 'var(--success)' : 'var(--primary)'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons to bridge gap */}
              <div style={{ display: 'flex', gap: 8 }}>
                {!item.isMet ? (
                  <>
                    <Link href="/micro-learning" className="btn btn-outline btn-sm">
                      <Zap size={13} /> Micro-Drill
                    </Link>
                    <Link href="/quiz" className="btn btn-primary btn-sm">
                      <Play size={13} /> Take Quiz
                    </Link>
                  </>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <CheckCircle2 size={16} /> Ready
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
