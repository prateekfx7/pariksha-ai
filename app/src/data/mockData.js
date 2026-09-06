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
