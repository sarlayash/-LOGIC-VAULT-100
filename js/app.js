// ==========================================================================
// KAPIL'S LOGIC-VAULT 100 - Core Application Engine
// Powered By Kapil • SarlaYash Learning Solutions LLP
// ==========================================================================

(() => {
  'use strict';

  // --- STATE MANAGEMENT ---
  const STORAGE_KEY = 'kapil_logic_vault_state_v1';

  let state = {
    learnerName: '',
    xp: 0,
    completedProblems: [],
    bookmarkedProblems: [],
    problemNotes: {},
    testScores: {},
    soundEnabled: true,
    verificationId: '',
    certIssueDate: ''
  };

  let activeDomainFilter = 'ALL';
  let activeStatusFilter = 'ALL';
  let searchQuery = '';
  let activeDsaCategory = 'ALL';
  let dsaSearchQuery = '';
  let currentProblem = null;
  let currentDsaPattern = null;
  let activeExam = null;
  let examAnswers = {};
  let examTimerInterval = null;
  let examSecondsRemaining = 0;

  // --- AUDIO SYNTHESIZER ENGINE (Web Audio API) ---
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },
    playTone(freq, type, duration, delay = 0, gainLevel = 0.1) {
      if (!state.soundEnabled) return;
      try {
        this.init();
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);
        gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration);
      } catch (e) {
        // Audio policy ignore
      }
    },
    chimeSuccess() {
      this.playTone(523.25, 'triangle', 0.15, 0, 0.12); // C5
      this.playTone(659.25, 'triangle', 0.18, 0.1, 0.12); // E5
      this.playTone(783.99, 'triangle', 0.25, 0.2, 0.15); // G5
      this.playTone(1046.50, 'sine', 0.45, 0.3, 0.18); // C6
    },
    fanfareVictory() {
      this.playTone(587.33, 'triangle', 0.2, 0, 0.15); // D5
      this.playTone(587.33, 'triangle', 0.2, 0.18, 0.15);
      this.playTone(587.33, 'triangle', 0.2, 0.36, 0.15);
      this.playTone(880.00, 'sine', 0.6, 0.54, 0.22); // A5
    },
    clickSoft() {
      this.playTone(800, 'sine', 0.05, 0, 0.04);
    }
  };

  // --- CONFETTI PARTICLE SYSTEM ---
  const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animId: null,
    init() {
      this.canvas = document.getElementById('confettiCanvas');
      if (this.canvas) {
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
      }
    },
    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    burst(count = 90) {
      this.init();
      const goldColors = ['#ffd700', '#dfb743', '#ffe882', '#d4af37', '#ffffff'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth / 2,
          y: window.innerHeight / 3,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.7) * 18,
          size: Math.random() * 8 + 4,
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 10,
          opacity: 1
        });
      }
      if (!this.animId) {
        this.animate();
      }
    },
    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.rotation += p.vRot;
        p.opacity -= 0.012;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        this.ctx.restore();

        if (p.opacity <= 0 || p.y > window.innerHeight) {
          this.particles.splice(i, 1);
        }
      }
      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(() => this.animate());
      } else {
        this.animId = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  };

  // --- PERSISTENCE ---
  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        state = Object.assign(state, JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
    updateAllUI();
  }

  // --- XP & TIERS ---
  const TIERS = [
    { level: 1, name: 'Logic Novice', minXP: 0 },
    { level: 2, name: 'Algorithm Apprentice', minXP: 300 },
    { level: 3, name: 'Logic Journeyman', minXP: 750 },
    { level: 4, name: 'Systems Analyst', minXP: 1400 },
    { level: 5, name: 'Edge-Case Hunter', minXP: 2200 },
    { level: 6, name: 'Pseudocode Virtuoso', minXP: 3200 },
    { level: 7, name: 'Senior Logic Architect', minXP: 4500 },
    { level: 8, name: 'Principal Systems Designer', minXP: 6000 },
    { level: 9, name: 'Master of Operational Logic', minXP: 7800 },
    { level: 10, name: 'Grandmaster of Systems', minXP: 9500 }
  ];

  function getCurrentTier(xp) {
    let tier = TIERS[0];
    for (const t of TIERS) {
      if (xp >= t.minXP) tier = t;
    }
    return tier;
  }

  function addXP(amount, reason = '') {
    const oldTier = getCurrentTier(state.xp);
    state.xp += amount;
    const newTier = getCurrentTier(state.xp);
    if (newTier.level > oldTier.level) {
      AudioEngine.fanfareVictory();
      Confetti.burst(120);
      showToast(`🎉 Level Up! You achieved ${newTier.name} (Level ${newTier.level})!`);
    } else {
      AudioEngine.chimeSuccess();
    }
    saveState();
  }

  // --- REAL-TIME LIVE CLOCK ---
  function startLiveClock() {
    const clockEl = document.getElementById('liveClockDisplay');
    function tick() {
      const now = new Date();
      const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      if (clockEl) {
        clockEl.textContent = now.toLocaleDateString('en-IN', options);
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(msg, duration = 3200) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed; bottom:24px; right:24px; z-index:99999; display:flex; flex-direction:column; gap:10px;';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.style.cssText = `
      background: #14141e;
      border: 1px solid var(--gold-primary);
      box-shadow: 0 4px 18px rgba(0,0,0,0.8), 0 0 12px rgba(212,175,55,0.3);
      color: #fff;
      padding: 12px 18px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: modalSlide 0.25s ease;
    `;
    toast.innerHTML = `<span>✨</span><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // --- DOMAIN PILLS & FILTER ---
  function renderDomainPills() {
    const scrollEl = document.getElementById('domainFilterScroll');
    if (!scrollEl || typeof DOMAINS_LIST === 'undefined') return;

    scrollEl.innerHTML = `
      <button class="domain-pill ${activeDomainFilter === 'ALL' ? 'active' : ''}" data-domain="ALL">
        🌟 All Domains (100)
      </button>
    `;

    DOMAINS_LIST.forEach(([domainName, dInfo]) => {
      const count = ALL_PROBLEMS.filter(p => p.domain === domainName).length;
      const btn = document.createElement('button');
      btn.className = `domain-pill ${activeDomainFilter === domainName ? 'active' : ''}`;
      btn.dataset.domain = domainName;
      btn.innerHTML = `${domainName} <span style="opacity:0.75; font-size:0.7rem;">(${count})</span>`;
      btn.addEventListener('click', () => {
        AudioEngine.clickSoft();
        activeDomainFilter = domainName;
        document.querySelectorAll('.domain-pill').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        renderProblemsGrid();
      });
      scrollEl.appendChild(btn);
    });

    scrollEl.querySelector('[data-domain="ALL"]').addEventListener('click', (e) => {
      AudioEngine.clickSoft();
      activeDomainFilter = 'ALL';
      document.querySelectorAll('.domain-pill').forEach(el => el.classList.remove('active'));
      e.currentTarget.classList.add('active');
      renderProblemsGrid();
    });
  }

  // --- PROBLEMS GRID RENDERING ---
  function renderProblemsGrid() {
    const container = document.getElementById('problemsContainer');
    if (!container || typeof ALL_PROBLEMS === 'undefined') return;

    let filtered = ALL_PROBLEMS.filter(p => {
      // Domain filter
      if (activeDomainFilter !== 'ALL' && p.domain !== activeDomainFilter) return false;

      // Status filter
      const isDone = state.completedProblems.includes(p.id);
      const isStar = state.bookmarkedProblems.includes(p.id);
      if (activeStatusFilter === 'COMPLETED' && !isDone) return false;
      if (activeStatusFilter === 'INCOMPLETE' && isDone) return false;
      if (activeStatusFilter === 'BOOKMARKED' && !isStar) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchCode = p.code.toLowerCase().includes(q) || `#${p.code}`.includes(q);
        const matchDomain = p.domain.toLowerCase().includes(q);
        const matchStatement = p.problemStatement.toLowerCase().includes(q);
        const matchConstraint = p.realWorldConstraint.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchDomain && !matchStatement && !matchConstraint) {
          return false;
        }
      }

      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; background:var(--bg-card); border-radius:var(--radius-md); border:1px dashed var(--gold-border);">
          <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
          <h3 style="color:#fff; margin-bottom:6px;">No Problem Statements Match Your Filters</h3>
          <p style="color:var(--text-muted); font-size:0.85rem;">Try clearing your search keyword or switching domain categories.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    filtered.forEach(p => {
      const isCompleted = state.completedProblems.includes(p.id);
      const isBookmarked = state.bookmarkedProblems.includes(p.id);

      const card = document.createElement('div');
      card.className = `problem-card ${isCompleted ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="problem-card-header">
          <span class="problem-num">#${p.code}</span>
          <span class="problem-domain-tag" title="${p.domain}">${p.domain}</span>
        </div>
        <h3 class="problem-title">${p.title}</h3>
        <p class="problem-snippet">${p.problemStatement}</p>
        <div class="problem-constraint-box">
          <strong>Constraint:</strong> ${p.realWorldConstraint}
        </div>
        <div class="problem-card-footer">
          <button class="btn-pill btn-gold" data-action="open-detail" data-id="${p.id}">
            ⚡ Open Solution & Logic
          </button>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn-icon" data-action="toggle-star" data-id="${p.id}" style="width:32px; height:32px;" title="Bookmark">
              ${isBookmarked ? '⭐' : '☆'}
            </button>
            <span style="font-size:0.78rem; font-weight:700; color:${isCompleted ? '#10b981' : '#6b7280'};">
              ${isCompleted ? '✔ Done' : 'Pending'}
            </span>
          </div>
        </div>
      `;

      // Event listeners
      card.querySelector('[data-action="open-detail"]').addEventListener('click', (e) => {
        e.stopPropagation();
        openProblemModal(p.id);
      });

      card.querySelector('[data-action="toggle-star"]').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(p.id);
      });

      card.addEventListener('click', () => {
        openProblemModal(p.id);
      });

      container.appendChild(card);
    });
  }

  // --- PROBLEM DETAIL MODAL ---
  function openProblemModal(problemId) {
    const p = ALL_PROBLEMS.find(item => item.id === problemId);
    if (!p) return;
    currentProblem = p;
    AudioEngine.clickSoft();

    // Populate Overview
    document.getElementById('modalProblemCode').textContent = `#${p.code}`;
    document.getElementById('modalDomainBadge').textContent = p.domain;
    document.getElementById('modalProblemTitle').textContent = p.title;
    document.getElementById('modalStatementText').textContent = p.problemStatement;
    document.getElementById('modalConstraintText').textContent = p.realWorldConstraint;
    document.getElementById('modalUnderstandingText').textContent = p.understanding;

    // Rules
    const rulesList = document.getElementById('modalRulesList');
    rulesList.innerHTML = p.assumptionsAndRules.map(r => `<li>${r}</li>`).join('');

    // IO Table
    const ioBody = document.getElementById('modalIOTableBody');
    ioBody.innerHTML = p.inputOutputDesign.inputs.map(inp => `
      <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
        <td style="padding:8px; font-family:monospace; color:var(--gold-primary); font-weight:700;">${inp.field}</td>
        <td style="padding:8px; color:var(--text-muted);">${inp.type}</td>
        <td style="padding:8px; color:#fff;">${inp.range}</td>
        <td style="padding:8px; color:#f87171;">${inp.missing_strategy}</td>
      </tr>
    `).join('');

    // Algorithm Steps
    const algoList = document.getElementById('modalAlgoStepsList');
    algoList.innerHTML = p.algorithmSteps.map(step => `<li>${step}</li>`).join('');

    // Pseudocode
    document.getElementById('modalPseudocodeText').textContent = p.pseudocode;

    // Edge cases
    const edgeContainer = document.getElementById('modalEdgeCasesContainer');
    edgeContainer.innerHTML = p.edgeCases.map((ec, idx) => `
      <div style="background:#171723; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:12px 14px;">
        <div style="font-weight:700; color:var(--warning); font-size:0.86rem; margin-bottom:4px;">
          Case ${idx + 1}: ${ec.case}
        </div>
        <div style="font-size:0.82rem; color:var(--text-muted);">
          <strong>Mitigation:</strong> ${ec.handling}
        </div>
      </div>
    `).join('');

    // Test cases
    const testContainer = document.getElementById('modalTestCasesContainer');
    testContainer.innerHTML = p.testCases.map((tc) => `
      <div style="background:#171723; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:12px 14px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:700; color:var(--gold-primary); font-size:0.84rem;">${tc.test_id}: ${tc.name}</span>
          <span class="gold-badge" style="font-size:0.68rem;">Expected: ${tc.expected_output}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">
          <strong>Inputs:</strong> <span style="font-family:monospace;">${JSON.stringify(tc.inputs)}</span>
        </div>
        <div style="font-size:0.78rem; color:#a0a0b2;">
          <strong>Reason:</strong> ${tc.reason}
        </div>
      </div>
    `).join('');

    // Simulator inputs setup
    setupSimulator(p);

    // Scratchpad notes
    const scratchArea = document.getElementById('modalScratchpadArea');
    scratchArea.value = state.problemNotes[p.id] || '';

    // Action buttons
    updateModalActionButtons(p.id);

    // Open Modal
    document.getElementById('problemDetailModal').classList.add('active');
  }

  function updateModalActionButtons(problemId) {
    const isCompleted = state.completedProblems.includes(problemId);
    const isBookmarked = state.bookmarkedProblems.includes(problemId);

    const completeBtn = document.getElementById('modalCompleteToggleBtn');
    if (isCompleted) {
      completeBtn.innerHTML = '✔ Mastered (+50 XP Earned)';
      completeBtn.style.background = '#10b981';
      completeBtn.style.color = '#fff';
    } else {
      completeBtn.innerHTML = '✔ Mark as Mastered (+50 XP)';
      completeBtn.style.background = 'var(--gold-gradient)';
      completeBtn.style.color = '#0d0d12';
    }

    const bookmarkBtn = document.getElementById('modalBookmarkToggleBtn');
    bookmarkBtn.innerHTML = isBookmarked ? '⭐ Remove Bookmark' : '☆ Bookmark Problem';
  }

  function setupSimulator(problem) {
    const grid = document.getElementById('simulatorInputsGrid');
    const resultBox = document.getElementById('simulatorResultBox');
    resultBox.textContent = 'Standby. Click "Execute Decision Logic" to run simulation.';

    grid.innerHTML = problem.inputOutputDesign.inputs.map((inp, idx) => `
      <div class="sim-input-group">
        <label>${inp.field}:</label>
        <input type="text" id="sim_field_${idx}" class="sim-input" value="${idx === 0 ? '100' : 'Safe'}" placeholder="Enter value...">
      </div>
    `).join('');

    document.getElementById('runSimulatorPresetBtn').onclick = () => {
      AudioEngine.clickSoft();
      problem.inputOutputDesign.inputs.forEach((inp, idx) => {
        const inputEl = document.getElementById(`sim_field_${idx}`);
        if (inputEl) {
          inputEl.value = (idx === 0) ? '1250' : 'High Variance / Anomaly';
        }
      });
      resultBox.textContent = 'Sample input preset loaded. Click "Execute Decision Logic" below.';
    };

    document.getElementById('executeSimBtn').onclick = () => {
      AudioEngine.clickSoft();
      const collected = {};
      let hasMissing = false;
      problem.inputOutputDesign.inputs.forEach((inp, idx) => {
        const el = document.getElementById(`sim_field_${idx}`);
        const val = el ? el.value.trim() : '';
        collected[inp.field] = val;
        if (val === '') hasMissing = true;
      });

      if (hasMissing) {
        resultBox.style.color = '#f87171';
        resultBox.textContent = `[EVALUATION ENGINE OUTPUT]\nStatus: REVIEW_REQUIRED\nReason: Enforcing Rule - "${problem.realWorldConstraint}"\nAudit: Missing parameter detected. Failsafe activated.`;
        return;
      }

      // Simple deterministic evaluation simulation
      resultBox.style.color = '#4ade80';
      resultBox.textContent = `[EVALUATION ENGINE OUTPUT - ${new Date().toISOString()}]
Function: evaluate_${problem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}()
Parameters: ${JSON.stringify(collected, null, 2)}
Constraint Validation: PASSED ("${problem.realWorldConstraint}")
Calculated Score: Nominal Risk (Score: 18/100)
Routing Decision: ${problem.inputOutputDesign.outputs.primary_states[0]}
Audit Trail: Telemetry verified within calibrated bounds. Log dispatch completed.`;
    };
  }

  function toggleComplete(problemId) {
    const idx = state.completedProblems.indexOf(problemId);
    if (idx === -1) {
      state.completedProblems.push(problemId);
      addXP(50);
      showToast(`⭐ Problem #${problemId} marked as Mastered! (+50 XP)`);
    } else {
      state.completedProblems.splice(idx, 1);
      state.xp = Math.max(0, state.xp - 50);
      saveState();
      showToast(`Problem #${problemId} unmarked.`);
    }
    updateModalActionButtons(problemId);
    renderProblemsGrid();
  }

  function toggleBookmark(problemId) {
    const idx = state.bookmarkedProblems.indexOf(problemId);
    if (idx === -1) {
      state.bookmarkedProblems.push(problemId);
      showToast(`Problem #${problemId} bookmarked ⭐`);
    } else {
      state.bookmarkedProblems.splice(idx, 1);
      showToast(`Bookmark removed for #${problemId}`);
    }
    saveState();
    updateModalActionButtons(problemId);
    renderProblemsGrid();
  }

  // --- 30 CORE DSA PATTERNS SECTION ---
  function renderDsaPatterns() {
    const container = document.getElementById('dsaPatternsContainer');
    if (!container || typeof DSA_PATTERNS === 'undefined') return;

    let filtered = DSA_PATTERNS.filter(pattern => {
      if (activeDsaCategory !== 'ALL' && pattern.category !== activeDsaCategory) {
        return false;
      }
      if (dsaSearchQuery.trim() !== '') {
        const q = dsaSearchQuery.toLowerCase();
        const matchName = pattern.name.toLowerCase().includes(q);
        const matchCore = pattern.coreLogic.toLowerCase().includes(q);
        const matchCat = pattern.category.toLowerCase().includes(q);
        if (!matchName && !matchCore && !matchCat) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; background:var(--bg-card); border-radius:var(--radius-md); border:1px dashed var(--gold-border);">
          <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
          <h3 style="color:#fff; margin-bottom:6px;">No DSA Patterns Found</h3>
          <p style="color:var(--text-muted); font-size:0.85rem;">Try modifying your keyword search or category filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'dsa-card';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <span class="gold-badge" style="font-size:0.68rem;">${p.category}</span>
          <span class="problem-num" style="font-size:0.75rem;">${p.timeComplexity}</span>
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; color:#fff; margin-bottom:4px;">${p.name}</h3>
        <div class="dsa-core-logic-box">
          <span class="dsa-core-logic-label">Core Logic / Algorithm</span>
          <span class="dsa-core-logic-text">"${p.coreLogic}"</span>
        </div>
        <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.45; margin-bottom:12px; flex:1;">
          ${p.whenToUse}
        </p>
        <div style="margin-bottom:14px;">
          <div style="font-size:0.72rem; color:var(--gold-primary); font-weight:700; text-transform:uppercase; margin-bottom:4px;">
            Industry Problem Linkage:
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px;">
            ${p.industryMapping.map(m => `<span class="dsa-tag-pill" style="color:#f5f5f7; border-color:rgba(212,175,55,0.25);">${m}</span>`).join('')}
          </div>
        </div>
        <button class="btn-pill btn-gold" data-pattern-id="${p.id}" style="width:100%; justify-content:center;">
          ⚡ View Template & Logic
        </button>
      `;

      card.querySelector(`[data-pattern-id="${p.id}"]`).addEventListener('click', (e) => {
        e.stopPropagation();
        openDsaPatternModal(p.id);
      });

      card.addEventListener('click', () => {
        openDsaPatternModal(p.id);
      });

      container.appendChild(card);
    });
  }

  function openDsaPatternModal(patternId) {
    const p = DSA_PATTERNS.find(item => item.id === patternId);
    if (!p) return;
    currentDsaPattern = p;
    AudioEngine.clickSoft();

    document.getElementById('modalDsaCategoryBadge').textContent = p.category;
    document.getElementById('modalDsaTimeComp').textContent = `Time: ${p.timeComplexity}`;
    document.getElementById('modalDsaSpaceComp').textContent = `Space: ${p.spaceComplexity}`;
    document.getElementById('modalDsaPatternTitle').textContent = p.name;
    document.getElementById('modalDsaCoreLogic').textContent = `"${p.coreLogic}"`;
    document.getElementById('modalDsaWhenToUse').textContent = p.whenToUse;
    document.getElementById('modalDsaTemplateText').textContent = p.template;

    const classicalList = document.getElementById('modalDsaClassicalList');
    classicalList.innerHTML = p.classicalProblems.map(cp => `
      <span class="gold-badge" style="font-size:0.75rem; text-transform:none;">${cp}</span>
    `).join('');

    const industryList = document.getElementById('modalDsaIndustryList');
    industryList.innerHTML = p.industryMapping.map(ip => `
      <span class="btn-pill btn-outline-gold" style="font-size:0.76rem; cursor:pointer;" data-industry-ref="${ip}">
        🏢 ${ip}
      </span>
    `).join('');

    // Click on mapped industry problem jumps directly to that problem in the vault!
    industryList.querySelectorAll('[data-industry-ref]').forEach(tag => {
      tag.addEventListener('click', () => {
        const ref = tag.dataset.industryRef;
        const match = ref.match(/#(\d+)/);
        if (match) {
          const probId = parseInt(match[1], 10);
          document.getElementById('dsaPatternModal').classList.remove('active');
          switchTab('problemsTab');
          setTimeout(() => {
            openProblemModal(probId);
          }, 200);
        }
      });
    });

    document.getElementById('dsaPatternModal').classList.add('active');
  }

  // --- MOCK TESTS & FINAL ASSESSMENT ARENA ---
  function renderTestsSection() {
    const container = document.getElementById('testsGridContainer');
    if (!container || typeof ALL_MOCK_TESTS === 'undefined') return;

    container.innerHTML = '';

    // Render Grand Final Assessment Card first as banner
    if (typeof GRAND_FINAL_ASSESSMENT !== 'undefined') {
      const finalCard = document.createElement('div');
      finalCard.className = 'test-card final-assessment-card';
      const finalScoreObj = state.testScores[GRAND_FINAL_ASSESSMENT.id];
      const isPassed = finalScoreObj && finalScoreObj.score >= GRAND_FINAL_ASSESSMENT.passScorePct;

      finalCard.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <span class="gold-badge">CAPSTONE CERTIFICATION EXAM</span>
          <span style="font-weight:800; font-size:0.82rem; color:${isPassed ? '#10b981' : 'var(--gold-primary)'};">
            ${isPassed ? `🏆 PASSED (${finalScoreObj.score}%)` : 'Passing Target: 75%'}
          </span>
        </div>
        <h3 style="font-size:1.3rem; margin-bottom:8px; color:#fff;">${GRAND_FINAL_ASSESSMENT.title}</h3>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-bottom:18px;">
          ${GRAND_FINAL_ASSESSMENT.description}
        </p>
        <div style="display:flex; gap:16px; margin-bottom:20px; font-size:0.82rem; color:#ccc;">
          <span>⏱️ Duration: 30 Mins</span>
          <span>📋 20 Comprehensive Questions</span>
          <span>🎯 Reward: +500 XP & Gold Certificate</span>
        </div>
        <div>
          <button class="btn-pill btn-gold" id="startFinalExamBtn" style="padding:10px 24px; font-size:0.9rem;">
            ${isPassed ? '🔄 Retake Final Assessment' : '⚡ Launch Grand Final Assessment'}
          </button>
        </div>
      `;
      finalCard.querySelector('#startFinalExamBtn').addEventListener('click', () => {
        startExam(GRAND_FINAL_ASSESSMENT);
      });
      container.appendChild(finalCard);
    }

    // Render 5 Mock Tests
    ALL_MOCK_TESTS.forEach(test => {
      const card = document.createElement('div');
      card.className = 'test-card';
      const scoreObj = state.testScores[test.id];
      const isDone = Boolean(scoreObj);

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          <span class="gold-badge" style="font-size:0.68rem;">MOCK TEST</span>
          <span style="font-size:0.78rem; font-weight:700; color:${isDone ? (scoreObj.score >= test.passScorePct ? '#10b981' : '#f59e0b') : 'var(--text-dim)'};">
            ${isDone ? `Score: ${scoreObj.score}%` : 'Not Attempted'}
          </span>
        </div>
        <h3 style="font-size:1.1rem; margin-bottom:8px; color:#fff;">${test.title}</h3>
        <p style="color:var(--text-muted); font-size:0.82rem; margin-bottom:14px; flex:1;">
          ${test.description}
        </p>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#aaa; margin-bottom:16px;">
          <span>⏱️ ${test.durationMinutes} Mins</span>
          <span>📋 ${test.questions.length} Questions</span>
          <span>🎯 Pass: ${test.passScorePct}%</span>
        </div>
        <button class="btn-pill btn-gold" data-test-id="${test.id}">
          ${isDone ? '🔄 Retake Test' : '▶ Begin Test'}
        </button>
      `;

      card.querySelector(`[data-test-id="${test.id}"]`).addEventListener('click', () => {
        startExam(test);
      });

      container.appendChild(card);
    });
  }

  function startExam(test) {
    activeExam = test;
    examAnswers = {};
    examSecondsRemaining = test.durationMinutes * 60;
    AudioEngine.clickSoft();

    const activeContainer = document.getElementById('activeExamContainer');
    const gridContainer = document.getElementById('testsGridContainer');
    gridContainer.style.display = 'none';
    activeContainer.classList.add('active');

    renderExamQuestions();

    // Timer Interval
    clearInterval(examTimerInterval);
    examTimerInterval = setInterval(() => {
      examSecondsRemaining--;
      updateExamTimerDisplay();
      if (examSecondsRemaining <= 0) {
        clearInterval(examTimerInterval);
        submitExam();
      }
    }, 1000);
  }

  function updateExamTimerDisplay() {
    const timerEl = document.getElementById('examCountdownTimer');
    if (timerEl) {
      const m = Math.floor(examSecondsRemaining / 60);
      const s = examSecondsRemaining % 60;
      timerEl.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      if (examSecondsRemaining < 180) {
        timerEl.style.color = '#ef4444';
      }
    }
  }

  function renderExamQuestions() {
    const activeContainer = document.getElementById('activeExamContainer');
    activeContainer.innerHTML = `
      <div style="background:var(--bg-card); border:1.5px solid var(--gold-border); border-radius:var(--radius-lg); padding:28px; margin-bottom:30px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:14px; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="gold-badge" style="margin-bottom:6px;">LIVE EXAMINATION</span>
            <h2 style="color:#fff; font-size:1.3rem;">${activeExam.title}</h2>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="background:#09090f; border:1px solid var(--gold-border); padding:8px 16px; border-radius:var(--radius-full); font-family:monospace; font-size:1.1rem; color:var(--gold-primary);" id="examCountdownTimer">
              --:--
            </div>
            <button id="cancelExamBtn" class="btn-pill btn-outline-gold" style="font-size:0.75rem;">
              Cancel & Exit
            </button>
          </div>
        </div>

        <div id="examQuestionsList" style="display:flex; flex-direction:column; gap:20px;">
          ${activeExam.questions.map((q, idx) => `
            <div class="question-block" id="qb_${q.id}">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="gold-badge" style="font-size:0.65rem;">QUESTION ${idx + 1} OF ${activeExam.questions.length}</span>
                ${q.domain ? `<span style="font-size:0.7rem; color:var(--text-muted);">${q.domain}</span>` : ''}
              </div>
              <div class="question-text">${q.question}</div>
              <div class="options-list">
                ${q.options.map((opt, optIdx) => `
                  <label class="option-item" data-qid="${q.id}" data-opt="${optIdx}">
                    <input type="radio" name="q_${q.id}" value="${optIdx}">
                    <span>${opt}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:30px; text-align:center; padding-top:20px; border-top:1px solid var(--border-subtle);">
          <button id="submitExamBtn" class="btn-pill btn-gold" style="padding:14px 40px; font-size:1rem;">
            🏁 Submit Assessment for Evaluation
          </button>
        </div>
      </div>
    `;

    updateExamTimerDisplay();

    // Option selection
    activeContainer.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const qid = item.dataset.qid;
        const opt = parseInt(item.dataset.opt, 10);
        examAnswers[qid] = opt;
        const radio = item.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        activeContainer.querySelectorAll(`[data-qid="${qid}"]`).forEach(el => el.classList.remove('selected'));
        item.classList.add('selected');
        AudioEngine.clickSoft();
      });
    });

    // Exit Exam
    document.getElementById('cancelExamBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to exit? Your exam progress will not be saved.')) {
        clearInterval(examTimerInterval);
        activeContainer.classList.remove('active');
        document.getElementById('testsGridContainer').style.display = 'grid';
      }
    });

    // Submit Exam
    document.getElementById('submitExamBtn').addEventListener('click', () => {
      const answeredCount = Object.keys(examAnswers).length;
      if (answeredCount < activeExam.questions.length) {
        if (!confirm(`You have only answered ${answeredCount} of ${activeExam.questions.length} questions. Do you still want to submit?`)) {
          return;
        }
      }
      clearInterval(examTimerInterval);
      submitExam();
    });
  }

  function submitExam() {
    let correctCount = 0;
    activeExam.questions.forEach(q => {
      if (examAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const pct = Math.round((correctCount / activeExam.questions.length) * 100);
    const passed = pct >= activeExam.passScorePct;

    // Save test score
    state.testScores[activeExam.id] = {
      score: pct,
      passed: passed,
      correct: correctCount,
      total: activeExam.questions.length,
      date: new Date().toLocaleDateString('en-IN')
    };

    // Award XP
    if (passed) {
      const award = (activeExam.id === 'final-assessment') ? 500 : 100;
      addXP(award);
      Confetti.burst(150);
      AudioEngine.fanfareVictory();
    }

    // Check certificate eligibility
    checkCertificateStatus();
    saveState();

    // Render results view
    renderExamResults(correctCount, pct, passed);
  }

  function renderExamResults(correct, pct, passed) {
    const activeContainer = document.getElementById('activeExamContainer');
    activeContainer.innerHTML = `
      <div style="background:var(--bg-card); border:2px solid ${passed ? 'var(--gold-primary)' : 'var(--danger)'}; border-radius:var(--radius-lg); padding:32px; margin-bottom:30px;">
        <div style="text-align:center; margin-bottom:24px;">
          <div style="font-size:3rem; margin-bottom:8px;">${passed ? '🏆' : '⚠️'}</div>
          <h2 style="color:#fff; font-size:1.6rem; margin-bottom:6px;">
            ${passed ? 'Assessment Passed Successfully!' : 'Assessment Not Cleared'}
          </h2>
          <p style="color:var(--text-muted); font-size:0.9rem;">
            You scored <strong>${pct}%</strong> (${correct} of ${activeExam.questions.length} correct). Passing threshold: <strong>${activeExam.passScorePct}%</strong>.
          </p>
          ${passed && activeExam.id === 'final-assessment' ? `
            <div class="gold-badge" style="margin-top:14px; font-size:0.85rem; padding:8px 18px;">
              🎖️ GOLD CERTIFIED INDUSTRY MASTER CREDENTIAL UNLOCKED!
            </div>
          ` : ''}
        </div>

        <h3 style="color:var(--gold-primary); margin-bottom:14px; font-size:1.1rem;">Detailed Question Explanations & Review</h3>
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${activeExam.questions.map((q, idx) => {
            const userChoice = examAnswers[q.id];
            const isCorrect = userChoice === q.correctIndex;
            return `
              <div style="background:#141420; border-left:4px solid ${isCorrect ? '#10b981' : '#ef4444'}; border-radius:var(--radius-sm); padding:16px;">
                <div style="font-weight:700; color:#fff; font-size:0.92rem; margin-bottom:8px;">
                  Q${idx + 1}: ${q.question}
                </div>
                <div style="font-size:0.82rem; margin-bottom:4px;">
                  <strong>Your Answer:</strong> 
                  <span style="color:${isCorrect ? '#10b981' : '#ef4444'}; font-weight:600;">
                    ${userChoice !== undefined ? q.options[userChoice] : 'Unanswered'}
                  </span>
                </div>
                ${!isCorrect ? `
                  <div style="font-size:0.82rem; color:#4ade80; margin-bottom:6px;">
                    <strong>Correct Answer:</strong> ${q.options[q.correctIndex]}
                  </div>
                ` : ''}
                <div style="font-size:0.78rem; color:#aaa; margin-top:6px; background:#0a0a10; padding:8px 12px; border-radius:4px;">
                  💡 <strong>Rationale:</strong> ${q.explanation}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="margin-top:28px; text-align:center; display:flex; justify-content:center; gap:14px;">
          <button id="exitResultsBtn" class="btn-pill btn-gold" style="padding:10px 28px;">
            Return to Assessment Hub
          </button>
          ${passed && activeExam.id === 'final-assessment' ? `
            <button id="viewCertBtn" class="btn-pill btn-outline-gold" style="padding:10px 28px;">
              📜 View Your Gold Certificate
            </button>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('exitResultsBtn').addEventListener('click', () => {
      activeContainer.classList.remove('active');
      renderTestsSection();
      document.getElementById('testsGridContainer').style.display = 'grid';
    });

    const viewCertBtn = document.getElementById('viewCertBtn');
    if (viewCertBtn) {
      viewCertBtn.addEventListener('click', () => {
        switchTab('certTab');
      });
    }
  }

  // --- BADGES & MASTERY ---
  const SPECIAL_BADGES = [
    {
      id: 'b_first',
      title: 'First Step',
      icon: '🚀',
      desc: 'Master your first industry problem statement.',
      check: () => state.completedProblems.length >= 1
    },
    {
      id: 'b_decathlon',
      title: 'Logic Decathlon',
      icon: '🎯',
      desc: 'Master 10 real industry problem statements.',
      check: () => state.completedProblems.length >= 10
    },
    {
      id: 'b_fifty',
      title: 'Half-Century Architect',
      icon: '⚡',
      desc: 'Master 50 industry problem statements.',
      check: () => state.completedProblems.length >= 50
    },
    {
      id: 'b_centurion',
      title: 'Centurion Grandmaster',
      icon: '👑',
      desc: 'Master all 100 industry problem statements!',
      check: () => state.completedProblems.length >= 100
    },
    {
      id: 'b_mock_prodigy',
      title: 'Mock Test Prodigy',
      icon: '🧠',
      desc: 'Pass all 5 domain-specific mock tests.',
      check: () => {
        if (!ALL_MOCK_TESTS) return false;
        return ALL_MOCK_TESTS.every(t => state.testScores[t.id] && state.testScores[t.id].passed);
      }
    },
    {
      id: 'b_certified_master',
      title: "Kapil's Certified Master",
      icon: '🏆',
      desc: 'Achieve 75%+ on the Grand Final Assessment.',
      check: () => {
        return state.testScores['final-assessment'] && state.testScores['final-assessment'].passed;
      }
    }
  ];

  function renderBadgesSection() {
    const specialGrid = document.getElementById('specialBadgesGrid');
    const domainGrid = document.getElementById('domainBadgesGrid');
    if (!specialGrid || !domainGrid) return;

    // Special badges
    specialGrid.innerHTML = SPECIAL_BADGES.map(b => {
      const unlocked = b.check();
      return `
        <div class="badge-card ${unlocked ? 'unlocked' : ''}">
          <div class="badge-icon-box">${b.icon}</div>
          <div>
            <div style="font-weight:700; color:${unlocked ? '#ffd700' : '#888'}; font-size:0.95rem;">${b.title}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${b.desc}</div>
            <div style="font-size:0.68rem; font-weight:700; color:${unlocked ? '#10b981' : '#6b7280'}; margin-top:4px;">
              ${unlocked ? '✔ UNLOCKED' : '🔒 LOCKED'}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 12 Domain Badges
    if (typeof DOMAINS_LIST !== 'undefined') {
      domainGrid.innerHTML = DOMAINS_LIST.map(([domainName, dInfo]) => {
        const domainProbs = ALL_PROBLEMS.filter(p => p.domain === domainName);
        const solvedInDomain = domainProbs.filter(p => state.completedProblems.includes(p.id)).length;
        const unlocked = solvedInDomain >= Math.ceil(domainProbs.length * 0.5);

        return `
          <div class="badge-card ${unlocked ? 'unlocked' : ''}">
            <div class="badge-icon-box" style="font-size:1.1rem; font-weight:800;">
              ${dInfo.id}
            </div>
            <div>
              <div style="font-weight:700; color:${unlocked ? '#ffd700' : '#888'}; font-size:0.88rem;">${domainName}</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Mastery: ${solvedInDomain} / ${domainProbs.length} solved</div>
              <div style="font-size:0.68rem; font-weight:700; color:${unlocked ? '#10b981' : '#6b7280'}; margin-top:4px;">
                ${unlocked ? '✔ DOMAIN BADGE EARNED' : `🔒 Need ${Math.ceil(domainProbs.length * 0.5) - solvedInDomain} more`}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Update Header badges count
    let count = SPECIAL_BADGES.filter(b => b.check()).length;
    DOMAINS_LIST.forEach(([domainName]) => {
      const domainProbs = ALL_PROBLEMS.filter(p => p.domain === domainName);
      const solvedInDomain = domainProbs.filter(p => state.completedProblems.includes(p.id)).length;
      if (solvedInDomain >= Math.ceil(domainProbs.length * 0.5)) count++;
    });
    document.getElementById('badgeUnlockedCount').textContent = `${count} / 18`;
    document.getElementById('tabBadgesCount').textContent = `${count}/18`;
    const sideBadgeCount = document.getElementById('sideTabBadgesCount');
    if (sideBadgeCount) sideBadgeCount.textContent = `${count}/18`;
  }

  // --- CERTIFICATE CHECK & DISPLAY ---
  function checkCertificateStatus() {
    const finalPassed = state.testScores['final-assessment'] && state.testScores['final-assessment'].passed;
    const enoughProblems = state.completedProblems.length >= 80;

    if ((finalPassed || enoughProblems) && !state.verificationId) {
      const randHex = Math.random().toString(36).substring(2, 7).toUpperCase();
      state.verificationId = `KLV-2026-${randHex}`;
      state.certIssueDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
      });
      saveState();
    }
  }

  function renderCertificate() {
    const isUnlocked = Boolean(state.verificationId);
    const tabBadge = document.getElementById('tabCertBadge');
    if (tabBadge) {
      tabBadge.textContent = isUnlocked ? 'Unlocked ✔' : 'Locked';
      tabBadge.style.color = isUnlocked ? '#10b981' : '#ffd700';
    }
    const sideCertBadge = document.getElementById('sideTabCertBadge');
    if (sideCertBadge) {
      sideCertBadge.textContent = isUnlocked ? 'Issued 📜' : 'Locked';
    }

    const learnerEl = document.getElementById('certLearnerName');
    if (learnerEl) learnerEl.textContent = state.learnerName || 'Distinguished Learner';

    const idEl = document.getElementById('certVerificationId');
    if (idEl) idEl.textContent = isUnlocked ? state.verificationId : 'LOCKED (Complete Final Exam or 80 Problems)';

    const dateEl = document.getElementById('certIssueDate');
    if (dateEl) dateEl.textContent = state.certIssueDate || '--';

    const printBtn = document.getElementById('printCertBtn');
    if (printBtn) {
      printBtn.onclick = () => {
        if (!isUnlocked) {
          showToast('⚠️ Please pass the Grand Final Assessment (75%+) or complete 80 problems to unlock certificate download.');
          return;
        }
        window.print();
      };
    }

    const shareBtn = document.getElementById('shareCertBtn');
    if (shareBtn) {
      shareBtn.onclick = () => {
        if (!isUnlocked) {
          showToast('Certificate not unlocked yet.');
          return;
        }
        navigator.clipboard.writeText(`https://sarlayash.org/verify?id=${state.verificationId}`).then(() => {
          showToast('📋 Credential verification link copied to clipboard!');
        });
      };
    }
  }

  // --- ALL UI UPDATE HELPER ---
  function updateAllUI() {
    // Header user info
    const nameEl = document.getElementById('headerLearnerName');
    if (nameEl) nameEl.textContent = state.learnerName || 'Learner';

    const avatarEl = document.getElementById('userAvatar');
    if (avatarEl) {
      avatarEl.textContent = (state.learnerName && state.learnerName.trim().length > 0)
        ? state.learnerName.trim()[0].toUpperCase()
        : 'K';
    }

    const currentTier = getCurrentTier(state.xp);
    const tierEl = document.getElementById('headerUserLevel');
    if (tierEl) tierEl.textContent = `${currentTier.name} • ${state.xp} XP`;

    // Hero metrics
    const masteredEl = document.getElementById('statsMasteredCount');
    if (masteredEl) masteredEl.textContent = state.completedProblems.length;

    const xpEl = document.getElementById('statsXpPoints');
    if (xpEl) xpEl.textContent = state.xp;

    const badgeXp = document.getElementById('badgeCurrentXP');
    if (badgeXp) badgeXp.textContent = state.xp;

    const badgeTier = document.getElementById('badgeTierName');
    if (badgeTier) badgeTier.textContent = `${currentTier.name} (Lvl ${currentTier.level})`;

    // Progress bar
    const pct = Math.round((state.completedProblems.length / 100) * 100);
    const barEl = document.getElementById('overallProgressBar');
    if (barEl) barEl.style.width = `${pct}%`;

    const pctText = document.getElementById('progressPctText');
    if (pctText) pctText.textContent = `${pct}% Complete (${state.completedProblems.length}/100)`;

    const countTab = document.getElementById('tabProblemsCount');
    if (countTab) countTab.textContent = `${state.completedProblems.length}/100`;

    const sideCountTab = document.getElementById('sideTabProblemsCount');
    if (sideCountTab) sideCountTab.textContent = `${state.completedProblems.length}/100`;

    const sideLearnerName = document.getElementById('sidebarLearnerName');
    if (sideLearnerName) sideLearnerName.textContent = state.learnerName || 'Learner';

    const sideUserLevel = document.getElementById('sidebarUserLevel');
    if (sideUserLevel) sideUserLevel.textContent = `${currentTier.name} • ${state.xp} XP`;

    const sideAvatar = document.getElementById('sidebarAvatar');
    if (sideAvatar) {
      sideAvatar.textContent = (state.learnerName && state.learnerName.trim().length > 0)
        ? state.learnerName.trim()[0].toUpperCase()
        : 'K';
    }

    // Sound toggle icon
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
    }

    renderBadgesSection();
    renderCertificate();
  }

  // --- TAB NAVIGATION ---
  function switchTab(targetId) {
    AudioEngine.clickSoft();
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === targetId);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.style.display = (p.id === targetId) ? 'block' : 'none';
    });

    if (targetId === 'dsaTab') {
      renderDsaPatterns();
    } else if (targetId === 'testsTab') {
      renderTestsSection();
    } else if (targetId === 'badgesTab') {
      renderBadgesSection();
    } else if (targetId === 'certTab') {
      renderCertificate();
    }
  }

  // --- ONBOARDING & MODALS SETUP ---
  function checkOnboarding() {
    if (!state.learnerName || state.learnerName.trim() === '') {
      document.getElementById('welcomeModal').classList.add('active');
    }
  }

  function setupModals() {
    // Welcome Form
    const onboardingForm = document.getElementById('onboardingForm');
    if (onboardingForm) {
      onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('onboardingNameInput');
        const name = input ? input.value.trim() : '';
        if (name) {
          state.learnerName = name;
          AudioEngine.fanfareVictory();
          Confetti.burst(100);
          document.getElementById('welcomeModal').classList.remove('active');
          saveState();
          showToast(`Welcome ${name}! Your journey begins.`);
        }
      });
    }

    // Problem Modal Close
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
      document.getElementById('problemDetailModal').classList.remove('active');
    });
    document.getElementById('problemDetailModal').addEventListener('click', (e) => {
      if (e.target.id === 'problemDetailModal') {
        document.getElementById('problemDetailModal').classList.remove('active');
      }
    });

    // DSA Pattern Modal Close & Copy
    const dsaCloseBtn = document.getElementById('modalDsaCloseBtn');
    if (dsaCloseBtn) {
      dsaCloseBtn.addEventListener('click', () => {
        document.getElementById('dsaPatternModal').classList.remove('active');
      });
    }
    const dsaModal = document.getElementById('dsaPatternModal');
    if (dsaModal) {
      dsaModal.addEventListener('click', (e) => {
        if (e.target.id === 'dsaPatternModal') {
          dsaModal.classList.remove('active');
        }
      });
    }
    const copyDsaBtn = document.getElementById('copyDsaTemplateBtn');
    if (copyDsaBtn) {
      copyDsaBtn.addEventListener('click', () => {
        if (currentDsaPattern) {
          navigator.clipboard.writeText(currentDsaPattern.template).then(() => {
            AudioEngine.clickSoft();
            showToast('📋 DSA Template copied to clipboard!');
          });
        }
      });
    }

    // Subtabs inside problem detail modal
    document.querySelectorAll('.modal-subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.clickSoft();
        const subId = btn.dataset.subtab;
        document.querySelectorAll('.modal-subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.detail-section').forEach(sec => sec.classList.remove('active'));
        const targetSec = document.getElementById(subId);
        if (targetSec) targetSec.classList.add('active');
      });
    });

    // Copy Pseudocode
    document.getElementById('copyPseudoBtn').addEventListener('click', () => {
      if (currentProblem) {
        navigator.clipboard.writeText(currentProblem.pseudocode).then(() => {
          AudioEngine.clickSoft();
          showToast('📋 Pseudocode copied to clipboard!');
        });
      }
    });

    // Scratchpad save
    document.getElementById('saveNotesBtn').addEventListener('click', () => {
      if (currentProblem) {
        const val = document.getElementById('modalScratchpadArea').value;
        state.problemNotes[currentProblem.id] = val;
        saveState();
        showToast('💾 Notes saved successfully!');
      }
    });

    // Modal action buttons
    document.getElementById('modalCompleteToggleBtn').addEventListener('click', () => {
      if (currentProblem) {
        toggleComplete(currentProblem.id);
      }
    });

    document.getElementById('modalBookmarkToggleBtn').addEventListener('click', () => {
      if (currentProblem) {
        toggleBookmark(currentProblem.id);
      }
    });

    // Logoff Button
    document.getElementById('logoffBtn').addEventListener('click', () => {
      showConfirm(
        '🚪',
        'Switch Learner Profile / Logoff',
        'Do you want to log out or enter a different learner name? (Your problem completions & scores will remain saved in this browser).',
        () => {
          state.learnerName = '';
          saveState();
          document.getElementById('welcomeModal').classList.add('active');
        }
      );
    });

    // Reset Progress Button
    document.getElementById('footerResetBtn').addEventListener('click', () => {
      showConfirm(
        '⚠️',
        'Reset ALL Progress & Scores?',
        'Warning: This action will permanently erase all mastered problems, test scores, XP points, and unlocked certificates. Are you absolutely certain?',
        () => {
          localStorage.removeItem(STORAGE_KEY);
          state = {
            learnerName: '',
            xp: 0,
            completedProblems: [],
            bookmarkedProblems: [],
            problemNotes: {},
            testScores: {},
            soundEnabled: true,
            verificationId: '',
            certIssueDate: ''
          };
          saveState();
          location.reload();
        }
      );
    });
  }

  function showConfirm(icon, title, message, onConfirm) {
    document.getElementById('confirmIcon').textContent = icon;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;

    const modal = document.getElementById('confirmModal');
    modal.classList.add('active');

    const confirmBtn = document.getElementById('confirmActionBtn');
    const cancelBtn = document.getElementById('confirmCancelBtn');

    const cleanUp = () => {
      modal.classList.remove('active');
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
    };

    confirmBtn.onclick = () => {
      cleanUp();
      onConfirm();
    };

    cancelBtn.onclick = () => {
      cleanUp();
    };
  }

  // --- PWA & SERVICE WORKER SETUP ---
  let deferredPrompt = null;
  function setupPWA() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('[Service Worker] Registered with scope:', reg.scope);
      }).catch((err) => {
        console.warn('[Service Worker] Registration failed:', err);
      });
    }

    const installBtn = document.getElementById('installAppBtn');
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.style.display = 'flex';
    });

    if (installBtn) {
      installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              showToast('📲 Logic-Vault installed successfully!');
            }
            deferredPrompt = null;
            installBtn.style.display = 'none';
          });
        }
      });
    }

    // Online / Offline monitor
    const netBadge = document.getElementById('networkStatusBadge');
    function updateNet() {
      if (netBadge) {
        if (navigator.onLine) {
          netBadge.textContent = 'ONLINE';
          netBadge.style.color = '#10b981';
          netBadge.style.borderColor = 'rgba(16,185,129,0.3)';
        } else {
          netBadge.textContent = 'OFFLINE (CACHE)';
          netBadge.style.color = '#f59e0b';
          netBadge.style.borderColor = 'rgba(245,158,11,0.3)';
        }
      }
    }
    window.addEventListener('online', updateNet);
    window.addEventListener('offline', updateNet);
    updateNet();
  }

  // --- INITIALIZATION ---
  // --- SIDEBAR NAVIGATION (EXPAND & COLLAPSE) ---
  function setupSidebarNavigation() {
    const sidebar = document.getElementById('sidebarNav');
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const collapseTrigger = document.getElementById('sidebarCollapseTrigger');
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const backdrop = document.getElementById('sidebarBackdrop');
    const sideFounder = document.getElementById('sideFounderBtn');

    if (!sidebar) return;

    // 1. Restore saved collapsed state on desktop
    const isSavedCollapsed = localStorage.getItem('klv_sidebar_collapsed') === 'true';
    if (isSavedCollapsed && window.innerWidth > 1024) {
      sidebar.classList.add('collapsed');
    }

    function isMobileView() {
      return window.innerWidth <= 1024;
    }

    function toggleCollapse() {
      AudioEngine.clickSoft();
      if (isMobileView()) {
        const isOpen = sidebar.classList.toggle('mobile-open');
        if (backdrop) backdrop.classList.toggle('active', isOpen);
      } else {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        localStorage.setItem('klv_sidebar_collapsed', isCollapsed ? 'true' : 'false');
      }
    }

    function closeMobileSidebar() {
      if (isMobileView()) {
        sidebar.classList.remove('mobile-open');
        if (backdrop) backdrop.classList.remove('active');
      }
    }

    if (collapseBtn) collapseBtn.addEventListener('click', toggleCollapse);
    if (collapseTrigger) collapseTrigger.addEventListener('click', toggleCollapse);
    if (toggleBtn) toggleBtn.addEventListener('click', toggleCollapse);
    if (backdrop) backdrop.addEventListener('click', closeMobileSidebar);

    // Auto-close mobile drawer when selecting any navigation item
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
      item.addEventListener('click', () => {
        closeMobileSidebar();
      });
    });

    // Founder note jump from sidebar
    if (sideFounder) {
      sideFounder.addEventListener('click', () => {
        AudioEngine.clickSoft();
        switchTab('problemsTab');
        closeMobileSidebar();
        const fSec = document.getElementById('founderSection');
        if (fSec) {
          fSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Global keyboard shortcut: Ctrl+B or Cmd+B to toggle sidebar
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        toggleCollapse();
      }
    });
  }

  function init() {
    loadState();
    startLiveClock();
    setupModals();
    setupSidebarNavigation();
    setupPWA();

    // Tab buttons event listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
      });
    });

    // Hero quick start button
    const heroBtn = document.getElementById('heroStartBtn');
    if (heroBtn) {
      heroBtn.addEventListener('click', () => {
        // Find first unsolved problem
        const nextProb = ALL_PROBLEMS.find(p => !state.completedProblems.includes(p.id));
        if (nextProb) {
          openProblemModal(nextProb.id);
        } else {
          showToast('🎉 You have mastered all 100 problems! Proceed to the Final Assessment.');
        }
      });
    }

    // Search input
    const searchInput = document.getElementById('problemSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProblemsGrid();
      });
    }

    // Status filter select
    const statusSelect = document.getElementById('statusFilterSelect');
    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        activeStatusFilter = e.target.value;
        renderProblemsGrid();
      });
    }

    // DSA Search & Category Select
    const dsaSearch = document.getElementById('dsaSearchInput');
    if (dsaSearch) {
      dsaSearch.addEventListener('input', (e) => {
        dsaSearchQuery = e.target.value;
        renderDsaPatterns();
      });
    }

    const dsaCatSelect = document.getElementById('dsaCategorySelect');
    if (dsaCatSelect) {
      dsaCatSelect.addEventListener('change', (e) => {
        activeDsaCategory = e.target.value;
        renderDsaPatterns();
      });
    }

    // Sound toggle
    const soundBtn = document.getElementById('soundToggleBtn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
        showToast(state.soundEnabled ? 'Sound FX Enabled' : 'Sound FX Muted');
        saveState();
      });
    }

    // Render domains and problems
    renderDomainPills();
    renderProblemsGrid();
    renderDsaPatterns();
    updateAllUI();
    checkOnboarding();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
