'use client';
import { useState, useEffect } from 'react';
import { Users, TrendingUp, Clock, Award, BarChart2, AlertTriangle, Download, Printer, Filter, X, ChevronRight, Check } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { officers, departments, skills, heatmapData, departmentCadreStats } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function getHeatColor(value) {
  if (value >= 50) return { bg: 'rgba(248, 113, 113, 0.8)', text: '#fff' };
  if (value >= 35) return { bg: 'rgba(251, 191, 36, 0.7)', text: '#1a1714' };
  if (value >= 20) return { bg: 'rgba(240, 90, 40, 0.5)', text: '#fff' };
  return { bg: 'rgba(52, 211, 153, 0.5)', text: '#fff' };
}

export default function AdminAnalyticsPage() {
  const { switchOfficer, theme, t, tSkill } = useApp();
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedCadre, setSelectedCadre] = useState('all');
  const [heatmapMetric, setHeatmapMetric] = useState('gap'); // 'gap' | 'score' | 'decay'
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState(null);
  const [assignedIntervention, setAssignedIntervention] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  useEffect(() => { setAnimateIn(true); }, []);

  const isLight = theme === 'light';
  const textColor = isLight ? '#0f172a' : '#f5f0eb';
  const textMuted = isLight ? '#64748b' : '#9a938c';
  const gridColor = isLight ? 'rgba(0, 0, 0, 0.07)' : 'rgba(58, 53, 48, 0.3)';
  const tooltipBg = isLight ? '#ffffff' : '#282420';
  const tooltipTitle = isLight ? '#0f172a' : '#f5f0eb';
  const tooltipBody = isLight ? '#475569' : '#9a938c';
  const tooltipBorder = isLight ? '#e2e8f0' : '#3a3530';

  const totalOfficers = officers.length;
  const avgCompetency = 62;
  const totalHours = 847;
  const totalAssessments = 156;

  const filteredHeatmap = selectedDept === 'all'
    ? heatmapData
    : heatmapData.filter(d => d.department === selectedDept);

  // Top gaps across all departments
  const topGaps = [];
  heatmapData.forEach(dept => {
    Object.entries(dept.skills).forEach(([skill, gap]) => {
      topGaps.push({ department: dept.department, skill, gap });
    });
  });
  topGaps.sort((a, b) => b.gap - a.gap);

  // Bar chart: average gap per skill across departments
  const avgGapPerSkill = skills.map(skill => {
    const avg = heatmapData.reduce((sum, dept) => sum + dept.skills[skill], 0) / heatmapData.length;
    return Math.round(avg);
  });

  const barData = {
    labels: skills.map(s => s.split(' ').slice(0, 2).join(' ')),
    datasets: [{
      label: 'Avg Gap Score',
      data: avgGapPerSkill,
      backgroundColor: avgGapPerSkill.map(v =>
        v >= 45 ? 'rgba(248, 113, 113, 0.85)' :
        v >= 30 ? 'rgba(251, 191, 36, 0.85)' :
        'rgba(52, 211, 153, 0.85)'
      ),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11, weight: '600' } },
      },
      y: {
        beginAtZero: true,
        max: 60,
        grid: { color: gridColor },
        ticks: { color: textMuted, font: { size: 11 } },
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
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  const leaderboard = [...officers].sort((a, b) => b.xp - a.xp);

  // Export CSV functionality
  const handleExportCSV = () => {
    const headers = ["Department", ...skills];
    const rows = heatmapData.map(d => [
      `"${d.department}"`,
      ...skills.map(s => d.skills[s] || 0)
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MoSPI_Competency_Gap_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Executive Report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className={animateIn ? 'fade-in' : ''} style={{ paddingBottom: 40 }}>
      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">{t('analytics_title', 'Department Analytics & Executive Audit')}</h1>
          <p className="section-subtitle">{t('analytics_subtitle', "Macro-level competency gap diagnosis across India's Official Statistical System")}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={handleExportCSV}>
            <Download size={15} /> {t('export_csv', 'Export CSV Matrix')}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrintReport}>
            <Printer size={15} /> {t('print_audit', 'Print Audit Summary')}
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-row mb-6">
        <div className="stat-card">
          <div className="stat-icon orange"><Users size={22} /></div>
          <div className="stat-content">
            <h3>{totalOfficers}</h3>
            <p>{t('monitored_officers', 'Monitored Officers')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><TrendingUp size={22} /></div>
          <div className="stat-content">
            <h3>{avgCompetency}%</h3>
            <p>{t('system_avg_score', 'System-wide Avg Score')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Clock size={22} /></div>
          <div className="stat-content">
            <h3>{totalHours} hrs</h3>
            <p>{t('training_hours', 'iGOT Training Hours')}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><Award size={22} /></div>
          <div className="stat-content">
            <h3>{totalAssessments}</h3>
            <p>{t('completed_assessments', 'Completed Assessments')}</p>
          </div>
        </div>
      </div>

      {/* Multi-Tier Filter & Metric Switcher Row */}
      <div className="card mb-6" style={{ padding: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Division Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Filter size={15} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t('division', 'Division')}:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{ width: 190, maxWidth: '100%', padding: '6px 10px', fontSize: 12 }}
            >
              <option value="all">{t('all_divisions', 'All 10 Divisions')}</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Cadre Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t('cadre', 'Cadre')}:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {['all', 'ISS', 'SSS'].map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCadre(c)}
                  className={`btn btn-sm ${selectedCadre === c ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: 11, padding: '4px 10px' }}
                >
                  {c === 'all' ? t('all_cadres', 'All Cadres') : c}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{t('metric', 'Metric')}:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                onClick={() => setHeatmapMetric('gap')}
                className={`btn btn-sm ${heatmapMetric === 'gap' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                {t('deficit_gap', 'Deficit Gap %')}
              </button>
              <button
                onClick={() => setHeatmapMetric('score')}
                className={`btn btn-sm ${heatmapMetric === 'score' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                {t('skill_score', 'Skill Score (0-100)')}
              </button>
              <button
                onClick={() => setHeatmapMetric('decay')}
                className={`btn btn-sm ${heatmapMetric === 'decay' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: 11, padding: '4px 10px' }}
              >
                {t('decay_risk', 'Decay Risk %')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Heatmap + Avg Gap Bar Chart */}
      <div className="grid-2 mb-8">
        {/* Heatmap */}
        <div className="chart-container fade-in fade-in-delay-1" style={{ overflowX: 'auto' }}>
          <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>
                {t('matrix_title', 'National Competency Matrix')} ({heatmapMetric === 'gap' ? t('deficit_gap', 'Deficit %') : heatmapMetric === 'score' ? t('skill_score', 'Skill Proficiency') : t('decay_risk', 'Decay Risk %')})
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {t('click_cell_drilldown', 'Click any cell to drill down into officers & prescribe training')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(248, 113, 113, 0.8)' }} /> {t('high_risk', 'High Risk (>40)')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(251, 191, 36, 0.7)' }} /> {t('moderate', 'Moderate')}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(52, 211, 153, 0.5)' }} /> {t('healthy', 'Healthy (<20)')}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="heatmap-table" style={{ width: '100%', minWidth: 500 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px 10px', fontSize: 12 }}>{t('division', 'Division')}</th>
                  {skills.map(s => (
                    <th key={s} style={{ fontSize: 10, padding: '8px 4px', whiteSpace: 'nowrap' }} title={s}>
                      {tSkill(s).split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredHeatmap.map(dept => {
                  const cadreStats = departmentCadreStats[dept.department] || { total: 200, iss: 25, sss: 175, decayRisk: 20 };
                  return (
                    <tr key={dept.department}>
                      <td style={{ fontSize: 12, fontWeight: 500, padding: '8px 10px', whiteSpace: 'nowrap' }}>
                        {dept.department}
                        <span style={{ display: 'block', fontSize: 10, color: 'var(--text-tertiary)' }}>
                          {selectedCadre === 'all' ? `${cadreStats.total} staff` : selectedCadre === 'ISS' ? `${cadreStats.iss} ISS` : `${cadreStats.sss} SSS`}
                        </span>
                      </td>
                      {skills.map(s => {
                        let val = dept.skills[s] || 0;
                        if (heatmapMetric === 'score') {
                          val = Math.max(15, 100 - val);
                        } else if (heatmapMetric === 'decay') {
                          val = cadreStats.decayRisk || Math.round(val * 0.7);
                        }

                        const c = heatmapMetric === 'score'
                          ? (val >= 70 ? { bg: 'rgba(52, 211, 153, 0.5)', text: '#fff' } : val >= 50 ? { bg: 'rgba(251, 191, 36, 0.7)', text: '#1a1714' } : { bg: 'rgba(248, 113, 113, 0.8)', text: '#fff' })
                          : getHeatColor(val);

                        return (
                          <td key={s} style={{ padding: 4, textAlign: 'center' }}>
                            <span
                              onClick={() => {
                                setAssignedIntervention(false);
                                setSelectedHeatmapCell({ department: dept.department, skill: s, value: val, metric: heatmapMetric });
                              }}
                              style={{
                                display: 'inline-block',
                                width: 34,
                                padding: '5px 0',
                                borderRadius: 4,
                                background: c.bg,
                                color: c.text,
                                fontSize: 11,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'transform 100ms ease',
                              }}
                              title={`Click to inspect ${dept.department} in ${s}`}
                            >
                              {val}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Avg Gap Bar Chart */}
        <div className="chart-container fade-in fade-in-delay-2">
          <h3 style={{ fontSize: 16, marginBottom: 16 }}>{t('avg_national_gap', 'Average National Gap by Domain')}</h3>
          <div style={{ height: 320 }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Critical Gaps + Officer Directory */}
      <div className="grid-2">
        {/* Critical Gaps Table */}
        <div className="chart-container fade-in fade-in-delay-3">
          <div className="flex-between mb-4">
            <h3 style={{ margin: 0, fontSize: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
              {t('high_risk_deficits', 'High-Risk Competency Deficits')}
            </h3>
            <span style={{ fontSize: 12, color: 'var(--error)', fontWeight: 600 }}>{t('action_required', 'Action Required')}</span>
          </div>
          <div className="table-responsive">
            <table className="data-table" style={{ minWidth: 380 }}>
              <thead>
                <tr>
                  <th>{t('division', 'Department')}</th>
                  <th>Skill Gap</th>
                  <th>Gap Score</th>
                </tr>
              </thead>
              <tbody>
                {topGaps.slice(0, 8).map((g, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 13, fontWeight: 500 }}>{g.department}</td>
                    <td style={{ fontSize: 13 }}>{tSkill(g.skill)}</td>
                    <td>
                      <span className={`tag ${g.gap >= 50 ? 'tag-hard' : g.gap >= 35 ? 'tag-medium' : 'tag-easy'}`}>
                        {g.gap}% {t('deficit', 'Deficit')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Officer Directory & Leaderboard */}
        <div className="chart-container fade-in fade-in-delay-4">
          <div className="flex-between mb-4">
            <h3 style={{ margin: 0, fontSize: 16 }}>
              {t('officer_directory', 'Statistical Officer Directory')}
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{officers.length} {t('officers_active', 'Officers Active')}</span>
          </div>

          <div className="table-responsive">
            <table className="data-table" style={{ minWidth: 440 }}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Officer</th>
                  <th>Division</th>
                  <th>Total XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 8).map((officer, i) => (
                  <tr
                    key={officer.id}
                    onClick={() => setSelectedOfficer(officer)}
                    style={{ cursor: 'pointer', transition: 'background 150ms' }}
                  >
                    <td style={{ fontWeight: 700, color: i < 3 ? 'var(--primary)' : 'var(--text-secondary)' }}>
                      #{i + 1}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: `hsl(${i * 35 + 15}, 65%, 45%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: 'white',
                        }}>
                          {officer.avatar}
                        </div>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 600 }}>{officer.name}</span>
                          <br />
                          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{officer.role}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{officer.department.split(' ')[0]}</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{officer.xp.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Officer Drill-down Modal */}
      {selectedOfficer && (
        <div className="modal-overlay" onClick={() => setSelectedOfficer(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 'clamp(16px, 3.5vw, 24px)', maxWidth: 640 }}>
            <div className="flex-between mb-4" style={{ flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="header-avatar" style={{ width: 44, height: 44, fontSize: 16 }}>
                  {selectedOfficer.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800 }}>{selectedOfficer.name}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {selectedOfficer.role} • {selectedOfficer.department}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                    Cadre: {selectedOfficer.cadre} • Experience: {selectedOfficer.experience} years
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedOfficer(null)} style={{ color: 'var(--text-tertiary)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div className="stats-row mb-6">
              <div className="stat-card">
                <div className="stat-icon orange"><Award size={20} /></div>
                <div className="stat-content">
                  <h3>{selectedOfficer.xp.toLocaleString()}</h3>
                  <p>Earned XP</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><TrendingUp size={20} /></div>
                <div className="stat-content">
                  <h3>{selectedOfficer.streak} Days</h3>
                  <p>Learning Streak</p>
                </div>
              </div>
            </div>

            <div className="card mb-4" style={{ background: 'var(--bg-elevated)', padding: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Cadre Alignment & iGOT Profile</h4>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Assigned to Ministry of Statistics & Programme Implementation cadre. Under National Training Policy (NTP), officer is slated for 40 hours of annual capacity building.
              </p>
            </div>

            <div className="flex-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: 10 }}>
              <button
                className="btn btn-primary btn-md"
                onClick={() => {
                  const idx = officers.findIndex(o => o.id === selectedOfficer.id);
                  if (idx >= 0) switchOfficer(idx);
                  setSelectedOfficer(null);
                }}
              >
                <Users size={16} /> Switch to Officer Dashboard
              </button>
              <button className="btn btn-ghost" onClick={() => setSelectedOfficer(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Heatmap Cell Inspection & Cadre Drilldown Modal */}
      {selectedHeatmapCell && (
        <div className="modal-overlay" onClick={() => setSelectedHeatmapCell(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 'clamp(16px, 3.5vw, 24px)', maxWidth: 660 }}>
            <div className="flex-between mb-4">
              <div>
                <span className="tag tag-priority" style={{ fontSize: 11, marginBottom: 4, display: 'inline-block' }}>
                  Institutional Drilldown Matrix
                </span>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                  {selectedHeatmapCell.department}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Domain: <strong>{selectedHeatmapCell.skill}</strong> • Metric: <strong>{selectedHeatmapCell.metric === 'gap' ? `${selectedHeatmapCell.value}% Deficit` : selectedHeatmapCell.metric === 'score' ? `${selectedHeatmapCell.value}% Proficiency` : `${selectedHeatmapCell.value}% Decay Risk`}</strong>
                </p>
              </div>
              <button onClick={() => setSelectedHeatmapCell(null)} style={{ color: 'var(--text-tertiary)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Division Snapshot */}
            <div className="stats-row mb-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16 }}>{departmentCadreStats[selectedHeatmapCell.department]?.total || 240}</h3>
                  <p style={{ fontSize: 11 }}>Total Division Staff</p>
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16 }}>{departmentCadreStats[selectedHeatmapCell.department]?.iss || 30} ISS / {departmentCadreStats[selectedHeatmapCell.department]?.sss || 210} SSS</h3>
                  <p style={{ fontSize: 11 }}>Cadre Distribution</p>
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16, color: 'var(--warning)' }}>{departmentCadreStats[selectedHeatmapCell.department]?.decayRisk || 25}%</h3>
                  <p style={{ fontSize: 11 }}>Unpracticed Decay Risk</p>
                </div>
              </div>
            </div>

            {/* Officers in this Division */}
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
                Monitored Officers in {selectedHeatmapCell.department}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {officers.filter(o => o.department === selectedHeatmapCell.department).map(officer => (
                  <div
                    key={officer.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="header-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                        {officer.avatar}
                      </div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{officer.name}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', marginLeft: 8 }}>{officer.role} ({officer.cadre})</span>
                      </div>
                    </div>
                    <span className="tag tag-easy" style={{ fontSize: 10 }}>
                      {officer.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cadre Intervention Plan */}
            <div style={{ background: 'rgba(240, 90, 40, 0.08)', border: '1px solid rgba(240, 90, 40, 0.3)', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                Cadre Director Action Recommendation:
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 10px' }}>
                Automate distribution of 2 targeted <strong>{selectedHeatmapCell.skill}</strong> micro-learning units and 1 mandatory practical diagnostic task to all officers in {selectedHeatmapCell.department}.
              </p>
              <button
                onClick={() => setAssignedIntervention(true)}
                disabled={assignedIntervention}
                className="btn btn-primary btn-sm"
              >
                {assignedIntervention ? (
                  <>✓ Intervention Assigned to Division Staff</>
                ) : (
                  <>Deploy Targeted Upskilling Pathway</>
                )}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedHeatmapCell(null)}>
                Close Drilldown
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
