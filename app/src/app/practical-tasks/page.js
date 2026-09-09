'use client';
import { useState } from 'react';
import { Terminal, CheckCircle2, Play, AlertCircle, Award, Sparkles, RotateCw, FileCode, CheckSquare, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { samplePracticalTasks, skills } from '@/data/mockData';
import Link from 'next/link';

// ─── Authentic MoSPI Procedural Rubric Evaluator ───
function evaluateSolutionRubric(task, solution) {
  const text = solution.trim();
  const lower = text.toLowerCase();

  if (text.length < 25) {
    return {
      score: 20,
      feedback: "Submission is too brief to evaluate against official MoSPI operational standards. It lacks methodological rationale, specific data record references, and verifiable validation assertions.",
      breakdown: {
        methodology: Math.round(task.rubric.methodologyWeight * 0.2),
        protocol: Math.round(task.rubric.protocolWeight * 0.25),
        completeness: Math.round(task.rubric.completenessWeight * 0.2)
      }
    };
  }

  let methodologyScore = 0;
  let protocolScore = 0;
  let completenessScore = 0;
  let specificCritiques = [];

  if (task.id === 'task-1') {
    // PLFS 2022-23 UPSS Validation
    const checks = [
      { terms: ['0102', 'child', 'age 8', 'age < 15', 'primary', 'public admin'], desc: 'Identified PLFS-0102 child wage labour anomaly' },
      { terms: ['0103', '81', 'unemployed', 'earnings', '65000', 'seeking', 'contradiction'], desc: 'Identified PLFS-0103 unemployed status with positive earnings' },
      { terms: ['0104', '67', 'illiterate', '91', 'education', 'pension', '95'], desc: 'Identified PLFS-0104 elderly illiterate attending school' },
      { terms: ['0105', '-3200', 'negative', 'casual labour', 'non-negativ'], desc: 'Identified PLFS-0105 negative earnings constraint' },
      { terms: ['assert', 'if', 'where', 'then', 'select', 'flag', 'rule', '<=', '==', 'def '], desc: 'Formulated conditional logic or validation code' },
    ];
    let passed = checks.filter(c => c.terms.some(t => lower.includes(t))).length;
    methodologyScore = Math.round(task.rubric.methodologyWeight * Math.min(1, (passed * 0.22) + (text.length > 180 ? 0.12 : 0)));
    protocolScore = Math.round(task.rubric.protocolWeight * (lower.includes('mospi') || lower.includes('plfs') || lower.includes('upss') || lower.includes('schedule 10') ? 0.95 : 0.65));
    completenessScore = Math.round(task.rubric.completenessWeight * Math.min(1, passed / 4));

    if (passed >= 4) {
      specificCritiques.push("Excellently audited PLFS microdata records. Correctly articulated UPSS status codes and established robust data hygiene assertions.");
    } else if (passed >= 2) {
      specificCritiques.push("Identified key record anomalies, but missed some cross-tabulation validations (e.g. child labour restrictions or negative income checks).");
    } else {
      specificCritiques.push("Limited anomaly detection. Ensure you reference specific PLFS record IDs and write programmatic assertion logic.");
    }
  } else if (task.id === 'task-2') {
    // ASI 2021-22 GVA & Input-Output
    const checks = [
      { terms: ['4011', '21', '21000', 'accurate', 'correct', 'nva'], desc: 'Verified ASI-MH-4011 GVA calculation' },
      { terms: ['4012', 'fraud', 'negative', '-7', 'discrepancy', '19', 'textiles'], desc: 'Identified ASI-TN-4012 reported GVA fraud' },
      { terms: ['4015', '-9', 'brick', 'minerals', 'semi-finished', 'inventory', 'power'], desc: 'Evaluated ASI-UP-4015 negative GVA vs fuel ratio' },
      { terms: ['gva =', 'output - input', 'gross output -', 'raw materials', 'depreciation', 'nva ='], desc: 'Applied exact GVA and NVA accounting identities' },
    ];
    let passed = checks.filter(c => c.terms.some(t => lower.includes(t))).length;
    methodologyScore = Math.round(task.rubric.methodologyWeight * Math.min(1, (passed * 0.26) + (text.length > 180 ? 0.12 : 0)));
    protocolScore = Math.round(task.rubric.protocolWeight * (lower.includes('asi') || lower.includes('nad') || lower.includes('block') || lower.includes('gva') ? 0.95 : 0.60));
    completenessScore = Math.round(task.rubric.completenessWeight * Math.min(1, passed / 3));

    if (passed >= 3) {
      specificCritiques.push("Rigorously applied National Accounts Division ASI audit procedures. Identified fraudulent textile return and computed true Net Value Added.");
    } else if (passed >= 2) {
      specificCritiques.push("Computed baseline input-output sums, but check factory ASI-TN-4012 for the discrepancy between calculated GVA (-7M) and reported GVA (+12M).");
    } else {
      specificCritiques.push("Incomplete reconciliation of ASI Block J accounts. Write out the full Gross Output minus Total Inputs arithmetic.");
    }
  } else if (task.id === 'task-3') {
    // CPI Base 2012=100
    const checks = [
      { terms: ['147', '159', '175', '193', '224', 'relative', 'p_t / p_0'], desc: 'Computed price relatives for rice/milk/fuel' },
      { terms: ['7.46', '4.64', 'weight', 'rural', 'urban', 'basket', 'twice', 'sensitivity'], desc: 'Referenced Laspeyres commodity basket weights' },
      { terms: ['laspeyres', 'sum(w', 'index', 'inflation', 'percentage'], desc: 'Articulated official index compilation formula' },
    ];
    let passed = checks.filter(c => c.terms.some(t => lower.includes(t))).length;
    methodologyScore = Math.round(task.rubric.methodologyWeight * Math.min(1, (passed * 0.35) + (text.length > 150 ? 0.15 : 0)));
    protocolScore = Math.round(task.rubric.protocolWeight * (lower.includes('cpi') || lower.includes('laspeyres') || lower.includes('psd') ? 0.95 : 0.65));
    completenessScore = Math.round(task.rubric.completenessWeight * Math.min(1, passed / 2.5));

    if (passed >= 2) {
      specificCritiques.push("Accurately explained rural inflation sensitivity driven by higher food/vegetable weights (7.46% vs 4.64%) under Laspeyres aggregation.");
    } else {
      specificCritiques.push("Review official CPI basket weight distribution between rural and urban sectors to explain differential inflation impact.");
    }
  } else if (task.id === 'task-4') {
    // Neyman Sample Allocation
    const checks = [
      { terms: ['308', '504', '520', '612', '1944', '1,944,000', 'n * s', 'n_h * s_h'], desc: 'Calculated N_h * S_h products' },
      { terms: ['190', '311', '321', '378', 'total = 1200', '1,200'], desc: 'Allocated stratum sample sizes' },
      { terms: ['1.36', '1.11', '4.01', '2.10', 'fraction', 'f_h', 'variance', 'heterogeneity'], desc: 'Analyzed sampling fractions & variance minimization' },
    ];
    let passed = checks.filter(c => c.terms.some(t => lower.includes(t))).length;
    methodologyScore = Math.round(task.rubric.methodologyWeight * Math.min(1, (passed * 0.35) + (text.length > 150 ? 0.15 : 0)));
    protocolScore = Math.round(task.rubric.protocolWeight * (lower.includes('neyman') || lower.includes('sdrd') || lower.includes('strat') ? 0.95 : 0.60));
    completenessScore = Math.round(task.rubric.completenessWeight * Math.min(1, passed / 2.5));

    if (passed >= 2) {
      specificCritiques.push("Methodologically sound execution of Neyman optimal sample allocation. Clearly recognized why high-variance strata receive disproportionate sampling fractions.");
    } else {
      specificCritiques.push("Remember the Neyman formula: n_h = n * (N_h * S_h) / sum(N_i * S_i). Ensure all stratum multiplications are calculated.");
    }
  } else if (task.id === 'task-5') {
    // GIS LGD Boundary
    const checks = [
      { terms: ['epsg', '32643', 'utm', 'reproject', 'projection', 'wgs84', 'meters'], desc: 'Addressed CRS coordinate reprojection' },
      { terms: ['snap', 'tolerance', '5', 'meter', 'vertex'], desc: 'Configured snapping tolerance' },
      { terms: ['eliminate', 'sliver', '50', 'shared boundary', 'neighbor'], desc: 'Defined sliver polygon merging rule' },
      { terms: ['fix geometries', 'union', 'planar', 'area', 'self-intersect'], desc: 'Specified topological cleaning & validation' },
    ];
    let passed = checks.filter(c => c.terms.some(t => lower.includes(t))).length;
    methodologyScore = Math.round(task.rubric.methodologyWeight * Math.min(1, (passed * 0.28) + (text.length > 150 ? 0.15 : 0)));
    protocolScore = Math.round(task.rubric.protocolWeight * (lower.includes('qgis') || lower.includes('lgd') || lower.includes('gis') ? 0.95 : 0.60));
    completenessScore = Math.round(task.rubric.completenessWeight * Math.min(1, passed / 3));

    if (passed >= 3) {
      specificCritiques.push("Excellent geoprocessing sequence. Addressed CRS transformation, topological snapping, and planar union validation to prevent double-counting.");
    } else {
      specificCritiques.push("Include explicit CRS parameters (e.g. EPSG:32643) and snapping threshold metrics to avoid micro-gaps.");
    }
  } else if (task.id === 'task-6') {
    // NDGFP SDC
    const checks = [
      { terms: ['4005', '4009', 'med-04', 'med-05', 'med-06', 'k=3', 'k < 3', 'violate'], desc: 'Identified k-anonymity violations' },
      { terms: ['pin', '208', 'mask', 'generaliz', 'age band', 'group'], desc: 'Proposed postal/age generalization' },
      { terms: ['top-code', 'top code', 'percentile', 'expenditure', '145000', 'suppression'], desc: 'Applied top-coding and cell suppression' },
    ];
    let passed = checks.filter(c => c.terms.some(t => lower.includes(t))).length;
    methodologyScore = Math.round(task.rubric.methodologyWeight * Math.min(1, (passed * 0.35) + (text.length > 150 ? 0.15 : 0)));
    protocolScore = Math.round(task.rubric.protocolWeight * (lower.includes('ndgfp') || lower.includes('anonymity') || lower.includes('sdc') ? 0.95 : 0.60));
    completenessScore = Math.round(task.rubric.completenessWeight * Math.min(1, passed / 2.5));

    if (passed >= 2) {
      specificCritiques.push("Compliant with National Data Governance Framework guidelines. Effectively balanced analytical utility with k-anonymity disclosure control.");
    } else {
      specificCritiques.push("Identify the exact equivalence classes with fewer than 3 records (e.g. MED-04, MED-06) and detail the masking techniques.");
    }
  } else {
    // Generic fallback for custom generated tasks
    const keywords = task.modelAnswerKey.toLowerCase().split(/\s+/).filter(w => w.length > 4);
    const matches = keywords.filter(w => lower.includes(w));
    const ratio = Math.min(1, matches.length / Math.max(5, keywords.length * 0.2));
    methodologyScore = Math.round(task.rubric.methodologyWeight * (0.3 + ratio * 0.65));
    protocolScore = Math.round(task.rubric.protocolWeight * (0.4 + (lower.includes('mospi') ? 0.5 : 0.3)));
    completenessScore = Math.round(task.rubric.completenessWeight * Math.min(1, text.length / 250));
    specificCritiques.push(ratio > 0.5 ? "Good domain coverage aligning with MoSPI operational practice." : "Consider referencing official guidelines and methodological formulas more explicitly.");
  }

  const totalScore = Math.min(98, Math.max(15, methodologyScore + protocolScore + completenessScore));
  return {
    score: totalScore,
    feedback: specificCritiques.join(' ') || "Solution evaluated against MoSPI competency standards.",
    breakdown: {
      methodology: methodologyScore,
      protocol: protocolScore,
      completeness: completenessScore
    }
  };
}

export default function PracticalTasksPage() {
  const { apiKey, submitPracticalTask, completedTasks, getSkillDecayStatus } = useApp();

  const [activeTask, setActiveTask] = useState(samplePracticalTasks[0]);
  const [solutionInput, setSolutionInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [dataViewMode, setDataViewMode] = useState('table'); // 'table' | 'json'
  const [copiedData, setCopiedData] = useState(false);

  // Custom AI generation state
  const [isGeneratingTask, setIsGeneratingTask] = useState(false);
  const [selectedSkillForGen, setSelectedSkillForGen] = useState("Data Science & Analytics");

  const handleSelectTask = (task) => {
    setActiveTask(task);
    setSolutionInput('');
    setEvaluationResult(null);
  };

  const handleCopyData = () => {
    if (!activeTask.datasetSnippet) return;
    navigator.clipboard.writeText(JSON.stringify(activeTask.datasetSnippet, null, 2));
    setCopiedData(true);
    setTimeout(() => setCopiedData(false), 2000);
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

    let score = 0;
    let feedback = "";
    let breakdown = { methodology: 0, protocol: 0, completeness: 0 };

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const evalPrompt = `You are the Official Evaluation Authority for MoSPI psychometric examinations.
Evaluate the officer's solution to the task: "${activeTask.title}".
Task prompt: ${activeTask.taskPrompt}
Model answer key: ${activeTask.modelAnswerKey}

Officer's submitted solution:
"${solutionInput}"

Evaluate rigorously against the model answer and output ONLY valid JSON:
{
  "score": number (0-100),
  "feedback": "2-3 sentences of constructive technical feedback referencing specific rules and formulas",
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
            score = parsed.score;
            feedback = parsed.feedback;
            breakdown = {
              methodology: parsed.methodology || Math.round(score * 0.4),
              protocol: parsed.protocol || Math.round(score * 0.3),
              completeness: parsed.completeness || Math.round(score * 0.3)
            };
          }
        }
      } catch (e) {
        console.warn('Gemini eval fallback to True Rubric Evaluator:', e);
      }
    }

    // Authentic MoSPI Procedural Rubric Evaluator (if API key omitted or call failed)
    if (!score || score === 0) {
      await new Promise(r => setTimeout(r, 700));
      const rubricResult = evaluateSolutionRubric(activeTask, solutionInput);
      score = rubricResult.score;
      feedback = rubricResult.feedback;
      breakdown = rubricResult.breakdown;
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

            {/* Dataset Snippet Viewer with Mode Switcher & Copy */}
            {activeTask.datasetSnippet && activeTask.datasetSnippet.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div className="flex-between mb-2" style={{ flexWrap: 'wrap', gap: 6 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', margin: 0 }}>
                    📋 Official MoSPI Microdata Records ({activeTask.datasetSnippet.length} rows):
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: 2, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <button
                        type="button"
                        onClick={() => setDataViewMode('table')}
                        style={{
                          padding: '3px 8px',
                          fontSize: 11,
                          borderRadius: 'var(--radius-xs)',
                          background: dataViewMode === 'table' ? 'var(--primary)' : 'transparent',
                          color: dataViewMode === 'table' ? '#fff' : 'var(--text-secondary)',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Table
                      </button>
                      <button
                        type="button"
                        onClick={() => setDataViewMode('json')}
                        style={{
                          padding: '3px 8px',
                          fontSize: 11,
                          borderRadius: 'var(--radius-xs)',
                          background: dataViewMode === 'json' ? 'var(--primary)' : 'transparent',
                          color: dataViewMode === 'json' ? '#fff' : 'var(--text-secondary)',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        JSON / Schema
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyData}
                      className="btn btn-ghost btn-xs"
                      style={{ fontSize: 11, padding: '3px 8px' }}
                    >
                      {copiedData ? '✓ Copied' : 'Copy Snippet'}
                    </button>
                  </div>
                </div>

                {dataViewMode === 'table' ? (
                  <div className="task-table-wrapper" style={{ maxHeight: 280, overflowY: 'auto' }}>
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
                ) : (
                  <pre style={{
                    background: 'var(--bg-elevated)',
                    padding: 12,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 11.5,
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    maxHeight: 250,
                    margin: 0,
                    border: '1px solid var(--border-light)'
                  }}>
                    {JSON.stringify(activeTask.datasetSnippet, null, 2)}
                  </pre>
                )}
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
            <div className="card fade-in" style={{
              padding: 22,
              borderColor: evaluationResult.score >= 70 ? 'var(--success)' : 'var(--warning)',
              background: 'var(--bg-surface)'
            }}>
              <div className="flex-between mb-3">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={20} style={{ color: evaluationResult.score >= 70 ? 'var(--success)' : 'var(--warning)' }} />
                  <h3 style={{ fontSize: 16, fontWeight: 700 }}>
                    AI Rubric Evaluation Score
                  </h3>
                </div>
                <div className="header-badge xp" style={{
                  fontSize: 14,
                  fontWeight: 800,
                  background: evaluationResult.score >= 70 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: evaluationResult.score >= 70 ? 'var(--success)' : 'var(--warning)',
                  border: `1px solid ${evaluationResult.score >= 70 ? 'var(--success)' : 'var(--warning)'}`
                }}>
                  {evaluationResult.score}% {evaluationResult.score >= 70 ? '(Passed & Certified)' : '(Revision Required)'}
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
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <span className="tag tag-priority">+75 XP Awarded</span>
                {evaluationResult.score >= 70 ? (
                  <span style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600 }}>
                    ✓ Credential Sealed in Competency Dossier (+12% {activeTask.skill})
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: 'var(--warning)', fontWeight: 600 }}>
                    Score &lt; 70% benchmark (70% required to seal verifiable APAR credential)
                  </span>
                )}
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
