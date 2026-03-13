/**
 * data.js — Statistics & rarity calculation for "How Rare Are You?"
 *
 * Sources:
 *  - Height:      NCD Risk Factor Collaboration (2020), WHO
 *  - Languages:   UNESCO / ilanguages.org
 *  - Instruments: NAMM/Gallup global estimate
 *  - Education:   Harvard/ADB, World Bank, OECD 2022
 *  - Country:     UN Population Division 2023
 *  - Handedness:  Papadatou-Pastou et al. (2020) meta-analysis
 */

// ── HEIGHT ───────────────────────────────────────────────────────────────────
const HEIGHT_STATS = {
  male:   { mean: 171.0, sd: 7.5 },
  female: { mean: 159.0, sd: 7.0 }
};

// Abramowitz & Stegun normal CDF approximation
function normCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const pdf  = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const cdf  = 1 - pdf * poly;
  return z >= 0 ? cdf : 1 - cdf;
}

function heightRarity(cm, sex) {
  const { mean, sd } = HEIGHT_STATS[sex];
  const z = (cm - mean) / sd;
  const pBelow = normCDF(z);
  return { percentile: Math.round(pBelow * 100), label: heightLabel(pBelow) };
}

function heightLabel(pBelow) {
  if (pBelow > 0.99) return 'exceptionally tall';
  if (pBelow > 0.95) return 'very tall';
  if (pBelow > 0.85) return 'above average height';
  if (pBelow > 0.65) return 'slightly above average';
  if (pBelow > 0.35) return 'average height';
  if (pBelow > 0.15) return 'slightly below average';
  if (pBelow > 0.05) return 'below average height';
  return 'exceptionally short';
}

// ── LANGUAGES ────────────────────────────────────────────────────────────────
const LANGUAGE_DATA = {
  '1':  { fraction: 0.40, label: 'Monolingual',  icon: '💬', desc: '~40% of the world' },
  '2':  { fraction: 0.43, label: 'Bilingual',     icon: '💬', desc: '~43% of the world' },
  '3':  { fraction: 0.13, label: 'Trilingual',    icon: '🌐', desc: '~13% of the world' },
  '4+': { fraction: 0.03, label: 'Polyglot (4+)', icon: '🌍', desc: '~3% of the world'  }
};

// ── INSTRUMENTS ──────────────────────────────────────────────────────────────
const INSTRUMENT_DATA = {
  '0':  { fraction: 0.82, label: 'No instrument',  icon: '🔇', desc: '~82% of the world' },
  '1':  { fraction: 0.12, label: '1 instrument',   icon: '🎵', desc: '~12% of the world' },
  '2':  { fraction: 0.04, label: '2 instruments',  icon: '🎸', desc: '~4% of the world'  },
  '3+': { fraction: 0.02, label: '3+ instruments', icon: '🎹', desc: '~2% of the world'  }
};

// ── EDUCATION ────────────────────────────────────────────────────────────────
const EDUCATION_DATA = {
  'none':      { fraction: 0.10, label: 'No formal schooling',     icon: '📖', desc: '~10% of the world' },
  'primary':   { fraction: 0.25, label: 'Primary school',          icon: '🏫', desc: '~25% of the world' },
  'secondary': { fraction: 0.52, label: 'Secondary / High school', icon: '📚', desc: '~52% of the world' },
  'bachelor':  { fraction: 0.10, label: "Bachelor's degree",       icon: '🎓', desc: '~10% of the world' },
  'postgrad':  { fraction: 0.03, label: 'Postgraduate degree',     icon: '🏆', desc: '~3% of the world'  }
};

// ── HANDEDNESS ───────────────────────────────────────────────────────────────
const HANDEDNESS_DATA = {
  'right':        { fraction: 0.88, label: 'Right-handed', icon: '✋', desc: '~88% of the world' },
  'left':         { fraction: 0.10, label: 'Left-handed',  icon: '🤚', desc: '~10% of the world' },
  'ambidextrous': { fraction: 0.02, label: 'Ambidextrous', icon: '🙌', desc: '~2% of the world'  }
};

// ── COUNTRIES (UN 2023, % of world population) ───────────────────────────────
const COUNTRY_DATA = [
  { name: 'Afghanistan', frac: 0.0040 },
  { name: 'Algeria', frac: 0.0057 },
  { name: 'Angola', frac: 0.0038 },
  { name: 'Argentina', frac: 0.0057 },
  { name: 'Australia', frac: 0.0032 },
  { name: 'Austria', frac: 0.0011 },
  { name: 'Bangladesh', frac: 0.0215 },
  { name: 'Belarus', frac: 0.0011 },
  { name: 'Belgium', frac: 0.0014 },
  { name: 'Benin', frac: 0.0014 },
  { name: 'Bolivia', frac: 0.0012 },
  { name: 'Brazil', frac: 0.0269 },
  { name: 'Burkina Faso', frac: 0.0023 },
  { name: 'Cambodia', frac: 0.0017 },
  { name: 'Cameroon', frac: 0.0027 },
  { name: 'Canada', frac: 0.0048 },
  { name: 'Central African Republic', frac: 0.0006 },
  { name: 'Chad', frac: 0.0018 },
  { name: 'Chile', frac: 0.0024 },
  { name: 'China', frac: 0.1772 },
  { name: 'Colombia', frac: 0.0063 },
  { name: "Côte d'Ivoire", frac: 0.0030 },
  { name: 'Croatia', frac: 0.0005 },
  { name: 'Cuba', frac: 0.0014 },
  { name: 'Czech Republic', frac: 0.0013 },
  { name: 'DR Congo', frac: 0.0114 },
  { name: 'Denmark', frac: 0.0007 },
  { name: 'Ecuador', frac: 0.0021 },
  { name: 'Egypt', frac: 0.0128 },
  { name: 'El Salvador', frac: 0.0009 },
  { name: 'Eritrea', frac: 0.0037 },
  { name: 'Ethiopia', frac: 0.0154 },
  { name: 'Finland', frac: 0.0007 },
  { name: 'France', frac: 0.0083 },
  { name: 'Georgia', frac: 0.0004 },
  { name: 'Germany', frac: 0.0104 },
  { name: 'Ghana', frac: 0.0033 },
  { name: 'Greece', frac: 0.0011 },
  { name: 'Guatemala', frac: 0.0020 },
  { name: 'Guinea', frac: 0.0014 },
  { name: 'Haiti', frac: 0.0012 },
  { name: 'Honduras', frac: 0.0011 },
  { name: 'Hong Kong', frac: 0.0009 },
  { name: 'Hungary', frac: 0.0010 },
  { name: 'India', frac: 0.1761 },
  { name: 'Indonesia', frac: 0.0344 },
  { name: 'Iran', frac: 0.0108 },
  { name: 'Iraq', frac: 0.0050 },
  { name: 'Ireland', frac: 0.0006 },
  { name: 'Israel', frac: 0.0010 },
  { name: 'Italy', frac: 0.0073 },
  { name: 'Japan', frac: 0.0155 },
  { name: 'Jordan', frac: 0.0013 },
  { name: 'Kazakhstan', frac: 0.0023 },
  { name: 'Kenya', frac: 0.0066 },
  { name: 'Kyrgyzstan', frac: 0.0008 },
  { name: 'Laos', frac: 0.0008 },
  { name: 'Libya', frac: 0.0008 },
  { name: 'Madagascar', frac: 0.0028 },
  { name: 'Malawi', frac: 0.0022 },
  { name: 'Malaysia', frac: 0.0040 },
  { name: 'Mali', frac: 0.0024 },
  { name: 'Mexico', frac: 0.0158 },
  { name: 'Morocco', frac: 0.0046 },
  { name: 'Mozambique', frac: 0.0033 },
  { name: 'Myanmar', frac: 0.0067 },
  { name: 'Nepal', frac: 0.0030 },
  { name: 'Netherlands', frac: 0.0021 },
  { name: 'New Zealand', frac: 0.0006 },
  { name: 'Nicaragua', frac: 0.0008 },
  { name: 'Niger', frac: 0.0026 },
  { name: 'Nigeria', frac: 0.0254 },
  { name: 'North Korea', frac: 0.0031 },
  { name: 'Norway', frac: 0.0007 },
  { name: 'Pakistan', frac: 0.0284 },
  { name: 'Papua New Guinea', frac: 0.0010 },
  { name: 'Paraguay', frac: 0.0009 },
  { name: 'Peru', frac: 0.0040 },
  { name: 'Philippines', frac: 0.0141 },
  { name: 'Poland', frac: 0.0047 },
  { name: 'Portugal', frac: 0.0010 },
  { name: 'Romania', frac: 0.0023 },
  { name: 'Russia', frac: 0.0179 },
  { name: 'Rwanda', frac: 0.0014 },
  { name: 'Saudi Arabia', frac: 0.0043 },
  { name: 'Senegal', frac: 0.0017 },
  { name: 'Sierra Leone', frac: 0.0009 },
  { name: 'Singapore', frac: 0.0007 },
  { name: 'Somalia', frac: 0.0017 },
  { name: 'South Africa', frac: 0.0075 },
  { name: 'South Korea', frac: 0.0063 },
  { name: 'South Sudan', frac: 0.0011 },
  { name: 'Spain', frac: 0.0060 },
  { name: 'Sri Lanka', frac: 0.0025 },
  { name: 'Sudan', frac: 0.0053 },
  { name: 'Sweden', frac: 0.0013 },
  { name: 'Switzerland', frac: 0.0011 },
  { name: 'Taiwan', frac: 0.0029 },
  { name: 'Tajikistan', frac: 0.0011 },
  { name: 'Tanzania', frac: 0.0080 },
  { name: 'Thailand', frac: 0.0087 },
  { name: 'Togo', frac: 0.0010 },
  { name: 'Tunisia', frac: 0.0012 },
  { name: 'Turkey', frac: 0.0107 },
  { name: 'Uganda', frac: 0.0048 },
  { name: 'Ukraine', frac: 0.0050 },
  { name: 'United Arab Emirates', frac: 0.0011 },
  { name: 'United Kingdom', frac: 0.0085 },
  { name: 'United States', frac: 0.0413 },
  { name: 'Uzbekistan', frac: 0.0042 },
  { name: 'Venezuela', frac: 0.0040 },
  { name: 'Vietnam', frac: 0.0120 },
  { name: 'Yemen', frac: 0.0033 },
  { name: 'Zambia', frac: 0.0021 },
  { name: 'Zimbabwe', frac: 0.0018 },
  { name: 'Other / Smaller country', frac: 0.0001 }
];

// ── RARITY ENGINE ─────────────────────────────────────────────────────────────
/**
 * Compute rarity using a weighted average of per-factor rarity scores (0–100).
 * Each factor's score = how rare that answer is (0 = most common, 100 = rarest).
 * Combined score is the mean, then mapped to a sensible output range via power curve.
 *
 * This avoids the "multiply tiny fractions" trap that makes everyone 99.9% rare.
 *
 * Typical person:  ~20–50%  | Moderately uncommon: ~65–80% | Truly rare: ~90–98%
 */
function computeRarity(answers) {
  const factors = [];

  // 1. Height — distance from sex-specific global median
  if (answers.height && answers.sex) {
    const { mean, sd } = HEIGHT_STATS[answers.sex];
    const z = (parseFloat(answers.height) - mean) / sd;
    const pBelow = normCDF(z);
    const extremeness = Math.abs(pBelow - 0.5) * 2; // 0 at median, 1 at extreme tails
    const rarityScore = Math.round(extremeness * 100);
    const hr = heightRarity(parseFloat(answers.height), answers.sex);
    factors.push({
      key: 'height', icon: '📏', label: 'HEIGHT',
      value: `${answers.height} cm`,
      description: hr.label,
      rarityScore,
      rarityPct: rarityScore,
      barWidth: rarityScore
    });
  }

  // 2. Languages
  if (answers.languages) {
    const d = LANGUAGE_DATA[answers.languages];
    const rarityScore = Math.round((1 - d.fraction) * 100);
    factors.push({
      key: 'languages', icon: '🌐', label: 'LANGUAGES',
      value: d.label, description: d.desc,
      rarityScore, rarityPct: rarityScore,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // 3. Instruments
  if (answers.instruments !== undefined) {
    const d = INSTRUMENT_DATA[answers.instruments];
    const rarityScore = Math.round((1 - d.fraction) * 100);
    factors.push({
      key: 'instruments', icon: '🎵', label: 'INSTRUMENTS',
      value: d.label, description: d.desc,
      rarityScore, rarityPct: rarityScore,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // 4. Education
  if (answers.education) {
    const d = EDUCATION_DATA[answers.education];
    const rarityScore = Math.round((1 - d.fraction) * 100);
    factors.push({
      key: 'education', icon: '🎓', label: 'EDUCATION',
      value: d.label, description: d.desc,
      rarityScore, rarityPct: rarityScore,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // 5. Country — log scale so large/small countries spread meaningfully
  if (answers.country) {
    const c = COUNTRY_DATA.find(x => x.name === answers.country);
    if (c) {
      const logFrac = Math.log10(c.frac);
      const logMin  = Math.log10(0.0001); // -4   (tiniest)
      const logMax  = Math.log10(0.25);   // -0.6 (just above largest)
      const raw = (1 - (logFrac - logMin) / (logMax - logMin));
      const rarityScore = Math.round(Math.min(85, Math.max(5, raw * 85)));
      factors.push({
        key: 'country', icon: '🌍', label: 'COUNTRY',
        value: c.name,
        description: `${(c.frac * 100).toFixed(2)}% of the world`,
        rarityScore, rarityPct: rarityScore,
        barWidth: Math.round(Math.min(c.frac * 500, 100))
      });
    }
  }

  // 6. Handedness
  if (answers.handedness) {
    const d = HANDEDNESS_DATA[answers.handedness];
    const rarityScore = Math.round((1 - d.fraction) * 100);
    factors.push({
      key: 'handedness', icon: d.icon, label: 'HANDEDNESS',
      value: d.label, description: d.desc,
      rarityScore, rarityPct: rarityScore,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // Mean of all factor scores → mapped via power curve to final percentage
  // output = 20 + (avg/100)^0.7 * 78  →  floor ~20%, ceiling ~98%
  const avg = factors.reduce((sum, f) => sum + f.rarityScore, 0) / factors.length;
  const rarerThanPct = Math.min(99.5, Math.round((20 + Math.pow(avg / 100, 0.7) * 78) * 10) / 10);

  return { factors, rarerThanPct };
}

function rarityTagline(pct) {
  if (pct >= 99)  return 'You are extraordinarily rare.';
  if (pct >= 97)  return 'You are a remarkable outlier.';
  if (pct >= 95)  return 'You are exceptionally rare.';
  if (pct >= 90)  return 'You are genuinely quite rare.';
  if (pct >= 80)  return 'You are rarer than most.';
  if (pct >= 65)  return 'You are somewhat uncommon.';
  if (pct >= 50)  return 'You are above average in rarity.';
  if (pct >= 35)  return 'You are fairly typical globally.';
  return "You are common globally — and that's okay.";
}
