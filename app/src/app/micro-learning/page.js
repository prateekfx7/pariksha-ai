'use client';
import { useState, useEffect } from 'react';
import { Sparkles, Brain, Zap, RotateCw, CheckCircle2, ChevronRight, ChevronLeft, Award, Play, BookOpen, Layers, Target, RefreshCw, Terminal, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { skills, sampleMicroLearning } from '@/data/mockData';
import Link from 'next/link';

export default function MicroLearningPage() {
  const { gapData, apiKey, addMicroLearningResult, completedMicroUnits, getSkillDecayStatus } = useApp();

  // Pick top gap skill by default
  const defaultSkill = gapData?.gapList?.[0]?.skill || "Survey Design";
  const [selectedSkill, setSelectedSkill] = useState(defaultSkill);
  const [format, setFormat] = useState('flashcards'); // 'flashcards' | 'caselet' | 'nugget'
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeUnit, setActiveUnit] = useState(null);
  
  // Flashcard state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Caselet state
  const [selectedCaseletOption, setSelectedCaseletOption] = useState(null);
  const [isCaseletSubmitted, setIsCaseletSubmitted] = useState(false);

  // Unit completion state
  const [unitCompleted, setUnitCompleted] = useState(false);

  useEffect(() => {
    loadContentForSkill(defaultSkill, 'flashcards');
  }, [defaultSkill]);

  const loadContentForSkill = (skill, unitFormat) => {
    const fallback = sampleMicroLearning[skill] || sampleMicroLearning["Survey Design"];
    setActiveUnit({
      skill,
      format: unitFormat,
      data: fallback[unitFormat] || fallback.flashcards,
      source: 'Procedural Official MoSPI Bank'
    });
    setCurrentCardIdx(0);
    setIsFlipped(false);
    setSelectedCaseletOption(null);
    setIsCaseletSubmitted(false);
    setUnitCompleted(false);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setUnitCompleted(false);

    // If API key is available, call Gemini 1.5 Flash
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const prompt = `You are a Senior Statistical Officer in the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.
Generate a high-yield micro-learning module for statistical officers on the topic "${selectedSkill}".
Format: ${format === 'flashcards' ? '3 high-yield flashcards with front (concept/term) and back (deep explanation/formula)' : format === 'caselet' ? '1 practical field decision caselet with scenario, question, 4 options, correctAnswer index (0-3), and detailed explanation' : 'A 60-second concept nugget with title and 4 concise bullet takeaways'}.

Respond ONLY with raw JSON:
${format === 'flashcards' ? '[{"front": "string", "back": "string", "tag": "string"}]' : format === 'caselet' ? '{"title": "string", "scenario": "string", "question": "string", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "string"}' : '{"title": "string", "takeaways": ["point 1", "point 2", "point 3", "point 4"]}'}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
            setActiveUnit({
              skill: selectedSkill,
              format,
              data: parsed,
              source: 'Gemini 1.5 Flash AI Engine'
            });
            setCurrentCardIdx(0);
            setIsFlipped(false);
            setSelectedCaseletOption(null);
            setIsCaseletSubmitted(false);
            setIsGenerating(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini micro-learning generation fallback:', err);
      }
    }

    // Procedural fallback
    await new Promise(r => setTimeout(r, 600));
    loadContentForSkill(selectedSkill, format);
    setIsGenerating(false);
  };

  const handleNextCard = () => {
    if (!activeUnit?.data) return;
    setIsFlipped(false);
    if (currentCardIdx < activeUnit.data.length - 1) {
      setCurrentCardIdx(prev => prev + 1);
    } else {
      finishUnit();
    }
  };

  const finishUnit = () => {
    setUnitCompleted(true);
    addMicroLearningResult({
      skill: selectedSkill,
      title: `${selectedSkill} ${format.toUpperCase()} Drill`,
      format: format === 'flashcards' ? 'Flashcards Deck' : format === 'caselet' ? 'Caselet Scenario' : 'Concept Nugget',
      score: 100,
      total: 100
    });
  };

  const decayStatus = getSkillDecayStatus(selectedSkill);

  return (
    <div className="fade-in" style={{ maxWidth: 960, margin: '0 auto', paddingBottom: 40 }}>
      {/* Learn Hub Tab Navigation */}
      <div className="card mb-6" style={{ padding: '4px', background: 'var(--bg-surface)', display: 'flex', gap: 4, borderRadius: 'var(--radius-lg)', overflow: 'auto' }}>
        <Link href="/recommendations" style={{
          flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <BookOpen size={16} /> Courses
        </Link>
        <Link href="/micro-learning" style={{
          flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 700, fontSize: 14, textDecoration: 'none',
          background: 'var(--primary)', color: '#fff', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Zap size={16} /> Micro-Drills
        </Link>
        <Link href="/practical-tasks" style={{
          flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Terminal size={16} /> Practical Labs
        </Link>
        <Link href="/readiness" style={{
          flex: 1, padding: '12px 16px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 14, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <TrendingUp size={16} /> Role Readiness
        </Link>
      </div>

      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tag tag-priority" style={{ fontSize: 11 }}>
              <Zap size={13} /> Continuous Skill Preservation
            </span>
            <span className="tag tag-easy" style={{ fontSize: 11 }}>
              2-3 Min Drills
            </span>
          </div>
          <h1 className="section-title">AI Micro-Learning Generator</h1>
          <p className="section-subtitle">
            Bite-sized, on-demand learning nuggets generated to reverse skill decay and bridge targeted MoSPI gaps.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="header-badge xp" style={{ fontSize: 13, padding: '6px 12px' }}>
            <Award size={16} /> {completedMicroUnits.length} Drills Done
          </div>
        </div>
      </div>

      {/* Control Panel Card */}
      <div className="card mb-6" style={{ padding: '18px 20px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {/* Target Skill */}
          <div style={{ flex: '1 1 240px', minWidth: 200 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
              Target Competency
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => {
                setSelectedSkill(e.target.value);
                loadContentForSkill(e.target.value, format);
              }}
              style={{ width: '100%', padding: '9px 12px' }}
            >
              {skills.map(s => {
                const isTopGap = s === defaultSkill;
                return (
                  <option key={s} value={s}>
                    {s} {isTopGap ? '(★ Top Gap)' : ''}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Format Selector */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button
              onClick={() => { setFormat('flashcards'); loadContentForSkill(selectedSkill, 'flashcards'); }}
              className={`btn btn-sm ${format === 'flashcards' ? 'btn-primary' : 'btn-outline'}`}
            >
              <Layers size={14} /> Flashcards (3)
            </button>
            <button
              onClick={() => { setFormat('caselet'); loadContentForSkill(selectedSkill, 'caselet'); }}
              className={`btn btn-sm ${format === 'caselet' ? 'btn-primary' : 'btn-outline'}`}
            >
              <Brain size={14} /> Caselet Scenario
            </button>
            <button
              onClick={() => { setFormat('nugget'); loadContentForSkill(selectedSkill, 'nugget'); }}
              className={`btn btn-sm ${format === 'nugget' ? 'btn-primary' : 'btn-outline'}`}
            >
              <BookOpen size={14} /> 60-Sec Nugget
            </button>
          </div>

          {/* Generator Button */}
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="btn btn-secondary btn-md"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {isGenerating ? (
              <>
                <RotateCw size={14} className="spinner" /> Synthesizing...
              </>
            ) : (
              <>
                <Sparkles size={14} /> Regenerate with AI
              </>
            )}
          </button>
        </div>

        {/* Skill decay status banner */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Skill Freshness:</span>
            <span className={`decay-badge ${decayStatus.status}`}>
              {decayStatus.status === 'fresh' ? '🟢 Fresh' : decayStatus.status === 'fading' ? '🟡 Fading (-10%)' : '🔴 At Risk of Decay'}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
              (Completing this drill restores 100% calibration)
            </span>
          </div>
          {activeUnit?.source && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
              Source: {activeUnit.source}
            </span>
          )}
        </div>
      </div>

      {/* Interactive Micro-Unit Viewport */}
      {!unitCompleted ? (
        <div>
          {/* ── FORMAT 1: 3D FLASHCARDS ── */}
          {format === 'flashcards' && activeUnit?.data && Array.isArray(activeUnit.data) && (
            <div className="card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div className="flex-between mb-4" style={{ maxWidth: 580, margin: '0 auto 16px' }}>
                <span className="tag tag-priority" style={{ fontSize: 11 }}>
                  Card {currentCardIdx + 1} of {activeUnit.data.length}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Click card to flip
                </span>
              </div>

              {/* 3D Flip Card */}
              <div className="flashcard-wrapper" onClick={() => setIsFlipped(prev => !prev)}>
                <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
                  {/* Front */}
                  <div className="flashcard-face flashcard-front">
                    <span className="tag tag-easy mb-3" style={{ fontSize: 11 }}>
                      {activeUnit.data[currentCardIdx]?.tag || selectedSkill}
                    </span>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', maxWidth: 440, lineHeight: 1.4 }}>
                      {activeUnit.data[currentCardIdx]?.front}
                    </h3>
                    <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 16 }}>
                      Tap to reveal official explanation ↻
                    </p>
                  </div>

                  {/* Back */}
                  <div className="flashcard-face flashcard-back">
                    <span className="tag tag-medium mb-3" style={{ fontSize: 11 }}>
                      Official Methodology & Rationale
                    </span>
                    <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.6, maxWidth: 480 }}>
                      {activeUnit.data[currentCardIdx]?.back}
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--primary)', marginTop: 16 }}>
                      Tap to flip back
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24 }}>
                <button
                  onClick={() => { setIsFlipped(false); setCurrentCardIdx(prev => Math.max(0, prev - 1)); }}
                  disabled={currentCardIdx === 0}
                  className="btn btn-outline btn-sm"
                >
                  <ChevronLeft size={16} /> Previous Card
                </button>
                <button
                  onClick={handleNextCard}
                  className="btn btn-primary btn-sm"
                >
                  {currentCardIdx < activeUnit.data.length - 1 ? (
                    <>Next Card <ChevronRight size={16} /></>
                  ) : (
                    <>Complete Drill <CheckCircle2 size={16} /></>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── FORMAT 2: CASELET SCENARIO DRILL ── */}
          {format === 'caselet' && activeUnit?.data && (
            <div className="card" style={{ padding: 24 }}>
              <div className="flex-between mb-3">
                <span className="tag tag-hard" style={{ fontSize: 11 }}>
                  MoSPI Tactical Caselet Drill
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  Decision Assessment
                </span>
              </div>

              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                {activeUnit.data.title || "Field Decision Challenge"}
              </h2>

              <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 20, borderLeft: '4px solid var(--accent-blue)' }}>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                  <strong>Scenario:</strong> {activeUnit.data.scenario}
                </p>
              </div>

              <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>
                {activeUnit.data.question}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {activeUnit.data.options?.map((opt, optIdx) => {
                  let borderCol = 'var(--border)';
                  let bgCol = 'var(--bg-surface)';
                  if (isCaseletSubmitted) {
                    if (optIdx === activeUnit.data.correctAnswer) {
                      borderCol = 'var(--success)';
                      bgCol = 'rgba(52, 211, 153, 0.12)';
                    } else if (selectedCaseletOption === optIdx) {
                      borderCol = 'var(--error)';
                      bgCol = 'rgba(239, 68, 68, 0.12)';
                    }
                  } else if (selectedCaseletOption === optIdx) {
                    borderCol = 'var(--primary)';
                    bgCol = 'var(--primary-glow)';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => !isCaseletSubmitted && setSelectedCaseletOption(optIdx)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        border: `1.5px solid ${borderCol}`,
                        background: bgCol,
                        cursor: isCaseletSubmitted ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'all 150ms ease'
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-tertiary)' }}>
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span style={{ fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Rationale Callout after submission */}
              {isCaseletSubmitted && (
                <div style={{ background: 'var(--bg-elevated)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 20, borderLeft: '4px solid var(--success)' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
                    Official Protocol Rationale:
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {activeUnit.data.explanation}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                {!isCaseletSubmitted ? (
                  <button
                    onClick={() => setIsCaseletSubmitted(true)}
                    disabled={selectedCaseletOption === null}
                    className="btn btn-primary"
                  >
                    Confirm Protocol Decision
                  </button>
                ) : (
                  <button
                    onClick={finishUnit}
                    className="btn btn-primary"
                    style={{ background: 'var(--success)' }}
                  >
                    Complete Drill (+25 XP) <CheckCircle2 size={16} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── FORMAT 3: 60-SECOND CONCEPT NUGGET ── */}
          {format === 'nugget' && activeUnit?.data && (
            <div className="card" style={{ padding: 24 }}>
              <div className="flex-between mb-3">
                <span className="tag tag-priority" style={{ fontSize: 11 }}>
                  ⚡ Rapid Field Brief
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  ~60 Sec Read
                </span>
              </div>

              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
                {activeUnit.data.title || `Essential Standards: ${selectedSkill}`}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {activeUnit.data.takeaways?.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: 14,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--primary-glow)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0
                    }}>
                      {pIdx + 1}
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={finishUnit}
                  className="btn btn-primary"
                >
                  Mark Concept Mastered (+25 XP) <CheckCircle2 size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completion Celebration Banner */
        <div className="card fade-in" style={{ padding: 36, textAlign: 'center', borderColor: 'var(--success)', background: 'rgba(52, 211, 153, 0.05)' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(52, 211, 153, 0.2)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Award size={32} />
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>
            Micro-Learning Drill Completed!
          </h2>

          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.5 }}>
            You refreshed your competency in <strong>{selectedSkill}</strong>. Skill decay risk has been cleared, and your profile is recalibrated.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <div className="header-badge xp" style={{ fontSize: 14, padding: '8px 16px' }}>
              <Zap size={16} /> +25 XP Earned
            </div>
            <div className="header-badge streak" style={{ fontSize: 14, padding: '8px 16px' }}>
              <Sparkles size={16} /> Freshness: 100%
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setUnitCompleted(false);
                loadContentForSkill(selectedSkill, format);
              }}
              className="btn btn-outline"
            >
              <RefreshCw size={14} /> Practice Another Drill
            </button>
            <Link href="/quiz" className="btn btn-primary">
              <Play size={14} /> Take Full Diagnostic Assessment
            </Link>
          </div>
        </div>
      )}

      {/* Completed Drills History */}
      {completedMicroUnits.length > 0 && (
        <div className="mt-8">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            Recent Micro-Learning History ({completedMicroUnits.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {completedMicroUnits.slice(0, 5).map(item => (
              <div key={item.id} className="card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{item.title}</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.format} • {item.date}</span>
                  </div>
                </div>
                <span className="tag tag-priority" style={{ fontSize: 11 }}>
                  +25 XP Logged
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
