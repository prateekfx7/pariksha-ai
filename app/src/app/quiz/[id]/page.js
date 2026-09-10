'use client';
import { useState, useEffect, use, useRef } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle, RotateCcw, Home, Award, Clock, Printer, Zap, Sparkles, BookOpen, Share2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

export default function QuizTakePage({ params }) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  const { generatedQuizzes, updateSkillAfterQuiz, addQuizResult, currentUser, t, tSkill } = useApp();

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState({}); // { [qIndex]: { selected, isCorrect } }
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes default
  const [timerActive, setTimerActive] = useState(true);
  const [earnedXP, setEarnedXP] = useState(0);

  const quiz = generatedQuizzes.find(q => q.id === quizId);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || quizCompleted) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, quizCompleted]);

  useEffect(() => { setAnimateIn(true); }, []);
  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 50);
    // Restore selected answer if this question was already answered
    if (userAnswers[currentQ]) {
      setSelectedAnswer(userAnswers[currentQ].selected);
      setShowResult(true);
    } else {
      setSelectedAnswer(null);
      setShowResult(false);
    }
    return () => clearTimeout(timer);
  }, [currentQ]);

  if (!quiz) {
    return (
      <div className="empty-state">
        <Award size={48} />
        <h3>Quiz not found</h3>
        <p>The quiz you're looking for doesn't exist or was removed.</p>
        <Link href="/quiz" className="btn btn-primary mt-4">Browse Available Quizzes</Link>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleSelect = (index) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    const isCorrect = selectedAnswer === question.correctAnswer;
    setShowResult(true);
    setUserAnswers(prev => ({
      ...prev,
      [currentQ]: {
        questionId: question.id,
        selected: selectedAnswer,
        correct: question.correctAnswer,
        isCorrect,
      }
    }));
  };

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(prev => prev - 1);
    }
  };

  // Keyboard navigation for desktop: 1-4/A-D for options, Enter for confirm/next, Arrows for prev/next
  useEffect(() => {
    if (quizCompleted) return;
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      if (e.key === '1' || e.key === 'a' || e.key === 'A') handleSelect(0);
      else if (e.key === '2' || e.key === 'b' || e.key === 'B') handleSelect(1);
      else if (e.key === '3' || e.key === 'c' || e.key === 'C') handleSelect(2);
      else if (e.key === '4' || e.key === 'd' || e.key === 'D') handleSelect(3);
      else if (e.key === 'Enter') {
        if (!showResult && selectedAnswer !== null) handleSubmitAnswer();
        else if (showResult) handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight' && showResult) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResult, selectedAnswer, currentQ, totalQuestions, quizCompleted]);

  const handleFinalSubmit = () => {
    setTimerActive(false);
    const answersList = Object.values(userAnswers);
    const correctCount = answersList.filter(a => a.isCorrect).length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const xpBonus = correctCount * 30 + 50;
    setEarnedXP(xpBonus);

    updateSkillAfterQuiz(quiz.skill, correctCount, totalQuestions);
    addQuizResult({
      quizId: quiz.id,
      skill: quiz.skill,
      score: correctCount,
      totalQuestions,
      scorePercent,
      answers: answersList,
      completedAt: new Date().toISOString(),
    });

    setQuizCompleted(true);
  };

  const handlePrintCertificate = () => {
    const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);
    const certWindow = window.open('', '_blank');
    if (!certWindow) return;

    certWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate of Competency — Pariksha AI</title>
        <style>
          @page { size: landscape; margin: 0; }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #fff;
            color: #1a1714;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 90vh;
          }
          .cert-frame {
            border: 8px double #f05a28;
            padding: 40px 60px;
            text-align: center;
            max-width: 800px;
            width: 100%;
            background: #fffdfb;
            box-shadow: 0 0 20px rgba(0,0,0,0.05);
            position: relative;
          }
          .emblem { font-size: 32px; font-weight: 800; color: #f05a28; margin-bottom: 4px; }
          .subtitle { font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #666; margin-bottom: 24px; }
          .title { font-size: 32px; font-weight: 800; text-transform: uppercase; color: #111; margin-bottom: 12px; }
          .awarded-to { font-size: 15px; color: #555; margin-bottom: 8px; }
          .name { font-size: 28px; font-weight: 800; color: #f05a28; border-bottom: 2px solid #ddd; display: inline-block; padding-bottom: 4px; margin-bottom: 16px; }
          .role { font-size: 14px; color: #444; margin-bottom: 24px; }
          .desc { font-size: 15px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto 30px auto; }
          .score-badge { font-size: 20px; font-weight: 700; color: #34d399; background: #e8fbf3; padding: 6px 16px; border-radius: 20px; display: inline-block; margin-bottom: 24px; }
          .footer { display: flex; justify-content: space-between; border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #777; }
        </style>
      </head>
      <body>
        <div class="cert-frame">
          <div class="emblem">PARIKSHA AI</div>
          <div class="subtitle">Ministry of Statistics & Programme Implementation • iGOT Karmayogi</div>
          <div class="title">Certificate of Competency Assessment</div>
          <div class="awarded-to">This credential is proudly conferred upon</div>
          <div class="name">${currentUser.name}</div>
          <div class="role">${currentUser.role} • ${currentUser.department}</div>
          <div class="desc">
            For successfully demonstrating domain proficiency in <strong>${quiz.skill}</strong> under official national statistical standards, completing <strong>${quiz.title}</strong>.
          </div>
          <div class="score-badge">Final Evaluated Score: ${scorePercent}% (${correctCount}/${totalQuestions})</div>
          <div class="footer">
            <div>Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Verification ID: MOSPI-PK-${Math.floor(100000 + Math.random() * 900000)}</div>
            <div>Competency Division, MoSPI</div>
          </div>
        </div>
      </body>
      </html>
    `);
    certWindow.document.close();
    certWindow.focus();
    setTimeout(() => { certWindow.print(); }, 250);
  };

  // Final Results Screen
  if (quizCompleted) {
    const answersList = Object.values(userAnswers);
    const score = answersList.filter(a => a.isCorrect).length;
    const scorePercent = Math.round((score / totalQuestions) * 100);

    return (
      <div className="fade-in" style={{ maxWidth: 700, margin: '0 auto', paddingBottom: 40 }}>
        <div className="quiz-result">
          <div className="score-circle" style={{ borderColor: scorePercent >= 75 ? 'var(--success)' : 'var(--primary)' }}>
            <span className="score-value">{scorePercent}%</span>
            <span className="score-label">{t('overall_score', 'Score')}</span>
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
            {scorePercent >= 80 ? `🎉 ${t('exceptional_mastery', 'Exceptional Mastery!')}` : scorePercent >= 60 ? `👍 ${t('solid_proficiency', 'Solid Proficiency!')}` : `💪 ${t('targeted_learning', 'Targeted Learning Required')}`}
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 20 }}>
            You scored {score} out of {totalQuestions} correct on <strong>{quiz.title}</strong>
          </p>

          {/* Gamification Rewards */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <div className="header-badge xp" style={{ fontSize: 13, padding: '8px 16px' }}>
              <Zap size={16} /> +{earnedXP} XP Earned
            </div>
            <div className="header-badge streak" style={{ fontSize: 13, padding: '8px 16px' }}>
              <Sparkles size={16} /> Competency +15% Boost
            </div>
          </div>

          {/* Competency Gap Live Update Box */}
          <div className="card mb-6" style={{ textAlign: 'left', borderColor: 'var(--primary)', background: 'var(--primary-subtle)', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Award size={28} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>
                  Official Skill Benchmark Updated!
                </h4>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Your proficiency rating for <strong>{tSkill(quiz.skill)}</strong> has been calibrated. Your radar chart on the dashboard and personalized course recommendations have been refreshed.
                </p>
              </div>
            </div>
          </div>

          {/* Certificate & Actions Row */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <button className="btn btn-primary" onClick={handlePrintCertificate}>
              <Printer size={16} /> {t('print_certificate', 'Print Official Certificate')}
            </button>
            <Link href="/recommendations" className="btn btn-outline">
              <BookOpen size={16} /> {t('tab_courses', 'Recommended Courses')}
            </Link>
            <Link href="/dashboard" className="btn btn-ghost">
              <Home size={16} /> {t('return_to_dashboard', 'Return to Dashboard')}
            </Link>
          </div>

          {/* Question Review Accordion */}
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
              {t('detailed_analysis', 'Detailed Question Analysis')} ({score}/{totalQuestions})
            </h3>
            {quiz.questions.map((q, idx) => {
              const ans = userAnswers[idx];
              const isCorrect = ans?.isCorrect;
              return (
                <div key={q.id || idx} className="card mb-3" style={{ padding: 16, background: 'var(--bg-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    {isCorrect ? (
                      <CheckCircle2 size={20} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                    ) : (
                      <XCircle size={20} style={{ color: 'var(--error)', flexShrink: 0, marginTop: 2 }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>
                        Q{idx + 1}. {q.question}
                      </p>
                      <div style={{ fontSize: 13, marginBottom: 4 }}>
                        {t('your_answer', 'Your answer')}: <span style={{ color: isCorrect ? 'var(--success)' : 'var(--error)', fontWeight: 600 }}>
                          {ans ? q.options[ans.selected] : t('not_answered', 'Not answered')}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div style={{ fontSize: 13, color: 'var(--success)', fontWeight: 600, marginBottom: 4 }}>
                          {t('correct_answer', 'Correct answer')}: {q.options[q.correctAnswer]}
                        </div>
                      )}
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5, background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                        💡 <strong>{t('official_note', 'Official Note')}:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 60 }}>
      {/* Contextual Back Navigation Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <Link
          href="/quiz"
          className="btn btn-ghost btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', fontSize: 13 }}
        >
          <ChevronLeft size={16} /> {t('back_to_quizzes', 'Back to Quizzes')}
        </Link>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
          {tSkill(quiz.skill)}
        </span>
      </div>

      {/* Top Bar: Progress, Timer, and Metadata */}
      <div className="card mb-6" style={{ padding: '16px 20px', background: 'var(--bg-surface)' }}>
        <div className="flex-between mb-3" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700 }}>
              {tSkill(quiz.skill)} • {quiz.title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 2, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>
                {t('question_of', 'Question')} {currentQ + 1} / {totalQuestions}
              </span>
              <span className={`tag ${question.difficulty === 'Easy' ? 'tag-easy' : question.difficulty === 'Hard' ? 'tag-hard' : 'tag-medium'}`}>
                {question.difficulty}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="header-badge" style={{ padding: '6px 12px', background: secondsRemaining < 60 ? 'var(--error-bg)' : 'var(--bg-elevated)', color: secondsRemaining < 60 ? 'var(--error)' : 'inherit' }}>
              <Clock size={15} />
              <span style={{ fontWeight: 700, fontFamily: 'monospace' }}>{formatTime(secondsRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-track" style={{ height: 6 }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Question Palette Buttons */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {quiz.questions.map((_, idx) => {
            const isAnswered = userAnswers[idx] !== undefined;
            const isCurrent = idx === currentQ;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQ(idx)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isCurrent ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isCurrent ? 'var(--primary-subtle)' : isAnswered ? 'var(--bg-elevated)' : 'transparent',
                  color: isCurrent ? 'var(--primary)' : isAnswered ? 'var(--text-primary)' : 'var(--text-tertiary)',
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Card */}
      <div className={animateIn ? 'fade-in' : ''}>
        <div className="mcq-card" style={{ marginBottom: 0, padding: 'clamp(16px, 3vw, 24px)' }}>
          <p className="mcq-question" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.5, marginBottom: 20 }}>
            {currentQ + 1}. {question.question}
          </p>

          <div className="mcq-options">
            {question.options.map((opt, i) => {
              let className = 'mcq-option';
              if (showResult) {
                if (i === question.correctAnswer) className += ' correct';
                else if (i === selectedAnswer && i !== question.correctAnswer) className += ' incorrect';
              } else if (i === selectedAnswer) {
                className += ' selected';
              }

              return (
                <div
                  key={i}
                  className={className}
                  onClick={() => handleSelect(i)}
                >
                  <span className="mcq-option-letter">{letters[i]}</span>
                  <span style={{ wordBreak: 'break-word', flex: 1 }}>{opt}</span>
                </div>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {showResult && (
            <div className="card mt-4" style={{ background: 'var(--bg-elevated)', borderLeft: '4px solid var(--primary)', padding: 16 }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Official Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex-between mt-6" style={{ flexWrap: 'wrap', gap: 10 }}>
          <button
            className="btn btn-ghost"
            disabled={currentQ === 0}
            onClick={handlePrev}
            style={{ opacity: currentQ === 0 ? 0.3 : 1, flex: '1 1 100px', justifyContent: 'center' }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          {!showResult ? (
            <button
              className="btn btn-primary btn-md"
              disabled={selectedAnswer === null}
              style={{ opacity: selectedAnswer === null ? 0.5 : 1, flex: '2 1 160px', justifyContent: 'center' }}
              onClick={handleSubmitAnswer}
            >
              Confirm Answer
            </button>
          ) : (
            <button className="btn btn-primary btn-md" style={{ flex: '2 1 160px', justifyContent: 'center' }} onClick={handleNext}>
              {currentQ < totalQuestions - 1 ? (
                <>Next Question <ChevronRight size={16} /></>
              ) : (
                <>Complete Assessment <Award size={16} /></>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="mobile-quiz-sticky-bar hide-desktop">
        <button
          className="btn btn-ghost btn-sm"
          disabled={currentQ === 0}
          onClick={handlePrev}
          style={{ opacity: currentQ === 0 ? 0.3 : 1, padding: '8px 12px' }}
          aria-label="Previous Question"
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            Q{currentQ + 1} / {totalQuestions}
          </span>
          <div style={{ fontSize: 11, color: secondsRemaining < 60 ? 'var(--error)' : 'var(--text-tertiary)', fontFamily: 'monospace' }}>
            ⏱ {formatTime(secondsRemaining)}
          </div>
        </div>

        {!showResult ? (
          <button
            className="btn btn-primary btn-sm"
            disabled={selectedAnswer === null}
            style={{ opacity: selectedAnswer === null ? 0.5 : 1, padding: '8px 18px', fontWeight: 700 }}
            onClick={handleSubmitAnswer}
          >
            Confirm
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" style={{ padding: '8px 18px', fontWeight: 700 }} onClick={handleNext}>
            {currentQ < totalQuestions - 1 ? (
              <>Next <ChevronRight size={14} /></>
            ) : (
              <>Finish <Award size={14} /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
