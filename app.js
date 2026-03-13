/**
 * app.js — Quiz logic for "How Rare Are You?"
 */

const TOTAL_STEPS = 7;
let currentStep = 1;
let answers = {};

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('countrySelect');
  COUNTRY_DATA.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.name;
    opt.textContent = c.name;
    select.appendChild(opt);
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────
function startQuiz() {
  document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
  setTimeout(updateProgress, 400);
}

function nextStep() {
  if (!validateStep(currentStep)) return;

  // Collect answers from non-button inputs
  if (currentStep === 2) {
    answers.height = document.getElementById('heightCm').value;
  } else if (currentStep === 6) {
    const val = document.getElementById('countrySelect').value;
    if (!val) { shakeEl('countrySelect'); return; }
    answers.country = val;
  }

  if (currentStep >= TOTAL_STEPS) { showResults(); return; }

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
  if (step === 1 && !answers.sex)                    { pulsePrompt('step-1'); return false; }
  if (step === 2) {
    const v = parseFloat(document.getElementById('heightCm').value);
    if (!v || v < 100 || v > 250)                    { shakeEl('heightCm'); return false; }
  }
  if (step === 3 && !answers.languages)              { pulsePrompt('step-3'); return false; }
  if (step === 4 && answers.instruments === undefined) { pulsePrompt('step-4'); return false; }
  if (step === 5 && !answers.education)              { pulsePrompt('step-5'); return false; }
  if (step === 6 && !document.getElementById('countrySelect').value) { shakeEl('countrySelect'); return false; }
  if (step === 7 && !answers.handedness)             { pulsePrompt('step-7'); return false; }
  return true;
}

function selectOption(btn) {
  btn.closest('.option-grid').querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  answers[btn.dataset.key] = btn.dataset.val;
  setTimeout(nextStep, 320);
}

function updateProgress() {
  document.getElementById('progressBar').style.width = ((currentStep - 1) / TOTAL_STEPS * 100) + '%';
  document.getElementById('stepLabel').textContent = `Step ${currentStep} of ${TOTAL_STEPS}`;
}

function shakeEl(id) {
  const el = document.getElementById(id);
  el.style.borderColor = '#f25a8e';
  setTimeout(() => { el.style.borderColor = ''; el.style.transition = 'border-color 0.5s'; }, 800);
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
  const ft    = parseFloat(document.getElementById('heightFt').value) || 0;
  const inVal = parseFloat(document.getElementById('heightIn').value) || 0;
  const totalCm = Math.round((ft * 30.48) + (inVal * 2.54));
  if (totalCm > 0) {
    document.getElementById('heightCm').value = totalCm;
    document.getElementById('heightConverter').classList.add('hidden');
  }
}

// ── Results ───────────────────────────────────────────────────────────────────
function showResults() {
  document.getElementById('quiz-section').classList.add('hidden');
  const result = computeRarity(answers);
  const resultSection = document.getElementById('result-section');
  resultSection.classList.remove('hidden');
  buildFactorCards(result.factors);
  animateRing(result.rarerThanPct);
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
    const rarityStr = f.rarityPct > 0 ? `Rarer than ${f.rarityPct}%` : 'Very common globally';
    card.innerHTML = `
      <span class="factor-icon">${f.icon}</span>
      <div class="factor-label">${f.label}</div>
      <div class="factor-value">${f.value}</div>
      <div class="factor-rarity">${rarityStr}</div>
      <div style="font-size:0.72rem;color:var(--muted);margin-top:0.2rem">${f.description}</div>
      <div class="factor-bar-wrap"><div class="factor-bar" id="bar-${f.key}" style="width:0%"></div></div>
    `;
    grid.appendChild(card);
    setTimeout(() => {
      const bar = document.getElementById(`bar-${f.key}`);
      if (bar) bar.style.width = f.barWidth + '%';
    }, 600 + i * 80);
  });
}

function animateRing(rarerThanPct) {
  const ring     = document.getElementById('ringFill');
  const numberEl = document.getElementById('rarityNumber');
  ring.setAttribute('stroke', 'url(#ringGrad)');
  setTimeout(() => { ring.style.strokeDashoffset = 534 * (1 - rarerThanPct / 100); }, 200);

  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / 1800, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    numberEl.textContent = (rarerThanPct * eased).toFixed(1) + '%';
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ── Reset ─────────────────────────────────────────────────────────────────────
function resetQuiz() {
  answers = {}; currentStep = 1;
  for (let i = 1; i <= TOTAL_STEPS; i++) {
    const step = document.getElementById(`step-${i}`);
    if (i === 1) step.classList.remove('hidden');
    else step.classList.add('hidden');
    step.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  }
  document.getElementById('heightCm').value = '';
  document.getElementById('countrySelect').value = '';
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('stepLabel').textContent = 'Step 1 of 7';
  document.getElementById('ringFill').style.strokeDashoffset = '534';
  document.getElementById('rarityNumber').textContent = '0%';
  document.getElementById('factorsGrid').innerHTML = '';
  document.getElementById('result-section').classList.add('hidden');
  document.getElementById('quiz-section').classList.remove('hidden');
  document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
}
