'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Volume2, VolumeX, Sparkles, CheckCircle2,
  AlertCircle, Award, RotateCw, Send, Globe, ChevronRight, Play
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Link from 'next/link';

const VIVA_PROMPTS = {
  en: [
    {
      id: 'viva-1',
      topic: 'Survey Sampling & Neyman Allocation',
      skill: 'Survey Design',
      examinerQuestion: 'Officer, in the NSSO 79th Round household survey manual, Neyman optimum allocation is mandated across rural and urban strata. Could you explain the mathematical justification for this, and how it mitigates non-response variance under a fixed survey budget?',
      keywords: ['variance', 'standard deviation', 'strata', 'cost', 'dispersion', 'budget', 'sample size', 'formula', 'proportional'],
      followUp: 'Excellent. If field travel costs in rural hilly terrain are triple that of plain regions, how would you modify the Neyman formula to account for unequal sampling costs per unit?',
      sampleAnswer: 'Under the NSSO 79th Round manual, Neyman optimum allocation minimizes total sampling variance under a fixed survey budget by allocating sample sizes proportional to the stratum size and standard deviation (N_h * S_h), effectively oversampling high-dispersion rural strata.'
    },
    {
      id: 'viva-2',
      topic: 'National Accounts & Double Deflation',
      skill: 'Official Statistics',
      examinerQuestion: 'Welcome, Officer. In the compilation of Gross Value Added (GVA) at basic prices, explain why the Central Statistics Office strictly prescribes the "Double Deflation" method over single indicator extrapolation during periods of imported commodity inflation.',
      keywords: ['gross output', 'intermediate consumption', 'input price', 'output price', 'wpi', 'cpi', 'real gva', 'systematic bias', 'distortion'],
      followUp: 'Very perceptive. Under SNA 2008, how do Supply-Use Tables (SUT) reconcile the statistical discrepancy between production-side and expenditure-side GDP?',
      sampleAnswer: 'Double deflation independently deflates gross output and intermediate consumption using specific WPI and CPI price deflators. During raw material price shocks, single deflation causes systematic bias by underestimating cost inflation and reporting artificially inflated real GVA.'
    }
  ],
  hi: [
    {
      id: 'viva-1-hi',
      topic: 'सर्वेक्षण नमूनाकरण और नेमन आवंटन',
      skill: 'Survey Design',
      examinerQuestion: 'अधिकारी महोदय, एनएसएसओ के 79वें दौर के सर्वेक्षण मैनुअल में ग्रामीण और शहरी स्तरों में नेमन इष्टतम आवंटन अनिवार्य किया गया है। क्या आप इसका गणितीय औचित्य स्पष्ट कर सकते हैं कि यह निश्चित बजट में नमूना प्रसरण को कैसे कम करता है?',
      keywords: ['प्रसरण', 'मानक विचलन', 'लागत', 'नमूना', 'बजट', 'स्तर', 'सूत्र'],
      followUp: 'उत्कृष्ट। यदि ग्रामीण पहाड़ी क्षेत्रों में सर्वेक्षण लागत मैदानी क्षेत्रों से तिगुनी हो, तो आप लागत के अनुसार सूत्र में क्या संशोधन करेंगे?',
      sampleAnswer: 'एनएसएसओ 79वें दौर के अनुसार, नेमन इष्टतम आवंटन निश्चित बजट में कुल नमूना प्रसरण को न्यूनतम करता है क्योंकि यह स्तर के आकार और उसके मानक विचलन के अनुपात में नमूना आवंटित करता है, जिससे उच्च विचलन वाले ग्रामीण क्षेत्रों का सटीक प्रतिनिधित्व होता है।'
    },
    {
      id: 'viva-2-hi',
      topic: 'राष्ट्रीय लेखा और दोहरा अपस्फीति (Double Deflation)',
      skill: 'Official Statistics',
      examinerQuestion: 'अधिकारी जी, राष्ट्रीय खातों में बुनियादी कीमतों पर सकल मूल्य वर्धन (GVA) का आकलन करते समय, यह बताएं कि आयातित मुद्रास्फीति के दौर में एकल अपस्फीति के बजाय दोहरा अपस्फीति (Double Deflation) तरीका क्यों आवश्यक है?',
      keywords: ['सकल उत्पादन', 'मध्यवर्ती उपभोग', 'कीमत सूचकांक', 'डब्ल्यूपीआई', 'सीपीआई', 'वास्तविक जीवीए', 'पूर्वाग्रह'],
      followUp: 'सटीक उत्तर। आपूर्ति और उपयोग तालिकाओं (SUT) के माध्यम से उत्पादन और व्यय दृष्टिकोण के बीच सांख्यिकीय विसंगति को कैसे संतुलित किया जाता है?',
      sampleAnswer: 'दोहरा अपस्फीति (Double Deflation) सकल उत्पादन और मध्यवर्ती उपभोग को उनके संबंधित मूल्य सूचकांकों से स्वतंत्र रूप से अपस्फीत करता है। आयातित लागत वृद्धि के समय एकल अपस्फीति वास्तविक जीवीए में कृत्रिम वृद्धि दर्शाती है, जिसे यह विधि रोकती है।'
    }
  ]
};

export default function OralVivaPage() {
  const { userSkills, updateSkillScore, language } = useApp();
  const [selectedLang, setSelectedLang] = useState(language === 'hi' ? 'hi' : 'en');
  const [promptIdx, setPromptIdx] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [vivaStep, setVivaStep] = useState('initial'); // 'initial' | 'answered' | 'followup' | 'completed'
  const [animateIn, setAnimateIn] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => { setAnimateIn(true); }, []);

  const prompts = VIVA_PROMPTS[selectedLang] || VIVA_PROMPTS['en'];
  const currentPrompt = prompts[promptIdx] || prompts[0];

  // Speech Recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onresult = (e) => {
        let current = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          current += e.results[i][0].transcript;
        }
        setTranscript(current);
      };

      rec.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setMicError('Microphone permission blocked. Please enable microphone access in your browser settings.');
        } else if (e.error === 'no-speech') {
          setMicError('No speech detected. Please speak closer to the microphone and try again.');
        } else {
          setMicError(`Voice service notice (${e.error}). You can also type your answer directly.`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [selectedLang]);

  const toggleListening = async () => {
    setMicError(null);

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SpeechRecognition) {
      setMicError('Speech Recognition is not available in this browser. You can type your answer or use Chrome/Edge/Safari.');
      return;
    }

    // Explicitly request microphone stream to trigger browser permission prompt if needed
    try {
      if (navigator?.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release audio track so SpeechRecognition engine can bind cleanly
        stream.getTracks().forEach(track => track.stop());
      }
    } catch (err) {
      console.warn('Microphone permission error:', err);
      setMicError('Microphone access was denied. Please allow microphone permission in your browser address bar.');
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      const initialText = transcript ? transcript.trim() + ' ' : '';

      rec.onresult = (e) => {
        let sessionTranscript = '';
        for (let i = 0; i < e.results.length; i++) {
          sessionTranscript += e.results[i][0].transcript;
        }
        if (sessionTranscript) {
          setTranscript(initialText + sessionTranscript);
        }
      };

      rec.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setIsListening(false);
        if (e.error === 'not-allowed') {
          setMicError('Microphone permission blocked. Please allow microphone access in browser settings.');
        } else if (e.error === 'no-speech') {
          setMicError('No voice detected. Please speak closer to your microphone or try again.');
        } else {
          setMicError(`Voice notice: ${e.error}. You can also type or use sample answer.`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setMicError('Could not activate microphone. Please type your response or try sample answer.');
    }
  };

  const speakText = (text) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleEvaluate = () => {
    if (!transcript.trim()) return;
    setIsEvaluating(true);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setTimeout(() => {
      const lower = transcript.toLowerCase();
      const matchedKeywords = currentPrompt.keywords.filter(k => lower.includes(k.toLowerCase()));
      const matchRatio = matchedKeywords.length / currentPrompt.keywords.length;

      const conceptualScore = Math.min(96, Math.max(35, Math.round(matchRatio * 75 + (transcript.length > 80 ? 25 : 10))));
      const articulationScore = Math.min(95, Math.max(40, Math.round(transcript.split(' ').length * 1.5 + 50)));
      const complianceScore = matchedKeywords.length >= 3 ? 92 : 68;
      const overallScore = Math.round((conceptualScore + articulationScore + complianceScore) / 3);

      updateSkillScore(currentPrompt.skill, overallScore);

      setEvaluation({
        overallScore,
        conceptualScore,
        articulationScore,
        complianceScore,
        matchedKeywords,
        feedback: matchedKeywords.length >= 3
          ? selectedLang === 'hi'
            ? 'उत्कृष्ट और प्रामाणिक प्रस्तुति! आपने सांख्यिकीय सिद्धांतों और MoSPI दिशा-निर्देशों को अत्यंत स्पष्टता से प्रतिपादित किया।'
            : 'Highly articulate and methodologically rigorous response. Accurately cited key mathematical identities and operational constraints.'
          : selectedLang === 'hi'
            ? 'संतोषजनक उत्तर, किन्तु तकनीकी शब्दावली (जैसे प्रसरण, विचलन) का और अधिक समावेश अपेक्षित है।'
            : 'Adequate explanation, but could be enhanced by incorporating deeper mathematical terminology.'
      });

      setIsEvaluating(false);
      setVivaStep('answered');
    }, 1200);
  };

  return (
    <div className={animateIn ? 'fade-in' : ''} style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 50 }}>
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{
              fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4,
              background: 'linear-gradient(135deg, #f05a28 0%, #a855f7 100%)', color: '#fff', textTransform: 'uppercase'
            }}>
              Voice Assessment AI
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>
              Socratic Oral Viva & Viva Voce Simulator
            </span>
          </div>
          <h1 className="section-title">AI Socratic Oral Viva (Voice-Based)</h1>
          <p className="section-subtitle">
            Demonstrate conceptual depth through natural speech in English or Hindi. The AI Examiner evaluates your articulation, terminology, and policy understanding.
          </p>
        </div>
      </div>

      {/* Language Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { setSelectedLang('en'); setEvaluation(null); setTranscript(''); }}
            className={`btn btn-sm ${selectedLang === 'en' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontWeight: 700 }}
          >
            English Viva
          </button>
          <button
            onClick={() => { setSelectedLang('hi'); setEvaluation(null); setTranscript(''); }}
            className={`btn btn-sm ${selectedLang === 'hi' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontWeight: 700 }}
          >
            हिन्दी मौखिक परीक्षा (Hindi Viva)
          </button>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {prompts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => { setPromptIdx(i); setEvaluation(null); setTranscript(''); setVivaStep('initial'); }}
              className={`btn btn-sm ${promptIdx === i ? 'btn-primary' : 'btn-ghost'}`}
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              Topic {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* AI Examiner Dialogue Box */}
      <div className="card mb-5" style={{ padding: 'clamp(20px, 4vw, 32px)', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 18 }}>
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 6px 20px rgba(168, 85, 247, 0.35)'
          }}>
            <Sparkles size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#a855f7', textTransform: 'uppercase' }}>
                  AI Presiding Examiner (UPSC / MoSPI Board)
                </span>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: '2px 0 0', color: 'var(--text-primary)' }}>
                  {currentPrompt.topic}
                </h3>
              </div>
              <button
                onClick={() => speakText(currentPrompt.examinerQuestion)}
                className="btn btn-outline btn-sm"
                style={{ padding: '4px 10px', fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                <span>{isSpeaking ? 'Speaking...' : 'Listen Question'}</span>
              </button>
            </div>

            <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', margin: '14px 0 0', lineHeight: 1.55 }}>
              &ldquo;{currentPrompt.examinerQuestion}&rdquo;
            </p>
          </div>
        </div>

        {/* Candidate Audio Input & Live Transcript Area */}
        <div style={{
          padding: 18, borderRadius: 'var(--radius-lg)', background: 'var(--bg-elevated)',
          border: isListening ? '2px solid var(--primary)' : '1px solid var(--border)',
          transition: 'all 200ms ease', marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              Your Spoken Response (Live Speech-to-Text)
            </span>
            {isListening && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, fontWeight: 700, color: '#ef4444'
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
                Listening via Microphone...
              </span>
            )}
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={isListening ? 'Speak clearly into your microphone...' : 'Click the microphone button below to speak, or type your answer here...'}
            style={{
              width: '100%', minHeight: 90, background: 'transparent',
              border: 'none', resize: 'vertical', color: 'var(--text-primary)',
              fontSize: 14, outline: 'none', lineHeight: 1.5
            }}
          />

          {micError && (
            <div style={{
              padding: '10px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444',
              fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{micError}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={toggleListening}
                className={`btn ${isListening ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '10px 18px', fontWeight: 800,
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: isListening ? '0 4px 16px var(--primary-glow)' : 'none'
                }}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isListening ? 'Stop Recording' : 'Start Speaking (Mic)'}</span>
              </button>

              {currentPrompt.sampleAnswer && (
                <button
                  type="button"
                  onClick={() => { setTranscript(currentPrompt.sampleAnswer); setMicError(null); }}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 12, padding: '8px 12px', color: 'var(--primary)', fontWeight: 600 }}
                  title="Insert a calibrated model response to test evaluation without microphone"
                >
                  <Sparkles size={13} /> Auto-Fill Sample Answer
                </button>
              )}
            </div>

            <button
              disabled={!transcript.trim() || isEvaluating}
              onClick={handleEvaluate}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Send size={14} />
              <span>{isEvaluating ? 'Evaluating Depth...' : 'Submit to Board'}</span>
            </button>
          </div>
        </div>

        {/* Evaluation Output */}
        {evaluation && (
          <div className="fade-in" style={{
            background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
            padding: 20, border: '1.5px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={20} color="#22c55e" />
                <h4 style={{ fontSize: 15, fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Oral Viva Assessment Score: {evaluation.overallScore}/100
                </h4>
              </div>
              <span className="tag tag-easy">
                Skill Updated: {currentPrompt.skill}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, background: 'var(--bg-elevated)', borderRadius: 6, textAlign: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Conceptual Depth</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#3b82f6', margin: '2px 0' }}>{evaluation.conceptualScore}%</div>
              </div>
              <div style={{ padding: 10, background: 'var(--bg-elevated)', borderRadius: 6, textAlign: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Articulation & Delivery</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e', margin: '2px 0' }}>{evaluation.articulationScore}%</div>
              </div>
              <div style={{ padding: 10, background: 'var(--bg-elevated)', borderRadius: 6, textAlign: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Terminology Matches</span>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--primary)', margin: '2px 0' }}>{evaluation.matchedKeywords.length} terms</div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 14px', lineHeight: 1.5 }}>
              💡 <strong>Board Feedback:</strong> {evaluation.feedback}
            </p>

            {/* Socratic Follow-Up */}
            <div style={{ padding: 14, background: 'rgba(168, 85, 247, 0.08)', borderRadius: 8, border: '1px solid rgba(168, 85, 247, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Sparkles size={14} color="#a855f7" />
                <span style={{ fontSize: 12, fontWeight: 800, color: '#a855f7' }}>
                  Socratic Follow-Up Prompt:
                </span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', margin: 0, fontStyle: 'italic' }}>
                &ldquo;{currentPrompt.followUp}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
