/**
 * iGOT Karmayogi 5,500+ Official Course Library & AI Role Profiler
 * 
 * Simulates the complete iGOT Karmayogi civil services course repository
 * with automated role-based curriculum recommendations, statutory compliance
 * tracking, and competency gap mapping.
 */

export const CATALOG_STATS = {
  totalCourses: 5642,
  totalModules: 18450,
  totalLearningHours: 14380,
  participatingMinistries: 54,
  cadresCovered: 38,
  cbpAccredited: true
};

export const CIVIL_SERVICE_ROLES = [
  {
    id: 'jso',
    title: 'Junior Statistical Officer (JSO / SSS)',
    cadre: 'Subordinate Statistical Service',
    ministry: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    level: 'Group B Gazetted / Non-Gazetted',
    description: 'Field data collection, primary survey enumeration, initial data validation, and district statistical compilation.'
  },
  {
    id: 'sso',
    title: 'Senior Statistical Officer (SSO / SSS)',
    cadre: 'Subordinate Statistical Service',
    ministry: 'Ministry of Statistics & Programme Implementation (MoSPI)',
    level: 'Group B Gazetted',
    description: 'Supervisory inspection of field survey teams, secondary scrutiny, complex tabulation, and index compilation.'
  },
  {
    id: 'ad_iss',
    title: 'Assistant Director (ISS - Grade IV)',
    cadre: 'Indian Statistical Service',
    ministry: 'MoSPI / Line Ministries',
    level: 'Group A Junior Time Scale',
    description: 'Survey design, sampling frame stratification, econometric modeling, official statistics publication, and inter-ministry liaison.'
  },
  {
    id: 'dir_iss',
    title: 'Director / Deputy Director (ISS)',
    cadre: 'Indian Statistical Service',
    ministry: 'MoSPI / Central Line Ministries',
    level: 'Group A Senior Administrative Grade / Selection Grade',
    description: 'National macroeconomic aggregations, base year revisions, policy advisory, international statistical harmonization (UNSD/IMF).'
  },
  {
    id: 'section_officer',
    title: 'Section Officer (CSS / Central Secretariat)',
    cadre: 'Central Secretariat Service',
    ministry: 'All Central Government Ministries & Departments',
    level: 'Group B Gazetted',
    description: 'Noting, drafting, file processing under CSMOP, parliamentary questions, GFR procurement, and service rule enforcement.'
  },
  {
    id: 'under_secretary',
    title: 'Under Secretary / Deputy Secretary (CSS / Central Staffing)',
    cadre: 'Central Staffing Scheme / CSS',
    ministry: 'Union Ministries',
    level: 'Group A Executive',
    description: 'Scheme sanctioning, cabinet notes preparation, statutory rule formulation, budget committee administration, and inter-cadre coordination.'
  },
  {
    id: 'dpdo',
    title: 'District Planning & Development Officer',
    cadre: 'State Civil Services / Planning Dept',
    ministry: 'Department of Planning & Panchayati Raj',
    level: 'District Administrative Cadre',
    description: 'Decentralized district planning, MPLADS/MLALADS execution, SDG local indicator tracking, and scheme convergence.'
  },
  {
    id: 'general_admin',
    title: 'General Civil Services Officer (All Cadres)',
    cadre: 'All India & Central Civil Services',
    ministry: 'Government of India',
    level: 'Universal Civil Service',
    description: 'Foundation administrative rules, citizen-centric service delivery, digital governance, ethics, and regulatory compliance.'
  }
];

export const SUBJECT_DOMAINS = [
  {
    id: 'official_statistics',
    title: 'Official Statistics & Survey Operations',
    topics: ['Sampling Design', 'NSS Rounds', 'CPI/IIP', 'National Accounts', 'Data Quality']
  },
  {
    id: 'procurement_finance',
    title: 'Public Procurement & Financial Rules (GFR/GeM/PFMS)',
    topics: ['GFR 2024 Rule 149', 'GeM Bidding', 'PFMS SNA', 'FRBM Act', 'Audit Scrutiny']
  },
  {
    id: 'civil_service_rules',
    title: 'Civil Service Regulations & Office Procedures',
    topics: ['CSMOP 16th Ed', 'CCS Conduct Rules 1964', 'CCS CCA Rules', 'RTI Act', 'POSH Act']
  },
  {
    id: 'digital_governance',
    title: 'Digital Public Infrastructure & Data Privacy (DPDP)',
    topics: ['DPDP Act 2023', 'API Setu', 'Cyber Crisis Plan', 'e-Office 7.0', 'Information Security']
  },
  {
    id: 'public_policy',
    title: 'Public Policy, Outcome Budgeting & Program Evaluation',
    topics: ['Outcome Budgeting', 'PPP Guidelines 2024', 'Evidence-Based Policy', 'SDG NIF']
  }
];

export const RAW_IGOT_COURSES = [
  // 1. Official Statistics & Survey Operations
  {
    id: 'igot-stat-01',
    code: 'STAT-MOSPI-101',
    title: 'National Indicator Framework (NIF) for Monitoring SDGs in India',
    ministry: 'MoSPI - Social Statistics Division',
    duration: '4h 30m',
    modulesCount: 6,
    level: 'Intermediate',
    topics: ['official_statistics', 'public_policy'],
    targetRoles: ['jso', 'sso', 'ad_iss', 'dir_iss', 'dpdo'],
    mandatoryFor: ['jso', 'sso'],
    competencies: ['SDG Localization', 'Indicator Computation', 'MoSPI Metadata Standards'],
    description: 'Master the 330+ indicators of the National Indicator Framework, data flow protocols from line ministries, and state SDG index compilation.'
  },
  {
    id: 'igot-stat-02',
    code: 'STAT-MOSPI-204',
    title: 'Multi-Stage Stratified Sampling & Survey Design in NSS Rounds',
    ministry: 'MoSPI - National Sample Survey Office (NSSO)',
    duration: '6h 15m',
    modulesCount: 8,
    level: 'Advanced',
    topics: ['official_statistics'],
    targetRoles: ['sso', 'ad_iss', 'dir_iss'],
    mandatoryFor: ['ad_iss'],
    competencies: ['Sampling Error Minimization', 'Stratum Allocation', 'Multiplier Calculation'],
    description: 'In-depth methodology on First Stage Units (FSUs), Ultimate Stage Units (USUs), sampling weights, and non-sampling error reduction in national household surveys.'
  },
  {
    id: 'igot-stat-03',
    code: 'STAT-MOSPI-108',
    title: 'CPI & IIP Data Collection, Item Basket Revision & Validation',
    ministry: 'MoSPI - Economic Statistics Division',
    duration: '3h 45m',
    modulesCount: 5,
    level: 'Intermediate',
    topics: ['official_statistics'],
    targetRoles: ['jso', 'sso'],
    mandatoryFor: ['jso'],
    competencies: ['Price Quotation Verification', 'Geometric Mean Weighting', 'Base Year Adjustment'],
    description: 'Standard operating procedures for monthly retail price quotation collection across selected urban and rural markets, outlier rejection, and imputation.'
  },
  {
    id: 'igot-stat-04',
    code: 'STAT-MOSPI-310',
    title: 'System of National Accounts (SNA 2008) & Gross Value Added Estimation',
    ministry: 'MoSPI - National Accounts Division (NAD)',
    duration: '8h 00m',
    modulesCount: 10,
    level: 'Advanced',
    topics: ['official_statistics', 'procurement_finance'],
    targetRoles: ['ad_iss', 'dir_iss'],
    mandatoryFor: ['dir_iss'],
    competencies: ['GVA by Economic Activity', 'FISIM Allocation', 'Supply-Use Tables'],
    description: 'Detailed analysis of institutional sectors, financial intermediation services indirectly measured, capital formation, and institutional data sources (MCA-21, ASI).'
  },
  {
    id: 'igot-stat-05',
    code: 'STAT-MOSPI-112',
    title: 'Primary Enumeration Protocols & Computer Assisted Personal Interviewing (CAPI)',
    ministry: 'MoSPI - Data Quality & Field Operations Division',
    duration: '3h 10m',
    modulesCount: 4,
    level: 'Foundation',
    topics: ['official_statistics'],
    targetRoles: ['jso', 'dpdo'],
    mandatoryFor: ['jso'],
    competencies: ['CAPI Tablet Validation', 'GPS Geofencing', 'Respondent Rapport Building'],
    description: 'Digital survey execution using tablet-based CAPI tools, handling consistency checks, offline questionnaire caching, and supervisor upload sync.'
  },
  {
    id: 'igot-stat-06',
    code: 'STAT-MOSPI-218',
    title: 'Time Series Econometrics & Seasonal Adjustment using X-13ARIMA-SEATS',
    ministry: 'MoSPI - Training Division & NSSTA Greater Noida',
    duration: '5h 20m',
    modulesCount: 7,
    level: 'Advanced',
    topics: ['official_statistics'],
    targetRoles: ['ad_iss', 'dir_iss'],
    mandatoryFor: [],
    competencies: ['Seasonal Adjustment', 'Calendar Effect Filtering', 'Trend Cycle Decomposition'],
    description: 'Practical training on X-13ARIMA-SEATS for producing seasonally adjusted monthly industrial indices and quarterly national accounts aggregates.'
  },

  // 2. Procurement & Financial Management (GFR/GeM/PFMS)
  {
    id: 'igot-fin-01',
    code: 'FIN-DOPT-101',
    title: 'General Financial Rules (GFR 2024): Rule 149 GeM Procurement Mandate',
    ministry: 'Ministry of Finance - Department of Expenditure',
    duration: '4h 00m',
    modulesCount: 6,
    level: 'Foundation',
    topics: ['procurement_finance', 'civil_service_rules'],
    targetRoles: ['section_officer', 'under_secretary', 'ad_iss', 'dir_iss', 'jso', 'sso', 'general_admin'],
    mandatoryFor: ['section_officer', 'under_secretary', 'ad_iss'],
    competencies: ['GFR Rule 149 Adherence', 'L1 Procurement', 'Proprietary Article Certificate'],
    description: 'Complete statutory walk-through of GFR 2024, Rule 149 mandatory procurement thresholds via Government e-Marketplace, custom bids, and PAC formalities.'
  },
  {
    id: 'igot-fin-02',
    code: 'FIN-EXP-202',
    title: 'Public Financial Management System (PFMS): Single Nodal Agency (SNA) Architecture',
    ministry: 'Ministry of Finance - Controller General of Accounts',
    duration: '5h 30m',
    modulesCount: 7,
    level: 'Intermediate',
    topics: ['procurement_finance'],
    targetRoles: ['section_officer', 'under_secretary', 'dpdo', 'dir_iss'],
    mandatoryFor: ['under_secretary', 'dpdo'],
    competencies: ['SNA Fund Tracking', 'Just-in-Time Releases', 'Utilization Certificate Verification'],
    description: 'Operational protocols for Centrally Sponsored Schemes, SNA bank account zero-balance drawing accounts, PFMS dashboard monitoring, and interest clawback.'
  },
  {
    id: 'igot-fin-03',
    code: 'FIN-EXP-305',
    title: 'Parliamentary Accounts Committee (PAC) Examination & Audit Para Resolution',
    ministry: 'Ministry of Finance / CAG of India',
    duration: '3h 40m',
    modulesCount: 5,
    level: 'Advanced',
    topics: ['procurement_finance', 'civil_service_rules'],
    targetRoles: ['under_secretary', 'dir_iss', 'section_officer'],
    mandatoryFor: ['dir_iss'],
    competencies: ['Action Taken Notes (ATN)', 'Audit Rebuttal', 'CAG Draft Para Scrutiny'],
    description: 'Systematic drafting of Action Taken Notes (ATNs) on CAG Inspection Reports, vetting through Principle Director of Audit, and committee appearance prep.'
  },
  {
    id: 'igot-fin-04',
    code: 'FIN-EXP-110',
    title: 'Government e-Marketplace (GeM 4.0): Reverse Auction & Custom Bidding Masterclass',
    ministry: 'Ministry of Commerce & Industry - GeM SPV',
    duration: '3h 15m',
    modulesCount: 5,
    level: 'Intermediate',
    topics: ['procurement_finance'],
    targetRoles: ['section_officer', 'under_secretary', 'ad_iss'],
    mandatoryFor: ['section_officer'],
    competencies: ['Reverse Auction Configuration', 'Vendor Dispute Redressal', 'CRAC Generation'],
    description: 'Practical workflows for Consignee Receipt and Acceptance Certificate (CRAC) generation, 10-day payment timelines, and drafting SLA specifications.'
  },

  // 3. Civil Service Regulations & Office Procedures
  {
    id: 'igot-dopt-01',
    code: 'DOPT-ADM-101',
    title: 'Central Secretariat Manual of Office Procedure (CSMOP 16th Edition) & e-Office 7.0',
    ministry: 'Ministry of Personnel, Public Grievances and Pensions - DARPG',
    duration: '4h 45m',
    modulesCount: 7,
    level: 'Foundation',
    topics: ['civil_service_rules'],
    targetRoles: ['section_officer', 'under_secretary', 'jso', 'sso', 'ad_iss', 'general_admin'],
    mandatoryFor: ['section_officer', 'general_admin'],
    competencies: ['CSMOP File Lifecycle', 'Green Sheet Noting', 'Dak Diarization & Dispatch'],
    description: 'Comprehensive guidelines on file creation, noting conventions, draft preparation, security grading (Secret/Confidential), and retention scheduling.'
  },
  {
    id: 'igot-dopt-02',
    code: 'DOPT-VIG-202',
    title: 'CCS (Conduct) Rules 1964 & CCS (CCA) Rules 1965: Disciplinary Procedures',
    ministry: 'DoPT - Vigilance & Ethics Wing',
    duration: '5h 15m',
    modulesCount: 8,
    level: 'Intermediate',
    topics: ['civil_service_rules'],
    targetRoles: ['section_officer', 'under_secretary', 'dir_iss', 'general_admin'],
    mandatoryFor: ['under_secretary', 'dir_iss'],
    competencies: ['Rule 14 Major Penalty Procedure', 'Rule 16 Minor Penalty', 'Inquiry Officer Reports'],
    description: 'Statutory compliance for charge sheets, defense statement review, inquiry appointments, CVC first/second stage advice, and presidential orders.'
  },
  {
    id: 'igot-dopt-03',
    code: 'DOPT-LEG-105',
    title: 'Right to Information (RTI) Act 2005: CPIO Obligations, Section 8 Exemptions & Appeals',
    ministry: 'DoPT / Central Information Commission',
    duration: '3h 30m',
    modulesCount: 5,
    level: 'Foundation',
    topics: ['civil_service_rules'],
    targetRoles: ['section_officer', 'under_secretary', 'ad_iss', 'dir_iss', 'general_admin'],
    mandatoryFor: ['section_officer', 'under_secretary'],
    competencies: ['Section 8(1) Scrutiny', 'Section 11 Third-Party Procedure', 'First Appellate Disposal'],
    description: '30-day statutory response timelines, drafting speaking orders on exemptions, handling life-or-liberty 48-hour applications, and CIC compliance.'
  },
  {
    id: 'igot-dopt-04',
    code: 'DOPT-ETH-108',
    title: 'Prevention of Sexual Harassment at Workplace (POSH Act 2013): ICC Mandate',
    ministry: 'Ministry of Women and Child Development & DoPT',
    duration: '2h 30m',
    modulesCount: 4,
    level: 'Foundation',
    topics: ['civil_service_rules'],
    targetRoles: ['general_admin', 'section_officer', 'under_secretary', 'ad_iss', 'dir_iss', 'jso', 'sso'],
    mandatoryFor: ['general_admin', 'section_officer', 'under_secretary', 'dir_iss', 'ad_iss', 'jso', 'sso'],
    competencies: ['ICC Constitution', 'Inquiry Timelines (90 Days)', 'Confidentiality Adherence'],
    description: 'Statutory obligation of every ministry/subordinate office to maintain an active Internal Complaints Committee, conciliation vs formal inquiry protocols.'
  },

  // 4. Digital Public Infrastructure & Data Privacy (DPDP)
  {
    id: 'igot-digi-01',
    code: 'MEITY-DPDP-101',
    title: 'Digital Personal Data Protection (DPDP) Act 2023 for Government Data Fiduciaries',
    ministry: 'Ministry of Electronics and Information Technology (MeitY)',
    duration: '4h 15m',
    modulesCount: 6,
    level: 'Intermediate',
    topics: ['digital_governance', 'civil_service_rules'],
    targetRoles: ['ad_iss', 'dir_iss', 'under_secretary', 'section_officer', 'general_admin'],
    mandatoryFor: ['ad_iss', 'dir_iss', 'under_secretary'],
    competencies: ['Data Fiduciary Compliance', 'Consent Notice Formats', 'Breach Notification Protocols'],
    description: 'Obligations of government entities collecting citizen identifiers, handling exempt government processing (Section 7), data minimization, and audit logs.'
  },
  {
    id: 'igot-digi-02',
    code: 'MEITY-SEC-204',
    title: 'Cyber Security Crisis Management Plan (CCMP) & CERT-In Compliance Directives',
    ministry: 'MeitY - Indian Computer Emergency Response Team (CERT-In)',
    duration: '3h 50m',
    modulesCount: 5,
    level: 'Intermediate',
    topics: ['digital_governance'],
    targetRoles: ['section_officer', 'under_secretary', 'ad_iss', 'dir_iss', 'general_admin'],
    mandatoryFor: ['under_secretary'],
    competencies: ['6-Hour Incident Reporting', 'NTP Synchronization', 'Log Retention 180 Days'],
    description: 'Mandatory CERT-In directives on system log retention, incident classification, multi-factor authentication for NIC net users, and air-gapped backups.'
  },
  {
    id: 'igot-digi-03',
    code: 'MEITY-DPI-302',
    title: 'India Stack & API Setu: Inter-Departmental Data Exchange Framework',
    ministry: 'National e-Governance Division (NeGD) - MeitY',
    duration: '4h 00m',
    modulesCount: 5,
    level: 'Advanced',
    topics: ['digital_governance', 'official_statistics'],
    targetRoles: ['ad_iss', 'dir_iss'],
    mandatoryFor: [],
    competencies: ['Open API Standards', 'DigiLocker Push/Pull APIs', 'Data Exchange SLA'],
    description: 'Architecting machine-readable data exchanges between Central Ministries and State Line Departments without manual paper certifications.'
  },

  // 5. Public Policy, Outcome Budgeting & Program Evaluation
  {
    id: 'igot-pol-01',
    code: 'NITI-EVAL-201',
    title: 'Development Monitoring & Evaluation Office (DMEO): Output-Outcome Monitoring Framework',
    ministry: 'NITI Aayog - DMEO',
    duration: '5h 00m',
    modulesCount: 6,
    level: 'Advanced',
    topics: ['public_policy', 'official_statistics'],
    targetRoles: ['ad_iss', 'dir_iss', 'under_secretary', 'dpdo'],
    mandatoryFor: ['ad_iss', 'dpdo'],
    competencies: ['KPI Formulation', 'Theory of Change Matrix', 'Third-Party Evaluation RFP'],
    description: 'Designing measurable outputs vs outcomes for Centrally Sponsored Schemes (CSS) submitted alongside Union Budget Demands for Grants.'
  },
  {
    id: 'igot-pol-02',
    code: 'DEA-PPP-301',
    title: 'Public-Private Partnership (PPP) Appraisal Guidelines (2024 Revision) & VGF Scheme',
    ministry: 'Ministry of Finance - Department of Economic Affairs',
    duration: '4h 30m',
    modulesCount: 6,
    level: 'Advanced',
    topics: ['public_policy', 'procurement_finance'],
    targetRoles: ['under_secretary', 'dir_iss', 'dpdo'],
    mandatoryFor: [],
    competencies: ['Viability Gap Funding (VGF)', 'Risk Allocation Matrix', 'Concession Agreement Drafting'],
    description: 'Evaluation framework for PPP infrastructure projects, Public Private Partnership Appraisal Committee (PPPAC) memo drafting, and concession monitoring.'
  },
  {
    id: 'igot-pol-03',
    code: 'NITI-DIST-102',
    title: 'Aspirational Districts & Blocks Programme: Data-Driven Saturation Modeling',
    ministry: 'NITI Aayog',
    duration: '3h 30m',
    modulesCount: 5,
    level: 'Intermediate',
    topics: ['public_policy', 'official_statistics'],
    targetRoles: ['dpdo', 'jso', 'sso'],
    mandatoryFor: ['dpdo'],
    competencies: ['Delta Ranking Indices', 'Saturation Campaign Design', 'Panchayat Gram Sabha Interventions'],
    description: 'Tactical execution of key performance indicators in Health & Nutrition, Education, Agriculture, Basic Infrastructure, and Financial Inclusion.'
  }
];

/**
 * Core AI Role Profiler Engine
 * Matches a Civil Service Role and Subject Domain to the 5,500+ iGOT library
 */
export function profileCoursesForRole(roleId = 'jso', subjectId = 'all') {
  const role = CIVIL_SERVICE_ROLES.find(r => r.id === roleId) || CIVIL_SERVICE_ROLES[0];
  const subject = SUBJECT_DOMAINS.find(s => s.id === subjectId) || null;

  // Filter courses relevant to this role or general civil services
  let eligibleCourses = RAW_IGOT_COURSES.filter(c => 
    c.targetRoles.includes(role.id) || c.targetRoles.includes('general_admin')
  );

  // If a specific subject domain was selected, prioritize or filter
  if (subjectId && subjectId !== 'all') {
    eligibleCourses = eligibleCourses.filter(c => c.topics.includes(subjectId));
    // If filtered too narrow, add general ones
    if (eligibleCourses.length < 3) {
      eligibleCourses = RAW_IGOT_COURSES.filter(c => c.topics.includes(subjectId));
    }
  }

  // Segment into Mandatory Foundation, Core Role Competency, and Electives
  const mandatory = [];
  const core = [];
  const electives = [];

  eligibleCourses.forEach(course => {
    const isMandatoryForThisRole = course.mandatoryFor.includes(role.id) || course.mandatoryFor.includes('general_admin');
    if (isMandatoryForThisRole) {
      mandatory.push({
        ...course,
        category: 'Mandatory Statutory Foundation',
        deadlineDays: 30,
        directiveCitation: 'DoPT / MoSPI Mandatory Cadre Training Directive'
      });
    } else if (course.targetRoles.includes(role.id)) {
      core.push({
        ...course,
        category: 'Core Role Competency',
        deadlineDays: 60,
        directiveCitation: 'National Training Policy (NTP) Recommended'
      });
    } else {
      electives.push({
        ...course,
        category: 'Career Elevation Elective',
        deadlineDays: 90,
        directiveCitation: 'Continuous Professional Development (CPD)'
      });
    }
  });

  // Calculate stats
  const totalProfiledCourses = mandatory.length + core.length + electives.length;
  const totalProfiledHours = [...mandatory, ...core, ...electives].reduce((sum, c) => {
    const hours = parseFloat(c.duration.split('h')[0]) || 3;
    return sum + hours;
  }, 0);

  // Weekly study commitment
  const recommendedWeeklyHours = (totalProfiledHours / 8).toFixed(1);

  // 4-Phase Completion Roadmap
  const timeline = [
    {
      phase: 'Phase 1: Statutory Onboarding & Compliance',
      duration: 'Weeks 1 - 2',
      coursesCount: mandatory.length,
      focus: 'GFR 2024 Rule 149, CSMOP, POSH Act 2013, and DoPT Mandatory Directives'
    },
    {
      phase: 'Phase 2: Core Operational Competencies',
      duration: 'Weeks 3 - 4',
      coursesCount: Math.ceil(core.length / 2),
      focus: 'Primary field operations, survey design, or ministry-specific file appraisal'
    },
    {
      phase: 'Phase 3: Digital Systems & Regulatory Scrutiny',
      duration: 'Weeks 5 - 6',
      coursesCount: Math.floor(core.length / 2),
      focus: 'DPDP Act 2023, PFMS SNA management, and CERT-In crisis protocols'
    },
    {
      phase: 'Phase 4: Advanced Policy & Executive Elevation',
      duration: 'Weeks 7 - 8',
      coursesCount: electives.length,
      focus: 'Outcome budgeting, multi-department data exchanges, and PAC readiness'
    }
  ];

  return {
    role,
    subject,
    catalogStats: CATALOG_STATS,
    summary: {
      totalCourses: totalProfiledCourses,
      totalHours: totalProfiledHours,
      recommendedWeeklyHours,
      mandatoryCount: mandatory.length,
      coreCount: core.length,
      electiveCount: electives.length
    },
    mandatory,
    core,
    electives,
    timeline
  };
}

/**
 * Filter and search across the catalog
 */
export function searchCatalogCourses(query = '', topic = 'all', level = 'all') {
  return RAW_IGOT_COURSES.filter(course => {
    const matchesQuery = !query || 
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.code.toLowerCase().includes(query.toLowerCase()) ||
      course.ministry.toLowerCase().includes(query.toLowerCase()) ||
      course.competencies.some(c => c.toLowerCase().includes(query.toLowerCase()));
    
    const matchesTopic = topic === 'all' || course.topics.includes(topic);
    const matchesLevel = level === 'all' || course.level.toLowerCase() === level.toLowerCase();

    return matchesQuery && matchesTopic && matchesLevel;
  });
}
