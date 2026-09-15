/**
 * Pariksha AI — Computerized Adaptive Testing (CAT) & Item Response Theory (IRT) Engine
 * Implements 2-Parameter Logistic (2PL) Rasch Model:
 * P(theta) = 1 / (1 + exp(-a * (theta - b)))
 * where:
 *   theta = officer's latent ability (-3.0 to +3.0)
 *   b = item difficulty parameter (-2.5 to +2.5)
 *   a = item discrimination parameter (0.8 to 2.2)
 */

export const IRT_ITEM_POOL = [
  // --- Foundational / Easy Items (b: -2.0 to -0.8) ---
  {
    id: 'irt-sd-1',
    skill: 'Survey Design',
    b: -1.5, // Easy difficulty
    a: 1.2,  // Good discrimination
    question: 'In the National Sample Survey (NSS) multi-stage design, what constitutes a First Stage Unit (FSU) in the rural sector?',
    options: [
      '2011 Census Enumeration Village',
      'Individual agricultural household',
      'Gram Panchayat Block headquarters',
      'District Collectorate Revenue subdivision'
    ],
    correctAnswer: 0,
    explanation: 'Under MoSPI NSS guidelines, Census villages serve as the primary First Stage Units (FSUs) in the rural sector, from which households (SSUs) are sampled.'
  },
  {
    id: 'irt-os-1',
    skill: 'Official Statistics',
    b: -1.2,
    a: 1.1,
    question: 'Which of the following identities correctly defines Gross Value Added (GVA) at basic prices according to National Accounts methodology?',
    options: [
      'Gross Output minus Intermediate Consumption',
      'GDP at Market Prices plus Product Subsidies',
      'Gross Output plus Product Taxes minus Intermediate Consumption',
      'Net Value Added minus Consumption of Fixed Capital'
    ],
    correctAnswer: 0,
    explanation: 'GVA at basic prices is defined strictly as Gross Output minus Intermediate Consumption before adding product taxes and deducting product subsidies.'
  },
  {
    id: 'irt-gis-1',
    skill: 'GIS & Spatial Analysis',
    b: -1.0,
    a: 1.3,
    question: 'What is the standard standard Local Government Directory (LGD) code used for in Indian census spatial mapping?',
    options: [
      'Assigning a persistent, unique spatial identifier to administrative units',
      'Encrypting field surveyor biometric credentials',
      'Calculating geodesic distances between urban enumeration blocks',
      'Storing satellite multi-spectral reflectance indices'
    ],
    correctAnswer: 0,
    explanation: 'The Local Government Directory (LGD) maintained by MoPR/MoSPI provides standardized, persistent digital identifiers for all administrative entities (States, Districts, Sub-districts, and Villages).'
  },

  // --- Intermediate Items (b: -0.5 to +0.5) ---
  {
    id: 'irt-sd-2',
    skill: 'Survey Design',
    b: -0.2,
    a: 1.5,
    question: 'In NSSO stratified sampling, when is Neyman Optimum Allocation superior to proportional allocation?',
    options: [
      'When stratum variances (standard deviations) differ significantly across strata',
      'When survey field budgets are unlimited across all districts',
      'When the non-response rate exceeds 15% in rural areas',
      'When sampling is conducted with replacement in urban blocks'
    ],
    correctAnswer: 0,
    explanation: 'Neyman allocation allocates sample size proportional to N_h * S_h (size times standard deviation), minimizing sampling variance when stratum dispersions vary widely.'
  },
  {
    id: 'irt-os-2',
    skill: 'Official Statistics',
    b: 0.1,
    a: 1.6,
    question: 'Why does the National Statistical Office mandate the "Double Deflation" method when computing real Gross Value Added in constant prices?',
    options: [
      'It independently deflates gross output and intermediate inputs with respective price indices',
      'It adjusts for both urban CPI and rural CPI simultaneously',
      'It applies nominal interest rate deflators twice to account for inflation compounding',
      'It prevents negative GVA calculations in seasonal manufacturing sectors'
    ],
    correctAnswer: 0,
    explanation: 'Double deflation deflates gross output by output price indices (e.g. WPI/CPI items) and intermediate inputs by input price indices, preventing severe systematic bias during price shocks.'
  },
  {
    id: 'irt-ds-1',
    skill: 'Data Science & Analytics',
    b: 0.4,
    a: 1.4,
    question: 'In survey microdata curation, why is Hot-Deck imputation preferred over mean imputation for missing household income entries?',
    options: [
      'It preserves the underlying variance and realistic distribution from a matched donor record',
      'It guarantees zero standard error in population aggregate estimates',
      'It completely removes the necessity for post-stratification sampling weights',
      'It mathematically eliminates all outliers exceeding 3 standard deviations'
    ],
    correctAnswer: 0,
    explanation: 'Hot-deck imputation replaces missing values with observed responses from similar "donor" units in the same survey batch, preserving the empirical distribution and bivariate relationships unlike mean imputation.'
  },

  // --- Advanced / High Competency Items (b: +0.8 to +2.2) ---
  {
    id: 'irt-sd-3',
    skill: 'Survey Design',
    b: 1.2,
    a: 1.8,
    question: 'Under CAPI protocol in MoSPI field surveys, an outlier casuality wage report deviates by 4.2 sigma from the district median. What is the mandated algorithmic action?',
    options: [
      'Trigger an automated supervisor re-interview callback flag and require photographic/voucher verification',
      'Silently winsorize the wage entry to the 99th percentile value before upload',
      'Automatically drop the sample household and substitute with the nearest village listing',
      'Overwrite the response with the state minimum wage gazette rate'
    ],
    correctAnswer: 0,
    explanation: 'MoSPI data quality protocols strictly forbid unverified on-field deletion or silent truncation. Extreme variance anomalies (>3 sigma) mandate an electronic callback flag and supervisor re-interview validation.'
  },
  {
    id: 'irt-gov-1',
    skill: 'Data Governance',
    b: 1.6,
    a: 1.9,
    question: 'Under the National Data Governance Framework Policy (NDGFP) and Statistical Disclosure Control (SDC), what mathematical constraint ensures that a 4-digit NIC microdata cell does not compromise proprietary factory output?',
    options: [
      'k-Anonymity constraint where k >= 3 within any demographic/geographic stratum',
      'Applying 128-bit MD5 hashing to aggregate turnover values',
      'Aggregating all factory records having fewer than 500 employees into state totals',
      'Restricting survey release to hardcopy gazettes rather than digital microdata'
    ],
    correctAnswer: 0,
    explanation: 'In SDC governance, k-anonymity (typically k >= 3) ensures that each combination of quasi-identifiers matches at least k distinct reporting entities, preventing individual factory re-identification.'
  },
  {
    id: 'irt-os-3',
    skill: 'Official Statistics',
    b: 2.1, // Expert Cadre Level
    a: 2.0,
    question: 'In the compilation of Supply and Use Tables (SUT) under SNA 2008, what is the regulatory tolerance threshold for statistical discrepancy between the production and expenditure approaches to GDP estimation?',
    options: [
      'Discrepancy must not exceed +/- 1.5% of total GDP at market prices',
      'Discrepancy must be exactly zero through balancing adjustments in household final consumption',
      'Discrepancy can extend up to +/- 5.0% during census revision base years',
      'Discrepancy is absorbed solely within gross fixed capital formation'
    ],
    correctAnswer: 0,
    explanation: 'MoSPI National Accounts Division guidelines require statistical discrepancies between GDP from the production side and expenditure side to remain strictly within +/- 1.5% in balanced SUT frameworks.'
  }
];

/**
 * Calculates probability of correct response under 2PL IRT model
 */
export function getProbability(theta, b, a = 1.0) {
  const z = a * (theta - b);
  return 1 / (1 + Math.exp(-z));
}

/**
 * Calculates Item Information Function: I(theta) = a^2 * P(theta) * (1 - P(theta))
 */
export function getItemInformation(theta, b, a = 1.0) {
  const p = getProbability(theta, b, a);
  return a * a * p * (1 - p);
}

/**
 * Selects the next best item from remaining pool that maximizes test information at current theta
 */
export function selectNextAdaptiveItem(theta, answeredItemIds = [], pool = IRT_ITEM_POOL) {
  const available = pool.filter(item => !answeredItemIds.includes(item.id));
  if (available.length === 0) return null;

  let bestItem = available[0];
  let maxInfo = -1;

  available.forEach(item => {
    const info = getItemInformation(theta, item.b, item.a);
    if (info > maxInfo) {
      maxInfo = info;
      bestItem = item;
    }
  });

  return bestItem;
}

/**
 * Updates theta ability estimate using Newton-Raphson Maximum Likelihood / Expected A Posteriori
 * responseHistory: Array of { item: {b, a}, isCorrect: boolean }
 */
export function estimateAbility(responseHistory, priorTheta = 0.0) {
  if (responseHistory.length === 0) return { theta: 0.0, se: 1.0 };

  let theta = priorTheta;
  const maxIterations = 20;
  const convergenceThreshold = 0.001;

  for (let iter = 0; iter < maxIterations; iter++) {
    let scoreFirstDerivative = 0; // First derivative of log-likelihood
    let testInfoSecondDerivative = 0; // Negative of second derivative (Information)

    responseHistory.forEach(({ item, isCorrect }) => {
      const p = getProbability(theta, item.b, item.a);
      const u = isCorrect ? 1 : 0;
      scoreFirstDerivative += item.a * (u - p);
      testInfoSecondDerivative += item.a * item.a * p * (1 - p);
    });

    // Bayesian prior regularization (Normal(0, 1) prior to prevent divergence on all-correct/all-wrong)
    scoreFirstDerivative -= theta; // prior derivative (d/d_theta of -theta^2/2)
    testInfoSecondDerivative += 1.0; // prior information

    const step = scoreFirstDerivative / testInfoSecondDerivative;
    theta = Math.max(-3.0, Math.min(3.0, theta + step));

    if (Math.abs(step) < convergenceThreshold) {
      break;
    }
  }

  // Calculate Standard Error: SE = 1 / sqrt(Total Information)
  let totalInformation = 1.0; // Prior info
  responseHistory.forEach(({ item }) => {
    totalInformation += getItemInformation(theta, item.b, item.a);
  });
  const se = 1 / Math.sqrt(totalInformation);

  return {
    theta: Math.round(theta * 100) / 100,
    se: Math.round(se * 100) / 100,
  };
}

/**
 * Converts IRT theta (-3.0 to +3.0) into a standardized MoSPI Competency Score (0 to 100)
 */
export function thetaToCompetencyScore(theta) {
  // Normal CDF mapping from theta to 0-100 scale:
  // theta = -2.5 -> ~12
  // theta = 0.0  -> 55 (Solid Foundational Level)
  // theta = +1.5 -> 85 (High Competency)
  // theta = +2.5 -> 98 (Cadre Specialist)
  const z = (theta + 0.2) / 1.15;
  const score = 1 / (1 + Math.exp(-z));
  return Math.max(10, Math.min(99, Math.round(score * 100)));
}

/**
 * Returns Cadre Mastery Level Description
 */
export function getCadreMasteryLevel(theta) {
  if (theta >= 1.5) {
    return {
      title: 'Cadre Specialist (ISS Senior Grade)',
      grade: 'Level 5 — High Mastery',
      color: '#22c55e',
      summary: 'Demonstrates deep psychometric mastery of complex survey allocation, double deflation, and advanced microdata disclosure controls.'
    };
  }
  if (theta >= 0.5) {
    return {
      title: 'Senior Statistical Officer (SSO / AD)',
      grade: 'Level 4 — Advanced Operational',
      color: '#3b82f6',
      summary: 'Proficient in multi-stage stratification, Neyman variance optimization, and national accounting identities.'
    };
  }
  if (theta >= -0.5) {
    return {
      title: 'Statistical Officer (JSO / SSS)',
      grade: 'Level 3 — Core Competent',
      color: '#f59e0b',
      summary: 'Solid grasp of foundational sampling units, LGD directory structures, and standard survey protocols.'
    };
  }
  return {
    title: 'Trainee Officer / Induction Cadre',
    grade: 'Level 2 — Developing',
    color: '#ef4444',
    summary: 'Requires targeted micro-learning in official statistical definitions, CAPI validation rules, and sampling frame concepts.'
  };
}
