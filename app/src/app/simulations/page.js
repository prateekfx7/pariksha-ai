'use client';
import { useState, useEffect } from 'react';
import {
  Layers, AlertTriangle, CheckCircle2, Award, Sparkles,
  ArrowRight, ShieldCheck, RefreshCw, UserCheck, MessageSquare,
  FileText, CornerDownRight, Play, ChevronRight
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

const SIMULATION_SCENARIOS = [
  {
    id: 'sim-nsso',
    title: 'NSSO 79th Round: CAPI Geo-Fence & Non-Response Dilemma',
    cadre: 'Field Operations Division (FOD) • ISS/SSS Cadre',
    domain: 'Survey Design & Field Audit',
    difficulty: 'Intermediate',
    description: 'A field surveyor’s CAPI tablet shows GPS coordinates 4.8 km outside the assigned Census Village, and 4 sample households are reported as "Temporarily Absent". The quarterly deadline is today.',
    stages: [
      {
        stageIndex: 0,
        speaker: 'Field Investigator Rajesh (CAPI Tablet Operator)',
        dialogue: 'Sir, village Rampur is flooded and unreachable by road. We interviewed 4 substitute households across the main highway having similar socio-economic profiles so our quarterly FOD quota doesn’t get penalized. Can I mark the primary FSU as completed?',
        choices: [
          {
            text: 'Approve the substitute households to meet the mandatory ministry deadline.',
            nextStage: 1,
            outcomeType: 'error',
            protocolPenalty: -30,
            feedback: 'Critical Protocol Breach! MoSPI Field Manual Sec 4.2 strictly forbids unapproved household substitution. This introduces severe non-response selection bias.'
          },
          {
            text: 'Reject substitution immediately. Order an electronic callback protocol and demand geo-fenced photographic audit.',
            nextStage: 2,
            outcomeType: 'success',
            protocolPenalty: 0,
            feedback: 'Optimal Methodological Action! Complies strictly with MoSPI CAPI Quality Assurance protocols. Maintains sampling frame integrity.'
          },
          {
            text: 'Instruct the surveyor to mark the households as "Permanently Deserted" and recalculate design weights.',
            nextStage: 3,
            outcomeType: 'warning',
            protocolPenalty: -15,
            feedback: 'Methodological Concern: Falsely declaring households deserted distorts the rural universe sampling weights in subsequent NSS rounds.'
          }
        ]
      },
      {
        stageIndex: 1,
        speaker: 'Deputy Director (Zonal Inspection HQ)',
        dialogue: 'Inspection Alert! The Central Data Center automated geo-hash algorithm flagged 4 records with coordinates outside LGD Block 0422. We are initiating a data integrity audit on your team.',
        choices: [
          {
            text: 'Acknowledge the mistake, void the 4 records, and dispatch a supervisor for re-enumeration within 48 hours.',
            nextStage: 4,
            outcomeType: 'success',
            protocolPenalty: 5,
            feedback: 'Responsible remediation. Rectifies error before microdata compilation.'
          },
          {
            text: 'Submit an operational exemption letter citing monsoon flooding.',
            nextStage: 4,
            outcomeType: 'warning',
            protocolPenalty: -10,
            feedback: 'Administrative delays incurred. Exemptions require formal DG approval.'
          }
        ]
      },
      {
        stageIndex: 2,
        speaker: 'Field Investigator Rajesh (CAPI Tablet Operator)',
        dialogue: 'Understood, Sir. The team coordinated with the Gram Rozgar Sahayak and reached the genuine sample households by boat. Geo-hash is now validated within 15 meters. How should we handle the 2 households engaged in daily wage labor?',
        choices: [
          {
            text: 'Schedule an evening callback (after 7:00 PM) to interview the primary breadwinner directly rather than accepting proxy entries.',
            nextStage: 4,
            outcomeType: 'success',
            protocolPenalty: 0,
            feedback: 'Exemplary field leadership! Evening callbacks prevent proxy reporting distortions in UPSS employment variables.'
          },
          {
            text: 'Allow neighbors to answer the wage module questions to expedite survey completion.',
            nextStage: 4,
            outcomeType: 'error',
            protocolPenalty: -20,
            feedback: 'Proxy wage reporting invalidates individual labor force classifications.'
          }
        ]
      },
      {
        stageIndex: 3,
        speaker: 'State Statistical Officer',
        dialogue: 'Flagging FSU as deserted will trigger a 20% variance surge in the district standard error. Are you certain no members return seasonally?',
        choices: [
          {
            text: 'Retract the deserted status and verify with the Local Government Directory (LGD) nodal registry.',
            nextStage: 4,
            outcomeType: 'success',
            protocolPenalty: 0,
            feedback: 'Correct course correction using official administrative registries.'
          }
        ]
      },
      {
        stageIndex: 4,
        speaker: 'Director General (MoSPI Field Operations Division)',
        dialogue: 'Field inspection completed. Your decisions have been logged in the Cadre Competency Ledger.',
        isConclusion: true
      }
    ]
  },
  {
    id: 'sim-gdp',
    title: 'National Accounts: Double Deflation & WPI-CPI Divergence',
    cadre: 'National Accounts Division (NAD) • Economic Statistics Cadre',
    domain: 'Macroeconomic Accounting & Price Indices',
    difficulty: 'Advanced',
    description: 'During a quarter with volatile global commodity shocks, raw material input prices surged 18% while manufactured finished goods prices rose only 2%. Single deflation shows misleading 7.2% real GVA growth.',
    stages: [
      {
        stageIndex: 0,
        speaker: 'Senior Joint Director (NAD Compilation Bureau)',
        dialogue: 'Officer, preliminary single-deflation tables show real GVA growth at 7.2%, which is being praised by stakeholders. However, the Double Deflation model accounts for the raw material spike and shows real GVA contracted by -1.4%. Which methodology do you mandate for the press release?',
        choices: [
          {
            text: 'Mandate Double Deflation compliance in accordance with SNA 2008 and submit the -1.4% calculation with detailed explanatory briefing notes.',
            nextStage: 1,
            outcomeType: 'success',
            protocolPenalty: 0,
            feedback: 'Upholds supreme statistical integrity! Double Deflation prevents false growth artifacts caused by input price surges.'
          },
          {
            text: 'Release the single-deflation 7.2% figure and publish the double deflation results in an appendix six months later.',
            nextStage: 2,
            outcomeType: 'error',
            protocolPenalty: -35,
            feedback: 'Severe Professional Violation! Distorts national macroeconomic signals and undermines trust in official statistics.'
          }
        ]
      },
      {
        stageIndex: 1,
        speaker: 'Chief Economic Advisor Review Panel',
        dialogue: 'We appreciate the methodological rigor of the Double Deflation submission. However, journalists are questioning the divergence between nominal turnover and real GVA. How do you articulate this in the technical press note?',
        choices: [
          {
            text: 'Provide disaggregated Supply-Use Table (SUT) balances showing intermediate input price absorption by domestic manufacturers.',
            nextStage: 3,
            outcomeType: 'success',
            protocolPenalty: 0,
            feedback: 'Masterful institutional defense! SUT balances provide irrefutable statistical proof of cost-push compression.'
          },
          {
            text: 'Issue a generic statement that statistical methods are revised periodically.',
            nextStage: 3,
            outcomeType: 'warning',
            protocolPenalty: -10,
            feedback: 'Lacks technical clarity and invites speculative critiques.'
          }
        ]
      },
      {
        stageIndex: 2,
        speaker: 'Parliamentary Standing Committee on Statistics',
        dialogue: 'A major revision had to be published later showing manufacturing had actually contracted, causing reputational fallout for official statistical credibility.',
        choices: [
          {
            text: 'Implement mandatory pre-release Double Deflation audits across all National Accounts sub-sectors.',
            nextStage: 3,
            outcomeType: 'success',
            protocolPenalty: 5,
            feedback: 'Institutional safeguard established.'
          }
        ]
      },
      {
        stageIndex: 3,
        speaker: 'Secretary (MoSPI) & Chief Statistician of India',
        dialogue: 'National Accounts reconciliation concluded. Your decisions have been logged in the Senior Cadre Portfolio.',
        isConclusion: true
      }
    ]
  }
];

export default function SimulationsPage() {
  const { userSkills, updateSkillScore, t } = useApp();
  const [selectedSim, setSelectedSim] = useState(SIMULATION_SCENARIOS[0]);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [score, setScore] = useState(100);
  const [decisionLog, setDecisionLog] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => { setAnimateIn(true); }, []);

  const resetSim = (sim) => {
    setSelectedSim(sim);
    setCurrentStageIdx(0);
    setScore(100);
    setDecisionLog([]);
    setIsCompleted(false);
  };

  const handleChoice = (choice) => {
    const newScore = Math.max(20, Math.min(100, score + choice.protocolPenalty));
    setScore(newScore);

    const logEntry = {
      stage: currentStageIdx,
      choiceText: choice.text,
      outcomeType: choice.outcomeType,
      feedback: choice.feedback
    };
    setDecisionLog(prev => [...prev, logEntry]);

    const nextStageObj = selectedSim.stages.find(s => s.stageIndex === choice.nextStage);
    if (nextStageObj && nextStageObj.isConclusion) {
      setIsCompleted(true);
      setCurrentStageIdx(choice.nextStage);
    } else {
      setCurrentStageIdx(choice.nextStage);
    }
  };

  const currentStage = selectedSim.stages.find(s => s.stageIndex === currentStageIdx) || selectedSim.stages[0];

  return (
    <div className={animateIn ? 'fade-in' : ''} style={{ maxWidth: 940, margin: '0 auto', paddingBottom: 50 }}>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
              background: 'var(--primary)', color: '#fff', textTransform: 'uppercase'
            }}>
              Interactive Case Lab
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
              MoSPI Field Operations & Cadre Decision Simulator
            </span>
          </div>
          <h1 className="section-title">Authentic Civil Service Case Simulations</h1>
          <p className="section-subtitle">
            Experience high-stakes on-field dilemmas where your choices impact statistical integrity, protocol compliance, and public trust.
          </p>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        {SIMULATION_SCENARIOS.map((sim) => (
          <button
            key={sim.id}
            onClick={() => resetSim(sim)}
            className={`btn btn-sm ${selectedSim.id === sim.id ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontWeight: 700, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Layers size={14} />
            <span>{sim.title.split(':')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Simulation Arena */}
      <div className="card" style={{ padding: 'clamp(20px, 4vw, 32px)', background: 'var(--bg-surface)' }}>
        {/* Scenario Header Info */}
        <div style={{
          borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 20,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
        }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              {selectedSim.domain} • {selectedSim.difficulty}
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0', color: 'var(--text-primary)' }}>
              {selectedSim.title}
            </h2>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
              {selectedSim.description}
            </p>
          </div>

          <div style={{
            padding: '8px 16px', borderRadius: 10,
            background: score >= 80 ? 'rgba(34, 197, 94, 0.12)' : score >= 60 ? 'rgba(245, 158, 11, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444', lineHeight: 1 }}>
              {score}/100
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
              Integrity Score
            </span>
          </div>
        </div>

        {/* Dialog / Decision Arena */}
        {!isCompleted ? (
          <div>
            {/* Speaker Bubble */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)',
              border: '1px solid var(--border)', marginBottom: 22
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f05a28 0%, #3b82f6 100%)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0
              }}>
                🏛️
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--primary)' }}>
                  {currentStage.speaker}
                </span>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '6px 0 0', lineHeight: 1.5 }}>
                  &ldquo;{currentStage.dialogue}&rdquo;
                </p>
              </div>
            </div>

            {/* Decision Options */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your Mandate as Presiding Statistical Officer:
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(currentStage.choices || []).map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(choice)}
                  className="btn btn-outline"
                  style={{
                    padding: '14px 18px', textAlign: 'left', borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'flex-start', gap: 12, background: 'var(--bg-surface)',
                    border: '1px solid var(--border)', transition: 'all 150ms ease'
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', background: 'var(--bg-elevated)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, color: 'var(--primary)', flexShrink: 0, marginTop: 1
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45 }}>
                    {choice.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Conclusion Card */
          <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: score >= 80 ? '#22c55e' : '#f59e0b', color: '#fff',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12
            }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 6px' }}>
              Simulation Debriefing Completed
            </h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: '0 0 20px' }}>
              Your actions resolved the {selectedSim.title.split(':')[0]} case with a Final Integrity Score of <strong>{score}/100</strong>.
            </p>

            {/* Decision Trail */}
            <div style={{ textAlign: 'left', background: 'var(--bg-elevated)', padding: 18, borderRadius: 'var(--radius-md)', marginBottom: 24 }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
                Audit Trail & Methodological Evaluation:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {decisionLog.map((log, idx) => (
                  <div key={idx} style={{
                    padding: 10, borderRadius: 6,
                    background: log.outcomeType === 'success' ? 'rgba(34, 197, 94, 0.08)' : log.outcomeType === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    borderLeft: `3px solid ${log.outcomeType === 'success' ? '#22c55e' : log.outcomeType === 'warning' ? '#f59e0b' : '#ef4444'}`
                  }}>
                    <p style={{ fontSize: 12.5, fontWeight: 700, margin: '0 0 3px', color: 'var(--text-primary)' }}>
                      Decision {idx + 1}: &ldquo;{log.choiceText}&rdquo;
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>
                      {log.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => resetSim(selectedSim)} className="btn btn-outline">
                <RefreshCw size={14} /> Replay This Case
              </button>
              <Link href="/dashboard" className="btn btn-primary">
                Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
