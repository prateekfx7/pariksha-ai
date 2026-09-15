/**
 * Pariksha AI — AI Content Quality & Outdated-Content Detector
 * Scans course materials, question banks, and notes against recent Government
 * of India, DoPT, MoSPI, and Ministry of Finance circulars to flag obsolete rules,
 * repealed acts, outdated thresholds, and broken guidelines.
 */

export const REGULATORY_CIRCULARS_DB = [
  {
    id: 'DOPT_GIFTS_2019',
    category: 'Conduct & Ethics',
    title: 'CCS (Conduct) Rules — Revised Monetary Limits for Gifts',
    circularRef: 'DoPT O.M. No. 11013/2/2018-Estt.A-III dated 06.08.2019',
    outdatedPattern: /(?:gift.*?(?:5,?000|2,?000|1,?000)\s*(?:rupees|rs|inr)|limit.*?group\s*[a|b].*?(?:5000|2000))/i,
    modernProvision: 'Under Rule 13(2) of CCS (Conduct) Rules 1964 as amended in 2019, Group A officers may accept gifts up to ₹25,000, Group B up to ₹15,000, and Group C up to ₹7,500 from near relatives/personal friends on ceremonial occasions.',
    recommendation: 'Update gift threshold to ₹25,000 for Group A and ₹15,000 for Group B per 2019 DoPT circular.'
  },
  {
    id: 'DPDP_ACT_2023',
    category: 'Legal & Regulatory / Digital Skills',
    title: 'Digital Personal Data Protection Act 2023 (Repeals IT Act Sec 43A)',
    circularRef: 'Ministry of Law & Justice, Gazette Notification Act No. 22 of 2023',
    outdatedPattern: /(?:section\s*43a\s*of\s*the\s*information\s*technology\s*act|it\s*\(reasonable\s*security\s*practices\)\s*rules|sensitive\s*personal\s*data\s*or\s*information\s*rules\s*2011)/i,
    modernProvision: 'Section 43A of the IT Act 2000 has been repealed and replaced by the Digital Personal Data Protection (DPDP) Act 2023, introducing Data Fiduciaries, Data Principals, and monetary penalties up to ₹250 crore.',
    recommendation: 'Replace references to IT Act Section 43A / SPDI Rules 2011 with the Digital Personal Data Protection (DPDP) Act 2023.'
  },
  {
    id: 'GFR_GEM_THRESHOLD_2024',
    category: 'Administrative Skills / Governance',
    title: 'GFR 2017 Rule 149 — Government e-Marketplace (GeM) Procurement Limits',
    circularRef: 'Department of Expenditure, Ministry of Finance O.M. F.1/26/2018-PPD',
    outdatedPattern: /(?:direct\s*purchase.*?gem.*?25,?000|rule\s*149.*?limit.*?25,?000)/i,
    modernProvision: 'Under amended Rule 149 of GFR 2017, direct purchase without comparison on GeM is permitted up to ₹50,000 (and up to ₹1,00,000 for specific approved categories) through any of the available sellers on GeM meeting quality specifications.',
    recommendation: 'Update GeM direct purchase ceiling to ₹50,000 per Department of Expenditure amendments.'
  },
  {
    id: 'RPWD_ACT_2016',
    category: 'Legal & Regulatory',
    title: 'Rights of Persons with Disabilities Act 2016 (21 Benchmark Disabilities)',
    circularRef: 'DoPT O.M. No. 36035/02/2017-Estt (Res) & Act No. 49 of 2016',
    outdatedPattern: /(?:persons\s*with\s*disabilities\s*\(equal\s*opportunities.*?1995|seven\s*types\s*of\s*disabilit(?:y|ies)|pwd\s*act\s*1995)/i,
    modernProvision: 'The Persons with Disabilities Act 1995 was superseded by the RPwD Act 2016, expanding benchmark disabilities from 7 to 21 categories (including acid attack victims, specific learning disabilities, autism spectrum, dwarfism) and 4% reservation in government posts.',
    recommendation: 'Replace PwD Act 1995 with RPwD Act 2016 and cite 21 benchmark disability categories and 4% reservation.'
  },
  {
    id: 'MOSPI_BASE_YEAR_GDP',
    category: 'Sector-Specific (MoSPI)',
    title: 'National Accounts & Industrial Statistics Base Year',
    circularRef: 'MoSPI Advisory on Statistical Base Year Series (2011-12 Series)',
    outdatedPattern: /(?:base\s*year.*?(?:1999-00|2004-05)\s*for\s*(?:gdp|national\s*accounts|iip)|wim\s*base\s*2004-05)/i,
    modernProvision: 'Current official base series for Gross Domestic Product (GDP) and Index of Industrial Production (IIP) is 2011-12 (with advisory updates underway for the upcoming series). 2004-05 base series has been archived.',
    recommendation: 'Update GDP and IIP base year references to the official 2011-12 series.'
  },
  {
    id: 'POSH_INTERNAL_COMMITTEE',
    category: 'Legal & Regulatory / Workplace Skills',
    title: 'POSH Act 2013 — Internal Committee (IC) Mandate & 90-Day Timeframe',
    circularRef: 'DoPT O.M. No. 11013/2/2014-Estt.A-III dated 16.07.2015 & Act No. 14 of 2013',
    outdatedPattern: /(?:visshaka|vishaka\s*guidelines\s*without\s*act|complaints\s*committee\s*timeline\s*(?:6\s*months|180\s*days))/i,
    modernProvision: 'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act 2013 codified Vishaka guidelines. Inquiries must be completed within a statutory limit of 90 days by an Internal Committee (IC) comprising at least 50% women and an external NGO member.',
    recommendation: 'Cite POSH Act 2013 statutory 90-day completion mandate and mandatory external NGO member.'
  }
];

// Detect outdated content in a question or text passage
export function auditTextForOutdatedContent(content = '', contentId = 'item-1') {
  const flags = [];

  for (const circular of REGULATORY_CIRCULARS_DB) {
    if (circular.outdatedPattern.test(content)) {
      flags.push({
        id: `${contentId}_${circular.id}`,
        circularId: circular.id,
        category: circular.category,
        title: circular.title,
        circularRef: circular.circularRef,
        severity: 'HIGH_REGULATORY_IMPACT',
        modernProvision: circular.modernProvision,
        recommendation: circular.recommendation,
        detectedSnippet: content.slice(0, 180) + '...'
      });
    }
  }

  return flags;
}

// Audit an entire question bank or course syllabus
export function auditCourseLibrary(questionsOrModules = []) {
  let totalAudited = 0;
  let totalOutdatedFlags = 0;
  const flaggedItems = [];

  questionsOrModules.forEach((item, index) => {
    totalAudited++;
    const textToScan = `${item.question || ''} ${(item.options || []).join(' ')} ${item.explanation || ''} ${item.content || ''} ${item.title || ''}`;
    const flags = auditTextForOutdatedContent(textToScan, `q_${index + 1}`);

    if (flags.length > 0) {
      totalOutdatedFlags += flags.length;
      flaggedItems.push({
        index: index + 1,
        itemTitle: item.question || item.title || `Item #${index + 1}`,
        flags,
        originalItem: item
      });
    }
  });

  const libraryHealthScore = totalAudited > 0
    ? Math.max(0, Math.round(100 - (totalOutdatedFlags / totalAudited) * 50))
    : 100;

  return {
    totalAudited,
    totalOutdatedFlags,
    flaggedItems,
    libraryHealthScore,
    status: libraryHealthScore >= 90 ? 'COMPLIANT' : libraryHealthScore >= 70 ? 'UPDATES_RECOMMENDED' : 'CRITICAL_OUTDATED_RULES'
  };
}
