'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck, Award, BookOpen, Clock, Calendar, CheckCircle2,
  ChevronRight, ArrowRight, Sparkles, Filter, ExternalLink, Play
} from 'lucide-react';
import {
  CIVIL_SERVICE_ROLES, SUBJECT_DOMAINS, CATALOG_STATS,
  profileCoursesForRole
} from '@/lib/coursesCatalog';

export default function RoleProfilerWidget({ initialRole = 'jso', compact = false }) {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeCategoryTab, setActiveCategoryTab] = useState('mandatory'); // 'mandatory' | 'core' | 'electives' | 'roadmap'

  const profile = useMemo(() => {
    return profileCoursesForRole(selectedRole, selectedSubject);
  }, [selectedRole, selectedSubject]);

  return (
    <div className="card mb-6" style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tag tag-priority" style={{ fontSize: 10.5 }}>
              <ShieldCheck size={12} /> AI Role Profiler
            </span>
            <span className="tag tag-easy" style={{ fontSize: 10.5 }}>
              5,500+ iGOT Course Library
            </span>
          </div>
          <h3 style={{ fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
            Cadre-Specific Curriculum & Course Profiler
          </h3>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0', maxWidth: 640 }}>
            Automated statutory curriculum mapping. Select your civil service role and subject to see mandatory foundation courses, operational competencies, and completion roadmap.
          </p>
        </div>

        {/* Global Catalog Telemetry */}
        <div style={{
          display: 'flex',
          gap: 12,
          padding: '8px 14px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-light)',
          fontSize: 12
        }}>
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>National Library</div>
            <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: 14 }}>5,642 Courses</div>
          </div>
          <div style={{ width: 1, background: 'var(--border-light)' }} />
          <div>
            <div style={{ color: 'var(--text-tertiary)', fontSize: 10, textTransform: 'uppercase', fontWeight: 600 }}>CBP Accredited</div>
            <div style={{ fontWeight: 800, color: 'var(--success)', fontSize: 14 }}>100% Verified</div>
          </div>
        </div>
      </div>

      {/* Selectors: Role & Subject */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 12,
        padding: '14px',
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        marginBottom: 20
      }}>
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5 }}>
            Civil Service Designation / Cadre
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            {CIVIL_SERVICE_ROLES.map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
            {profile.role.ministry} • {profile.role.level}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 5 }}>
            Specialized Subject Domain
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            <option value="all">All Relevant Civil Service Domains</option>
            {SUBJECT_DOMAINS.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Recommended study time: <strong>{profile.summary.recommendedWeeklyHours} hrs/week</strong>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: 6,
        borderBottom: '1px solid var(--border-light)',
        marginBottom: 16,
        overflowX: 'auto',
        paddingBottom: 2
      }}>
        <button
          onClick={() => setActiveCategoryTab('mandatory')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeCategoryTab === 'mandatory' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeCategoryTab === 'mandatory' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <ShieldCheck size={14} /> Mandatory Statutory ({profile.mandatory.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab('core')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeCategoryTab === 'core' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeCategoryTab === 'core' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Award size={14} /> Core Cadre Competencies ({profile.core.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab('electives')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeCategoryTab === 'electives' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeCategoryTab === 'electives' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <BookOpen size={14} /> Elevation Electives ({profile.electives.length})
        </button>

        <button
          onClick={() => setActiveCategoryTab('roadmap')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 700,
            border: 'none',
            background: 'none',
            borderBottom: activeCategoryTab === 'roadmap' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            color: activeCategoryTab === 'roadmap' ? 'var(--primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <Calendar size={14} /> 8-Week Cadre Roadmap
        </button>
      </div>

      {/* Tab Contents: Course List */}
      {activeCategoryTab !== 'roadmap' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
          {(activeCategoryTab === 'mandatory' ? profile.mandatory :
            activeCategoryTab === 'core' ? profile.core : profile.electives).map(course => (
            <div
              key={course.id}
              style={{
                background: 'var(--bg-elevated)',
                border: activeCategoryTab === 'mandatory' ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)' }}>{course.code}</span>
                  {activeCategoryTab === 'mandatory' ? (
                    <span className="tag tag-hard" style={{ fontSize: 9.5 }}>
                      Mandatory (30d)
                    </span>
                  ) : (
                    <span className="tag tag-priority" style={{ fontSize: 9.5 }}>
                      {course.level}
                    </span>
                  )}
                </div>

                <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-primary)', lineHeight: 1.35 }}>
                  {course.title}
                </h4>

                <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  {course.ministry}
                </div>

                <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  {course.description}
                </p>

                {/* Competencies */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {course.competencies.map(comp => (
                    <span key={comp} style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-light)',
                      color: 'var(--text-secondary)'
                    }}>
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {course.duration} ({course.modulesCount} modules)
                </span>

                <Link
                  href="/quiz"
                  className="btn btn-outline"
                  style={{ fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Play size={11} /> Practice Assessment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: 8-Week Roadmap */}
      {activeCategoryTab === 'roadmap' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profile.timeline.map((phase, pIdx) => (
            <div
              key={pIdx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                padding: '12px 16px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-card)',
                border: '1px solid var(--primary)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0
              }}>
                {pIdx + 1}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                  <h4 style={{ fontSize: 13.5, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                    {phase.phase}
                  </h4>
                  <span className="tag tag-easy" style={{ fontSize: 10 }}>
                    {phase.duration}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>
                  Focus: {phase.focus}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
