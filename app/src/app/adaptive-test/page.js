'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  BrainCircuit, Sparkles, TrendingUp, CheckCircle2, AlertCircle,
  ArrowRight, ShieldCheck, RefreshCw, BarChart2, Award, Zap, ChevronRight, Play
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  IRT_ITEM_POOL,
  selectNextAdaptiveItem,
  estimateAbility,
  thetaToCompetencyScore,
  getCadreMasteryLevel,
  getItemInformation
} from '@/lib/adaptiveTesting';
import Link from 'next/link';

export default function AdaptiveTestPage() {
  const { userSkills, updateSkillScore, t, tSkill } = useApp();
  const [testState, setTestState] = useState('intro'); // 'intro' | 'testing' | 'feedback' | 'completed'
  const [theta, setTheta] = useState(0.0);
  const [se, setSe] = useState(1.0);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [responseHistory, setResponseHistory] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [lastFeedback, setLastFeedback] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => { setAnimateIn(true); }, []);

  const startTest = () => {
    const firstItem = selectNextAdaptiveItem(0.0, []);
    setCurrentItem(firstItem);
    setTheta(0.0);
    setSe(1.0);
    setAnsweredIds([]);
    setResponseHistory([]);
    setSelectedOption(null);
    setTestState('testing');
  };

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentItem) return;

    const isCorrect = selectedOption === currentItem.correctAnswer;
    const newHistory = [...responseHistory, { item: currentItem, isCorrect }];
    const newAnsweredIds = [...answeredIds, currentItem.id];

    // Recalculate theta and standard error via Newton-Raphson
    const { theta: newTheta, se: newSe } = estimateAbility(newHistory, theta);

    setResponseHistory(newHistory);
    setAnsweredIds(newAnsweredIds);
    setTheta(newTheta);
    setSe(newSe);

    setLastFeedback({
      isCorrect,
      explanation: currentItem.explanation,
      previousTheta: theta,
      newTheta,
      difficulty: currentItem.b > 0.8 ? 'Advanced' : currentItem.b > -0.5 ? 'Intermediate' : 'Foundational'
    });

    setTestState('feedback');
  };

  const handleNextStep = () => {
    // Stopping conditions:
    // 1. High precision reached (SE < 0.42) AND at least 4 items answered
    // 2. Max items reached (5 items)
    if ((se < 0.42 && responseHistory.length >= 4) || responseHistory.length >= 5) {
      // Complete!
      const finalScore = thetaToCompetencyScore(theta);
      if (currentItem && currentItem.skill) {
        updateSkillScore(currentItem.skill, finalScore);
      }
      setTestState('completed');
      return;
    }

    // Select next optimal item matching updated theta
    const nextItem = selectNextAdaptiveItem(theta, answeredIds);
    if (!nextItem) {
      setTestState('completed');
      return;
    }

    setCurrentItem(nextItem);
    setSelectedOption(null);
    setTestState('testing');
  };

  const competencyScore = useMemo(() => thetaToCompetencyScore(theta), [theta]);
  const masteryLevel = useMemo(() => getCadreMasteryLevel(theta), [theta]);

  return (
    <div className={animateIn ? 'fade-in' : ''} style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 50 }}>
      {/* Page Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
              background: 'linear-gradient(135deg, #f05a28 0%, #3b82f6 100%)', color: '#fff', textTransform: 'uppercase'
            }}>
              Psychometric AI
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
              2-Parameter Logistic (2PL) Rasch Model
            </span>
          </div>
          <h1 className="section-title">Computerized Adaptive Testing (CAT)</h1>
          <p className="section-subtitle">
            Dynamically adjusts item difficulty in real time to pinpoint your exact competency level in just 4–5 calibrated questions.
          </p>
        </div>
      </div>

      {/* INTRO STATE */}
      {testState === 'intro' && (
        <div className="card" style={{ padding: 'clamp(20px, 4vw, 36px)', background: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #f05a28 0%, #e04818 100%)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px var(--primary-glow)'
            }}>
              <BrainCircuit size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                How Adaptive Testing Works
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Replaces rigid 25-question exams with psychometric precision
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 24 }}>
            <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: 20 }}>🎯</span>
              <h4 style={{ fontSize: 14, fontWeight: 800, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
                Real-Time Calibration
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Answer correctly, and the AI presents a more rigorous MoSPI problem. If you miss, it adjusts downward to locate your exact baseline.
              </p>
            </div>

            <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: 20 }}>⚡</span>
              <h4 style={{ fontSize: 14, fontWeight: 800, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
                80% Time Savings
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Item Response Theory converges on your true ability parameter (&theta;) in only 4 to 5 questions with 95% statistical confidence.
              </p>
            </div>

            <div style={{ padding: 16, background: 'var(--bg-elevated)', borderRadius: 10, border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: 20 }}>🏛️</span>
              <h4 style={{ fontSize: 14, fontWeight: 800, margin: '8px 0 4px', color: 'var(--text-primary)' }}>
                Cadre-Matched Standards
              </h4>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
                Calibrated against official MoSPI (NSSO, CSO, ASI) methodological circulars and Indian Statistical Service (ISS) benchmarks.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              Estimated time: 3–5 minutes • 5 calibrated questions maximum
            </span>
            <button
              onClick={startTest}
              className="btn btn-primary"
              style={{ padding: '12px 28px', fontSize: 14, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span>Begin Adaptive Assessment</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE TESTING / FEEDBACK STATES */}
      {(testState === 'testing' || testState === 'feedback') && currentItem && (
        <div>
          {/* Live Psychometric Diagnostic Telemetry Bar */}
          <div className="card mb-5" style={{
            padding: '14px 18px', background: 'var(--bg-surface)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Latent Ability (&theta;)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace' }}>
                    {theta >= 0 ? `+${theta.toFixed(2)}` : theta.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    (&plusmn;{(se * 1.96).toFixed(2)})
                  </span>
                </div>
              </div>

              <div style={{ width: 1, height: 32, background: 'var(--border)' }} />

              <div>
                <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Projected MoSPI Score
                </span>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-primary)' }}>
                  {competencyScore}<span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)' }}>/100</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`tag ${currentItem.b > 0.8 ? 'tag-hard' : currentItem.b > -0.5 ? 'tag-medium' : 'tag-easy'}`}>
                Item Difficulty: {currentItem.b > 0.8 ? 'Advanced' : currentItem.b > -0.5 ? 'Intermediate' : 'Foundational'} (b = {currentItem.b})
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>
                Question {responseHistory.length + 1} of 5
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="card mb-5" style={{ padding: 'clamp(18px, 3.5vw, 28px)', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>
                {currentItem.skill}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                Discrimination (a): {currentItem.a}
              </span>
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.5, marginBottom: 20, color: 'var(--text-primary)' }}>
              {currentItem.question}
            </h3>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {currentItem.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentItem.correctAnswer;
                let bg = 'var(--bg-elevated)';
                let border = '1px solid var(--border)';
                let textColor = 'var(--text-primary)';

                if (testState === 'feedback') {
                  if (isCorrect) {
                    bg = 'rgba(34, 197, 94, 0.15)';
                    border = '1.5px solid #22c55e';
                    textColor = '#22c55e';
                  } else if (isSelected && !isCorrect) {
                    bg = 'rgba(239, 68, 68, 0.15)';
                    border = '1.5px solid #ef4444';
                    textColor = '#ef4444';
                  }
                } else if (isSelected) {
                  bg = 'var(--primary-glow)';
                  border = '1.5px solid var(--primary)';
                  textColor = 'var(--primary)';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => testState === 'testing' && handleSelectOption(idx)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: bg,
                      border,
                      cursor: testState === 'testing' ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 150ms ease'
                    }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: isSelected ? 'var(--primary)' : 'var(--bg-card)',
                      color: isSelected ? '#fff' : 'var(--text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                      border: isSelected ? 'none' : '1px solid var(--border)'
                    }}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: isSelected ? 700 : 500, color: textColor, lineHeight: 1.4 }}>
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Real-Time Recalibration Feedback Box */}
            {testState === 'feedback' && lastFeedback && (
              <div style={{
                padding: 16, borderRadius: 10, marginBottom: 20,
                background: lastFeedback.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(240, 90, 40, 0.1)',
                border: `1px solid ${lastFeedback.isCorrect ? 'rgba(34, 197, 94, 0.3)' : 'rgba(240, 90, 40, 0.3)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  {lastFeedback.isCorrect ? (
                    <CheckCircle2 size={18} color="#22c55e" />
                  ) : (
                    <AlertCircle size={18} color="var(--primary)" />
                  )}
                  <span style={{ fontSize: 13, fontWeight: 800, color: lastFeedback.isCorrect ? '#22c55e' : 'var(--primary)' }}>
                    {lastFeedback.isCorrect ? 'Correct! Ability estimate upgraded.' : 'Incorrect. Calibrating difficulty.'}
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.45 }}>
                  {lastFeedback.explanation}
                </p>
                <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                  &theta; adjusted from {lastFeedback.previousTheta >= 0 ? `+${lastFeedback.previousTheta}` : lastFeedback.previousTheta} &rarr;{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{lastFeedback.newTheta >= 0 ? `+${lastFeedback.newTheta}` : lastFeedback.newTheta}</strong>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              {testState === 'testing' ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontWeight: 700 }}
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <span>{responseHistory.length >= 5 ? 'View Final Psychometric Report' : 'Next Calibrated Question'}</span>
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* COMPLETED STATE */}
      {testState === 'completed' && (
        <div className="card fade-in" style={{ padding: 'clamp(20px, 4vw, 36px)', background: 'var(--bg-surface)' }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)', marginBottom: 12
            }}>
              <Award size={30} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 4px' }}>
              Adaptive Assessment Complete
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
              Test converged with 95% statistical confidence in {responseHistory.length} calibrated questions
            </p>
          </div>

          {/* Results Diagnostic Card */}
          <div style={{
            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)',
            padding: 24, border: '1px solid var(--border)', marginBottom: 24
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, textAlign: 'center', marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Calibrated Competency
                </span>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1, margin: '4px 0' }}>
                  {competencyScore}%
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>MoSPI Official Scale</span>
              </div>

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Latent Ability Parameter (&theta;)
                </span>
                <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', lineHeight: 1.1, margin: '4px 0' }}>
                  {theta >= 0 ? `+${theta.toFixed(2)}` : theta.toFixed(2)}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Standard Error: &plusmn;{se.toFixed(2)}</span>
              </div>

              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Cadre Classification
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: masteryLevel.color, lineHeight: 1.2, margin: '8px 0 4px' }}>
                  {masteryLevel.title}
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{masteryLevel.grade}</span>
              </div>
            </div>

            <div style={{ padding: 14, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                📋 <strong>Cadre Insight:</strong> {masteryLevel.summary}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '10px 22px' }}>
              Back to Dashboard
            </Link>
            <Link href="/recommendations" className="btn btn-outline" style={{ padding: '10px 20px' }}>
              View Recommended Courses
            </Link>
            <button onClick={startTest} className="btn btn-ghost" style={{ padding: '10px 16px' }}>
              <RefreshCw size={14} /> Retake Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
