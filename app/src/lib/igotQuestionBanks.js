/**
 * Pariksha AI — iGOT Karmayogi Official 7-Topic Question Banks
 * Comprehensive high-quality questions mapped to DoPT & MoSPI civil service topics:
 * 1. Conduct & Ethics
 * 2. Workplace Skills
 * 3. Administrative Skills
 * 4. Digital Skills
 * 5. Governance & Policy
 * 6. Legal & Regulatory
 * 7. Sector-Specific (MoSPI Official Statistics)
 */

export const IGOT_TOPIC_BANKS = {
  'Conduct & Ethics': [
    {
      q: "Under Rule 13 of the CCS (Conduct) Rules 1964 as amended by DoPT in 2019, what is the monetary threshold above which a Group A officer must report gifts received from near relatives on ceremonial occasions?",
      opts: ["Exceeding ₹25,000", "Exceeding ₹5,000", "Exceeding ₹10,000", "Exceeding ₹1,500"],
      correct: 0,
      diff: "Medium",
      exp: "Per DoPT O.M. dated 06.08.2019, the ceiling for Group A officers is ₹25,000, for Group B is ₹15,000, and for Group C is ₹7,500.",
      isHOTS: false
    },
    {
      q: "Scenario: An officer's close relative tenders a commercial bid for an IT procurement contract managed by the officer's division. According to the Central Vigilance Commission (CVC) manual, what is the mandatory immediate action?",
      opts: [
        "Formally recuse in writing from all tender committee meetings and declare the conflict of interest",
        "Advise the relative to lower their bid price to ensure public exchequer savings",
        "Abstain only from the final award decision while participating in technical evaluation",
        "Allow the process to continue if there are at least three other competitive bidders"
      ],
      correct: 0,
      diff: "Hard",
      exp: "CVC guidelines require immediate written disclosure of conflict of interest and complete recusal from all phases of the procurement process.",
      isHOTS: true
    },
    {
      q: "Under Rule 9 of CCS (Conduct) Rules 1964, can a government servant criticize any recent policy or action of the Central Government on social media or public forums?",
      opts: [
        "No, public criticism or expressing adverse opinions on government policy without authorization is strictly prohibited",
        "Yes, as long as it is done from a personal social media handle outside office hours",
        "Yes, provided no official confidential documents are attached to the post",
        "Permitted only if the officer is an office bearer of a recognized staff association"
      ],
      correct: 0,
      diff: "Medium",
      exp: "Rule 9 strictly bars any utterance or publication in social media, print, or broadcast which has the effect of an adverse criticism of any current or recent policy or action of the Government.",
      isHOTS: false
    },
    {
      q: "Case Application: An officer on an official field audit receives an offer of complimentary luxury hospitality from a surveyed enterprise. How should the officer proceed?",
      opts: [
        "Politely decline the hospitality and claim permissible Travelling & Daily Allowance (TA/DA) as per government entitlements",
        "Accept the hospitality if no formal financial transactions are pending on the same day",
        "Accept but deposit an estimated commercial equivalent into the public exchequer",
        "Permissible if other members of the survey team also share the accommodation"
      ],
      correct: 0,
      diff: "Hard",
      exp: "Public servants must not accept hospitality from commercial entities with which they have official dealings, preserving independence and integrity.",
      isHOTS: true
    }
  ],

  'Workplace Skills': [
    {
      q: "In high-pressure administrative coordination, which emotional intelligence competency allows a section leader to recognize burnout symptoms in subordinates before error rates spike?",
      opts: ["Social Awareness and Empathy", "Strict Task Delegation", "Selective Perception", "Hierarchical Escalation"],
      correct: 0,
      diff: "Medium",
      exp: "Social awareness and empathy enable leaders to perceive emotional undercurrents, stress, and fatigue in team members.",
      isHOTS: false
    },
    {
      q: "Scenario: A multi-disciplinary team between economists and software engineers faces conflicting priorities regarding a statistical portal release. As the project director, which conflict resolution approach best ensures long-term collaboration?",
      opts: [
        "Facilitate an integrative consensus session focusing on shared mission goals and user impact",
        "Exercise executive authority to overrule the technical team completely",
        "Postpone the launch indefinitely until informal agreement is achieved",
        "Split the deliverables into isolated tracks with zero shared accountability"
      ],
      correct: 0,
      diff: "Hard",
      exp: "Integrative collaboration addresses underlying concerns of both domain specialists and technical architects, fostering collective ownership.",
      isHOTS: true
    },
    {
      q: "Which active listening practice is most effective when briefing citizens and field enumerators during grievance redressal sessions?",
      opts: [
        "Paraphrasing key points back to the speaker to confirm mutual understanding before proposing solutions",
        "Interrupting immediately to cite relevant circular numbers",
        "Maintaining silence while preparing a defensive rebuttal",
        "Redirecting all verbal complaints to an online ticketing form"
      ],
      correct: 0,
      diff: "Easy",
      exp: "Paraphrasing confirms accurate message reception and validates the speaker's perspective.",
      isHOTS: false
    }
  ],

  'Administrative Skills': [
    {
      q: "Under the Central Secretariat Manual of Office Procedure (CSMOP), what is the primary purpose of a 'Note for Cabinet'?",
      opts: [
        "To present major policy proposals, legislative drafts, or significant inter-ministerial disagreements for Council of Ministers decision",
        "To sanction petty cash expenses under GFR Rule 145",
        "To record daily attendance logs of field staff",
        "To issue routine annual confidential report reminders"
      ],
      correct: 0,
      diff: "Medium",
      exp: "Cabinet Notes are formal instruments for submitting major policy, legislative, or inter-ministerial matters for decision by the Cabinet or its Committees.",
      isHOTS: false
    },
    {
      q: "Scenario: A file regarding public procurement requires urgent concurrence, but the primary dealing assistant is on sanctioned leave. According to CSMOP work continuity protocols, what action should the Section Officer take?",
      opts: [
        "Examine and initiate the file directly or assign it to an alternative desk officer under the link-officer system",
        "Keep the file pending until the primary assistant returns to preserve audit continuity",
        "Return the file to the originating department without remarks",
        "Transmit the file informally via messaging apps without physical or e-Office registration"
      ],
      correct: 0,
      diff: "Hard",
      exp: "CSMOP link-officer procedures mandate that urgent administrative files must not stagnate; the Section Officer or designated link-officer must process them.",
      isHOTS: true
    },
    {
      q: "In government drafting, what distinguishing feature separates an 'Office Memorandum' (OM) from a 'Notification'?",
      opts: [
        "An OM communicates internal decisions or instructions between Ministries, whereas a Notification is published in the Gazette of India to declare rules or statutory appointments",
        "An OM has legal effect on private citizens while a Notification is purely advisory",
        "An OM must be signed by the Minister while a Notification is signed by an Assistant",
        "There is no legal or procedural difference between an OM and a Notification"
      ],
      correct: 0,
      diff: "Medium",
      exp: "Office Memoranda are used for inter-departmental correspondence and internal guidelines; Notifications are published in the Official Gazette for statutory promulgation.",
      isHOTS: false
    }
  ],

  'Digital Skills': [
    {
      q: "Under the Digital Personal Data Protection (DPDP) Act 2023, what is the role and liability of a government department processing citizen survey microdata as a 'Data Fiduciary'?",
      opts: [
        "It must implement reasonable security safeguards, notify data breaches to the Data Protection Board, and process data only for lawful stated purposes",
        "It is exempt from all security obligations if the data belongs to rural households",
        "It can monetize citizen microdata to fund state statistical schemes",
        "It is only required to maintain password protection on personal workstations"
      ],
      correct: 0,
      diff: "Hard",
      exp: "Under DPDP Act 2023, Data Fiduciaries bear statutory obligations for data security, purpose limitation, breach reporting, and erasure when purpose is served.",
      isHOTS: true
    },
    {
      q: "When analyzing large official dataset files in MS Excel, which feature prevents data corruption when multiple users enter field returns concurrently?",
      opts: ["Data Validation with restricted drop-downs and workbook protection", "Conditional formatting only", "Spell check auto-correction", "Manual cell highlighting"],
      correct: 0,
      diff: "Easy",
      exp: "Data Validation restricts allowed inputs (e.g. valid district codes, non-negative numbers), preventing corrupted or erroneous entries.",
      isHOTS: false
    },
    {
      q: "What constitutes the most secure practice against phishing and credential theft when accessing government e-Office and iGOT portals?",
      opts: [
        "Enforcing hardware-based FIDO2 / multi-factor authentication (MFA) and never sharing OTPs",
        "Saving passwords in plaintext notes on office desktop monitors",
        "Using simple common passwords across internal and external web accounts",
        "Disabling antivirus definitions to speed up page loading"
      ],
      correct: 0,
      diff: "Easy",
      exp: "Multi-Factor Authentication (MFA) with strict OTP hygiene remains the primary defense against credential harvesting and unauthorized portal access.",
      isHOTS: false
    }
  ],

  'Governance & Policy': [
    {
      q: "In evidence-based policy formulation, what is the fundamental advantage of utilizing Data-Driven Decision Making (DDDM) over intuitive administrative discretion?",
      opts: [
        "It establishes measurable baseline indicators, quantifies policy impact, and reduces cognitive or anecdotal biases",
        "It eliminates the requirement for parliamentary budgetary approval",
        "It automatically prevents any future project expenditure overruns",
        "It replaces the need for field inspections and citizen consultations"
      ],
      correct: 0,
      diff: "Medium",
      exp: "Data-driven governance anchors policy in verifiable statistical evidence, enabling rigorous monitoring, evaluation, and targeted resource allocation.",
      isHOTS: false
    },
    {
      q: "Scenario: An administrative district displays an unexpected 20% drop in maternal health scheme uptake. Which data governance step should the District Collector execute first?",
      opts: [
        "Cross-validate microdata across primary health centers and check for localized field non-response or CAPI connectivity anomalies",
        "Immediately suspend health workers before investigating data fidelity",
        "Declare the scheme successful based on historical state-level averages",
        "Delete the reporting records from the central dashboard to prevent negative publicity"
      ],
      correct: 0,
      diff: "Hard",
      exp: "Rigorous data governance requires validating reporting integrity, data transmission, and local field conditions before making policy or disciplinary determinations.",
      isHOTS: true
    }
  ],

  'Legal & Regulatory': [
    {
      q: "Under the Rights of Persons with Disabilities (RPwD) Act 2016, how many categories of benchmark disabilities are recognized for reservations in government establishment posts?",
      opts: ["21 benchmark categories with 4% reservation", "7 categories with 3% reservation", "14 categories with 2% reservation", "10 categories with 5% reservation"],
      correct: 0,
      diff: "Medium",
      exp: "The RPwD Act 2016 expanded benchmark categories from 7 to 21 and increased government reservation from 3% to 4%.",
      isHOTS: false
    },
    {
      q: "Under the Sexual Harassment of Women at Workplace (POSH) Act 2013, what is the statutory timeframe within which an Internal Committee (IC) must complete an inquiry?",
      opts: ["Within 90 days from receipt of complaint", "Within 180 days", "Within 30 days", "Within one calendar year"],
      correct: 0,
      diff: "Medium",
      exp: "Under Section 11 of the POSH Act 2013, inquiry proceedings must be completed within a strict timeline of 90 days.",
      isHOTS: false
    },
    {
      q: "Under GFR 2017 Rule 149, direct procurement without comparison on the Government e-Marketplace (GeM) is permitted up to what financial ceiling?",
      opts: ["Up to ₹50,000 through any seller meeting requisite quality specifications", "Up to ₹5,00,000 without any price ceiling", "Up to ₹10,000 only", "Direct purchase is prohibited on GeM"],
      correct: 0,
      diff: "Medium",
      exp: "Under amended Rule 149 of GFR 2017, direct purchase is permitted up to ₹50,000 through any available seller meeting specifications.",
      isHOTS: false
    }
  ],

  'Sector-Specific (MoSPI)': [
    {
      q: "In stratified two-stage sampling adopted by NSSO, what units constitute the First Stage Units (FSU) in the rural and urban sectors respectively?",
      opts: [
        "Census Villages in rural sector and Urban Frame Survey (UFS) blocks in urban sector",
        "Individual agricultural holdings in rural and municipal wards in urban",
        "Gram Panchayats in rural and Pin Code areas in urban",
        "Households in both rural and urban sectors"
      ],
      correct: 0,
      diff: "Medium",
      exp: "Per NSSO sampling methodology, Census Villages serve as rural FSUs and UFS blocks serve as urban FSUs.",
      isHOTS: false
    },
    {
      q: "Which method is recommended by MoSPI to estimate Gross Value Added (GVA) in constant prices to avoid distortion during commodity price shocks?",
      opts: ["Double Deflation Method", "Single Deflation Method", "Laspeyres Quantity Extrapolation", "Simple Moving Average"],
      correct: 0,
      diff: "Hard",
      exp: "Double Deflation deflates gross output and intermediate consumption independently using respective price indices (WPI/CPI).",
      isHOTS: true
    },
    {
      q: "Scenario: In the Annual Survey of Industries (ASI), a manufacturing unit reports negative Gross Value Added (GVA). What audit check must the statistical officer perform?",
      opts: [
        "Verify Block H (fuels and intermediate inputs) and check whether input costs exceeded gross output due to inventory valuation or temporary shutdown",
        "Automatically reject the schedule and delete the factory record from the universe",
        "Assume deliberate tax evasion and refer to police immediately",
        "Change the input numbers manually to produce a positive GVA"
      ],
      correct: 0,
      diff: "Hard",
      exp: "A negative GVA can legitimately occur if high raw material/energy inputs coincide with temporary factory distress or inventory buildup; it must be audited in Block H.",
      isHOTS: true
    }
  ]
};

// Generate high-volume banks by topic and target count
export function generateQuestionBankForTopic(topic = 'Conduct & Ethics', count = 10, isHOTS = false, difficulty = 'mixed') {
  const bank = IGOT_TOPIC_BANKS[topic] || IGOT_TOPIC_BANKS['Sector-Specific (MoSPI)'];
  let pool = isHOTS ? bank.filter(q => q.isHOTS) : bank;
  if (pool.length === 0) pool = bank;

  const result = [];
  let counter = 0;

  while (result.length < count) {
    const base = pool[counter % pool.length];
    const iteration = Math.floor(counter / pool.length);

    let qText = base.q;
    if (iteration > 0) {
      qText = `[Case Scenario #${iteration + 1}] ${base.q}`;
    }

    result.push({
      id: result.length + 1,
      question: qText,
      options: [...base.opts],
      correctAnswer: base.correct,
      difficulty: difficulty === 'mixed' ? base.diff : difficulty,
      explanation: base.exp,
      isHOTS: base.isHOTS || isHOTS
    });

    counter++;
  }

  return result;
}
