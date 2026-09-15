'use client';
import { useState, useEffect } from 'react';
import { Clock, BookOpen, BarChart2, Filter, TrendingUp, Award, ArrowUpRight, CheckCircle2, Search, X, Play, Check, Zap, Terminal, ShieldCheck, ChevronRight, Compass } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { skills } from '@/data/mockData';
import Link from 'next/link';

export default function RecommendationsPage() {
  const { recommendations, gapData, enrollCourse, enrolledCourses, t, tSkill } = useApp();
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterType, setFilterType] = useState('all'); // all, priority, enrolled
  const [searchQuery, setSearchQuery] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [enrollToast, setEnrollToast] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [selectedRole, setSelectedRole] = useState('Junior Statistical Officer (JSO)');
  const [timeBudget, setTimeBudget] = useState('30'); // 10, 30, 120 mins
  const [activeWeek, setActiveWeek] = useState(1);
  const [showWeakTopicModal, setShowWeakTopicModal] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || params.get('search');
      if (q) setSearchQuery(q);
    }
  }, []);

  const topGaps = gapData.gapList.slice(0, 3);

  const handleEnroll = (course) => {
    enrollCourse(course.id);
    setEnrollToast(course.title);
    setTimeout(() => setEnrollToast(null), 3000);
  };

  const filtered = recommendations.filter(course => {
    const matchesSkill = filterSkill === 'all' || course.skill === filterSkill;
    const matchesType = filterType === 'all' ||
      (filterType === 'priority' && course.priority === 'High Priority') ||
      (filterType === 'enrolled' && enrolledCourses.includes(course.id));
    const matchesSearch = !searchQuery.trim() ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSkill && matchesType && matchesSearch;
  });

  return (
    <div className={animateIn ? 'fade-in' : ''} style={{ paddingBottom: 40 }}>
      {/* Toast Notification */}
      {enrollToast && (
        <div style={{
          position: 'fixed', top: 76, right: 16, left: 'auto', zIndex: 999,
          background: 'var(--bg-card)', border: '1px solid var(--success)',
          borderRadius: 'var(--radius-lg)', padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: 'var(--shadow-lg)', animation: 'fadeInUp 0.3s ease-out',
          maxWidth: 'calc(100vw - 32px)',
        }}>
          <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>Enrolled Successfully!</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{enrollToast} added to your learning plan.</p>
          </div>
        </div>
      )}

      {/* Learn Hub Tab Navigation */}
      <div className="card mb-6" style={{
        padding: '4px', background: 'var(--bg-surface)',
        display: 'flex', gap: 4, borderRadius: 'var(--radius-lg)',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none'
      }}>
        <Link href="/recommendations" style={{
          flex: 1, padding: '11px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 700, fontSize: 13.5, textDecoration: 'none',
          background: 'var(--primary)', color: '#fff', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <BookOpen size={15} /> {t('tab_courses', 'Recommended Courses')}
        </Link>
        <Link href="/micro-learning" style={{
          flex: 1, padding: '11px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13.5, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Zap size={15} /> {t('tab_micro', 'Micro-Drills')}
        </Link>
        <Link href="/practical-tasks" style={{
          flex: 1, padding: '11px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13.5, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Terminal size={15} /> {t('tab_practical', 'Practical Labs')}
        </Link>
        <Link href="/readiness" style={{
          flex: 1, padding: '11px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13.5, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <TrendingUp size={15} /> {t('tab_readiness', 'Role Readiness')}
        </Link>
      </div>

      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">{t('learn_page_title', 'Personalized iGOT Learning Pathways')}</h1>
          <p className="section-subtitle">{t('learn_page_subtitle', 'Curated courses, 2-minute micro-drills, practical labs, and role readiness benchmarks for your statistical cadre')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="tag tag-easy" style={{ fontSize: 12, padding: '6px 12px' }}>
            <Check size={14} /> {enrolledCourses.length} {t('learn_enrolled', 'Enrolled')}
          </span>
        </div>
      </div>

      {/* Top 3 Competency Gaps Bar */}
      <div className="stats-row mb-6">
        {topGaps.map((g, i) => (
          <div key={g.skill} className="stat-card fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={`stat-icon ${['orange', 'yellow', 'blue'][i]}`}>
              <TrendingUp size={22} />
            </div>
            <div className="stat-content" style={{ flex: 1 }}>
              <h3 style={{ fontSize: 15 }}>{tSkill(g.skill)}</h3>
              <p style={{ fontSize: 12 }}>{t('deficit', 'Deficit')}: {g.gap} points (Benchmark {g.required})</p>
              <div className="progress-bar-track" style={{ marginTop: 8, height: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${g.percentage}%` }} />
              </div>
              <div className="flex-between" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                <span>{t('current_score', 'Current Score')}: {g.current}</span>
                <span>{g.percentage}% {t('target_met', 'Target Met')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Competency Gap Learning Path Engine (Problems #7, #8, #13, Opportunity #3) */}
      <div className="card mb-6" style={{
        padding: 22,
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(20, 24, 33, 0.3) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="tag tag-priority" style={{ fontSize: 11 }}>
                <Compass size={12} /> AI Learning Path Engine
              </span>
              <span className="tag tag-easy" style={{ fontSize: 11 }}>
                Problems #7, #8 & #13 Resolution
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: 'var(--text-primary)' }}>
              Competency-Driven Learning Pathway
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, maxWidth: 680 }}>
              Replaces manual course searching with a structured 4-week roadmap tailored to your civil service cadre, time availability, and assessed skill deficits.
            </p>
          </div>

          {/* Role & Time Budget Selectors */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', display: 'block', marginBottom: 2 }}>
                Cadre / Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{ fontSize: 12, padding: '5px 10px' }}
              >
                <option value="Junior Statistical Officer (JSO)">Junior Statistical Officer (JSO)</option>
                <option value="Senior Statistical Officer (SSO)">Senior Statistical Officer (SSO)</option>
                <option value="Assistant Director (ISS)">Assistant Director (ISS Cadre)</option>
                <option value="Section Officer">Section Officer / Desk Officer</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', display: 'block', marginBottom: 2 }}>
                Time Budget
              </label>
              <select
                value={timeBudget}
                onChange={(e) => setTimeBudget(e.target.value)}
                style={{ fontSize: 12, padding: '5px 10px' }}
              >
                <option value="10">10 mins/day (Micro-burst)</option>
                <option value="30">30 mins/day (Standard)</option>
                <option value="120">2 hrs/wknd (Intensive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4-Week Milestone Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12, marginBottom: 16 }}>
          {[
            { week: 1, title: 'Week 1: Core Circulars', desc: 'MoSPI Guidelines & Neyman sample allocation rules', hours: timeBudget === '10' ? '1.2 hrs' : '3.5 hrs' },
            { week: 2, title: 'Week 2: Field Protocols', desc: 'CAPI validation scripts & non-response mitigation', hours: timeBudget === '10' ? '1.2 hrs' : '3.5 hrs' },
            { week: 3, title: 'Week 3: Weak-Topic Revision', desc: 'Built-in practice mode & explanation drills (Problem #13)', hours: timeBudget === '10' ? '1.5 hrs' : '4.0 hrs', highlight: true },
            { week: 4, title: 'Week 4: Karmayogi Exam', desc: 'Proctored CAT assessment & QR certificate sealing', hours: timeBudget === '10' ? '1.0 hr' : '2.5 hrs' }
          ].map((m) => (
            <div
              key={m.week}
              onClick={() => setActiveWeek(m.week)}
              style={{
                padding: 12,
                borderRadius: 'var(--radius-md)',
                background: activeWeek === m.week ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                border: activeWeek === m.week ? '1.5px solid #3b82f6' : '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: activeWeek === m.week ? '#3b82f6' : 'var(--text-tertiary)' }}>
                  {m.title}
                </span>
                <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 4, background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                  {m.hours}
                </span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.35 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Action Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Target Focus: <strong>{topGaps[0]?.skill || 'Survey Design'}</strong> ({topGaps[0]?.gap || 28}pt deficit)
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowWeakTopicModal(true)}
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--primary)', borderColor: 'var(--primary)', fontWeight: 700 }}
            >
              <BookOpen size={13} /> Built-in Practice Mode (Problem #13)
            </button>
            <Link href="/adaptive-test" className="btn btn-primary btn-sm">
              <Play size={13} /> Launch Adaptive Benchmark
            </Link>
          </div>
        </div>
      </div>

      {/* Weak-Topic Revision Modal Dialog (Problem #13) */}
      {showWeakTopicModal && (
        <div className="modal-overlay" onClick={() => setShowWeakTopicModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 'clamp(18px, 4vw, 28px)', maxWidth: 680 }}>
            <div className="flex-between mb-4">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="tag tag-easy" style={{ fontSize: 11 }}>
                    <ShieldCheck size={12} /> Built-in Practice Mode
                  </span>
                  <span className="tag" style={{ fontSize: 11, background: 'var(--bg-elevated)' }}>
                    Problem #13 Solution
                  </span>
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>
                  Weak-Topic Revision & Practice Sandbox
                </h2>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  Integrated official explanations and mock drills to prevent relying on external web answers.
                </p>
              </div>
              <button onClick={() => setShowWeakTopicModal(false)} style={{ color: 'var(--text-tertiary)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ padding: 14, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Concept Note #1: Neyman Optimum Sample Allocation
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '6px 0 8px', fontWeight: 600 }}>
                  Why do high-variance survey strata receive disproportionately larger sample allocations?
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Under fixed overall survey budget constraints, Neyman allocation minimizes the overall variance of the estimator by drawing larger samples from strata with greater within-stratum standard deviation (S_h).
                </p>
              </div>

              <div style={{ padding: 14, borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                  Concept Note #2: Double Deflation in National Accounts
                </span>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: '6px 0 8px', fontWeight: 600 }}>
                  How does double deflation isolate true economic output from intermediate inflation shocks?
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Gross Output is deflated with output price indices (WPI/CPI) and intermediate input costs are deflated independently with input price indices, preventing systematic over/under-estimation of GVA during price volatility.
                </p>
              </div>
            </div>

            <div className="flex-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
              <button onClick={() => setShowWeakTopicModal(false)} className="btn btn-ghost btn-sm">
                Close Practice Mode
              </button>
              <Link href="/quiz" className="btn btn-primary btn-sm">
                <Play size={13} /> Take Mock Revision Quiz
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="card mb-6" style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 200, width: '100%', position: 'relative' }}>
            <input
              type="text"
              placeholder={t('search_courses_placeholder', 'Search course title, provider, or topic...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Quick Filter Buttons */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterType('all')}
            >
              {t('filter_all_courses', 'All Courses')}
            </button>
            <button
              className={`btn btn-sm ${filterType === 'priority' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterType('priority')}
            >
              {t('filter_priority_only', 'High Priority Only')}
            </button>
            <button
              className={`btn btn-sm ${filterType === 'enrolled' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterType('enrolled')}
            >
              {t('filter_my_enrolled', 'My Enrolled')} ({enrolledCourses.length})
            </button>
          </div>
        </div>

        {/* Skill Filter Chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 6 }}>
          <button
            className={`btn btn-sm ${filterSkill === 'all' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilterSkill('all')}
            style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: 12 }}
          >
            {t('filter_all_skills', 'All Skills')}
          </button>
          {skills.map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filterSkill === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterSkill(s)}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: 12 }}
            >
              {tSkill(s)}
            </button>
          ))}
        </div>

        {/* Active Filters Summary */}
        {(filterSkill !== 'all' || filterType !== 'all' || searchQuery.trim().length > 0) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-light)', marginTop: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {t('showing', 'Showing')} <strong>{filtered.length}</strong> / {recommendations.length} {t('tab_courses', 'Courses')}
            </span>
            <button
              onClick={() => { setFilterSkill('all'); setFilterType('all'); setSearchQuery(''); }}
              style={{
                background: 'none', border: 'none', color: 'var(--primary)',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0
              }}
            >
              <X size={13} /> {t('reset_filters', 'Reset Filters')}
            </button>
          </div>
        )}
      </div>

      {/* Course Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((course, i) => {
          const isEnrolled = enrolledCourses.includes(course.id);
          return (
            <div
              key={course.id}
              className="course-card fade-in"
              style={{ animationDelay: `${0.04 * i}s`, cursor: 'pointer' }}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="course-card-rank">#{course.rank}</div>
              <div className="course-card-body">
                <h4>{course.title}</h4>
                <p>
                  {t('provider', 'Provider')}: <strong>{course.provider}</strong> • {t('closes_gap', 'Closes gap in')} <strong style={{ color: 'var(--primary)' }}>{tSkill(course.skill)}</strong>
                </p>
                <div className="course-card-meta">
                  <span className={`tag ${course.priority === 'High Priority' ? 'tag-priority' : course.priority === 'Quick Win' ? 'tag-easy' : 'tag-medium'}`}>
                    {course.priority}
                  </span>
                  <span><Clock size={13} /> {course.duration}</span>
                  <span><BookOpen size={13} /> {course.modules} {t('modules', 'Modules')}</span>
                  <span><BarChart2 size={13} /> {course.level}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={13} />
                    {t('fit', 'Fit')}:
                    <span className="relevance-bar">
                      <span className="relevance-bar-fill" style={{ width: `${course.relevance}%` }} />
                    </span>
                    {course.relevance}%
                  </span>
                </div>
              </div>

              <div className="course-card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCourse(course)}>
                  {t('syllabus', 'Syllabus')}
                </button>
                {isEnrolled ? (
                  <span className="btn btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', cursor: 'default' }}>
                    <CheckCircle2 size={14} /> {t('learn_enrolled', 'Enrolled')}
                  </span>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(course)}>
                    {t('learn_enroll_btn', 'Enroll Now')} <ArrowUpRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No matching courses found</h3>
          <p>Try resetting filters to explore other modules in the statistical curriculum.</p>
          <button className="btn btn-outline mt-4" onClick={() => { setFilterSkill('all'); setFilterType('all'); setSearchQuery(''); }}>
            {t('reset_filters', 'Reset Filters')}
          </button>
        </div>
      )}

      {/* Course Detail / Syllabus Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 'clamp(16px, 4vw, 28px)' }}>
            <div className="flex-between mb-4">
              <div>
                <span className="tag tag-priority" style={{ fontSize: 11, marginBottom: 8, display: 'inline-block' }}>
                  {selectedCourse.priority} • {selectedCourse.level}
                </span>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{selectedCourse.title}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {t('provider', 'Offered by')} <strong>{selectedCourse.provider}</strong> • {t('closes_gap', 'Aligned with')} {tSkill(selectedCourse.skill)}
                </p>
              </div>
              <button onClick={() => setSelectedCourse(null)} style={{ color: 'var(--text-tertiary)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            <div className="stats-row mb-4">
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16 }}>{selectedCourse.duration}</h3>
                  <p style={{ fontSize: 11 }}>{t('estimated_time', 'Estimated Time')}</p>
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16 }}>{selectedCourse.modules} {t('modules', 'Modules')}</h3>
                  <p style={{ fontSize: 11 }}>{t('interactive_content', 'Interactive Content')}</p>
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16 }}>{selectedCourse.relevance}%</h3>
                  <p style={{ fontSize: 11 }}>{t('gap_match', 'Gap Match')}</p>
                </div>
              </div>
            </div>

            <div className="card mb-4" style={{ background: 'var(--bg-elevated)', padding: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{t('curriculum_highlights', 'Curriculum Highlights')}</h4>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.8 }}>
                <li>Theoretical Foundations & Statistical Standards in Indian Governance</li>
                <li>Data Collection Protocols, Validation Rules, and Non-Sampling Error Controls</li>
                <li>Practical Case Studies from Recent NSS, ASI, and National Accounts Datasets</li>
                <li>End-of-Course Evaluative Assessment & Karmayogi Verification Credential</li>
              </ul>
            </div>

            <div className="flex-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: 10 }}>
              <Link href="/quiz" className="btn btn-outline btn-sm">
                <Play size={14} /> {t('take_quiz_btn', 'Take Diagnostic Quiz')}
              </Link>

              {enrolledCourses.includes(selectedCourse.id) ? (
                <span className="btn btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                  <CheckCircle2 size={14} /> {t('already_enrolled', 'Already Enrolled')}
                </span>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    handleEnroll(selectedCourse);
                    setSelectedCourse(null);
                  }}
                >
                  {t('confirm_enrollment', 'Confirm Enrollment')} <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
