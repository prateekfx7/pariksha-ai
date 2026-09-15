'use client';
import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Sparkles, Trash2, Play, Eye, Printer, Download, BookOpen, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft, X, Layers, ShieldCheck, BrainCircuit, Mic, Check, CheckCheck, ShieldAlert, Terminal, CloudUpload, Settings, HelpCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';
import IGotPublisherModal from '@/components/igot/IGotPublisherModal';
import PortalStatusBadge from '@/components/igot/PortalStatusBadge';
import { validateQuestionBank } from '@/lib/questionQualityValidator';
import { generateQuestionBankForTopic } from '@/lib/igotQuestionBanks';

const samplePresets = [
  {
    name: 'NSSO 79th Round: Household Survey Manual',
    skill: 'Survey Design',
    text: `National Sample Survey (NSS) 79th Round (July 2022 - June 2023).
Subject: Comprehensive Survey on Multiple Indicators and Living Conditions.
Sampling Design: A stratified two-stage design is adopted. First stage units (FSU) are Census Villages in the rural sector and Urban Frame Survey (UFS) blocks in the urban sector. The second stage units (SSU) are households in both sectors.
Sample Allocation: Within each district, total sample FSUs are allocated between rural and urban sectors proportional to population as per Census 2011. Selection of FSUs is done using Probability Proportional to Size with Replacement (PPSWR) in rural and Simple Random Sampling Without Replacement (SRSWOR) in urban.
Field Non-Response Handling: Substituted households are not allowed except in cases of complete abandonment of the SSU.`
  },
  {
    name: 'MoSPI National Accounts GDP Methodology',
    skill: 'Official Statistics',
    text: `Methodology for Estimation of Gross Domestic Product (GDP) - Base Year 2011-12 Revision.
Gross Value Added (GVA) at basic prices is defined as output less intermediate consumption. Basic price is the amount receivable by the producer from the purchaser for a unit of a good or service produced as output, minus any tax payable, plus any subsidy receivable.
GDP at market prices = GVA at basic prices + Product Taxes - Product Subsidies.
Double Deflation method: Output is deflated by output price indices (WPI/CPI) and intermediate consumption is deflated by input price indices to obtain GVA in constant prices.`
  },
  {
    name: 'GIS & Spatial Analytics in Census Mapping',
    skill: 'GIS & Spatial Analysis',
    text: `Application of Geographic Information Systems (GIS) in Enumeration Block (EB) Demarcation.
Each Enumeration Block typically contains 600-800 population or 120-150 households. Spatial coordinates are captured using handheld mobile devices using NavIC / GPS constellation with minimum precision of 5 meters.
Topology rules: Enumeration block boundaries must not self-intersect and must perfectly cover administrative ward boundaries without slivers or overlaps. Polygon centroids are stored with unique Local Government Directory (LGD) identifiers.`
  }
];

const sampleMoSPIPdfs = [
  {
    id: 'nsso-79',
    title: 'NSSO 79th Round: Household Survey Operational Manual',
    fileName: 'MoSPI_NSSO_79th_Round_Survey_Manual.pdf',
    downloadUrl: '/samples/MoSPI_NSSO_79th_Round_Survey_Manual.pdf',
    size: '2.3 KB',
    cadre: 'ISS / SSS Cadre',
    skill: 'Survey Design',
    highlight: 'Stratified Two-Stage Design, Neyman Optimum Allocation & CAPI Validation',
    extractedText: `National Sample Survey 79th Round (July 2022 - June 2023) Operational Field Guidelines.
Ministry of Statistics & Programme Implementation (MoSPI), Government of India.
1. Multi-Stage Stratified Sampling Architecture: A stratified two-stage design is mandated across all 36 States and Union Territories. Rural First Stage Units (FSUs) are 2011 Census Enumeration Villages. Urban FSUs are Urban Frame Survey (UFS) 2017-22 blocks demarcated by FOD. Ultimate Stage Units (USUs) are systematically chosen households with equal probability.
2. Neyman Optimum Sample Allocation Strategy: Sample sizes across strata are allocated via Neyman formula: n_h = n * (N_h * S_h) / sum(N_i * S_i). Variance is minimized under fixed survey budget by sampling high-dispersion strata more heavily. Zero non-response bias: Mandatory callback protocols required prior to household substitution.
3. Statistical Data Quality & Audit Controls: CAPI tablet validation script verifies UPSS employment codes against weekly activity (CWS). Outlier screening flags casual wage entries exceeding 4 sigma standard deviations from district median. Automated geo-hash cryptographic stamp validates on-field surveyor presence.`
  },
  {
    id: 'gdp-compendium',
    title: 'National Accounts GVA & GDP Compilation Guidelines',
    fileName: 'MoSPI_National_Accounts_GDP_Compendium.pdf',
    downloadUrl: '/samples/MoSPI_National_Accounts_GDP_Compendium.pdf',
    size: '2.2 KB',
    cadre: 'Economic Statistics Cadre',
    skill: 'Official Statistics',
    highlight: 'GVA at Basic Prices, Double Deflation Method & SUT Balancing',
    extractedText: `Compilation Guidelines for Gross Value Added (GVA) & GDP (Base Year 2011-12 Revision).
National Statistical Office (NSO), MoSPI, Government of India.
1. Gross Value Added (GVA) at Basic Prices Accounting Identity: Gross Value Added (GVA) at basic prices is defined strictly as Gross Output minus Intermediate Consumption. Basic Price represents the amount receivable by the producer excluding taxes on products, plus subsidies. GDP at Market Prices is derived as: GDP = GVA at basic prices + Product Taxes - Product Subsidies.
2. Double Deflation & Constant Price Estimation: Real GVA measurement requires double deflation: gross output and intermediate inputs deflated independently. Wholesale Price Index (WPI) and Consumer Price Index (CPI) components serve as price deflators. Single indicators or single extrapolation can introduce substantial systematic bias during price shocks.
3. Supply and Use Tables (SUT) Reconciliation: Balancing product supply (domestic output + imports) against total uses (intermediate + final demand). Statistical discrepancies between production and expenditure approaches must not exceed +/- 1.5%.`
  },
  {
    id: 'asi-manual',
    title: 'Annual Survey of Industries (ASI): Factory Verification Manual',
    fileName: 'MoSPI_Annual_Survey_of_Industries_Handbook.pdf',
    downloadUrl: '/samples/MoSPI_Annual_Survey_of_Industries_Handbook.pdf',
    size: '2.2 KB',
    cadre: 'Industrial Statistics Wing',
    skill: 'Data Quality & Auditing',
    highlight: 'Census vs Sample Sector Thresholds, NVA Audits & k-Anonymity SDC',
    extractedText: `Annual Survey of Industries (ASI): Schedule A-J Verification and Microdata Auditing Manual.
MoSPI Industrial Statistics Wing (ISW), Government of India.
1. Factory Frame Eligibility and Sampling Thresholds: Census Sector comprises all registered factories employing 100 or more workers with electricity. Sample Sector covers the remaining factory universe sampled with probability proportional to size. Data collection covers Block A (identification), Block C (fixed capital), and Block H (inputs/fuels).
2. Depreciation, Net Capital Formation, and Output Audit: Net Value Added (NVA) is calculated as Gross Value Added (GVA) minus Depreciation. Reported negative GVA must be audited for excessive fuel inputs, inventory writedowns, or shutdown phases. Contractual labor payments in Block E must conform to minimum wage gazette notifications.
3. Microdata Masking and SDC Disclosure Governance: Under the National Data Governance Framework (NDGFP), enterprise identifiers must be cryptographically hashed. K-anonymity constraint (k >= 3) ensures no 4-digit NIC cell discloses proprietary factory output.`
  }
];

export default function QuizGeneratorPage() {
  const { generatedQuizzes, addGeneratedQuiz, apiKey, t, tSkill } = useApp();
  const [file, setFile] = useState({
    name: 'my-cv.pdf',
    size: 122880,
    type: 'application/pdf',
    isSample: true
  });
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState('mixed');
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedSkill, setSelectedSkill] = useState('Survey Design');
  const [textInput, setTextInput] = useState('Official MoSPI Survey & Statistical Methodology Manual. Modules covering NSSO 79th Round sampling framework, primary sampling units, and data validation standards.');
  const [useTextInput, setUseTextInput] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [igotModalQuiz, setIgotModalQuiz] = useState(null);
  const [isHotsMode, setIsHotsMode] = useState(false);
  const [smeApprovals, setSmeApprovals] = useState({});
  const [validationReport, setValidationReport] = useState(null);
  const [generationSource, setGenerationSource] = useState(null);
  const fileInputRef = useRef(null);

  const handleUrlImport = () => {
    if (!urlInput.trim()) return;
    const cleanUrl = urlInput.trim();
    const parts = cleanUrl.split('/');
    const lastPart = parts[parts.length - 1].split('?')[0] || 'imported-document.pdf';
    const fileName = lastPart.includes('.') ? lastPart : `${lastPart}.pdf`;
    const newFile = {
      name: fileName,
      size: 122880,
      type: 'application/pdf',
      isUrl: true,
      url: cleanUrl
    };
    setFile(newFile);
    setTextInput(`Extracted content from URL (${cleanUrl}): Official circular & statistical study module. Formulated for iGOT Karmayogi civil servant assessment.`);
    setUrlInput('');
  };

  useEffect(() => { setAnimateIn(true); }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (fileObj) => {
    if (!fileObj) return;
    setFile(fileObj);
    setUseTextInput(false);

    // Read text directly if text or json file
    if (fileObj.type.includes('text') || fileObj.name.endsWith('.txt') || fileObj.name.endsWith('.json') || fileObj.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextInput(e.target.result);
      };
      reader.readAsText(fileObj);
    } else {
      // For PDF / PPTX, simulate extraction from statistical file
      setTextInput(`Extracted text from ${fileObj.name}: MoSPI Official Statistical Guidelines, Sampling Methodology, and Quality Protocols. Contains sections on Primary Sampling Units (PSUs), data validation checks, standard deviation thresholds, and field enumeration procedures.`);
    }
  };

  const loadPreset = (preset) => {
    setTextInput(preset.text);
    setSelectedSkill(preset.skill);
    setUseTextInput(true);
    setFile(null);
  };

  const handleLoadSamplePdf = (sample) => {
    setFile({
      name: sample.fileName,
      size: 2350,
      type: 'application/pdf',
      isSample: true,
      sampleInfo: sample
    });
    setSelectedSkill(sample.skill);
    setTextInput(sample.extractedText);
    setUseTextInput(false);
  };

  // Call Gemini API or use rich domain generator
  const generateQuiz = async () => {
    setGenerating(true);
    setGenerationSource(null);

    const topicSource = file ? file.name : (textInput.slice(0, 32) + '...');
    const targetCount = questionCount;

    let generatedQuestions = [];
    let usedGemini = false;

    // 1. Try real Gemini API if key is present
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const prompt = `You are a Senior Statistical Officer and expert psychometric test creator for the Ministry of Statistics and Programme Implementation (MoSPI), Government of India.
Based on the following content, generate ${targetCount} high quality, challenging multiple-choice questions (MCQs) for statistical officers.
Difficulty level: ${difficulty}.
Focus domain/skill: ${selectedSkill}.

Respond with ONLY valid raw JSON (no markdown formatting, no code blocks, no backticks). The JSON must be an array of objects, with each object structured like:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "difficulty": "Easy" | "Medium" | "Hard",
    "explanation": "Detailed explanation of why this answer is correct based on statistical theory and official guidelines."
  }
]

Content:
${textInput || "Official Statistics, Survey Sampling, and Data Analysis guidelines."}`;

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json"
            }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
            if (Array.isArray(parsed) && parsed.length > 0) {
              generatedQuestions = parsed.map((q, i) => ({
                id: i + 1,
                question: q.question,
                options: q.options,
                correctAnswer: q.correctAnswer,
                difficulty: q.difficulty || (difficulty === 'mixed' ? (i % 2 === 0 ? 'Medium' : 'Hard') : difficulty),
                explanation: q.explanation,
              }));
              usedGemini = true;
            }
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, using procedural generation fallback:', err);
      }
    }

    // 2. High-fidelity procedural fallback if Gemini was not used
    if (generatedQuestions.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      generatedQuestions = generateQuestionBankForTopic(selectedSkill, targetCount, isHotsMode, difficulty);
    }

    const validation = validateQuestionBank(generatedQuestions);
    setValidationReport(validation);

    const newQuiz = {
      id: `quiz-gen-${Date.now()}`,
      title: `Assessment: ${topicSource}`,
      skill: selectedSkill,
      difficulty: difficulty === 'mixed' ? 'Mixed' : difficulty,
      questionCount: generatedQuestions.length,
      questions: generatedQuestions,
      validationSummary: {
        score: validation.averageScore,
        hotsCount: validation.hotsCount,
        status: validation.overallStatus
      },
      generatedBy: usedGemini ? 'Google Gemini 3.6 Flash' : 'Pariksha Statistical Engine',
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    addGeneratedQuiz(newQuiz);
    setGenerationSource(usedGemini ? 'Google Gemini 3.6 Flash' : 'Pariksha Statistical Engine');
    setGenerating(false);
    setPreviewQuiz(newQuiz);
  };

  const handlePrintQuiz = (quiz) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${quiz.title} — Pariksha AI</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.5; }
          .header { border-bottom: 2px solid #f05a28; padding-bottom: 16px; margin-bottom: 24px; }
          .title { font-size: 22px; font-weight: 800; margin: 0 0 6px 0; }
          .meta { font-size: 13px; color: #555; }
          .q-box { margin-bottom: 24px; page-break-inside: avoid; }
          .q-title { font-weight: 700; font-size: 15px; margin-bottom: 8px; }
          .opt { margin: 4px 0 4px 20px; font-size: 14px; }
          .answers { margin-top: 50px; page-break-before: always; border-top: 2px dashed #999; padding-top: 20px; }
          .ans-title { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
          .ans-item { margin-bottom: 12px; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${quiz.title}</div>
          <div class="meta">Competency: ${quiz.skill} • Difficulty: ${quiz.difficulty} • Questions: ${quiz.questionCount} • Generated by ${quiz.generatedBy || 'Pariksha AI'}</div>
        </div>
        ${quiz.questions.map((q, idx) => `
          <div class="q-box">
            <div class="q-title">Q${idx + 1}. ${q.question}</div>
            ${q.options.map((opt, optIdx) => `
              <div class="opt">(${String.fromCharCode(65 + optIdx)}) ${opt}</div>
            `).join('')}
          </div>
        `).join('')}
        <div class="answers">
          <div class="ans-title">Confidential Answer Key & Explanations (Evaluator Copy)</div>
          ${quiz.questions.map((q, idx) => `
            <div class="ans-item">
              <strong>Q${idx + 1}:</strong> Option (${String.fromCharCode(65 + q.correctAnswer)}) — ${q.options[q.correctAnswer]}<br/>
              <em>Explanation:</em> ${q.explanation}
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => { printWindow.print(); }, 250);
  };

  const handleDownloadJSON = (quiz) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quiz, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
          padding: '10px 14px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Play size={14} /> {t('tab_take_quiz', 'Quizzes')}
        </Link>
        <Link href="/adaptive-test" style={{
          padding: '10px 14px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <BrainCircuit size={14} color="#3b82f6" /> Adaptive Test (CAT)
        </Link>
        <Link href="/simulations" style={{
          padding: '10px 14px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Layers size={14} color="#22c55e" /> Case Simulations
        </Link>
        <Link href="/oral-viva" style={{
          padding: '10px 14px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 600, fontSize: 13, textDecoration: 'none',
          background: 'transparent', color: 'var(--text-secondary)', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Mic size={14} color="#a855f7" /> Oral Viva (Voice)
        </Link>
        <Link href="/quiz-generator" style={{
          padding: '10px 14px', borderRadius: 'var(--radius-md)',
          textAlign: 'center', fontWeight: 700, fontSize: 13, textDecoration: 'none',
          background: 'var(--primary)', color: '#fff', transition: 'all 150ms ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, whiteSpace: 'nowrap',
        }}>
          <Sparkles size={14} /> {t('tab_gen_quiz', 'AI Generator')}
        </Link>
      </div>

      <div className="section-header mb-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 className="section-title">{t('gen_page_title', 'AI Assessment Generator')}</h1>
          <p className="section-subtitle">{t('gen_page_subtitle', 'Auto-generate validated competency assessments from training manuals, PDFs, or PPTs')}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <PortalStatusBadge />
          <button
            onClick={() => setIgotModalQuiz(previewQuiz || (generatedQuizzes && generatedQuizzes[0]))}
            className="btn btn-outline btn-sm"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(240, 90, 40, 0.08)'
            }}
            title="Open iGOT Karmayogi Publisher & Resiliency Bridge"
          >
            <Sparkles size={14} />
            <span>{t('btn_igot_bridge', 'iGOT Publisher Bridge')}</span>
          </button>
        </div>
      </div>

      <div className="grid-2 mb-8">
        {/* Left Column: Input & Controls */}
        <div className="fade-in fade-in-delay-1">
          {/* Quick Load Sample Circulars Bar */}
          <div className="card mb-4" style={{ padding: '12px 16px', background: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                Sample Training Documents
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                Click to load authentic circulars
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {sampleMoSPIPdfs.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSamplePdf(sample)}
                  className="btn btn-outline btn-sm"
                  style={{ padding: '5px 11px', fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  title={`Load ${sample.title}`}
                >
                  <FileText size={12} />
                  <span>{sample.title.split(':')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            <button
              className={`btn btn-sm ${!useTextInput ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setUseTextInput(false)}
              style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Upload size={14} /> Upload Document (PDF / PPT)
            </button>
            <button
              className={`btn btn-sm ${useTextInput ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setUseTextInput(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <FileText size={14} /> Paste Text / Syllabus
            </button>
          </div>

          {!useTextInput ? (
            <div className="modern-upload-card">
              {/* Card Header */}
              <div className="modern-upload-header">
                <div className="modern-upload-header-left">
                  <div className="modern-upload-icon-btn">
                    <Settings size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="modern-upload-title">Upload files</h3>
                    <p className="modern-upload-subtitle">Select and upload the files of your choice</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="modern-upload-close-btn"
                  onClick={() => { setFile(null); setTextInput(''); }}
                  title="Reset upload"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Dashed Dropzone */}
              <div
                className={`modern-dropzone ${dragOver ? 'dragover' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="modern-dropzone-icon">
                  <CloudUpload size={36} strokeWidth={1.75} />
                </div>
                <div className="modern-dropzone-heading">Choose a file or drag & drop it here.</div>
                <div className="modern-dropzone-formats">JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</div>

                <button
                  type="button"
                  className="modern-browse-btn"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Browse File
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.ppt,.pptx,.txt,.json,.md,.docx,.png,.jpg,.jpeg,.mp4"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Uploaded File Item Preview */}
              {file && (
                <div className="modern-file-card">
                  <div className="modern-file-left">
                    <div className="modern-pdf-badge">
                      {file.name?.toLowerCase().endsWith('.png') || file.name?.toLowerCase().endsWith('.jpg') ? 'IMG' :
                       file.name?.toLowerCase().endsWith('.mp4') ? 'MP4' :
                       file.name?.toLowerCase().endsWith('.pptx') || file.name?.toLowerCase().endsWith('.ppt') ? 'PPT' :
                       file.name?.toLowerCase().endsWith('.docx') ? 'DOC' : 'PDF'}
                    </div>
                    <div className="modern-file-info">
                      <div className="modern-file-name" title={file.name}>
                        {file.name}
                      </div>
                      <div className="modern-file-meta">
                        <span>0 KB of {file.size ? (file.size >= 1024 ? `${Math.round(file.size / 1024)} KB` : `${file.size} B`) : '120 KB'}</span>
                        <span>•</span>
                        <span className="modern-file-completed">
                          <CheckCircle2 size={13} color="#10b981" /> Completed
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="modern-file-trash"
                    onClick={(e) => { e.stopPropagation(); setFile(null); setTextInput(''); }}
                    title="Remove file"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* Hairline Divider with OR */}
              <div className="modern-or-divider">
                <div className="modern-or-line" />
                <span className="modern-or-text">OR</span>
                <div className="modern-or-line" />
              </div>

              {/* Import from URL Link */}
              <div className="modern-url-section">
                <label className="modern-url-label">Import from URL Link</label>
                <div className="modern-url-input-box">
                  <div className="modern-url-prefix">http://</div>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleUrlImport();
                      }
                    }}
                    placeholder="Paste file URL"
                    className="modern-url-input"
                  />
                  <div
                    className="modern-url-icon"
                    onClick={handleUrlImport}
                    title="Click or press Enter to import from URL"
                  >
                    <HelpCircle size={16} />
                  </div>
                </div>
              </div>

              {/* Extracted Text Preview Drawer */}
              {textInput && (
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--primary)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <Eye size={12} /> {showExtractedPreview ? 'Hide Extracted Text' : 'Inspect Extracted Content'}
                    </button>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                      Ready for AI Question Generation
                    </span>
                  </div>
                  {showExtractedPreview && (
                    <div style={{
                      marginTop: 8,
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      maxHeight: 90,
                      overflowY: 'auto'
                    }}>
                      {textInput}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Raw Text Mode */
            <div>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste your study material, handbook chapter, or circular text here... The AI will extract core statistical concepts and generate psychometric MCQs."
                style={{
                  width: '100%',
                  minHeight: 180,
                  resize: 'vertical',
                  borderRadius: 'var(--radius-lg)',
                  padding: 16,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              />
            </div>
          )}

          {/* Generator Controls */}
          <div className="card mt-4" style={{ padding: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  {t('gen_target_comp', 'Target Competency & Topic')}
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <optgroup label="Official iGOT Assessment Topics">
                    <option value="Conduct & Ethics">Conduct & Ethics (Code, Gifts, CVC)</option>
                    <option value="Workplace Skills">Workplace Skills (Leadership, EQ, Stress)</option>
                    <option value="Administrative Skills">Administrative Skills (Noting & Drafting, CSMOP)</option>
                    <option value="Digital Skills">Digital Skills (DPDP 2023, Cybersecurity, Office)</option>
                    <option value="Governance & Policy">Governance & Policy (DDDM, Citizen-Centric)</option>
                    <option value="Legal & Regulatory">Legal & Regulatory (CCS Rules, POSH, RPwD)</option>
                    <option value="Sector-Specific (MoSPI)">Sector-Specific (MoSPI Official Statistics)</option>
                  </optgroup>
                  <optgroup label="MoSPI Statistical Specializations">
                    <option value="Survey Design">{tSkill('Survey Design')}</option>
                    <option value="Data Science & Analytics">{tSkill('Data Science & Analytics')}</option>
                    <option value="Official Statistics">{tSkill('Official Statistics')}</option>
                    <option value="Economic Statistics">{tSkill('Economic Statistics')}</option>
                    <option value="GIS & Spatial Analysis">{tSkill('GIS & Spatial Analysis')}</option>
                    <option value="Data Quality & Auditing">{tSkill('Data Quality & Auditing')}</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  {t('gen_difficulty_label', 'Difficulty Level')}
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="mixed">Mixed (Adaptive)</option>
                  <option value="Easy">Easy (Fundamental)</option>
                  <option value="Medium">Medium (Operational)</option>
                  <option value="Hard">Hard (Expert/Director)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4, display: 'block' }}>
                  {t('gen_num_questions', 'Question Bank Volume')}
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  style={{ width: '100%' }}
                >
                  <option value={5}>5 Questions (Quick Check)</option>
                  <option value={10}>10 Questions (Standard Quiz)</option>
                  <option value={25}>25 Questions (Comprehensive)</option>
                  <option value={50}>50 Questions (Trainer Bank Scale)</option>
                  <option value={100}>100 Questions (Master Course Bank)</option>
                </select>
              </div>
            </div>

            {/* Cognitive Mode Toggle & Regulatory Audit Shortcut */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              marginBottom: 16,
              flexWrap: 'wrap',
              gap: 10
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0, fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={isHotsMode}
                  onChange={(e) => setIsHotsMode(e.target.checked)}
                  style={{ accentColor: 'var(--primary)', width: 16, height: 16 }}
                />
                <span>Generate Scenario / HOTS (Higher Order Thinking Skills) Questions</span>
              </label>

              <Link
                href="/admin/content-audit"
                className="btn btn-ghost btn-sm"
                style={{ fontSize: 12, color: 'var(--primary)', padding: '2px 8px' }}
              >
                <ShieldCheck size={13} />
                <span>AI Regulatory Audit (DoPT / GFR)</span>
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                disabled={generating || (!file && !textInput.trim())}
                onClick={generateQuiz}
                style={{ flex: '1 1 200px', width: '100%', justifyContent: 'center' }}
              >
                {generating ? (
                  <>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Analyzing & Generating Bank...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    {t('gen_btn_generate', 'Generate Assessment from Document')}
                  </>
                )}
              </button>
            </div>

            {generationSource && (
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} />
                Successfully generated using {generationSource}!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quizzes List & Preview */}
        <div className="fade-in fade-in-delay-2">
          <div className="flex-between mb-4">
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>
              {t('gen_generated_quizzes', 'Generated Quizzes')} ({generatedQuizzes.length})
            </h3>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{t('gen_auto_synced', 'Auto-synced to Assessment Bank')}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 580, overflowY: 'auto', paddingRight: 4 }}>
            {generatedQuizzes.map((quiz) => (
              <div key={quiz.id} className="mcq-card" style={{ marginBottom: 0, padding: 18 }}>
                <div className="flex-between" style={{ marginBottom: 8 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700 }}>{quiz.title}</h4>
                  <span className={`tag ${quiz.difficulty === 'Easy' ? 'tag-easy' : quiz.difficulty === 'Hard' ? 'tag-hard' : 'tag-medium'}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
                  {tSkill(quiz.skill)} • {quiz.questionCount} Questions • {quiz.generatedBy || 'AI Engine'}
                </p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Link href={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm">
                    <Play size={14} /> {t('btn_start_quiz', 'Start Quiz')}
                  </Link>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setIgotModalQuiz(quiz)}
                    title="Export to iGOT (Bulk CSV, Auto-Tags, Copilot)"
                    style={{ borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <Sparkles size={13} /> {t('btn_igot_bridge_sm', 'iGOT Bridge')}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      setPreviewQuiz(quiz);
                      setValidationReport(validateQuestionBank(quiz.questions || []));
                    }}
                  >
                    <Eye size={14} /> {t('btn_preview', 'Preview')}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handlePrintQuiz(quiz)} title="Print / Export PDF">
                    <Printer size={14} /> {t('btn_print', 'Print')}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => handleDownloadJSON(quiz)} title="Download JSON">
                    <Download size={14} /> JSON
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal — Human-in-the-Loop SME Review & Approval Workbench */}
      {previewQuiz && (
        <div className="modal-overlay" onClick={() => setPreviewQuiz(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: 'clamp(16px, 4vw, 28px)', maxWidth: 860 }}>
            <div className="flex-between mb-4">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span className="tag tag-priority" style={{ fontSize: 11 }}>
                    <ShieldCheck size={13} /> Karmayogi SME Review Workbench
                  </span>
                  <span className="tag tag-easy" style={{ fontSize: 11 }}>
                    Human-in-the-Loop Workflow
                  </span>
                </div>
                <h2 style={{ fontSize: 19, fontWeight: 800, margin: 0 }}>{previewQuiz.title}</h2>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                  {tSkill(previewQuiz.skill)} • {previewQuiz.difficulty} • {previewQuiz.questionCount} Questions
                </p>
              </div>
              <button onClick={() => setPreviewQuiz(null)} style={{ color: 'var(--text-tertiary)', padding: 4 }}>
                <X size={20} />
              </button>
            </div>

            {/* Quality Summary Bar */}
            {validationReport && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 10,
                padding: 12,
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                marginBottom: 16
              }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Quality Index
                  </span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: validationReport.averageScore >= 80 ? 'var(--success)' : '#f59e0b' }}>
                    {validationReport.averageScore}/100
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Cognitive HOTS Ratio
                  </span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#a855f7' }}>
                    {validationReport.hotsPercentage}% HOTS
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    Deduplication & Clarity
                  </span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: validationReport.criticalCount === 0 ? 'var(--success)' : '#ef4444' }}>
                    {validationReport.passedCount} / {validationReport.totalQuestions} Passed
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    SME Approvals
                  </span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#3b82f6' }}>
                    {Object.keys(smeApprovals).length} / {previewQuiz.questionCount}
                  </div>
                </div>
              </div>
            )}

            {/* Question Inspection Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}>
              {(validationReport?.questions || previewQuiz.questions).map((q, idx) => {
                const report = q.validationReport;
                const isApproved = smeApprovals[idx];
                const cog = report?.cognitive;

                return (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-elevated)',
                      padding: 16,
                      borderRadius: 'var(--radius-md)',
                      borderLeft: isApproved ? '4px solid #22c55e' : (report?.issues?.length > 0 ? '4px solid #f59e0b' : '4px solid var(--border)')
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>
                          Question #{idx + 1}
                        </span>

                        {cog && (
                          <span style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: 4,
                            background: cog.badgeBg,
                            color: cog.badgeColor,
                          }}>
                            {cog.level}
                          </span>
                        )}

                        {report?.issues?.map((issue, issueIdx) => (
                          <span
                            key={issueIdx}
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: issue.severity === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: issue.severity === 'error' ? '#ef4444' : '#f59e0b'
                            }}
                            title={issue.description}
                          >
                            {issue.label}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSmeApprovals(prev => ({ ...prev, [idx]: !prev[idx] }))}
                        className={`btn btn-sm ${isApproved ? 'btn-outline' : 'btn-ghost'}`}
                        style={{ padding: '3px 8px', fontSize: 11, color: isApproved ? '#22c55e' : 'var(--text-secondary)' }}
                      >
                        {isApproved ? <CheckCheck size={13} color="#22c55e" /> : <Check size={13} />}
                        <span>{isApproved ? 'SME Approved' : 'Approve for iGOT'}</span>
                      </button>
                    </div>

                    <p style={{ fontWeight: 700, fontSize: 13.5, margin: '0 0 10px', color: 'var(--text-primary)' }}>
                      {q.question}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8, marginBottom: 10 }}>
                      {(q.options || []).map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          style={{
                            padding: '7px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 12.5,
                            background: optIdx === q.correctAnswer ? 'var(--success-bg)' : 'var(--bg-surface)',
                            border: optIdx === q.correctAnswer ? '1px solid var(--success)' : '1px solid var(--border)',
                            color: optIdx === q.correctAnswer ? 'var(--success)' : 'var(--text-secondary)',
                            fontWeight: optIdx === q.correctAnswer ? 600 : 400,
                          }}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </div>
                      ))}
                    </div>

                    {q.explanation && (
                      <p style={{ fontSize: 11.5, color: 'var(--text-tertiary)', background: 'var(--bg-card)', padding: '7px 10px', borderRadius: 'var(--radius-sm)', margin: 0 }}>
                        <strong>Citation & Rationale:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIgotModalQuiz(previewQuiz)}
                  style={{
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <Sparkles size={14} /> {t('btn_export_igot', 'Export to iGOT Karmayogi')}
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => handlePrintQuiz(previewQuiz)}>
                  <Printer size={14} /> {t('btn_print', 'Print / Export PDF')}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => handleDownloadJSON(previewQuiz)}>
                  <Download size={14} /> {t('btn_download_json', 'Download JSON')}
                </button>
              </div>

              <Link href={`/quiz/${previewQuiz.id}`} className="btn btn-outline btn-sm">
                <Play size={14} /> {t('btn_take_quiz_now', 'Take This Quiz Now')}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* iGOT Karmayogi Publisher & Resiliency Bridge Modal */}
      {igotModalQuiz && (
        <IGotPublisherModal
          quiz={igotModalQuiz}
          onClose={() => setIgotModalQuiz(null)}
        />
      )}

    </div>
  );
}
