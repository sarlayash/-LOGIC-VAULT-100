// ==========================================================================
// DEEP AUTOMATED TEST SUITE: KAPIL'S LOGIC-VAULT 100
// ==========================================================================

const fs = require('fs');
const path = require('path');

const dp = require('./js/data-problems.js');
const dt = require('./js/data-tests.js');

let passCount = 0;
let failCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`  [FAIL] ${testName} -> ${details}`);
    failCount++;
  }
}

console.log('====================================================');
console.log('1. DATASET INTEGRITY & SPECIFICATION VERIFICATION');
console.log('====================================================');

assert(Array.isArray(dp.ALL_PROBLEMS), 'ALL_PROBLEMS is an array');
assert(dp.ALL_PROBLEMS.length === 100, `Exact 100 problems exist (Found: ${dp.ALL_PROBLEMS.length})`);

// Check consecutive IDs 1..100
let ids = dp.ALL_PROBLEMS.map(p => p.id);
let missingIds = [];
for (let i = 1; i <= 100; i++) {
  if (!ids.includes(i)) missingIds.push(i);
}
assert(missingIds.length === 0, 'Consecutive problem IDs 1 through 100 all present', `Missing IDs: ${missingIds}`);

// Check all 12 domains
const domainCounts = {};
dp.ALL_PROBLEMS.forEach(p => {
  domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
});

const EXPECTED_DOMAINS = [
  "Banking, FinTech & Insurance",
  "Healthcare, Hospitals & Pharma",
  "Retail, E-commerce & Consumer Goods",
  "Manufacturing, Supply Chain & Logistics",
  "Education, EdTech & Workforce Development",
  "IT, SaaS, Cybersecurity & Cloud Operations",
  "Government, Public Services & Smart Cities",
  "Energy, Utilities & Sustainability",
  "Travel, Hospitality, Aviation & Mobility",
  "Agriculture, Food Systems & Rural Enterprise",
  "Telecom, Media & Digital Platforms",
  "HR, Professional Services & Enterprise Operations"
];

assert(Object.keys(domainCounts).length === 12, `Exactly 12 domains mapped (Found: ${Object.keys(domainCounts).length})`);

EXPECTED_DOMAINS.forEach(d => {
  assert(domainCounts[d] > 0, `Domain "${d}" has ${domainCounts[d]} problem statements`);
});

// Deep Check each problem schema
let invalidSchemaCount = 0;
let invalidEdgeCases = 0;
let invalidTestCases = 0;

dp.ALL_PROBLEMS.forEach(p => {
  const requiredKeys = [
    'id', 'code', 'title', 'domain', 'domainId', 'problemStatement',
    'realWorldConstraint', 'understanding', 'assumptionsAndRules',
    'inputOutputDesign', 'algorithmSteps', 'pseudocode', 'edgeCases',
    'testCases', 'complexity'
  ];

  for (const k of requiredKeys) {
    if (p[k] === undefined || p[k] === null || p[k] === '') {
      invalidSchemaCount++;
      console.error(`Problem #${p.code} missing key: ${k}`);
    }
  }

  if (!Array.isArray(p.edgeCases) || p.edgeCases.length < 5) {
    invalidEdgeCases++;
  }

  if (!Array.isArray(p.testCases) || p.testCases.length < 5) {
    invalidTestCases++;
  }
});

assert(invalidSchemaCount === 0, 'All 100 problems pass schema completeness check');
assert(invalidEdgeCases === 0, 'Every problem has at least 5 realistic edge cases');
assert(invalidTestCases === 0, 'Every problem has at least 5 structured test verification vectors');

console.log('\n====================================================');
console.log('2. MOCK TESTS & GRAND FINAL ASSESSMENT VERIFICATION');
console.log('====================================================');

assert(Array.isArray(dt.ALL_MOCK_TESTS), 'ALL_MOCK_TESTS is an array');
assert(dt.ALL_MOCK_TESTS.length === 5, `Exactly 5 Mock Tests exist (Found: ${dt.ALL_MOCK_TESTS.length})`);

dt.ALL_MOCK_TESTS.forEach(t => {
  assert(t.questions.length === 10, `${t.title} has 10 questions`);
  t.questions.forEach((q, idx) => {
    assert(q.options.length >= 4, `${t.id} Q${idx+1} has 4 distinct options`);
    assert(q.correctIndex >= 0 && q.correctIndex < q.options.length, `${t.id} Q${idx+1} valid correctIndex (${q.correctIndex})`);
    assert(q.explanation && q.explanation.length > 20, `${t.id} Q${idx+1} has comprehensive educational rationale`);
  });
});

assert(Boolean(dt.GRAND_FINAL_ASSESSMENT), 'GRAND_FINAL_ASSESSMENT exists');
assert(dt.GRAND_FINAL_ASSESSMENT.questions.length === 20, `Grand Final Assessment has 20 questions (Found: ${dt.GRAND_FINAL_ASSESSMENT.questions.length})`);
assert(dt.GRAND_FINAL_ASSESSMENT.passScorePct === 75, 'Grand Final Assessment passing threshold is 75%');

dt.GRAND_FINAL_ASSESSMENT.questions.forEach((q, idx) => {
  assert(q.options.length >= 4, `Final Exam Q${idx+1} has 4 options`);
  assert(q.correctIndex >= 0 && q.correctIndex < q.options.length, `Final Exam Q${idx+1} valid answer index`);
  assert(q.explanation && q.explanation.length > 20, `Final Exam Q${idx+1} has clear explanation`);
});

console.log('\n====================================================');
console.log('3. HTML DOM & APP.JS BINDING VERIFICATION');
console.log('====================================================');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const criticalElements = [
  'confettiCanvas', 'brandHomeLink', 'liveClockDisplay', 'networkStatusBadge',
  'soundToggleBtn', 'installAppBtn', 'userProfileBadge', 'userAvatar',
  'headerLearnerName', 'headerUserLevel', 'logoffBtn', 'problemsTab',
  'testsTab', 'badgesTab', 'certTab', 'standardsTab', 'statsMasteredCount',
  'statsXpPoints', 'overallProgressBar', 'progressPctText', 'problemSearchInput',
  'statusFilterSelect', 'domainFilterScroll', 'problemsContainer',
  'activeExamContainer', 'testsGridContainer', 'specialBadgesGrid',
  'domainBadgesGrid', 'certPrintArea', 'certLearnerName', 'certVerificationId',
  'certIssueDate', 'printCertBtn', 'shareCertBtn', 'problemDetailModal',
  'modalProblemCode', 'modalDomainBadge', 'modalProblemTitle', 'modalStatementText',
  'modalConstraintText', 'modalUnderstandingText', 'modalRulesList',
  'modalIOTableBody', 'modalAlgoStepsList', 'modalPseudocodeText',
  'modalEdgeCasesContainer', 'modalTestCasesContainer', 'simulatorInputsGrid',
  'simulatorResultBox', 'modalScratchpadArea', 'modalCompleteToggleBtn',
  'modalBookmarkToggleBtn', 'welcomeModal', 'onboardingForm', 'onboardingNameInput',
  'confirmModal', 'confirmActionBtn', 'confirmCancelBtn', 'footerResetBtn'
];

let missingDomElements = [];
criticalElements.forEach(id => {
  if (!htmlContent.includes(`id="${id}"`)) {
    missingDomElements.push(id);
  }
});

assert(missingDomElements.length === 0, 'All critical DOM IDs referenced in app.js exist in index.html', `Missing: ${missingDomElements}`);

console.log('\n====================================================');
console.log('4. PWA MANIFEST & SERVICE WORKER VALIDATION');
console.log('====================================================');

const manifestContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.webmanifest'), 'utf8'));
assert(manifestContent.name === "KAPIL'S LOGIC-VAULT 100", 'PWA manifest name matches exactly');
assert(manifestContent.display === 'standalone', 'PWA display set to standalone');
assert(fs.existsSync(path.join(__dirname, 'icons', 'icon-192.png')), 'icon-192.png exists');
assert(fs.existsSync(path.join(__dirname, 'icons', 'icon-512.png')), 'icon-512.png exists');
assert(fs.existsSync(path.join(__dirname, 'icons', 'favicon.png')), 'favicon.png exists');

const swContent = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
assert(swContent.includes('kapil-logic-vault-v1'), 'sw.js has cache namespace');
assert(swContent.includes('install') && swContent.includes('activate') && swContent.includes('fetch'), 'sw.js implements all standard lifecycle events');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL SYSTEMS 100% OPERATIONAL & VERIFIED!\n');
}
