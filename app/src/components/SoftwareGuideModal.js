'use client';
import { useState } from 'react';
import {
  X, ArrowRight, ArrowLeft, Brain, BookOpen, BrainCircuit,
  Award, BarChart3, CheckCircle2, Zap, Sparkles, Target, Compass, Play
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function SoftwareGuideModal() {
  const { showGuideModal, setShowGuideModal } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  if (!showGuideModal) return null;

  const steps = [
    {
      badge: "Stage 1 • The Starting Point",
      title: "Welcome to Day 0: Establishing Your Baseline",
      icon: Compass,
      color: "var(--primary)",
      summary: "You begin at 0 XP, 0 streak, and an unassessed baseline across all 6 statistical competencies.",
      details: [
        "In Pariksha AI, there is no fake or artificial data for your profile — your growth is 100% authentic and earned.",
        "Your first objective as an officer is to take a 5-question baseline diagnostic quiz in any domain.",
        "Once completed, the platform instantly evaluates your accuracy, awards your first XP, and maps your initial score onto the Competency Radar."
      ],
      actionText: "Take 1st Assessment",
      actionHref: "/quiz",
      tip: "Pro Tip: Start with Survey Design or Statistical Methods to establish your initial score."
    },
    {
      badge: "Stage 2 • Competency Diagnostics",
      title: "Understanding Your Competency Radar & Gap Analysis",
      icon: Target,
      color: "#f59e0b",
      summary: "Visualizing where you stand versus MoSPI cadre benchmarks (Director, SSO, SO, JSO).",
      details: [
        "The orange polygon represents your active skill level across 6 core domains (Survey Design, GIS, Data Science, AI, Stats, Governance).",
        "The dashed grey polygon displays the required benchmark standard for your specific rank/cadre.",
        "The Skill Gap Analysis bar chart highlights your top deficits in red, yellow, and green so you know exactly what to focus on."
      ],
      actionText: "View Dashboard Radar",
      actionHref: "/dashboard",
      tip: "Benchmark standards automatically adjust if you switch your cadre role in Settings."
    },
    {
      badge: "Stage 3 • Targeted Upskilling",
      title: "Personalized iGOT Learning Pathways",
      icon: BookOpen,
      color: "#10b981",
      summary: "Automated course recommendations ranked by algorithmic deficit priority.",
      details: [
        "Instead of browsing thousands of random courses, Pariksha AI matches your top 3 largest skill deficits with official iGOT Karmayogi, ISI Kolkata, and CSO courses.",
        "Courses are tagged with 'High Priority' for critical deficits and 'Quick Win' for rapid mastery.",
        "Click 'Enroll' on any course to track active learning directly in your profile."
      ],
      actionText: "Explore Recommendations",
      actionHref: "/recommendations",
      tip: "Enrolling in courses and completing modules unlocks progressive achievements."
    },
    {
      badge: "Stage 4 • AI Quiz Generation",
      title: "Generating Custom Quizzes from MoSPI Handbooks",
      icon: BrainCircuit,
      color: "#8b5cf6",
      summary: "Convert census manuals, survey protocols, or guidelines into interactive MCQs.",
      details: [
        "Navigate to the Quiz Generator to create custom diagnostics for your team or personal study.",
        "Upload any PDF (e.g., NSS 80th Round manual) or type a custom topic like 'Circular Systematic Sampling'.",
        "Powered by Google Gemini 1.5 Flash (or built-in MoSPI Knowledge Base), the system generates questions with comprehensive official explanations."
      ],
      actionText: "Open Quiz Generator",
      actionHref: "/quiz-generator",
      tip: "You can save your custom Gemini API key in Settings for unlimited live AI generation."
    },
    {
      badge: "Stage 5 • Certification & Institutional View",
      title: "Verifiable XP, Streaks & Department Analytics",
      icon: BarChart3,
      color: "#3b82f6",
      summary: "Measure personal milestones and view cross-cadre institutional readiness.",
      details: [
        "Every assessment completed earns XP bonuses (+30 XP per correct question + 50 completion bonus) and builds your daily learning streak.",
        "Unlock 8 milestone achievements from 'First Quiz' to 'Department Leader'.",
        "Supervisors and Directors can view the Admin Analytics heatmap to identify macro skill gaps across all 10 MoSPI divisions."
      ],
      actionText: "Check Admin Analytics",
      actionHref: "/admin",
      tip: "Collaborate with fellow officers in the Discussion Hub to share survey best practices."
    }
  ];

  const current = steps[currentStep];
  const Icon = current.icon;

  const handleAction = (href) => {
    setShowGuideModal(false);
    router.push(href);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowGuideModal(false)}>
      <div className="modal-content guide-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="guide-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
            <div className="guide-modal-header-icon">
              <Brain size={20} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h3 className="guide-modal-header-title">
                Pariksha AI — Officer User Guide
              </h3>
              <p className="guide-modal-header-sub">
                Step-by-step walkthrough to master your statistical competency journey
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowGuideModal(false)}
            className="guide-modal-close-btn"
            title="Close Guide"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step Progress Bar & Indicators */}
        <div className="guide-modal-steps">
          <div className="flex-between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {current.badge}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map((s, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: idx === currentStep ? 'var(--primary)' : idx < currentStep ? 'var(--success)' : 'var(--border-light)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                title={`Jump to Step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="guide-modal-body">
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
            <div className="guide-icon-badge" style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: current.color,
              flexShrink: 0
            }}>
              <Icon size={22} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <h2 className="guide-modal-title" style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
                {current.title}
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {current.summary}
              </p>
            </div>
          </div>

          {/* Bulleted Points */}
          <div className="guide-modal-bullets" style={{
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 14px',
            border: '1px solid var(--border-light)',
            marginBottom: 12
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              How it works:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {current.details.map((detail, dIdx) => (
                <div key={dIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  <CheckCircle2 size={14} style={{ color: 'var(--success)', marginTop: 2, flexShrink: 0 }} />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip Callout */}
          <div style={{
            background: 'var(--primary-subtle)',
            borderLeft: '3px solid var(--primary)',
            padding: '8px 12px',
            borderRadius: '0 var(--radius-md) var(--radius-md) 0',
            fontSize: 12,
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Sparkles size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ lineHeight: 1.4 }}>{current.tip}</span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="guide-modal-footer">
          {/* Quick action button to try feature directly */}
          <div className="guide-footer-action">
            <button
              onClick={() => handleAction(current.actionHref)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Play size={13} /> {current.actionText}
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="guide-footer-nav">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="btn btn-outline btn-sm"
              >
                <ArrowLeft size={14} /> Previous
              </button>
            ) : (
              <button
                onClick={() => setShowGuideModal(false)}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--text-tertiary)' }}
              >
                Skip Guide
              </button>
            )}

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="btn btn-primary btn-sm"
              >
                Next Step <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={() => setShowGuideModal(false)}
                className="btn btn-primary btn-sm"
                style={{ background: 'var(--success)' }}
              >
                Start Day 0! <CheckCircle2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
