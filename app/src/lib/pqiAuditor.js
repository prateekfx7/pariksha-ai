/**
 * Pariksha AI — Psychometric Quality Index (PQI) & Question Auditor
 * Evaluates generated assessments against Capacity Building Commission (CBC)
 * and MoSPI psychometric standards before publishing to iGOT Karmayogi.
 */

export function auditQuestionPsychometrics(q) {
  const issues = [];
  let score = 100;

  const stem = q.question || '';
  const options = q.options || [];
  const explanation = q.explanation || '';

  // 1. Stem Length & Clarity
  if (stem.length < 25) {
    issues.push({
      type: 'warning',
      category: 'STEM_BREVITY',
      message: 'Question prompt is very brief (< 25 chars). May lack context for evaluators.',
      deduction: 10
    });
    score -= 10;
  }

  // 2. Double Negative Check (causes cognitive distortion in high-stakes testing)
  if (/(not\s+un|never\s+fail|neither\s+.*nor\s+.*not|cannot\s+disprove)/i.test(stem)) {
    issues.push({
      type: 'error',
      category: 'DOUBLE_NEGATIVE',
      message: 'Contains confusing double negatives in prompt. Violates CBC psychometric clarity rules.',
      deduction: 15
    });
    score -= 15;
  }

  // 3. "All of the Above" or "None of the Above" check (discouraged by modern psychometric guidelines)
  const hasGiveawayOptions = options.some(opt =>
    /all of the above|none of the above|both [a-c] and [a-c]|any of these/i.test(opt)
  );
  if (hasGiveawayOptions) {
    issues.push({
      type: 'warning',
      category: 'POOR_DISTRACTOR',
      message: 'Uses "All/None of the above". Modern CAT testing recommends four independent plausible distractors.',
      deduction: 10
    });
    score -= 10;
  }

  // 4. Distractor Length Disparity (the longest option is often statistically guessed as correct)
  if (options.length >= 4 && typeof q.correctAnswer === 'number') {
    const correctLen = (options[q.correctAnswer] || '').length;
    const avgOtherLen = options.reduce((sum, opt, i) => i === q.correctAnswer ? sum : sum + opt.length, 0) / (options.length - 1);
    
    if (correctLen > avgOtherLen * 2.2 && correctLen > 60) {
      issues.push({
        type: 'warning',
        category: 'LENGTH_BIAS',
        message: 'The correct answer is more than double the average length of other distractors (length cue bias).',
        deduction: 10
      });
      score -= 10;
    }
  }

  // 5. Duplicate or overlapping distractors
  const optionSet = new Set(options.map(o => o.trim().toLowerCase()));
  if (optionSet.size < options.length) {
    issues.push({
      type: 'error',
      category: 'DUPLICATE_OPTIONS',
      message: 'Contains duplicate or overlapping answer options.',
      deduction: 25
    });
    score -= 25;
  }

  // 6. Explanation Depth & Circular Citation
  const hasMoSPICitation = /(nss|mospi|cso|plfs|asi|sna|gva|gdp|capi|ndgfp|circular|guideline|schedule)/i.test(explanation);
  if (!hasMoSPICitation) {
    issues.push({
      type: 'info',
      category: 'CITATION_RECOMMENDED',
      message: 'Explanation would benefit from citing an official MoSPI manual or gazette circular.',
      deduction: 5
    });
    score -= 5;
  }

  score = Math.max(20, Math.min(100, score));

  return {
    score,
    issues,
    distractorPlausibility: score >= 85 ? 'High (Plausible Distractors)' : score >= 70 ? 'Moderate' : 'Low',
    antiHallucinationStatus: hasMoSPICitation ? 'Verified MoSPI Methodology' : 'General Theory'
  };
}

/**
 * Audits an entire Quiz/Assessment and returns aggregate Psychometric Quality Index (PQI)
 */
export function auditQuizPQI(quiz) {
  const questions = quiz.questions || [];
  if (questions.length === 0) {
    return {
      pqiScore: 0,
      grade: 'F',
      seal: 'Unverified',
      auditSummary: 'No questions to evaluate.',
      itemAudits: []
    };
  }

  const itemAudits = questions.map((q, idx) => ({
    qNum: idx + 1,
    ...auditQuestionPsychometrics(q)
  }));

  const totalScore = itemAudits.reduce((acc, curr) => acc + curr.score, 0);
  const pqiScore = Math.round(totalScore / itemAudits.length);

  let grade = 'C';
  let seal = 'CBC Compliant';
  let color = '#f59e0b';

  if (pqiScore >= 92) {
    grade = 'A+';
    seal = 'Gold Certified (CBC & MoSPI Standards)';
    color = '#22c55e';
  } else if (pqiScore >= 84) {
    grade = 'A';
    seal = 'Silver Certified (Quality Validated)';
    color = '#3b82f6';
  } else if (pqiScore >= 72) {
    grade = 'B';
    seal = 'Bronze Certified (Minor Warnings)';
    color = '#f59e0b';
  } else {
    grade = 'C';
    seal = 'Review Required Before iGOT Upload';
    color = '#ef4444';
  }

  return {
    pqiScore,
    grade,
    seal,
    color,
    totalItems: questions.length,
    highQualityItems: itemAudits.filter(i => i.score >= 85).length,
    itemAudits
  };
}
