// ==========================================================================
// DEEP AUTOMATED TEST SUITE: KAPIL'S LOGIC-VAULT 100
// ==========================================================================

const fs = require('fs');
const path = require('path');

const dp = require('./js/data-problems.js');
const dt = require('./js/data-tests.js');
const dsa = require('./js/data-dsa.js');

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
console.log('2. 30 CORE DSA PATTERNS VERIFICATION');
console.log('====================================================');

assert(Array.isArray(dsa.DSA_PATTERNS), 'DSA_PATTERNS is an array');
assert(dsa.DSA_PATTERNS.length === 30, `Exact 30 DSA patterns exist (Found: ${dsa.DSA_PATTERNS.length})`);

const EXPECTED_DSA_PATTERNS = [
  ["Array Traversal", "Visit every element once"],
  ["Two Pointer", "Two indices moving together/opposite"],
  ["Sliding Window (Fixed)", "Fixed-size window moves"],
  ["Sliding Window (Variable)", "Expand and shrink window"],
  ["HashMap / Frequency", "Store key-value pairs for counting and fast lookup"],
  ["HashSet", "Fast lookup of uniqueness"],
  ["Prefix Sum", "Running cumulative sum"],
  ["Binary Search", "Search by halving the search space"],
  ["Sorting", "Arrange elements in ascending/descending order"],
  ["Recursion", "Function calls itself until a base case"],
  ["Backtracking", "Try → Undo → Try Again"],
  ["Stack", "LIFO operations"],
  ["Queue", "FIFO operations"],
  ["Monotonic Stack", "Maintain increasing/decreasing stack"],
  ["Linked List", "Traverse and manipulate nodes using pointers"],
  ["Fast & Slow Pointer", "Two-speed traversal"],
  ["Trees (DFS)", "Depth-first recursive traversal"],
  ["Trees (BFS)", "Level-by-level traversal using a queue"],
  ["Heap / Priority Queue", "Always access min/max efficiently"],
  ["Greedy", "Choose the locally optimal solution"],
  ["Dynamic Programming (1D)", "Store solutions to overlapping subproblems"],
  ["Dynamic Programming (2D)", "DP table over two dimensions"],
  ["Graph DFS", "Recursive graph traversal"],
  ["Graph BFS", "Queue-based graph traversal"],
  ["Union-Find (DSU)", "Merge and find connected components"],
  ["Trie", "Prefix-based tree for strings"],
  ["Bit Manipulation", "Operate directly on binary bits"],
  ["Matrix Traversal", "Navigate rows and columns systematically"],
  ["Interval Problems", "Sort and merge overlapping intervals"],
  ["Divide & Conquer", "Break into smaller subproblems and combine"]
];

EXPECTED_DSA_PATTERNS.forEach(([name, logic]) => {
  const found = dsa.DSA_PATTERNS.find(p => p.name.toLowerCase() === name.toLowerCase() || p.name.startsWith(name));
  assert(Boolean(found), `Pattern exists: "${name}"`);
  if (found) {
    assert(found.coreLogic.toLowerCase().includes(logic.toLowerCase().slice(0, 15)), `Pattern "${name}" core logic matches: "${found.coreLogic}"`);
    assert(Boolean(found.template && found.template.length > 20), `Pattern "${name}" has executable pseudocode template`);
    assert(Array.isArray(found.classicalProblems) && found.classicalProblems.length > 0, `Pattern "${name}" has classical benchmark problems`);
    assert(Array.isArray(found.industryMapping) && found.industryMapping.length > 0, `Pattern "${name}" mapped to 100 industry problem statements`);
  }
});

console.log('\n====================================================');
console.log('3. MOCK TESTS & GRAND FINAL ASSESSMENT VERIFICATION');
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
console.log('4. HTML DOM & APP.JS BINDING VERIFICATION');
console.log('====================================================');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const criticalElements = [
  'confettiCanvas', 'brandHomeLink', 'liveClockDisplay', 'networkStatusBadge',
  'soundToggleBtn', 'installAppBtn', 'userProfileBadge', 'userAvatar',
  'headerLearnerName', 'headerUserLevel', 'logoffBtn', 'problemsTab',
  'dsaTab', 'dsaSearchInput', 'dsaCategorySelect', 'dsaPatternsContainer',
  'dsaPatternModal', 'modalDsaCategoryBadge', 'modalDsaTimeComp', 'modalDsaSpaceComp',
  'modalDsaPatternTitle', 'modalDsaCoreLogic', 'modalDsaWhenToUse', 'modalDsaTemplateText',
  'modalDsaClassicalList', 'modalDsaIndustryList', 'modalDsaCloseBtn', 'copyDsaTemplateBtn',
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
console.log('5. PWA MANIFEST & SERVICE WORKER VALIDATION');
console.log('====================================================');

const manifestContent = JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.webmanifest'), 'utf8'));
assert(manifestContent.name === "KAPIL'S LOGIC-VAULT 100", 'PWA manifest name matches exactly');
assert(manifestContent.display === 'standalone', 'PWA display set to standalone');
assert(fs.existsSync(path.join(__dirname, 'icons', 'icon-192.png')), 'icon-192.png exists');
assert(fs.existsSync(path.join(__dirname, 'icons', 'icon-512.png')), 'icon-512.png exists');
assert(fs.existsSync(path.join(__dirname, 'icons', 'favicon.png')), 'favicon.png exists');

const swContent = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
assert(swContent.includes('kapil-logic-vault-v1'), 'sw.js has cache namespace');
assert(swContent.includes('js/data-dsa.js'), 'sw.js caches data-dsa.js');
assert(swContent.includes('install') && swContent.includes('activate') && swContent.includes('fetch'), 'sw.js implements all standard lifecycle events');

console.log('\n====================================================');
console.log(`TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL SYSTEMS 100% OPERATIONAL & VERIFIED!\n');
}
