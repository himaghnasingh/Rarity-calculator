/**
 * app.js — Quiz logic for "How Rare Are You?"
 */

// ── State ────────────────────────────────────────────────────────────────────
const TOTAL_STEPS = 7;
let currentStep = 1;
let answers = {};

// ── Initialise ────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  populateCountryDropdown();
  injectSvgDefs();
});

function populateCountryDropdown() {
  const select = document.getElementById('countrySelect');
  COUNTRY_DATA.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
}

function injectSvgDefs() {
  // We need to add a linearGradient to the SVG after it's rendered
  // We'll do this when showing results
}

// ── Navigation ────────────────────────────────────────────────────────────────
function startQuiz() {
  document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => updateProgress(), 400);
}

function nextStep() {
  // Validate current step
  if (!validateStep(currentStep)) return;

  // Collect answer from inputs (non-button steps)
  if (currentStep === 2) {
    answers.height = document.getElementById('heightCm').value;
  } else if (currentStep === 6) {
    const val = document.getElementById('countrySelect').value;
    if (!val) { shakeEl('countrySelect'); return; }
    answers.country = val;
  }

  if (currentStep >= TOTAL_STEPS) {
    showResults();
    return;
  }

  const oldStep = document.getElementById(`step-${currentStep}`);
  currentStep++;
  const newStep = document.getElementById(`step-${currentStep}`);

  oldStep.classList.add('hidden');
  newStep.classList.remove('hidden');
  newStep.classList.add('anim-in');
  setTimeout(() => newStep.classList.remove('anim-in'), 500);

  updateProgress();
  window.scrollTo({ top: document.getElementById('quiz-section').offsetTop - 20, behavior: 'smooth' });
}

function validateStep(step) {
  if (step === 1 && !answers.sex) {
    pulsePrompt('step-1'); return false;
  }
  if (step === 2) {
    const v = parseFloat(document.getElementById('heightCm').value);
    if (!v || v < 100 || v > 250) { shakeEl('heightCm'); return false; }
  }
  if (step === 3 && !answers.languages) {
    pulsePrompt('step-3'); return false;
  }
  if (step === 4 && answers.instruments === undefined) {
    pulsePrompt('step-4'); return false;
  }
  if (step === 5 && !answers.education) {
    pulsePrompt('step-5'); return false;
  }
  if (step === 6) {
    if (!document.getElementById('countrySelect').value) {
      shakeEl('countrySelect'); return false;
    }
  }
  if (step === 7 && !answers.handedness) {
    pulsePrompt('step-7'); return false;
  }
  return true;
}

function selectOption(btn) {
  const key = btn.dataset.key;
  const val = btn.dataset.val;

  // Deselect siblings
  const parent = btn.closest('.option-grid');
  parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // Store answer
  answers[key] = val;

  // Auto-advance for option grids (not text inputs)
  setTimeout(() => nextStep(), 320);
}

function updateProgress() {
  const pct = ((currentStep - 1) / TOTAL_STEPS) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('stepLabel').textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
}

function shakeEl(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.style.borderColor = '#f25a8e';
  setTimeout(() => {
    el.style.borderColor = '';
    el.style.transition = 'border-color 0.5s';
  }, 800);
}

function pulsePrompt(stepId) {
  const el = document.getElementById(stepId);
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = 'fadeUp 0.4s ease both';
}

// ── Height converter ──────────────────────────────────────────────────────────
function toggleHeightConverter() {
  document.getElementById('heightConverter').classList.toggle('hidden');
}

function convertHeight() {
  const ft = parseFloat(document.getElementById('heightFt').value) || 0;
  const inVal = parseFloat(document.getElementById('heightIn').value) || 0;
  const totalCm = Math.round((ft * 30.48) + (inVal * 2.54));
  if (totalCm > 0) {
    document.getElementById('heightCm').value = totalCm;
    document.getElementById('heightConverter').classList.add('hidden');
  }
}

// ── Results ────────────────────────────────────────────────────────────────────
function showResults() {
  document.getElementById('quiz-section').classList.add('hidden');

  const result = computeRarity(answers);
  const resultSection = document.getElementById('result-section');
  resultSection.classList.remove('hidden');

  // Build factor cards
  buildFactorCards(result.factors);

  // Animate ring & number
  animateRing(result.rarerThanPct);

  // Set tagline
  document.getElementById('rarityTagline').textContent = rarityTagline(result.rarerThanPct);

  resultSection.scrollIntoView({ behavior: 'smooth' });
}

function buildFactorCards(factors) {
  const grid = document.getElementById('factorsGrid');
  grid.innerHTML = '';

  factors.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'factor-card';
    card.style.animationDelay = `${i * 0.08}s`;

    const rarityStr = f.rarityPct > 0
      ? `Rarer than ${f.rarityPct}%`
      : `Very common globally`;

    card.innerHTML = `
      <span class="factor-icon">${f.icon}</span>
      <div class="factor-label">${f.label}</div>
      <div class="factor-value">${f.value}</div>
      <div class="factor-rarity">${rarityStr}</div>
      <div style="font-size:0.72rem;color:var(--muted);margin-top:0.2rem">${f.description}</div>
      <div class="factor-bar-wrap">
        <div class="factor-bar" id="bar-${f.key}" style="width:0%"></div>
      </div>
    `;
    grid.appendChild(card);

    // Animate bars with delay
    setTimeout(() => {
      const bar = document.getElementById(`bar-${f.key}`);
      if (bar) bar.style.width = f.barWidth + '%';
    }, 600 + i * 80);
  });
}

function animateRing(rarerThanPct) {
  const circumference = 534; // 2 * π * 85
  const ring = document.getElementById('ringFill');
  const numberEl = document.getElementById('rarityNumber');

  // Inject gradient def into SVG
  const svg = ring.closest('svg');
  if (!svg.querySelector('defs')) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7b5cfa"/>
        <stop offset="100%" stop-color="#c8f25a"/>
      </linearGradient>
    `;
    svg.insertBefore(defs, svg.firstChild);
  }
  ring.setAttribute('stroke', 'url(#ringGrad)');

  const fraction = rarerThanPct / 100;
  const offset = circumference * (1 - fraction);

  // Animate over 1.6s
  setTimeout(() => {
    ring.style.strokeDashoffset = offset;
  }, 200);

  // Count up number
  let start = 0;
  const end = rarerThanPct;
  const duration = 1800;
  const startTime = performance.now();

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    numberEl.textContent = current.toFixed(1) + '%';
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function resetQuiz() {
  answers = {};
  currentStep = 1;

  // Reset all steps
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const step = document.getElementById(`step-${i}`);
    if (i === 1) step.classList.remove('hidden');
    else step.classList.add('hidden');

    // Deselect buttons
    step.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  }

  // Reset inputs
  const hcm = document.getElementById('heightCm');
  if (hcm) hcm.value = '';
  const cs = document.getElementById('countrySelect');
  if (cs) cs.value = '';

  // Reset UI
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('stepLabel').textContent = 'Step 1 of 7';
  document.getElementById('ringFill').style.strokeDashoffset = '534';
  document.getElementById('rarityNumber').textContent = '0%';
  document.getElementById('factorsGrid').innerHTML = '';

  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('quiz-section').classList.remove('hidden');
  document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
}
