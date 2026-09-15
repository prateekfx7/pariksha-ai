/**
 * Pariksha AI — Question Quality Validator & Human-in-the-Loop Engine
 * Evaluates assessment banks for duplicates, ambiguity, distractor bias,
 * and HOTS (Higher Order Thinking Skills) per Karmayogi Bharat SME standards.
 */

// Simple token similarity (Jaccard) for duplicate detection
function calculateJaccardSimilarity(str1, str2) {
  const getTokens = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const set1 = getTokens(str1);
  const set2 = getTokens(str2);
  if (set1.size === 0 || set2.size === 0) return 0;
  
  let intersection = 0;
  for (const token of set1) {
    if (set2.has(token)) intersection++;
  }
  const union = set1.size + set2.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// Classify question into Bloom's taxonomy & HOTS
export function classifyCognitiveLevel(questionText, options = []) {
  const text = (questionText + ' ' + options.join(' ')).toLowerCase();

  // Evaluation & HOTS (Analysis / Synthesis / Evaluation)
  if (
    /case study|scenario|evaluate|audit|investigate|which of the following actions should the officer take|best course of action|discrepancy|reconcile|determine the optimal|recommend/i.test(text)
  ) {
    return {
      level: 'HOTS (Application & Evaluation)',
      isHOTS: true,
      bloomLevel: 'Analyzing & Evaluating',
      badgeColor: '#a855f7',
      badgeBg: 'rgba(168, 85, 247, 0.12)'
    };
  }

  // Application
  if (
    /calculate|apply|determine|implement|compute|procedure for|according to the circular, if|in the event that/i.test(text)
  ) {
    return {
      level: 'Application',
      isHOTS: true,
      bloomLevel: 'Applying',
      badgeColor: '#3b82f6',
      badgeBg: 'rgba(59, 130, 246, 0.12)'
    };
  }

  // Understanding
  if (
    /why|explain|distinguish|difference between|summarize|illustrate/i.test(text)
  ) {
    return {
      level: 'Understanding',
      isHOTS: false,
      bloomLevel: 'Understanding',
      badgeColor: '#eab308',
      badgeBg: 'rgba(234, 179, 8, 0.12)'
    };
  }

  // Recall / Knowledge
  return {
    level: 'Direct Recall',
    isHOTS: false,
    bloomLevel: 'Remembering',
    badgeColor: '#94a3b8',
    badgeBg: 'rgba(148, 163, 184, 0.12)'
  };
}

// Comprehensive Question Audit
export function validateQuestionQuality(q, allQuestions = [], currentIndex = 0) {
  const issues = [];
  let qualityScore = 100;

  const stem = (q.question || '').trim();
  const options = q.options || [];
  const explanation = (q.explanation || '').trim();
  const correctAnswer = q.correctAnswer;

  // 1. Check for Duplicates / Redundancies across the bank
  for (let i = 0; i < allQuestions.length; i++) {
    if (i === currentIndex) continue;
    const otherStem = (allQuestions[i].question || '').trim();
    const similarity = calculateJaccardSimilarity(stem, otherStem);
    if (similarity > 0.75) {
      issues.push({
        severity: 'error',
        code: 'DUPLICATE_QUESTION',
        label: 'Potential Duplicate Question',
        description: `Very high similarity (${Math.round(similarity * 100)}%) with Question #${i + 1} in this bank.`,
        recommendation: 'Deduplicate or modify the scenario context to test distinct competencies.'
      });
      qualityScore -= 25;
      break;
    }
  }

  // 2. Stem Clarity & Length
  if (stem.length < 25) {
    issues.push({
      severity: 'warning',
      code: 'STEM_TOO_SHORT',
      label: 'Insufficient Prompt Context',
      description: 'Stem is shorter than 25 characters, which may create ambiguity for civil service test-takers.',
      recommendation: 'Expand with practical administrative context or specific circular reference.'
    });
    qualityScore -= 10;
  }

  // 3. Double Negative / Linguistic Confusion
  if (/(not\s+un|never\s+fail|neither\s+.*nor\s+.*not|cannot\s+disprove|which of the following is not untrue)/i.test(stem)) {
    issues.push({
      severity: 'error',
      code: 'DOUBLE_NEGATIVE',
      label: 'Double Negative Phrasing',
      description: 'Contains double negatives in the prompt. Causes cognitive distortion in civil service assessments.',
      recommendation: 'Rephrase affirmatively (e.g., "Which action is required..." rather than "Which action is not unallowed...").'
    });
    qualityScore -= 15;
  }

  // 4. Distractor Count & Validity
  if (options.length !== 4) {
    issues.push({
      severity: 'error',
      code: 'INVALID_OPTION_COUNT',
      label: 'Non-Standard Distractor Count',
      description: `Found ${options.length} options. iGOT standard MCQ format requires exactly 4 options.`,
      recommendation: 'Ensure exactly 4 mutually exclusive options (A, B, C, D).'
    });
    qualityScore -= 20;
  }

  // 5. "All of the Above" or "None of the Above" giveaway
  const hasGiveawayOptions = options.some(opt =>
    /all of the above|none of the above|both [a-c] and [a-c]|any of these/i.test(opt)
  );
  if (hasGiveawayOptions) {
    issues.push({
      severity: 'warning',
      code: 'GIVEAWAY_OPTION',
      label: 'Catch-All Distractor Detected',
      description: 'Contains "All/None of the above". Modern psychometric testing recommends 4 independent plausible distractors.',
      recommendation: 'Replace catch-all option with a plausible functional distractor.'
    });
    qualityScore -= 10;
  }

  // 6. Length Bias / Giveaway Clue (Correct option excessively longer than distractors)
  if (options.length === 4 && typeof correctAnswer === 'number') {
    const correctLen = (options[correctAnswer] || '').length;
    const otherLens = options.filter((_, idx) => idx !== correctAnswer).map(o => o.length);
    const avgOtherLen = otherLens.reduce((a, b) => a + b, 0) / (otherLens.length || 1);

    if (correctLen > avgOtherLen * 2.2 && correctLen > 50) {
      issues.push({
        severity: 'warning',
        code: 'LENGTH_BIAS',
        label: 'Correct Option Length Cue',
        description: `Correct answer (${correctLen} chars) is more than 2x longer than average distractors (${Math.round(avgOtherLen)} chars).`,
        recommendation: 'Balance option lengths to prevent visual guessing cues.'
      });
      qualityScore -= 10;
    }
  }

  // 7. Explanation & Citation Presence
  if (!explanation || explanation.length < 15) {
    issues.push({
      severity: 'warning',
      code: 'MISSING_EXPLANATION',
      label: 'Missing Official Citation',
      description: 'No official regulatory reference or rationale provided for candidates.',
      recommendation: 'Add circular reference or DoPT rule citation to enhance learner feedback.'
    });
    qualityScore -= 10;
  }

  // Cognitive taxonomy classification
  const cognitive = classifyCognitiveLevel(stem, options);

  return {
    score: Math.max(0, qualityScore),
    status: qualityScore >= 85 ? 'PASSED' : qualityScore >= 60 ? 'REVIEW_REQUIRED' : 'CRITICAL_ISSUES',
    issues,
    cognitive,
    isSmeApproved: false
  };
}

// Batch validator for full question bank
export function validateQuestionBank(questions = []) {
  let totalScore = 0;
  let passedCount = 0;
  let reviewCount = 0;
  let criticalCount = 0;
  let hotsCount = 0;

  const validatedQuestions = questions.map((q, idx) => {
    const report = validateQuestionQuality(q, questions, idx);
    totalScore += report.score;
    if (report.status === 'PASSED') passedCount++;
    else if (report.status === 'REVIEW_REQUIRED') reviewCount++;
    else criticalCount++;

    if (report.cognitive.isHOTS) hotsCount++;

    return {
      ...q,
      validationReport: report
    };
  });

  const averageScore = questions.length > 0 ? Math.round(totalScore / questions.length) : 100;
  const hotsPercentage = questions.length > 0 ? Math.round((hotsCount / questions.length) * 100) : 0;

  return {
    averageScore,
    totalQuestions: questions.length,
    passedCount,
    reviewCount,
    criticalCount,
    hotsCount,
    hotsPercentage,
    questions: validatedQuestions,
    overallStatus: averageScore >= 80 && criticalCount === 0 ? 'READY_FOR_IGOT' : 'REQUIRES_SME_APPROVAL'
  };
}
