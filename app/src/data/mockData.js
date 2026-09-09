// ─── Mock Officers ───
export const officers = [
  { id: 1, name: "Rajesh Kumar Sharma", role: "Deputy Director", department: "Census Operations", cadre: "ISS", avatar: "RS", xp: 2450, streak: 12 },
  { id: 2, name: "Priya Nair", role: "Statistical Officer", department: "National Sample Survey", cadre: "SSS", avatar: "PN", xp: 1830, streak: 7 },
  { id: 3, name: "Amit Verma", role: "Junior Statistical Officer", department: "Economic Statistics", cadre: "SSS", avatar: "AV", xp: 920, streak: 3 },
  { id: 4, name: "Sneha Patel", role: "Senior Statistical Officer", department: "Agricultural Statistics", cadre: "ISS", avatar: "SP", xp: 3100, streak: 21 },
  { id: 5, name: "Vikram Singh", role: "Director", department: "Industrial Statistics", cadre: "ISS", avatar: "VS", xp: 4200, streak: 45 },
  { id: 6, name: "Anita Desai", role: "Statistical Investigator", department: "Price Statistics", cadre: "SSS", avatar: "AD", xp: 1450, streak: 9 },
  { id: 7, name: "Rohan Gupta", role: "Deputy Director", department: "Social Statistics", cadre: "ISS", avatar: "RG", xp: 2780, streak: 15 },
  { id: 8, name: "Kavitha Reddy", role: "Senior Statistical Officer", department: "Health Statistics", cadre: "ISS", avatar: "KR", xp: 2100, streak: 11 },
  { id: 9, name: "Suresh Menon", role: "Statistical Officer", department: "Trade Statistics", cadre: "SSS", avatar: "SM", xp: 1600, streak: 5 },
  { id: 10, name: "Deepa Iyer", role: "Junior Statistical Officer", department: "Labour Statistics", cadre: "SSS", avatar: "DI", xp: 780, streak: 2 },
  { id: 11, name: "Manoj Tiwari", role: "Deputy Director", department: "Census Operations", cadre: "ISS", avatar: "MT", xp: 2900, streak: 18 },
  { id: 12, name: "Rashmi Joshi", role: "Statistical Investigator", department: "National Sample Survey", cadre: "SSS", avatar: "RJ", xp: 1200, streak: 6 },
  { id: 13, name: "Arjun Das", role: "Senior Statistical Officer", department: "Economic Statistics", cadre: "ISS", avatar: "AD", xp: 2650, streak: 14 },
  { id: 14, name: "Pooja Saxena", role: "Statistical Officer", department: "Agricultural Statistics", cadre: "SSS", avatar: "PS", xp: 1750, streak: 8 },
  { id: 15, name: "Naveen Prasad", role: "Director", department: "Social Statistics", cadre: "ISS", avatar: "NP", xp: 3800, streak: 30 },
  { id: 16, name: "Lakshmi Subramaniam", role: "Deputy Director", department: "Health Statistics", cadre: "ISS", avatar: "LS", xp: 2300, streak: 10 },
  { id: 17, name: "Rahul Khanna", role: "Junior Statistical Officer", department: "Price Statistics", cadre: "SSS", avatar: "RK", xp: 650, streak: 1 },
  { id: 18, name: "Swati Bhatt", role: "Statistical Investigator", department: "Industrial Statistics", cadre: "SSS", avatar: "SB", xp: 1100, streak: 4 },
  { id: 19, name: "Dhruv Malhotra", role: "Senior Statistical Officer", department: "Trade Statistics", cadre: "ISS", avatar: "DM", xp: 2500, streak: 13 },
  { id: 20, name: "Neha Agarwal", role: "Statistical Officer", department: "Labour Statistics", cadre: "SSS", avatar: "NA", xp: 1950, streak: 7 },
  { id: 21, name: "Karthik Raman", role: "Deputy Director", department: "Census Operations", cadre: "ISS", avatar: "KR", xp: 2700, streak: 16 },
  { id: 22, name: "Meera Chopra", role: "Senior Statistical Officer", department: "National Sample Survey", cadre: "ISS", avatar: "MC", xp: 2200, streak: 9 },
  { id: 23, name: "Sanjay Mishra", role: "Statistical Officer", department: "Economic Statistics", cadre: "SSS", avatar: "SM", xp: 1400, streak: 5 },
  { id: 24, name: "Divya Krishnan", role: "Junior Statistical Officer", department: "Agricultural Statistics", cadre: "SSS", avatar: "DK", xp: 850, streak: 3 },
  { id: 25, name: "Arun Pandey", role: "Director", department: "Industrial Statistics", cadre: "ISS", avatar: "AP", xp: 4500, streak: 52 },
  { id: 26, name: "Tanvi Shah", role: "Statistical Investigator", department: "Social Statistics", cadre: "SSS", avatar: "TS", xp: 1050, streak: 4 },
  { id: 27, name: "Prakash Hegde", role: "Deputy Director", department: "Health Statistics", cadre: "ISS", avatar: "PH", xp: 2850, streak: 17 },
  { id: 28, name: "Ritu Bansal", role: "Senior Statistical Officer", department: "Price Statistics", cadre: "ISS", avatar: "RB", xp: 2400, streak: 11 },
  { id: 29, name: "Gaurav Sharma", role: "Statistical Officer", department: "Trade Statistics", cadre: "SSS", avatar: "GS", xp: 1550, streak: 6 },
  { id: 30, name: "Sunita Rao", role: "Junior Statistical Officer", department: "Labour Statistics", cadre: "SSS", avatar: "SR", xp: 720, streak: 2 },
];

// ─── Skill Framework ───
export const skills = [
  "Survey Design",
  "GIS & Spatial Analysis",
  "Data Science & Analytics",
  "AI & Machine Learning",
  "Statistical Methods",
  "Data Governance"
];

export const requiredLevels = {
  "Director": { "Survey Design": 90, "GIS & Spatial Analysis": 75, "Data Science & Analytics": 85, "AI & Machine Learning": 70, "Statistical Methods": 95, "Data Governance": 90 },
  "Deputy Director": { "Survey Design": 80, "GIS & Spatial Analysis": 70, "Data Science & Analytics": 75, "AI & Machine Learning": 60, "Statistical Methods": 85, "Data Governance": 80 },
  "Senior Statistical Officer": { "Survey Design": 75, "GIS & Spatial Analysis": 65, "Data Science & Analytics": 70, "AI & Machine Learning": 55, "Statistical Methods": 80, "Data Governance": 70 },
  "Statistical Officer": { "Survey Design": 65, "GIS & Spatial Analysis": 55, "Data Science & Analytics": 60, "AI & Machine Learning": 45, "Statistical Methods": 70, "Data Governance": 60 },
  "Junior Statistical Officer": { "Survey Design": 50, "GIS & Spatial Analysis": 40, "Data Science & Analytics": 45, "AI & Machine Learning": 30, "Statistical Methods": 55, "Data Governance": 45 },
  "Statistical Investigator": { "Survey Design": 55, "GIS & Spatial Analysis": 45, "Data Science & Analytics": 50, "AI & Machine Learning": 35, "Statistical Methods": 60, "Data Governance": 50 },
};

// Base skill levels for a fresh officer starting from 0 (unassessed baseline)
export const initialUserSkills = {
  "Survey Design": 0,
  "GIS & Spatial Analysis": 0,
  "Data Science & Analytics": 0,
  "AI & Machine Learning": 0,
  "Statistical Methods": 0,
  "Data Governance": 0
};

export const currentUserSkills = { ...initialUserSkills };

export const initialOfficer = {
  id: 0,
  name: "New Officer",
  role: "Statistical Officer",
  department: "National Sample Survey",
  cadre: "SSS",
  avatar: "SO",
  xp: 0,
  streak: 0
};

// ─── iGOT-style Course Catalog ───
export const courses = [
  { id: 1, title: "Advanced Survey Methodology for Census 2031", provider: "NSSO Training Division", skill: "Survey Design", duration: "8 hours", level: "Advanced", relevance: 95, modules: 12 },
  { id: 2, title: "GIS Applications in Official Statistics", provider: "Survey of India", skill: "GIS & Spatial Analysis", duration: "6 hours", level: "Intermediate", relevance: 92, modules: 8 },
  { id: 3, title: "Python for Statistical Data Analysis", provider: "ISI Kolkata", skill: "Data Science & Analytics", duration: "10 hours", level: "Intermediate", relevance: 90, modules: 15 },
  { id: 4, title: "Introduction to Machine Learning for Government", provider: "MeitY", skill: "AI & Machine Learning", duration: "12 hours", level: "Beginner", relevance: 88, modules: 18 },
  { id: 5, title: "Data Governance Framework for India", provider: "NIC", skill: "Data Governance", duration: "4 hours", level: "Intermediate", relevance: 85, modules: 6 },
  { id: 6, title: "Sampling Techniques & Error Estimation", provider: "IASRI", skill: "Statistical Methods", duration: "6 hours", level: "Advanced", relevance: 82, modules: 9 },
  { id: 7, title: "QGIS for Field Survey Mapping", provider: "NATMO", skill: "GIS & Spatial Analysis", duration: "5 hours", level: "Beginner", relevance: 78, modules: 7 },
  { id: 8, title: "R Programming for Official Statistics", provider: "ISI Delhi", skill: "Data Science & Analytics", duration: "8 hours", level: "Beginner", relevance: 76, modules: 11 },
  { id: 9, title: "Natural Language Processing for Survey Analysis", provider: "C-DAC", skill: "AI & Machine Learning", duration: "6 hours", level: "Advanced", relevance: 73, modules: 8 },
  { id: 10, title: "Data Quality Assurance in Large-Scale Surveys", provider: "CSO", skill: "Data Governance", duration: "3 hours", level: "Intermediate", relevance: 70, modules: 5 },
  { id: 11, title: "Time Series Analysis for Economic Indicators", provider: "RBI Academy", skill: "Statistical Methods", duration: "7 hours", level: "Advanced", relevance: 68, modules: 10 },
  { id: 12, title: "Questionnaire Design Best Practices", provider: "MOSPI Training Cell", skill: "Survey Design", duration: "4 hours", level: "Beginner", relevance: 65, modules: 6 },
  { id: 13, title: "Deep Learning Fundamentals", provider: "IIT Madras (NPTEL)", skill: "AI & Machine Learning", duration: "15 hours", level: "Advanced", relevance: 62, modules: 20 },
  { id: 14, title: "Spatial Data Infrastructure for e-Governance", provider: "ISRO", skill: "GIS & Spatial Analysis", duration: "5 hours", level: "Advanced", relevance: 60, modules: 7 },
  { id: 15, title: "Data Visualization with Tableau", provider: "NASSCOM", skill: "Data Science & Analytics", duration: "4 hours", level: "Beginner", relevance: 58, modules: 6 },
  { id: 16, title: "Bayesian Statistics for Policy Analysis", provider: "ISI Bangalore", skill: "Statistical Methods", duration: "9 hours", level: "Advanced", relevance: 55, modules: 12 },
  { id: 17, title: "Open Data Policy & Implementation", provider: "NIC", skill: "Data Governance", duration: "3 hours", level: "Beginner", relevance: 52, modules: 4 },
  { id: 18, title: "Computer-Assisted Survey Methods (CAPI/CATI)", provider: "World Bank (iGOT)", skill: "Survey Design", duration: "5 hours", level: "Intermediate", relevance: 50, modules: 7 },
  { id: 19, title: "Big Data Analytics for Government", provider: "MeitY", skill: "Data Science & Analytics", duration: "10 hours", level: "Advanced", relevance: 48, modules: 14 },
  { id: 20, title: "Ethics in AI for Public Sector", provider: "NITI Aayog", skill: "AI & Machine Learning", duration: "3 hours", level: "Beginner", relevance: 45, modules: 5 },
];

// ─── Sample Quiz Data ───
export const sampleQuizzes = [
  {
    id: "quiz-1",
    title: "Survey Design Fundamentals",
    skill: "Survey Design",
    difficulty: "Medium",
    questionCount: 5,
    questions: [
      {
        id: 1,
        question: "What is the primary purpose of stratified random sampling in large-scale surveys?",
        options: [
          "To reduce the overall sample size needed",
          "To ensure representation from all subgroups of the population",
          "To eliminate non-response bias",
          "To speed up data collection"
        ],
        correctAnswer: 1,
        difficulty: "Medium",
        explanation: "Stratified random sampling divides the population into homogeneous subgroups (strata) and samples from each, ensuring all key subgroups are represented proportionally."
      },
      {
        id: 2,
        question: "Which type of question bias occurs when the question wording suggests a preferred answer?",
        options: [
          "Response bias",
          "Leading question bias",
          "Anchoring bias",
          "Social desirability bias"
        ],
        correctAnswer: 1,
        difficulty: "Easy",
        explanation: "Leading question bias occurs when the phrasing of a question nudges respondents toward a particular answer, compromising data validity."
      },
      {
        id: 3,
        question: "In the context of India's National Sample Survey, what does 'First Stage Unit (FSU)' typically refer to?",
        options: [
          "Individual household",
          "Census Enumeration Block or village",
          "District boundary",
          "State administrative unit"
        ],
        correctAnswer: 1,
        difficulty: "Hard",
        explanation: "In NSSO surveys, FSUs are typically Census Enumeration Blocks in urban areas and villages in rural areas, selected through probability proportional to size (PPS) sampling."
      },
      {
        id: 4,
        question: "What is the recommended approach when pilot testing a survey questionnaire?",
        options: [
          "Test with colleagues in the office only",
          "Test with a small sample from the target population",
          "Skip pilot testing to save time if the survey is straightforward",
          "Only test the translated versions"
        ],
        correctAnswer: 1,
        difficulty: "Easy",
        explanation: "Pilot testing should be conducted with respondents who match the target population to identify real-world issues with question comprehension, flow, and timing."
      },
      {
        id: 5,
        question: "Which estimation method is most appropriate when dealing with complex survey designs involving clustering and stratification?",
        options: [
          "Simple random sample variance estimator",
          "Bootstrap estimation",
          "Taylor series linearization",
          "Maximum likelihood estimation"
        ],
        correctAnswer: 2,
        difficulty: "Hard",
        explanation: "Taylor series linearization (also known as the delta method) is widely used for variance estimation in complex survey designs as it accounts for stratification and clustering effects."
      }
    ]
  }
];

// ─── Department Aggregation for Admin ───
export const departments = [
  "Census Operations",
  "National Sample Survey",
  "Economic Statistics",
  "Agricultural Statistics",
  "Industrial Statistics",
  "Social Statistics",
  "Health Statistics",
  "Price Statistics",
  "Trade Statistics",
  "Labour Statistics"
];

// Generate department-wise skill gap data
export function getDepartmentHeatmapData() {
  const data = [];
  departments.forEach(dept => {
    const deptOfficers = officers.filter(o => o.department === dept);
    const row = { department: dept, skills: {} };
    skills.forEach(skill => {
      // Simulated average gap scores
      row.skills[skill] = Math.floor(Math.random() * 45) + 15;
    });
    data.push(row);
  });
  return data;
}

// Pre-generated heatmap data for consistency
export const heatmapData = [
  { department: "Census Operations", skills: { "Survey Design": 18, "GIS & Spatial Analysis": 35, "Data Science & Analytics": 42, "AI & Machine Learning": 55, "Statistical Methods": 15, "Data Governance": 28 } },
  { department: "National Sample Survey", skills: { "Survey Design": 12, "GIS & Spatial Analysis": 30, "Data Science & Analytics": 38, "AI & Machine Learning": 50, "Statistical Methods": 20, "Data Governance": 25 } },
  { department: "Economic Statistics", skills: { "Survey Design": 25, "GIS & Spatial Analysis": 40, "Data Science & Analytics": 30, "AI & Machine Learning": 48, "Statistical Methods": 18, "Data Governance": 32 } },
  { department: "Agricultural Statistics", skills: { "Survey Design": 22, "GIS & Spatial Analysis": 20, "Data Science & Analytics": 35, "AI & Machine Learning": 52, "Statistical Methods": 22, "Data Governance": 30 } },
  { department: "Industrial Statistics", skills: { "Survey Design": 30, "GIS & Spatial Analysis": 38, "Data Science & Analytics": 28, "AI & Machine Learning": 45, "Statistical Methods": 25, "Data Governance": 35 } },
  { department: "Social Statistics", skills: { "Survey Design": 20, "GIS & Spatial Analysis": 42, "Data Science & Analytics": 40, "AI & Machine Learning": 58, "Statistical Methods": 28, "Data Governance": 22 } },
  { department: "Health Statistics", skills: { "Survey Design": 28, "GIS & Spatial Analysis": 32, "Data Science & Analytics": 45, "AI & Machine Learning": 52, "Statistical Methods": 20, "Data Governance": 38 } },
  { department: "Price Statistics", skills: { "Survey Design": 32, "GIS & Spatial Analysis": 45, "Data Science & Analytics": 35, "AI & Machine Learning": 48, "Statistical Methods": 22, "Data Governance": 28 } },
  { department: "Trade Statistics", skills: { "Survey Design": 35, "GIS & Spatial Analysis": 38, "Data Science & Analytics": 32, "AI & Machine Learning": 50, "Statistical Methods": 30, "Data Governance": 25 } },
  { department: "Labour Statistics", skills: { "Survey Design": 28, "GIS & Spatial Analysis": 35, "Data Science & Analytics": 40, "AI & Machine Learning": 55, "Statistical Methods": 25, "Data Governance": 32 } },
];

// ─── Scheduled Assessments ───
export const scheduledItems = [
  { id: 1, title: "Data Science Assessment (A2)", time: "Starts in 3 min", type: "group", avatars: ["RK", "PN", "AV"] },
  { id: 2, title: "1-on-1 Skill Review", time: "7:00-7:40 PM", type: "personal", day: "Tomorrow" },
  { id: 3, title: "Department Analytics Review", time: "7:00-7:40 PM", type: "event", day: "Tomorrow" },
];

// ─── Competency Scoring Logic ───
export function calculateGapScores(currentSkills, role) {
  const required = requiredLevels[role] || requiredLevels["Statistical Officer"];
  const gaps = {};
  const gapList = [];

  skills.forEach(skill => {
    const current = currentSkills[skill] || 0;
    const req = required[skill] || 50;
    const gap = Math.max(0, req - current);
    const percentage = Math.round((current / req) * 100);
    gaps[skill] = { current, required: req, gap, percentage: Math.min(100, percentage) };
    gapList.push({ skill, gap, current, required: req, percentage: Math.min(100, percentage) });
  });

  gapList.sort((a, b) => b.gap - a.gap);
  return { gaps, gapList, overallScore: Math.round(gapList.reduce((s, g) => s + g.percentage, 0) / gapList.length) };
}

// ─── Recommendation Engine ───
export function getRecommendations(gapList) {
  const top3Gaps = gapList.slice(0, 3).map(g => g.skill);
  return courses
    .filter(c => top3Gaps.includes(c.skill))
    .sort((a, b) => b.relevance - a.relevance)
    .map((c, i) => ({ ...c, rank: i + 1, priority: i < 3 ? "High Priority" : i < 6 ? "Quick Win" : "Deep Dive" }));
}

// ─── Dashboard Modules (Toko style) ───
export const dashboardModules = [
  { num: "01", title: "Survey Design", icon: "📋" },
  { num: "02", title: "GIS & Mapping", icon: "🌍" },
  { num: "03", title: "Data Science", icon: "📊" },
];

export const currentModule = {
  number: 1,
  title: "Official Statistics & Survey Methodology",
  progress: 0,
  lessons: [
    { title: "Introduction to Official Statistics", desc: "Understand the core principles and legal framework of MoSPI.", icon: "book" },
    { title: "Basic Sampling & Frame Design", desc: "Learn sampling methods, stratification, and cluster selection.", icon: "brain" },
    { title: "Data Collection & Imputation", desc: "Field protocols for handling non-response and missing data.", icon: "database" },
    { title: "Data Quality & Validation Controls", desc: "Error detection and consistency checking rules.", icon: "shield" },
    { title: "Applied Statistical Analysis", desc: "Practical calculation of variance, weights, and indicators.", icon: "message" },
  ]
};

// ─── Cadre Promotion Hierarchy & Progression ───
export const cadreHierarchy = [
  {
    role: "Statistical Investigator",
    cadre: "SSS",
    rank: 1,
    minExperience: "Entry Level",
    summary: "Primary field data collection, preliminary verification, and household enumeration.",
    nextRole: "Junior Statistical Officer",
  },
  {
    role: "Junior Statistical Officer",
    cadre: "SSS",
    rank: 2,
    minExperience: "2+ Years",
    summary: "Supervision of field survey teams, data cleaning, and sample frame validation.",
    nextRole: "Statistical Officer",
  },
  {
    role: "Statistical Officer",
    cadre: "SSS",
    rank: 3,
    minExperience: "4+ Years",
    summary: "Survey round design, variance estimation, national accounts tabulations, and district reports.",
    nextRole: "Senior Statistical Officer",
  },
  {
    role: "Senior Statistical Officer",
    cadre: "SSS / ISS Inducted",
    rank: 4,
    minExperience: "7+ Years",
    summary: "Methodological drafting, econometric modeling, automated survey pipelines, and division supervision.",
    nextRole: "Deputy Director",
  },
  {
    role: "Deputy Director",
    cadre: "ISS",
    rank: 5,
    minExperience: "10+ Years",
    summary: "Division leadership, policy advice to ministries, census master planning, and national data governance.",
    nextRole: "Director",
  },
  {
    role: "Director",
    cadre: "ISS",
    rank: 6,
    minExperience: "15+ Years",
    summary: "Strategic direction of official statistical system, international statistical liaison (UN/OECD), and cabinet briefs.",
    nextRole: null,
  }
];

// ─── Micro-Learning Content Bank ───
export const sampleMicroLearning = {
  "Survey Design": {
    flashcards: [
      {
        front: "Probability Proportional to Size (PPS)",
        back: "A sampling technique where the probability of selecting an FSU (e.g., village or block) is proportional to an auxiliary measure of size (e.g., census population).",
        tag: "Sampling Theory"
      },
      {
        front: "Design Effect (DEFF)",
        back: "The ratio of the variance under the actual complex survey design (clustering, stratification) to the variance under simple random sampling with equal sample size: DEFF = Var_complex / Var_srs.",
        tag: "Variance Estimation"
      },
      {
        front: "First Stage Unit (FSU) vs Ultimate Stage Unit (USU)",
        back: "FSU is the primary sampling unit (e.g., village/urban block) selected first. USU is the final element from which data is collected (e.g., individual household or enterprise).",
        tag: "NSS Architecture"
      }
    ],
    caselet: {
      title: "Field Non-Response in High-Income Urban Clusters",
      scenario: "During the 79th NSS Round in Urban Mumbai, 42% of selected sample households in a gated residential society refused entry or were unavailable during afternoon visits.",
      question: "What is the official MoSPI protocol for resolving this without biasing the sample?",
      options: [
        "Immediately replace the refused households with neighboring households from outside the sample frame.",
        "Conduct mandatory evening/weekend callback visits with resident welfare association (RWA) liaison before considering systematic substitution.",
        "Drop the entire First Stage Unit (FSU) from the survey round calculation.",
        "Impute the missing values using state-level median expenditure directly without callback."
      ],
      correctAnswer: 1,
      explanation: "NSS Field Protocol mandates at least two callback visits during non-business hours (6 PM - 8 PM or weekends) with official institutional letter before initiating formal replacement from the designated reserve list."
    },
    nugget: {
      title: "60-Second Nugget: Circular Systematic Sampling with PPS",
      takeaways: [
        "Calculate cumulative sizes (Ci) for all N units in the stratum frame.",
        "Determine the sampling interval: I = C_total / n.",
        "Draw a single random start R from 1 to I.",
        "Select units corresponding to R + (k * I) mod C_total for k = 0, 1, ..., n-1."
      ]
    }
  },
  "GIS & Spatial Analysis": {
    flashcards: [
      {
        front: "Local Government Directory (LGD) Codes",
        back: "Unique hierarchical numeric identifiers (State -> District -> Sub-district -> Village) established by MoPR to harmonize spatial & administrative boundaries across govt datasets.",
        tag: "Spatial Governance"
      },
      {
        front: "Georeferencing & Ground Control Points (GCPs)",
        back: "The process of assigning real-world geographic coordinates (lat/long) to raster maps or enumeration block sketches using known physical landmarks.",
        tag: "Cartography"
      },
      {
        front: "Choropleth vs Dasymetric Mapping",
        back: "Choropleth colors administrative areas by aggregated rates; Dasymetric mapping uses ancillary spatial data (land use, building footprints) to refine population distribution within boundaries.",
        tag: "Spatial Visualization"
      }
    ],
    caselet: {
      title: "Boundary Discrepancy in Newly Bifurcated Districts",
      scenario: "A newly created district in 2024 has overlapping village boundary shapefiles between the State Directorate of Economics and the Survey of India base layers.",
      question: "Which standardized methodology should the statistical officer follow to establish the official census enumeration frame?",
      options: [
        "Use whichever boundary covers a larger land area to maximize count.",
        "Anchor to official LGD Gazette notification boundary and re-project both layers to WGS 84 / UTM Zone 43N with topological validation.",
        "Discard digital boundaries and rely solely on manual physical landmarks.",
        "Delay the survey until the next 10-year census revision."
      ],
      correctAnswer: 1,
      explanation: "MoSPI standards mandate topological snapping against the latest gazetted LGD codes, re-projected to standard WGS84 CRS, ensuring zero polygon slivers or self-intersections."
    },
    nugget: {
      title: "60-Second Nugget: QGIS Buffer Analysis for Enumeration Clusters",
      takeaways: [
        "Ensure project Coordinate Reference System is projected (e.g., EPSG:32643) rather than geographic (EPSG:4326) for true meter buffers.",
        "Set buffer distance based on rural walking radius (max 1.5 km per enumerator team).",
        "Run 'Dissolve Result' to merge overlapping coverage zones into single contiguous supervisory blocks."
      ]
    }
  },
  "Data Science & Analytics": {
    flashcards: [
      {
        front: "Polars vs Pandas on Microdata",
        back: "Polars utilizes multi-threaded Rust execution and Apache Arrow memory layout, reducing RAM overhead by ~80% when querying 50M+ census rows compared to Pandas.",
        tag: "High Performance Data"
      },
      {
        front: "Winsorization vs Trimming",
        back: "Trimming removes extreme outliers completely, reducing sample size; Winsorization caps outliers at specified percentiles (e.g. 1st and 99th), preserving degrees of freedom.",
        tag: "Data Cleaning"
      },
      {
        front: "Sampling Weight Calibration (GREG)",
        back: "Generalized Regression Estimator (GREG) adjusts design weights so that estimated totals for auxiliary variables equal known census population benchmarks.",
        tag: "Weighting Theory"
      }
    ],
    caselet: {
      title: "Extreme Outliers in Monthly Per Capita Consumption Expenditure (MPCE)",
      scenario: "During data validation, a rural household reported monthly expenditure 120 times the cluster mean due to a one-time social ceremony expense.",
      question: "How should this record be treated in official tabular aggregates?",
      options: [
        "Delete the household completely from the survey database.",
        "Separate the durable/ceremonial component into non-recurrent expenditure tables and cap recurrent items at the 99th percentile with a flag.",
        "Divide the expenditure by 120 to force it to match the mean.",
        "Ignore the outlier and publish unadjusted mean estimates."
      ],
      correctAnswer: 1,
      explanation: "Official NSS methodology isolates lumpy ceremonial expenditures to avoid skewing standard food/non-food recurrent MPCE quintiles while preserving audit integrity via outlier flags."
    },
    nugget: {
      title: "60-Second Nugget: Automated Data Validation Rules in Python",
      takeaways: [
        "Define range boundaries: 0 <= age <= 115, expenditure >= 0.",
        "Check logical consistency: if marital_status == 'Never Married', spouse_age MUST be null.",
        "Validate sum constraints: total_consumption == sum(itemized_consumption)."
      ]
    }
  },
  "AI & Machine Learning": {
    flashcards: [
      {
        front: "Synthetic Microdata Generation",
        back: "Using generative models (GANs, diffusion) to produce statistically realistic tabular data that preserves correlation matrices while protecting citizen privacy.",
        tag: "Privacy & Data"
      },
      {
        front: "Computer Vision for Satellite Imagery in Agriculture",
        back: "Applying Convolutional Neural Networks (CNNs) on Sentinel-2 optical imagery to forecast crop yields and acreage prior to manual crop-cutting experiments.",
        tag: "Remote Sensing"
      },
      {
        front: "Retrieval-Augmented Generation (RAG) for Circulars",
        back: "Connecting LLMs to official MoSPI compendiums and NSS instruction manuals via vector search to answer technical field questions with zero hallucination.",
        tag: "AI Architecture"
      }
    ],
    caselet: {
      title: "Automated Crop Acreage Estimation via Satellite Imagery",
      scenario: "An agricultural statistics team deploys a deep learning model to estimate paddy acreage, but heavy cloud cover during monsoon blinds optical satellite bands.",
      question: "What is the recommended AI engineering solution?",
      options: [
        "Wait until the post-harvest dry season before attempting any estimates.",
        "Fuse optical data with Synthetic Aperture Radar (SAR, Sentinel-1) which penetrates cloud cover through microwave backscatter analysis.",
        "Generate random values for cloud-covered pixels.",
        "Rely entirely on historical 5-year averages without sensor data."
      ],
      correctAnswer: 1,
      explanation: "SAR microwave sensors operate in C-band which penetrates cloud, fog, and rain, making optical-SAR sensor fusion the gold standard for monsoon crop monitoring in India."
    },
    nugget: {
      title: "60-Second Nugget: Responsible AI & Bias Auditing in Public Surveys",
      takeaways: [
        "Check demographic parity: ensure model error rates do not disproportionately skew across gender, caste, or geography.",
        "Maintain human-in-the-loop validation for all automated outlier rejections.",
        "Log model version, prompt templates, and random seeds for government audit compliance."
      ]
    }
  },
  "Statistical Methods": {
    flashcards: [
      {
        front: "Taylor Series Linearization (Delta Method)",
        back: "An asymptotic technique used to estimate variance for non-linear statistics (ratios, Gini coefficients) under multi-stage cluster sampling.",
        tag: "Variance Estimation"
      },
      {
        front: "Seasonal Adjustment (X-13ARIMA-SEATS)",
        back: "The official standard method for decomposing time series (CPI, IIP) into seasonal, trend-cycle, and irregular components.",
        tag: "Time Series"
      },
      {
        front: "Base Year Revision & Chain Linking",
        back: "Re-basing national accounts indices to reflect updated economic structure, with chain-linking connecting legacy series to modern base periods.",
        tag: "Macroeconomics"
      }
    ],
    caselet: {
      title: "Reconciling CPI Urban vs CPI Rural Divergence",
      scenario: "During a volatile quarter, CPI Rural food inflation surged by 8.4% while CPI Urban food inflation stood at 4.1%.",
      question: "Which statistical decomposition isolates whether this is structural transport cost divergence or item weighting differences?",
      options: [
        "Laspeyres vs Paasche index decomposition isolating commodity weights vs price relatives across urban-rural baskets.",
        "A simple arithmetic average of both indices.",
        "Disregarding rural price collections as field errors.",
        "Taking the median of urban prices and assigning it to rural markets."
      ],
      correctAnswer: 0,
      explanation: "Food represents 54.18% of CPI Rural but only 36.29% of CPI Urban; index decomposition separates the basket weight effect from genuine spatial price wedge effects."
    },
    nugget: {
      title: "60-Second Nugget: Neyman Optimal Sample Allocation",
      takeaways: [
        "Formula: n_h = n * (N_h * S_h) / sum(N_i * S_i).",
        "Allocate larger sample shares to strata with larger population (N_h) OR higher variance (S_h).",
        "Minimizes the overall sampling variance for a fixed total sample budget n."
      ]
    }
  },
  "Data Governance": {
    flashcards: [
      {
        front: "National Data Governance Framework Policy (NDGFP)",
        back: "The national policy framework establishing standardized non-personal data access, anonymous data sharing protocols, and India Datasets Platform governance.",
        tag: "Policy"
      },
      {
        front: "Differential Privacy in Microdata Dissemination",
        back: "A mathematical framework that injects calibrated statistical noise into query responses to guarantee that no individual's identity can be re-identified.",
        tag: "Privacy"
      },
      {
        front: "Audit Trail & Metadata (ISO 19115 / SDMX)",
        back: "Standardized structural metadata and processing history tracking every transformation, imputation, and aggregation applied to raw official data.",
        tag: "Standards"
      }
    ],
    caselet: {
      title: "Public Release of High-Resolution Census Geospatial Microdata",
      scenario: "A research university requests enumeration block-level microdata containing household income, religion, and GPS coordinates for an urban study.",
      question: "Under Indian official data governance regulations, what is the required disclosure control protocol?",
      options: [
        "Provide full unmasked database since it is for academic research.",
        "Apply spatial perturbation (geomasking), suppress sensitive variables at clusters with <5 households, and release aggregated grid units.",
        "Reject all research requests permanently.",
        "Ask the university to sign a paper pledge without technical de-identification."
      ],
      correctAnswer: 1,
      explanation: "Official statistical governance strictly prohibits publishing direct GPS or sensitive identifiers below safe k-anonymity thresholds; spatial geomasking and minimum cell suppression are mandatory."
    },
    nugget: {
      title: "60-Second Nugget: SDMX (Statistical Data & Metadata Exchange)",
      takeaways: [
        "Global standard supported by UN, World Bank, and MoSPI for machine-to-machine exchange.",
        "Components: Data Structure Definition (DSD), Code Lists, Concept Schemes.",
        "Eliminates manual CSV wrangling between ministry portals and central dashboards."
      ]
    }
  }
};

// ─── Practical Simulation Tasks Bank ───
export const samplePracticalTasks = [
  {
    id: "task-1",
    title: "NSS Survey Data Cleaning: Anomaly & Inconsistency Detection",
    skill: "Data Science & Analytics",
    difficulty: "Operational",
    estimatedMinutes: 8,
    scenario: "You are the supervising officer inspecting raw microdata from a district-level Household Consumer Expenditure Survey. The automated ingestion script has flagged 5 potential inconsistencies across 10 sample records.",
    datasetSnippet: [
      { hhid: "H-101", members: 4, monthlyExp: 18500, mainIncome: "Agriculture", reportedLandAcres: 2.5, childUnder14: 2, schoolingCost: 3200 },
      { hhid: "H-102", members: 1, monthlyExp: 84000, mainIncome: "Daily Wage Labour", reportedLandAcres: 0.0, childUnder14: 0, schoolingCost: 14000 },
      { hhid: "H-103", members: 6, monthlyExp: 22000, mainIncome: "Self Employed", reportedLandAcres: 1.2, childUnder14: 3, schoolingCost: 1200 },
      { hhid: "H-104", members: 3, monthlyExp: -4500, mainIncome: "Salaried", reportedLandAcres: 0.5, childUnder14: 1, schoolingCost: 5000 },
      { hhid: "H-105", members: 5, monthlyExp: 31000, mainIncome: "Agriculture", reportedLandAcres: 4.0, childUnder14: 0, schoolingCost: 8500 },
    ],
    taskPrompt: "Identify the critical inconsistencies in H-102, H-104, and H-105. Write the precise conditional validation rules (in pseudocode, SQL, or Python) to automatically flag these in future survey rounds.",
    modelAnswerKey: "1. H-102 has high expenditure (84,000) for daily wage labourer with schooling cost (14,000) despite 0 children under 14.\n2. H-104 has negative monthly expenditure (-4500), which violates non-negativity constraint.\n3. H-105 has schooling expenditure (8500) reported despite 0 children under 14 (could be higher education/vocational, requires field verification note).\nRule logic:\n- IF monthlyExp <= 0 THEN FLAG_FATAL('Negative or zero consumption')\n- IF childUnder14 == 0 AND schoolingCost > 0 THEN FLAG_WARNING('Check vocational/adult education or coding error')",
    rubric: {
      methodologyWeight: 40,
      protocolWeight: 30,
      completenessWeight: 30
    }
  },
  {
    id: "task-2",
    title: "Optimum Sample Allocation using Neyman Formula",
    skill: "Statistical Methods",
    difficulty: "Advanced",
    estimatedMinutes: 10,
    scenario: "A state statistical bureau has a fixed budget to interview n = 1,000 agricultural enterprises across 3 distinct agro-climatic strata. Historical variance indicates high heterogeneity in Stratum 2.",
    datasetSnippet: [
      { stratum: "1: Coastal Plains", populationN: 12000, stdDevS: 25 },
      { stratum: "2: Highland Plateau", populationN: 6000, stdDevS: 80 },
      { stratum: "3: Inland Semi-Arid", populationN: 22000, stdDevS: 15 },
    ],
    taskPrompt: "Calculate the Neyman optimum sample allocation (n1, n2, n3) for the 1,000 total enterprises. Explain why Stratum 2 receives a higher sampling fraction despite having the smallest population.",
    modelAnswerKey: "Calculations:\nN1 * S1 = 12,000 * 25 = 300,000\nN2 * S2 = 6,000 * 80 = 480,000\nN3 * S3 = 22,000 * 15 = 330,000\nSum(Ni * Si) = 300,000 + 480,000 + 330,000 = 1,110,000\n\nAllocations:\nn1 = 1,000 * (300,000 / 1,110,000) = ~270\nn2 = 1,000 * (480,000 / 1,110,000) = ~432\nn3 = 1,000 * (330,000 / 1,110,000) = ~298\nTotal = 270 + 432 + 298 = 1,000\n\nExplanation: Stratum 2 exhibits substantially higher standard deviation (S2 = 80 vs 15-25), requiring more samples to constrain total survey variance.",
    rubric: {
      methodologyWeight: 50,
      protocolWeight: 25,
      completenessWeight: 25
    }
  },
  {
    id: "task-3",
    title: "Urban Slum Field Enumeration Non-Response Protocol",
    skill: "Survey Design",
    difficulty: "Operational",
    estimatedMinutes: 6,
    scenario: "During the 3rd week of field data collection in a designated slum enumeration block (FSU #402), the enumerator team reports that 6 out of 16 selected households work informal night shifts and cannot be contacted during standard hours.",
    datasetSnippet: [
      { fsu: "402", totalSample: 16, completed: 8, refused: 2, nonContactShift: 6, daysLeft: 4 }
    ],
    taskPrompt: "Draft an operational field action plan complying with MoSPI NSS guidelines to achieve minimum required 90% response rate without unauthorized convenience substitutions.",
    modelAnswerKey: "Action plan:\n1. Split enumerator shift into evening callback windows (6:30 PM - 8:30 PM) and early morning (6:00 AM - 7:30 AM).\n2. Coordinate with local community volunteer / Anganwadi worker for pre-survey notification.\n3. If non-contact persists after 3 documented visits, consult designated reserve sampling frame (List B) authorized by the Senior Statistical Officer.\n4. Document non-response codes strictly in Schedule 0.0 block.",
    rubric: {
      methodologyWeight: 35,
      protocolWeight: 45,
      completenessWeight: 20
    }
  },
  {
    id: "task-4",
    title: "GIS LGD Boundary Harmonization & Polygon Topology Check",
    skill: "GIS & Spatial Analysis",
    difficulty: "Expert",
    estimatedMinutes: 8,
    scenario: "When integrating Census 2011 enumeration blocks with 2024 updated Local Government Directory (LGD) shapefiles, QGIS topology validator reports 14 sliver polygons and 3 multi-part disconnected geometries along the district periphery.",
    datasetSnippet: [
      { layerA: "Census_2011_EB.shp", layerB: "LGD_2024_SubDistrict.shp", errorType: "Sliver overlap & Gap", featureCount: 17 }
    ],
    taskPrompt: "Specify the exact sequence of GIS geoprocessing operations (buffer, snap, eliminate sliver polygons, topological editing) required to harmonize the boundary without duplicating population counts.",
    modelAnswerKey: "Sequence:\n1. Verify both layers are projected to same CRS (e.g. EPSG:32643 - UTM Zone 43N).\n2. Set topological editing ON with snapping tolerance of 5 meters.\n3. Run 'Fix Geometries' to resolve self-intersecting loops.\n4. Run 'Eliminate Sliver Polygons' merging slivers < 50 sq meters into adjacent polygon with largest shared boundary.\n5. Validate spatial union so total area equals the official gazetted district area.",
    rubric: {
      methodologyWeight: 45,
      protocolWeight: 30,
      completenessWeight: 25
    }
  }
];

// ─── Initial Skill Evidence Portfolio Items ───
export const samplePortfolioEvidence = [
  {
    id: "ev-1",
    title: "NSS 79th Round Urban Field Survey Supervision Report",
    competency: "Survey Design",
    date: "2024-06-15",
    type: "Field Report",
    status: "Verified by Cadre Supervisor",
    verifiedBy: "Rajesh Kumar Sharma, Deputy Director",
    hash: "0x8f4d92a1c6e3b745",
    summary: "Supervised 12 First Stage Units in District Kanpur; validated sampling frame coverage and achieved 96.2% response rate with zero unauthorized substitutions.",
    credentialId: "MOSPI-EVD-2024-0891"
  },
  {
    id: "ev-2",
    title: "R Pipeline for Taylor Series Complex Variance Estimation",
    competency: "Statistical Methods",
    date: "2024-07-22",
    type: "Code Artifact",
    status: "AI Rubric Verified",
    verifiedBy: "Pariksha AI Automated Auditor",
    hash: "0x3e1b7829fa04bc91",
    summary: "Automated standard error calculation script for multi-stage stratified clusters; benchmarked against SAS survey procedures with 100% numerical convergence.",
    credentialId: "MOSPI-EVD-2024-1142"
  },
  {
    id: "ev-3",
    title: "District Census Boundary Harmonization Memo",
    competency: "GIS & Spatial Analysis",
    date: "2024-08-10",
    type: "Spatial Protocol",
    status: "Pending Cadre Review",
    verifiedBy: "Under Evaluation",
    hash: "0x9c41f6e07a2318df",
    summary: "Resolved 17 border polygon gaps between Survey of India 1:50k maps and state LGD gazette boundaries using topological snapping in QGIS.",
    credentialId: "MOSPI-EVD-2024-1509"
  }
];

// ─── Department Heatmap Decay & Cadre Distributions ───
export const departmentCadreStats = {
  "Census Operations": { total: 420, iss: 48, sss: 372, decayRisk: 18, topDeficit: "GIS & Spatial Analysis" },
  "National Sample Survey": { total: 680, iss: 82, sss: 598, decayRisk: 12, topDeficit: "AI & Machine Learning" },
  "Economic Statistics": { total: 310, iss: 55, sss: 255, decayRisk: 24, topDeficit: "Data Science & Analytics" },
  "Agricultural Statistics": { total: 290, iss: 34, sss: 256, decayRisk: 15, topDeficit: "AI & Machine Learning" },
  "Industrial Statistics": { total: 240, iss: 30, sss: 210, decayRisk: 28, topDeficit: "Data Governance" },
  "Social Statistics": { total: 350, iss: 42, sss: 308, decayRisk: 31, topDeficit: "AI & Machine Learning" },
  "Health Statistics": { total: 210, iss: 28, sss: 182, decayRisk: 22, topDeficit: "Data Science & Analytics" },
  "Price Statistics": { total: 190, iss: 22, sss: 168, decayRisk: 35, topDeficit: "GIS & Spatial Analysis" },
  "Trade Statistics": { total: 180, iss: 25, sss: 155, decayRisk: 26, topDeficit: "Statistical Methods" },
  "Labour Statistics": { total: 220, iss: 26, sss: 194, decayRisk: 29, topDeficit: "AI & Machine Learning" },
};

