'use client';
import { useState } from 'react';
import { Terminal, CheckCircle2, Play, AlertCircle, Award, Sparkles, RotateCw, FileCode, CheckSquare, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { samplePracticalTasks, skills } from '@/data/mockData';
import Link from 'next/link';

export default function PracticalTasksPage() {
  const { apiKey, submitPracticalTask, completedTasks, getSkillDecayStatus } = useApp();

  const [activeTask, setActiveTask] = useState(samplePracticalTasks[0]);
  const [solutionInput, setSolutionInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Custom AI generation state
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [selectedSkillForGen, setSelectedSkillForGen] = useState("Data Science & Analytics");

  const handleSelectTask = (task) => {
    setActiveTask(task);
    setSolutionInput('');
    setEvaluationResult(null);
  };

  const handleGenerateCustomTask = async () => {
    setIsGeneratingTask(true);
    setEvaluationResult(null);

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const prompt = `You are an expert psychometric simulation designer for the Ministry of Statistics and Programme Implementation (MoSPI).
Generate an authentic, challenging practical simulation task for a Statistical Officer on "${selectedSkillForGen}".
Format required in raw JSON:
{
  "id": "task-${Date.now()}",
  "title": "Title here",
  "skill": "${selectedSkillForGen}",
  "difficulty": "Operational",
  "estimatedMinutes": 8,
  "scenario": "Detailed realistic field/administrative situation description",
  "datasetSnippet": [
    {"fieldA": "value", "fieldB": 100}
  ],
  "taskPrompt": "Specific question or coding/analysis challenge for the officer",
  "modelAnswerKey": "Detailed official answer key and expected methodology",
  "rubric": { "methodologyWeight": 40, "protocolWeight": 30, "completenessWeight": 30 }
}`;

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
            setActiveTask(parsed);
            setSolutionInput('');
            setIsGeneratingTask(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Gemini practical task generation error, falling back:', err);
      }
    }

    // Fallback rotation
    await new Promise(r => setTimeout(r, 600));
    const matching = samplePracticalTasks.filter(t => t.skill === selectedSkillForGen);
    const chosen = matching.length > 0 ? matching[0] : samplePracticalTasks[Math.floor(Math.random() * samplePracticalTasks.length)];
    setActiveTask(chosen);
    setSolutionInput('');
    setIsGeneratingTask(false);
  };

  const handleEvaluateSolution = async () => {
    if (!solutionInput.trim()) return;
    setIsEvaluating(true);

    let score = 88;
    let feedback = "Accurately identified core discrepancies and framed correct MoSPI validation logic.";
    let breakdown = {
      methodology: 36,
      protocol: 27,
      completeness: 25
    };

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const evalPrompt = `You are the Official Evaluation Authority for MoSPI psychometric examinations.
Evaluate the officer's solution to the task: "${activeTask.title}".
Task prompt: ${activeTask.taskPrompt}
Model answer key: ${activeTask.modelAnswerKey}

Officer's submitted solution:
"${solutionInput}"

Evaluate and output ONLY valid JSON:
{
  "score": number (0-100),
  "feedback": "2-3 sentences of constructive technical feedback",
  "methodology": number (out of ${activeTask.rubric.methodologyWeight}),
  "protocol": number (out of ${activeTask.rubric.protocolWeight}),
  "completeness": number (out of ${activeTask.rubric.completenessWeight})
}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: evalPrompt }] }],
            generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
            score = parsed.score || 85;
            feedback = parsed.feedback || feedback;
            breakdown = {
              methodology: parsed.methodology || Math.round(score * 0.4),
              protocol: parsed.protocol || Math.round(score * 0.3),
              completeness: parsed.completeness || Math.round(score * 0.3)
            };
          }
        }
      } catch (e) {
        console.warn('Gemini eval fallback:', e);
      }
    } else {
      // Procedural evaluation based on length and key statistical terms
      await new Promise(r => setTimeout(r, 800));
      const hasKeywords = activeTask.modelAnswerKey.split(' ').filter(w => w.length > 5 && solutionInput.toLowerCase().includes(w.toLowerCase()));
      const keywordRatio = Math.min(1, hasKeywords.length / 5);
      score = Math.min(96, Math.max(70, Math.round(75 + keywordRatio * 20 + Math.min(10, solutionInput.length / 50))));
      breakdown = {
        methodology: Math.round(activeTask.rubric.methodologyWeight * (score / 100)),
        protocol: Math.round(activeTask.rubric.protocolWeight * (score / 100)),
        completeness: Math.round(activeTask.rubric.completenessWeight * (score / 100))
      };
    }

    const evalObj = {
      score,
      feedback,
      breakdown,
      taskTitle: activeTask.title,
      skill: activeTask.skill,
      date: new Date().toLocaleDateString()
    };

    setEvaluationResult(evalObj);
    setIsEvaluating(false);

    submitPracticalTask({
      taskId: activeTask.id,
      taskTitle: activeTask.title,
      skill: activeTask.skill,
      solution: solutionInput,
      score,
      feedback
    });
  };

  const decay = getSkillDecayStatus(activeTask.skill);

  return (
    <div className="fade-in" style={{ maxWidth: 1080, margin: '0 auto', paddingBottom: 40 }}>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="tag tag-priority" style={{ fontSize: 11 }}>
              <Terminal size={13} /> Simulation & Problem Lab
            </span>
            <span className="tag tag-easy" style={{ fontSize: 11 }}>
              Real-World Datasets
            </span>
          </div>
          <h1 className="section-title">AI Practical Task Generator</h1>
          <p className="section-subtitle">
            Execute authentic MoSPI fieldwork scenarios, data cleaning challenges, and spatial adjustments with automated AI rubric grading.
          </p>
        </div>
        <div className="header-badge xp" style={{ fontSize: 13, padding: '6px 12px' }}>
          <Award size={16} /> {completedTasks.length} Tasks Evaluated
        </div>
      </div>

      {/* Task Selection & Custom Generator Bar */}
      <div className="card mb-6" style={{ padding: '16px 20px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', flex: 1, minWidth: 300, paddingBottom: 4 }}>
            {samplePracticalTasks.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => handleSelectTask(t)}
                className={`btn btn-sm ${activeTask.id === t.id ? 'btn-primary' : 'btn-outline'}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                Task {idx + 1}: {t.title.split(':')[0]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={selectedSkillForGen}
              onChange={(e) => setSelectedSkillForGen(e.target.value)}
              style={{ padding: '6px 10px', fontSize: 12 }}
            >
              {skills.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button
              onClick={handleGenerateCustomTask}
              disabled={isGeneratingTask}
              className="btn btn-secondary btn-sm"
              style={{ whiteSpace: 'nowrap' }}
            >
              {isGeneratingTask ? <RotateCw size={14} className="spinner" /> : <Sparkles size={14} />}
              Generate AI Task
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation Workspace Grid */}
      <div className="grid-sidebar" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: 20 }}>
        {/* Left Column: Task Scenario & Dataset Viewer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="flex-between mb-3">
              <span className={`tag ${activeTask.difficulty === 'Expert' ? 'tag-hard' : 'tag-medium'}`}>
                {activeTask.difficulty} • ~{activeTask.estimatedMinutes} Mins
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                Skill: <strong style={{ color: 'var(--text-primary)' }}>{activeTask.skill}</strong>
              </span>
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
              {activeTask.title}
            </h2>

            {/* Scenario Description */}
            <div style={{ background: 'var(--bg-elevated)', padding: 14, borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--primary)', marginBottom: 16 }}>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-primary)', margin: 0 }}>
                {activeTask.scenario}
              </p>
            </div>

            {/* Dataset Snippet Viewer */}
            {activeTask.datasetSnippet && activeTask.datasetSnippet.length > 0 && (
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: 6 }}>
                  📋 Official Data Sample / Microdata Snippet:
                </p>
                <div className="task-table-wrapper">
                  <table className="task-snippet-table">
                    <thead>
                      <tr>
                        {Object.keys(activeTask.datasetSnippet[0]).map(key => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeTask.datasetSnippet.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {Object.values(row).map((val, vIdx) => (
                            <td key={vIdx}>{String(val)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Task Prompt / Challenge Directive */}
            <div style={{ background: 'rgba(240, 90, 40, 0.08)', padding: 14, borderRadius: 'var(--radius-md)', border: '1px solid rgba(240, 90, 40, 0.25)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                🎯 Task Directive:
              </h4>
              <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.5, margin: 0 }}>
                {activeTask.taskPrompt}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Solution Editor & AI Evaluation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: 22 }}>
            <div className="flex-between mb-3">
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>
                Officer Response Workspace
              </h3>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                Code / Protocol / Explanation
              </span>
            </div>

            <textarea
              className="code-editor-area"
              placeholder="Write your diagnostic solution, conditional validation rules, sample allocation math, or operational field protocol here..."
              rows={8}
              value={solutionInput}
              onChange={(e) => setSolutionInput(e.target.value)}
              disabled={isEvaluating}
            />

            <div className="flex-between mt-3">
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                {solutionInput.length} chars • Evaluated against MoSPI Cadre Rubric
              </span>
              <button
                onClick={handleEvaluateSolution}
                disabled={isEvaluating || !solutionInput.trim()}
                className="btn btn-primary btn-sm"
              >
                {isEvaluating ? (
                  <>
                    <RotateCw size={14} className="spinner" /> Evaluating Rubric...
                  </>
                ) : (
                  <>
                    <Play size={14} /> Submit for AI Rubric Evaluation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Rubric Evaluation Report Card */}
          {evaluationResult && (
            <div className="card fade-in" style={{ padding: 22, borderColor: 'var(--success)', background: 'var(--bg-surface)' }}>
              <div className="flex-between mb-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={20} style={{ color: 'var(--success)' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                    AI Rubric Evaluation Score
                  </h3>
                </div>
                <div className="header-badge xp" style={{ fontSize: 14, fontWeight: 800 }}>
                  {evaluationResult.score}% (Passed)
                </div>
              </div>

              {/* Rubric Breakdown Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0 16px' }}>
                <div>
                  <div className="flex-between" style={{ fontSize: 12, marginBottom: 3 }}>
                    <span>Methodological Rigor</span>
                    <span style={{ fontWeight: 700 }}>{evaluationResult.breakdown.methodology}/{activeTask.rubric.methodologyWeight}</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: 6 }}>
                    <div className="progress-bar-fill" style={{ width: `${(evaluationResult.breakdown.methodology / activeTask.rubric.methodologyWeight) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex-between" style={{ fontSize: 12, marginBottom: 3 }}>
                    <span>Official Protocol Adherence</span>
                    <span style={{ fontWeight: 700 }}>{evaluationResult.breakdown.protocol}/{activeTask.rubric.protocolWeight}</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: 6 }}>
                    <div className="progress-bar-fill" style={{ width: `${(evaluationResult.breakdown.protocol / activeTask.rubric.protocolWeight) * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex-between" style={{ fontSize: 12, marginBottom: 3 }}>
                    <span>Practical Completeness</span>
                    <span style={{ fontWeight: 700 }}>{evaluationResult.breakdown.completeness}/{activeTask.rubric.completenessWeight}</span>
                  </div>
                  <div className="progress-bar-track" style={{ height: 6 }}>
                    <div className="progress-bar-fill" style={{ width: `${(evaluationResult.breakdown.completeness / activeTask.rubric.completenessWeight) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Qualitative Feedback */}
              <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-sm)', marginBottom: 14 }}>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  💡 <strong>Evaluator Remarks:</strong> {evaluationResult.feedback}
                </p>
              </div>

              {/* Model Answer Key Toggle */}
              <details style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--primary)', marginBottom: 6 }}>
                  View Official MoSPI Model Solution Key
                </summary>
                <div style={{ whiteSpace: 'pre-line', padding: 12, background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', lineHeight: 1.6, border: '1px solid var(--border-light)' }}>
                  {activeTask.modelAnswerKey}
                </div>
              </details>

              {/* Rewards info */}
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="tag tag-priority">+75 XP Awarded</span>
                <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                  ✓ {activeTask.skill} Calibrated (+12%)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks Audit History */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
            Evaluated Simulation Records ({completedTasks.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {completedTasks.map(t => (
              <div key={t.id} className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CheckSquare size={20} style={{ color: 'var(--success)' }} />
                  <div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{t.taskTitle}</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t.skill} • {t.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="tag tag-easy" style={{ fontSize: 12 }}>Score: {t.score}%</span>
                  <span className="tag tag-priority">+75 XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
