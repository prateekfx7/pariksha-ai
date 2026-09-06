'use client';
import { useState, useEffect } from 'react';
import { Clock, BookOpen, BarChart2, Filter, TrendingUp, Award, ArrowUpRight, CheckCircle2, Search, X, Play, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { skills } from '@/data/mockData';
import Link from 'next/link';

export default function RecommendationsPage() {
  const { recommendations, gapData, enrollCourse, enrolledCourses } = useApp();
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterType, setFilterType] = useState('all'); // all, priority, enrolled
  const [searchQuery, setSearchQuery] = useState('');
  const [animateIn, setAnimateIn] = useState(false);
  const [enrollToast, setEnrollToast] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => { setAnimateIn(true); }, []);

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

      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">Personalized Learning Pathways</h1>
          <p className="section-subtitle">iGOT Karmayogi & MoSPI courses ranked by algorithm to target your largest competency deficits</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="tag tag-easy" style={{ fontSize: 12, padding: '6px 12px' }}>
            <Check size={14} /> {enrolledCourses.length} Active Courses
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
              <h3 style={{ fontSize: 15 }}>{g.skill}</h3>
              <p style={{ fontSize: 12 }}>Deficit: {g.gap} points (Benchmark {g.required})</p>
              <div className="progress-bar-track" style={{ marginTop: 8, height: 6 }}>
                <div className="progress-bar-fill" style={{ width: `${g.percentage}%` }} />
              </div>
              <div className="flex-between" style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                <span>Current: {g.current}</span>
                <span>{g.percentage}% Met</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="card mb-6" style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 200, width: '100%', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search course title, provider, or topic..."
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
              All Courses
            </button>
            <button
              className={`btn btn-sm ${filterType === 'priority' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterType('priority')}
            >
              High Priority Only
            </button>
            <button
              className={`btn btn-sm ${filterType === 'enrolled' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterType('enrolled')}
            >
              My Enrolled ({enrolledCourses.length})
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
            All Skills
          </button>
          {skills.map(s => (
            <button
              key={s}
              className={`btn btn-sm ${filterSkill === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterSkill(s)}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: 12 }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Active Filters Summary */}
        {(filterSkill !== 'all' || filterType !== 'all' || searchQuery.trim().length > 0) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-light)', marginTop: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Showing <strong>{filtered.length}</strong> of {recommendations.length} courses
            </span>
            <button
              onClick={() => { setFilterSkill('all'); setFilterType('all'); setSearchQuery(''); }}
              style={{
                background: 'none', border: 'none', color: 'var(--primary)',
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: 0
              }}
            >
              <X size={13} /> Reset Filters
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
                  Provider: <strong>{course.provider}</strong> • Closes gap in <strong style={{ color: 'var(--primary)' }}>{course.skill}</strong>
                </p>
                <div className="course-card-meta">
                  <span className={`tag ${course.priority === 'High Priority' ? 'tag-priority' : course.priority === 'Quick Win' ? 'tag-easy' : 'tag-medium'}`}>
                    {course.priority}
                  </span>
                  <span><Clock size={13} /> {course.duration}</span>
                  <span><BookOpen size={13} /> {course.modules} Modules</span>
                  <span><BarChart2 size={13} /> {course.level}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Award size={13} />
                    Fit:
                    <span className="relevance-bar">
                      <span className="relevance-bar-fill" style={{ width: `${course.relevance}%` }} />
                    </span>
                    {course.relevance}%
                  </span>
                </div>
              </div>

              <div className="course-card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedCourse(course)}>
                  Syllabus
                </button>
                {isEnrolled ? (
                  <span className="btn btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)', cursor: 'default' }}>
                    <CheckCircle2 size={14} /> Enrolled
                  </span>
                ) : (
                  <button className="btn btn-primary btn-sm" onClick={() => handleEnroll(course)}>
                    Enroll Now <ArrowUpRight size={14} />
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
            Reset Filters
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
                  Offered by <strong>{selectedCourse.provider}</strong> • Aligned with {selectedCourse.skill}
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
                  <p style={{ fontSize: 11 }}>Estimated Time</p>
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16 }}>{selectedCourse.modules} Modules</h3>
                  <p style={{ fontSize: 11 }}>Interactive Content</p>
                </div>
              </div>
              <div className="stat-card" style={{ padding: 12 }}>
                <div className="stat-content">
                  <h3 style={{ fontSize: 16 }}>{selectedCourse.relevance}%</h3>
                  <p style={{ fontSize: 11 }}>Gap Match</p>
                </div>
              </div>
            </div>

            <div className="card mb-4" style={{ background: 'var(--bg-elevated)', padding: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Curriculum & Syllabus Highlights</h4>
              <ul style={{ fontSize: 13, color: 'var(--text-secondary)', paddingLeft: 18, lineHeight: 1.8 }}>
                <li>Theoretical Foundations & Statistical Standards in Indian Governance</li>
                <li>Data Collection Protocols, Validation Rules, and Non-Sampling Error Controls</li>
                <li>Practical Case Studies from Recent NSS, ASI, and National Accounts Datasets</li>
                <li>End-of-Course Evaluative Assessment & Karmayogi Verification Credential</li>
              </ul>
            </div>

            <div className="flex-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: 10 }}>
              <Link href="/quiz" className="btn btn-outline btn-sm">
                <Play size={14} /> Take Diagnostic Quiz
              </Link>

              {enrolledCourses.includes(selectedCourse.id) ? (
                <span className="btn btn-sm" style={{ background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success)' }}>
                  <CheckCircle2 size={14} /> Already Enrolled
                </span>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    handleEnroll(selectedCourse);
                    setSelectedCourse(null);
                  }}
                >
                  Confirm Enrollment <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
