'use client';
import { useState, useEffect } from 'react';
import { Play, Clock, Award, BrainCircuit, Search, Filter, CheckCircle2, Zap, Sparkles, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function QuizListPage() {
  const { generatedQuizzes, quizHistory, t, tSkill } = useApp();
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => { setAnimateIn(true); }, []);

  const skillsList = ['All', 'Survey Design', 'Data Science & Analytics', 'Official Statistics', 'Economic Statistics', 'GIS & Spatial Analysis'];

  // Check if a quiz was completed in quizHistory
  const isQuizCompleted = (quizId) => {
    return quizHistory.some(h => h.quizId === quizId);
  };

  const filteredQuizzes = generatedQuizzes.filter(quiz => {
    const matchesSkill = selectedSkill === 'All' || quiz.skill.toLowerCase().includes(selectedSkill.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || quiz.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const matchesSearch = !searchFilter.trim() || quiz.title.toLowerCase().includes(searchFilter.toLowerCase()) || quiz.skill.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSkill && matchesDiff && matchesSearch;
  });

  const hasActiveFilters = selectedSkill !== 'All' || selectedDifficulty !== 'All' || searchFilter.trim().length > 0;
  const resetFilters = () => {
    setSelectedSkill('All');
    setSelectedDifficulty('All');
    setSearchFilter('');
  };

  return (
    <div className={animateIn ? 'fade-in' : ''}>
      {/* Quiz Hub Tab Navigation */}
      <div className="card mb-6" style={{
        padding: '4px', background: 'var(--bg-surface)',
        display: 'flex', gap: 4, borderRadius: 'var(--radius-lg)',
        overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none'
      }}>
        <Link href="/quiz" style={{
          flex: 1, padding: '11px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 700, fontSize: 13.5, textDecoration: 'none',
          background: 'var(--primary)', color: '#fff', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Play size={15} /> {t('tab_take_quiz', 'Take a Quiz')}
        </Link>
        <Link href="/quiz-generator" style={{
          flex: 1, padding: '11px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13.5, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Sparkles size={15} /> {t('tab_gen_quiz', 'Generate New Quiz')}
        </Link>
      </div>

      <div className="section-header mb-6">
        <div>
          <h1 className="section-title">{t('quiz_page_title', 'Assessment & Diagnostic Quizzes')}</h1>
          <p className="section-subtitle">{t('quiz_page_subtitle', 'Validate your statistical competencies, close diagnostic skill gaps, and earn iGOT-recognized XP')}</p>
        </div>
      </div>

      {/* Quiz History Summary */}
      {quizHistory.length > 0 && (
        <div className="stats-row mb-6">
          <div className="stat-card">
            <div className="stat-icon orange"><Award size={22} /></div>
            <div className="stat-content">
              <h3>{quizHistory.length}</h3>
              <p>{t('quiz_quizzes_completed', 'Quizzes Completed')}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><Award size={22} /></div>
            <div className="stat-content">
              <h3>{Math.round(quizHistory.reduce((s, q) => s + q.scorePercent, 0) / quizHistory.length)}%</h3>
              <p>Average Score</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon blue"><Clock size={22} /></div>
            <div className="stat-content">
              <h3>{quizHistory.reduce((s, q) => s + Math.ceil(q.totalQuestions * 1.5), 0)} min</h3>
              <p>Time Invested</p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card mb-6" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 180, width: '100%', position: 'relative' }}>
            <input
              type="text"
              placeholder={t('quiz_search_placeholder', 'Search quizzes...')}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ fontSize: 13 }}
            >
              <option value="All">{t('filter_all', 'All Difficulties')}</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Skill Category Chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 12, paddingBottom: 4 }}>
          {skillsList.map(skill => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`btn btn-sm ${selectedSkill === skill ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap', fontSize: 12 }}
            >
              {skill === 'All' ? t('filter_all', 'All Skills') : tSkill(skill)}
            </button>
          ))}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-light)', marginTop: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Showing <strong>{filteredQuizzes.length}</strong> of {generatedQuizzes.length} quizzes
            </span>
            <button
              onClick={resetFilters}
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

      {/* Available Quizzes Grid */}
      <div className="grid-3">
        {filteredQuizzes.map((quiz, i) => {
          const completed = isQuizCompleted(quiz.id);
          const historyItem = quizHistory.find(h => h.quizId === quiz.id);

          return (
            <div key={quiz.id} className="card fade-in" style={{ animationDelay: `${0.04 * i}s`, display: 'flex', flexDirection: 'column' }}>
              <div className="flex-between mb-3">
                <span className={`tag ${quiz.difficulty === 'Easy' ? 'tag-easy' : quiz.difficulty === 'Hard' ? 'tag-hard' : 'tag-medium'}`}>
                  {quiz.difficulty}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{quiz.questionCount} {t('quiz_questions_count', 'Questions')}</span>
              </div>

              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                {quiz.title}
              </h4>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Domain: <strong style={{ color: 'var(--text-primary)' }}>{tSkill(quiz.skill)}</strong>
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, fontSize: 12, color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-light)', paddingTop: 10 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} /> ~{Math.ceil(quiz.questionCount * 1.5)} {t('quiz_duration', 'min')}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--warning)' }}>
                  <Zap size={14} /> +{quiz.questionCount * 30} XP
                </span>
              </div>

              <div style={{ marginTop: 'auto' }}>
                {completed ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/quiz/${quiz.id}`} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>
                      Retake ({historyItem ? `${historyItem.scorePercent}%` : 'Done'})
                    </Link>
                  </div>
                ) : (
                  <Link href={`/quiz/${quiz.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Play size={16} /> {t('quiz_start_btn', 'Start Assessment')}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="empty-state">
          <BrainCircuit size={48} />
          <h3>No matching assessments found</h3>
          <p>Try clearing your filters or generate a custom quiz with the AI Quiz Generator.</p>
          <button className="btn btn-outline mt-4" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
