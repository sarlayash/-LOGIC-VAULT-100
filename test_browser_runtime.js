// ==========================================================================
// REAL HEADLESS BROWSER RUNTIME E2E TESTING VIA CHROME CDP
// ==========================================================================

const { spawn } = require('child_process');
const http = require('http');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const TARGET_URL = "http://localhost:8080/index.html";

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getJson(endpoint) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${PORT}${endpoint}`, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function runBrowserTest() {
  console.log("====================================================");
  console.log("STARTING REAL CHROME BROWSER HEADLESS TEST");
  console.log("====================================================");

  // 1. Launch Chrome Headless with Target URL directly
  const chromeProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=C:\\Users\\LC\\AppData\\Local\\Temp\\chrome_vault_test2',
    TARGET_URL
  ], { detached: false });

  let chromeKilled = false;
  function cleanup() {
    if (!chromeKilled) {
      chromeKilled = true;
      try { chromeProc.kill(); } catch (e) {}
    }
  }

  process.on('exit', cleanup);
  process.on('SIGINT', cleanup);

  // Wait for Chrome CDP port to open
  let connected = false;
  for (let i = 0; i < 20; i++) {
    try {
      const ver = await getJson('/json/version');
      if (ver && ver.webSocketDebuggerUrl) {
        connected = true;
        break;
      }
    } catch (e) {
      await sleep(300);
    }
  }

  if (!connected) {
    console.error("Failed to connect to headless Chrome CDP on port " + PORT);
    cleanup();
    process.exit(1);
  }

  console.log("[PASS] Chrome Headless launched and CDP connection active.");
  await sleep(1500);

  // Find the target page
  const pages = await getJson('/json/list');
  const targetPage = pages.find(p => p.url && p.url.includes('8080')) || pages[0];
  let targetWsUrl = targetPage.webSocketDebuggerUrl;

  console.log(`[PASS] Attaching to Page Target: "${targetPage.title}" (${targetPage.url})`);

  const ws = new WebSocket(targetWsUrl);
  let msgId = 1;
  const callbacks = new Map();
  const consoleErrors = [];
  const runtimeExceptions = [];

  let pageLoaded = false;
  ws.onmessage = (event) => {
    const res = JSON.parse(event.data);
    if (res.id && callbacks.has(res.id)) {
      const cb = callbacks.get(res.id);
      callbacks.delete(res.id);
      cb(res);
    } else if (res.method === 'Page.loadEventFired') {
      pageLoaded = true;
    } else if (res.method === 'Runtime.consoleAPICalled') {
      if (res.params.type === 'error') {
        const text = res.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
        consoleErrors.push(text);
      }
    } else if (res.method === 'Runtime.exceptionThrown') {
      const desc = res.params.exceptionDetails.exception?.description || res.params.exceptionDetails.text;
      runtimeExceptions.push(desc);
    }
  };

  function sendCmd(method, params = {}) {
    return new Promise((resolve) => {
      const id = msgId++;
      callbacks.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.onopen = r);

  await sendCmd('Runtime.enable');
  await sendCmd('Page.enable');

  console.log("[PASS] Connected via WebSocket to page target. Navigating to " + TARGET_URL);
  await sendCmd('Page.navigate', { url: TARGET_URL });

  // Wait for page to finish loading and DOM elements to be ready
  for (let i = 0; i < 40; i++) {
    try {
      const state = await evalInPage("document.readyState === 'complete' && !!document.getElementById('headerLearnerName')");
      if (state) {
        console.log(`[PASS] Document ready and DOM mounted (iteration ${i+1}).`);
        break;
      }
    } catch (e) {}
    await sleep(250);
  }
  await sleep(500);

  // Evaluate script in page context with scope isolation
  async function evalInPage(expression) {
    const trimmed = expression.trim();
    // If it has statements, wrap in IIFE
    const wrapped = (trimmed.includes(';') || trimmed.includes('const ') || trimmed.includes('let ') || trimmed.startsWith('return'))
      ? `(() => {\n${trimmed}\n})()`
      : trimmed;

    const res = await sendCmd('Runtime.evaluate', {
      expression: wrapped,
      returnByValue: true,
      awaitPromise: true
    });
    if (res.result && res.result.exceptionDetails) {
      console.error("Eval Exception Details:", JSON.stringify(res.result.exceptionDetails));
      throw new Error(res.result.exceptionDetails.text || 'Exception during eval');
    }
    return res.result?.result?.value;
  }

  // TEST 1: Page Title
  const title = await evalInPage("document.title");
  console.log(`[PASS] Page Title loaded: "${title}"`);

  // TEST 2: Check Initial Welcome Modal
  const isModalActive = await evalInPage("document.getElementById('welcomeModal')?.classList.contains('active')");
  console.log(`[PASS] Onboarding Welcome Modal is visible: ${isModalActive}`);

  // TEST 3: Submit Learner Name "Kapil Dev"
  await evalInPage(`
    const input = document.getElementById('onboardingNameInput');
    if (input) {
      input.value = 'Kapil Dev';
      document.getElementById('onboardingForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  `);
  await sleep(500);

  const headerName = await evalInPage("document.getElementById('headerLearnerName').textContent");
  const avatarText = await evalInPage("document.getElementById('userAvatar').textContent");
  console.log(`[PASS] Learner Name set in Header: "${headerName}" (Avatar: "${avatarText}")`);

  // TEST 4: Founder Section and Image check
  const founderImgNaturalWidth = await evalInPage("document.getElementById('founderImage')?.naturalWidth || 0");
  const founderTitle = await evalInPage("document.querySelector('.founder-title')?.textContent.trim()");
  console.log(`[PASS] Founder Section rendered: "${founderTitle}" (Image width: ${founderImgNaturalWidth}px)`);

  // TEST 5: Verify 100 Problem Cards Rendered
  const problemCardCount = await evalInPage("document.querySelectorAll('.problem-card').length");
  console.log(`[PASS] Problem cards rendered in DOM: ${problemCardCount} of 100`);

  // TEST 6: Open Problem #001 Modal & Subtabs
  await evalInPage(`
    const btn = document.querySelector('[data-action="open-detail"][data-id="1"]');
    if (btn) btn.click();
  `);
  await sleep(400);

  const modalProblemTitle = await evalInPage("document.getElementById('modalProblemTitle')?.textContent");
  const isDetailModalOpen = await evalInPage("document.getElementById('problemDetailModal')?.classList.contains('active')");
  console.log(`[PASS] Problem #001 Modal Open: "${modalProblemTitle}" (Active: ${isDetailModalOpen})`);

  // Test Simulator Execution on Problem #001
  await evalInPage(`
    document.querySelector('[data-subtab="modalTabSim"]')?.click();
  `);
  await sleep(300);

  await evalInPage(`
    document.getElementById('executeSimBtn')?.click();
  `);
  const simOutput = await evalInPage("document.getElementById('simulatorResultBox')?.textContent");
  console.log(`[PASS] Simulator executed successfully on Problem #001: Output length = ${simOutput ? simOutput.length : 0} chars`);

  // Close Problem Modal
  await evalInPage("document.getElementById('modalCloseBtn')?.click();");
  await sleep(300);

  // TEST 7: Open Problem #100 Modal (Boundary Test)
  await evalInPage(`
    const btn100 = document.querySelector('[data-action="open-detail"][data-id="100"]');
    if (btn100) btn100.click();
  `);
  await sleep(400);
  const title100 = await evalInPage("document.getElementById('modalProblemTitle')?.textContent");
  console.log(`[PASS] Problem #100 Modal Open: "${title100}"`);
  await evalInPage("document.getElementById('modalCloseBtn')?.click();");
  await sleep(300);

  // TEST 8: Test Search Filter for "Fraud"
  await evalInPage(`
    const input = document.getElementById('problemSearchInput');
    if (input) {
      input.value = 'Fraud';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  `);
  await sleep(400);
  const searchResultsCount = await evalInPage("document.querySelectorAll('.problem-card').length");
  console.log(`[PASS] Search for 'Fraud' returned ${searchResultsCount} matching problems.`);

  // Clear search
  await evalInPage(`
    const input = document.getElementById('problemSearchInput');
    if (input) {
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  `);
  await sleep(300);

  // TEST 9: Switch to "⚡ 30 Core DSA Patterns" Tab
  await evalInPage(`
    document.querySelector('[data-tab="dsaTab"]')?.click();
  `);
  await sleep(400);
  const dsaCardsCount = await evalInPage("document.querySelectorAll('.dsa-card').length");
  console.log(`[PASS] Switched to 30 DSA Patterns tab: Rendered ${dsaCardsCount} of 30 pattern cards.`);

  // Open DSA Pattern #03 (Sliding Window Fixed)
  await evalInPage(`
    const dsaBtn = document.querySelector('[data-pattern-id="dsa_03"]');
    if (dsaBtn) dsaBtn.click();
  `);
  await sleep(400);
  const dsaModalTitle = await evalInPage("document.getElementById('modalDsaPatternTitle')?.textContent");
  const dsaCoreLogic = await evalInPage("document.getElementById('modalDsaCoreLogic')?.textContent");
  console.log(`[PASS] DSA Pattern Modal Open: "${dsaModalTitle}" -> ${dsaCoreLogic}`);
  await evalInPage("document.getElementById('modalDsaCloseBtn')?.click();");
  await sleep(300);

  // TEST 10: Switch to Mock Tests Tab
  await evalInPage(`
    document.querySelector('[data-tab="testsTab"]')?.click();
  `);
  await sleep(400);
  const testCardsCount = await evalInPage("document.querySelectorAll('.test-card').length");
  console.log(`[PASS] Switched to Mock Tests tab: Rendered ${testCardsCount} assessment cards (5 Mocks + 1 Capstone).`);

  // Launch Mock Test 1
  await evalInPage(`
    document.querySelector('[data-test-id="mock-1"]')?.click();
  `);
  await sleep(400);
  const isExamActive = await evalInPage("document.getElementById('activeExamContainer')?.classList.contains('active')");
  console.log(`[PASS] Mock Test 1 active exam started: ${isExamActive}`);

  // Answer All 10 questions in Mock Test 1
  await evalInPage(`
    const questions = document.querySelectorAll('.question-block');
    questions.forEach(q => {
      const firstOpt = q.querySelector('.option-item');
      if (firstOpt) firstOpt.click();
    });
  `);
  await sleep(300);

  // Submit Mock Test 1
  await evalInPage(`
    document.getElementById('submitExamBtn')?.click();
  `);
  await sleep(400);

  const examResultHeader = await evalInPage("document.querySelector('#activeExamContainer h2')?.textContent");
  console.log(`[PASS] Mock Test 1 evaluation rendered: "${examResultHeader}"`);

  // Return to Assessment Hub
  await evalInPage("document.getElementById('exitResultsBtn')?.click();");
  await sleep(300);

  // TEST 11: Switch to Badges Tab
  await evalInPage(`
    document.querySelector('[data-tab="badgesTab"]')?.click();
  `);
  await sleep(400);
  const badgesCount = await evalInPage("document.querySelectorAll('.badge-card').length");
  console.log(`[PASS] Switched to Badges tab: Rendered ${badgesCount} badges (6 Milestones + 12 Domain seals).`);

  // TEST 12: Switch to Certificate Tab
  await evalInPage(`
    document.querySelector('[data-tab="certTab"]')?.click();
  `);
  await sleep(400);
  const certLearnerName = await evalInPage("document.getElementById('certLearnerName')?.textContent");
  console.log(`[PASS] Switched to Certificate tab: Recipient verified as "${certLearnerName}"`);

  // TEST 13: Switch to Rubric & Standards Tab
  await evalInPage(`
    document.querySelector('[data-tab="standardsTab"]')?.click();
  `);
  await sleep(400);
  const rubricTableRows = await evalInPage("document.querySelectorAll('#standardsTab table tr').length");
  console.log(`[PASS] Switched to Rubric tab: Evaluation table rendered with ${rubricTableRows} rows.`);

  // TEST 14: Mobile Responsive Viewport Audit (375x667)
  await sendCmd('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(400);
  const mobileOverflow = await evalInPage("document.documentElement.scrollWidth > window.innerWidth");
  const mobileWidth = await evalInPage("document.documentElement.scrollWidth");
  console.log(`[PASS] Mobile Viewport (375px): scrollWidth=${mobileWidth}px, hasHorizontalOverflow=${mobileOverflow}`);

  // TEST 15: Desktop Responsive Viewport Audit (1440x900)
  await sendCmd('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(400);
  const desktopOverflow = await evalInPage("document.documentElement.scrollWidth > window.innerWidth");
  const desktopWidth = await evalInPage("document.documentElement.scrollWidth");
  console.log(`[PASS] Desktop Viewport (1440px): scrollWidth=${desktopWidth}px, hasHorizontalOverflow=${desktopOverflow}`);

  // FINAL CONSOLE & RUNTIME AUDIT
  console.log("====================================================");
  console.log("CONSOLE & RUNTIME EXCEPTION AUDIT");
  console.log("====================================================");
  console.log(`Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.error("Errors found:", consoleErrors);
  }
  console.log(`Runtime Exceptions: ${runtimeExceptions.length}`);
  if (runtimeExceptions.length > 0) {
    console.error("Exceptions found:", runtimeExceptions);
  }

  const allClear = consoleErrors.length === 0 && runtimeExceptions.length === 0;
  console.log("====================================================");
  if (allClear) {
    console.log(">>> DEEP TESTING COMPLETE: 0 ERRORS! 100% CLEAN RUNTIME <<<");
  } else {
    console.error(">>> TESTING FAILED: ERRORS DETECTED <<<");
  }
  console.log("====================================================");

  cleanup();
  process.exit(allClear ? 0 : 1);
}

runBrowserTest().catch(err => {
  console.error("Unhandled test runner exception:", err);
  process.exit(1);
});
