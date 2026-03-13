/**
 * data.js — Statistics tables for "How Rare Are You?"
 *
 * Sources:
 *  - Height: NCD Risk Factor Collaboration (2020), WHO, normal distribution modelling
 *  - Languages: UNESCO; ilanguages.org (bilingual 43%, trilingual 13%, 4+ ~3%)
 *  - Instruments: NAMM/Gallup, Quora expert estimate (~15% globally)
 *  - Education: Harvard/ADB study, World Bank, OECD 2022
 *  - Country: UN Population Division 2023 estimates
 *  - Handedness: multiple peer-reviewed meta-analyses (~10% left-handed)
 */

// ── HEIGHT ──────────────────────────────────────────────────────────────────
// World adult height means & std deviations by sex (NCD Risk Factor 2020)
// Male: mean 171 cm, sd 7.5 | Female: mean 159 cm, sd 7
const HEIGHT_STATS = {
  male:   { mean: 171.0, sd: 7.5 },
  female: { mean: 159.0, sd: 7.0 }
};

// Standard normal CDF approximation (Abramowitz & Stegun)
function normCDF(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly = t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const pdf  = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  const cdf  = 1 - pdf * poly;
  return z >= 0 ? cdf : 1 - cdf;
}

/**
 * Returns the percentile of people AT OR BELOW this height globally.
 * We use this to calculate rarity among the world population (both sexes combined).
 * Approx 50/50 sex split; combine CDFs weighted equally.
 */
function heightRarity(cm, sex) {
  const { mean, sd } = HEIGHT_STATS[sex];
  const z = (cm - mean) / sd;
  const pBelow = normCDF(z);          // fraction shorter than you
  // Rarity = how rare it is to be this tall OR taller (extremeness from average)
  // We actually return "rarer than X%" which = how far you are from the median
  const distFromMedian = Math.abs(pBelow - 0.5);
  return {
    percentile: Math.round(pBelow * 100),
    rarityFraction: distFromMedian * 2,   // 0 = average, 1 = most extreme
    label: heightLabel(pBelow, sex)
  };
}

function heightLabel(pBelow, sex) {
  if (pBelow > 0.99) return 'exceptionally tall';
  if (pBelow > 0.95) return 'very tall';
  if (pBelow > 0.85) return 'above average height';
  if (pBelow > 0.65) return 'slightly above average';
  if (pBelow > 0.35) return 'average height';
  if (pBelow > 0.15) return 'slightly below average';
  if (pBelow > 0.05) return 'below average height';
  return 'exceptionally short';
}

// ── LANGUAGES ───────────────────────────────────────────────────────────────
// Monolingual: 40% | Bilingual: 43% | Trilingual: 13% | 4+: 3% | 5+: <0.1%
const LANGUAGE_DATA = {
  '1':  { fraction: 0.40, label: 'Monolingual',     icon: '💬', desc: '~40% of the world' },
  '2':  { fraction: 0.43, label: 'Bilingual',        icon: '💬💬', desc: '~43% of the world' },
  '3':  { fraction: 0.13, label: 'Trilingual',       icon: '🌐', desc: '~13% of the world' },
  '4+': { fraction: 0.03, label: 'Polyglot (4+)',    icon: '🌍', desc: '~3% of the world' }
};

// ── INSTRUMENTS ─────────────────────────────────────────────────────────────
// ~85% play no instrument | ~10% play 1 | ~4% play 2 | ~1% play 3+
// Source: NAMM/Gallup (US ~54% household), global estimate ~15% total
const INSTRUMENT_DATA = {
  '0':  { fraction: 0.82, label: 'No instrument',    icon: '🔇', desc: '~82% of the world' },
  '1':  { fraction: 0.12, label: '1 instrument',     icon: '🎵', desc: '~12% of the world' },
  '2':  { fraction: 0.04, label: '2 instruments',    icon: '🎸', desc: '~4% of the world' },
  '3+': { fraction: 0.02, label: '3+ instruments',   icon: '🎹', desc: '~2% of the world' }
};

// ── EDUCATION ───────────────────────────────────────────────────────────────
// Source: World Bank, Harvard/ADB, UNESCO, OECD
// ~10% no formal schooling | ~25% primary | ~55% secondary | ~7% bachelor's | ~3% postgrad
const EDUCATION_DATA = {
  'none':      { fraction: 0.10, label: 'No formal schooling', icon: '📖', desc: '~10% of the world' },
  'primary':   { fraction: 0.25, label: 'Primary school',      icon: '🏫', desc: '~25% of the world' },
  'secondary': { fraction: 0.52, label: 'Secondary / High school', icon: '📚', desc: '~52% of the world' },
  'bachelor':  { fraction: 0.10, label: "Bachelor's degree",   icon: '🎓', desc: '~10% of the world' },
  'postgrad':  { fraction: 0.03, label: 'Postgraduate degree', icon: '🏆', desc: '~3% of the world' }
};

// ── HANDEDNESS ──────────────────────────────────────────────────────────────
// ~88% right | ~10% left | ~2% ambidextrous
// Source: Hardyck & Petrinovich (1977), Papadatou-Pastou et al. (2020) meta-analysis
const HANDEDNESS_DATA = {
  'right':        { fraction: 0.88, label: 'Right-handed',   icon: '✋', desc: '~88% of the world' },
  'left':         { fraction: 0.10, label: 'Left-handed',    icon: '🤚', desc: '~10% of the world' },
  'ambidextrous': { fraction: 0.02, label: 'Ambidextrous',   icon: '🙌', desc: '~2% of the world' }
};

// ── COUNTRIES ───────────────────────────────────────────────────────────────
// As % of world population (8.1 billion total). Source: UN 2023
const COUNTRY_DATA = [
  { name: 'China',                   frac: 0.1772 },
  { name: 'India',                   frac: 0.1761 },
  { name: 'United States',           frac: 0.0413 },
  { name: 'Indonesia',               frac: 0.0344 },
  { name: 'Pakistan',                frac: 0.0284 },
  { name: 'Brazil',                  frac: 0.0269 },
  { name: 'Nigeria',                 frac: 0.0254 },
  { name: 'Bangladesh',              frac: 0.0215 },
  { name: 'Russia',                  frac: 0.0179 },
  { name: 'Ethiopia',                frac: 0.0154 },
  { name: 'Mexico',                  frac: 0.0158 },
  { name: 'Japan',                   frac: 0.0155 },
  { name: 'Philippines',             frac: 0.0141 },
  { name: 'DR Congo',                frac: 0.0114 },
  { name: 'Egypt',                   frac: 0.0128 },
  { name: 'Vietnam',                 frac: 0.0120 },
  { name: 'Iran',                    frac: 0.0108 },
  { name: 'Turkey',                  frac: 0.0107 },
  { name: 'Germany',                 frac: 0.0104 },
  { name: 'Thailand',                frac: 0.0087 },
  { name: 'United Kingdom',          frac: 0.0085 },
  { name: 'France',                  frac: 0.0083 },
  { name: 'Tanzania',                frac: 0.0080 },
  { name: 'South Africa',            frac: 0.0075 },
  { name: 'Myanmar',                 frac: 0.0067 },
  { name: 'Kenya',                   frac: 0.0066 },
  { name: 'Argentina',               frac: 0.0057 },
  { name: 'Algeria',                 frac: 0.0057 },
  { name: 'Colombia',                frac: 0.0063 },
  { name: 'Sudan',                   frac: 0.0053 },
  { name: 'Iraq',                    frac: 0.0050 },
  { name: 'Ukraine',                 frac: 0.0050 },
  { name: 'Uganda',                  frac: 0.0048 },
  { name: 'Canada',                  frac: 0.0048 },
  { name: 'Poland',                  frac: 0.0047 },
  { name: 'Morocco',                 frac: 0.0046 },
  { name: 'Uzbekistan',              frac: 0.0042 },
  { name: 'Saudi Arabia',            frac: 0.0043 },
  { name: 'Venezuela',               frac: 0.0040 },
  { name: 'Peru',                    frac: 0.0040 },
  { name: 'Malaysia',                frac: 0.0040 },
  { name: 'Angola',                  frac: 0.0038 },
  { name: 'Ghana',                   frac: 0.0033 },
  { name: 'Mozambique',              frac: 0.0033 },
  { name: 'Yemen',                   frac: 0.0033 },
  { name: 'Nepal',                   frac: 0.0030 },
  { name: 'Madagascar',              frac: 0.0028 },
  { name: 'Cameroon',                frac: 0.0027 },
  { name: 'Australia',               frac: 0.0032 },
  { name: 'North Korea',             frac: 0.0031 },
  { name: 'Côte d\'Ivoire',          frac: 0.0030 },
  { name: 'Niger',                   frac: 0.0026 },
  { name: 'Sri Lanka',               frac: 0.0025 },
  { name: 'Burkina Faso',            frac: 0.0023 },
  { name: 'Mali',                    frac: 0.0024 },
  { name: 'Romania',                 frac: 0.0023 },
  { name: 'Malawi',                  frac: 0.0022 },
  { name: 'Kazakhstan',              frac: 0.0023 },
  { name: 'Chile',                   frac: 0.0024 },
  { name: 'Zambia',                  frac: 0.0021 },
  { name: 'Ecuador',                 frac: 0.0021 },
  { name: 'Guatemala',               frac: 0.0020 },
  { name: 'Netherlands',             frac: 0.0021 },
  { name: 'Cambodia',                frac: 0.0017 },
  { name: 'Zimbabwe',                frac: 0.0018 },
  { name: 'Senegal',                 frac: 0.0017 },
  { name: 'Chad',                    frac: 0.0018 },
  { name: 'South Sudan',             frac: 0.0011 },
  { name: 'Bolivia',                 frac: 0.0012 },
  { name: 'Rwanda',                  frac: 0.0014 },
  { name: 'Somalia',                 frac: 0.0017 },
  { name: 'Belgium',                 frac: 0.0014 },
  { name: 'Cuba',                    frac: 0.0014 },
  { name: 'Jordan',                  frac: 0.0013 },
  { name: 'Guinea',                  frac: 0.0014 },
  { name: 'Czech Republic',          frac: 0.0013 },
  { name: 'Haiti',                   frac: 0.0012 },
  { name: 'Tunisia',                 frac: 0.0012 },
  { name: 'Greece',                  frac: 0.0011 },
  { name: 'Portugal',                frac: 0.0010 },
  { name: 'Sweden',                  frac: 0.0013 },
  { name: 'Hungary',                 frac: 0.0010 },
  { name: 'United Arab Emirates',    frac: 0.0011 },
  { name: 'Israel',                  frac: 0.0010 },
  { name: 'Honduras',                frac: 0.0011 },
  { name: 'Tajikistan',              frac: 0.0011 },
  { name: 'Belarus',                 frac: 0.0011 },
  { name: 'Austria',                 frac: 0.0011 },
  { name: 'Laos',                    frac: 0.0008 },
  { name: 'Papua New Guinea',        frac: 0.0010 },
  { name: 'Paraguay',                frac: 0.0009 },
  { name: 'New Zealand',             frac: 0.0006 },
  { name: 'Norway',                  frac: 0.0007 },
  { name: 'Finland',                 frac: 0.0007 },
  { name: 'Denmark',                 frac: 0.0007 },
  { name: 'Switzerland',             frac: 0.0011 },
  { name: 'Sierra Leone',            frac: 0.0009 },
  { name: 'Togo',                    frac: 0.0010 },
  { name: 'Nicaragua',               frac: 0.0008 },
  { name: 'El Salvador',             frac: 0.0009 },
  { name: 'Kyrgyzstan',              frac: 0.0008 },
  { name: 'Eritrea',                 frac: 0.0037 },
  { name: 'Singapore',               frac: 0.0007 },
  { name: 'Ireland',                 frac: 0.0006 },
  { name: 'Central African Republic',frac: 0.0006 },
  { name: 'Croatia',                 frac: 0.0005 },
  { name: 'Georgia',                 frac: 0.0004 },
  { name: 'Benin',                   frac: 0.0014 },
  { name: 'South Korea',             frac: 0.0063 },
  { name: 'Spain',                   frac: 0.0060 },
  { name: 'Italy',                   frac: 0.0073 },
  { name: 'Taiwan',                  frac: 0.0029 },
  { name: 'Hong Kong',               frac: 0.0009 },
  { name: 'Afghanistan',             frac: 0.0040 },
  { name: 'Libya',                   frac: 0.0008 },
  { name: 'Other / Smaller country', frac: 0.0001 }
];

// Sort alphabetically for the dropdown
COUNTRY_DATA.sort((a, b) => a.name.localeCompare(b.name));

// ── COMBINED RARITY CALCULATOR ──────────────────────────────────────────────
/**
 * Given the user's answers, compute an overall "rarity" score (0–1).
 * 1 = rarest, 0 = most common.
 * We multiply independent probabilities together, then normalize.
 */
function computeRarity(answers) {
  const factors = [];

  // 1. Height
  if (answers.height && answers.sex) {
    const hr = heightRarity(parseFloat(answers.height), answers.sex);
    const { mean, sd } = HEIGHT_STATS[answers.sex];
    const pct = hr.percentile;
    // "rarity" = how far from 50th percentile in either direction
    const extremeness = Math.abs(pct - 50) / 50; // 0 = average, 1 = extreme
    const heightPct = pct;  // for display
    const heightFrac = hr.rarityFraction; // proportion as rare or rarer

    // For multiplication: probability of someone being this height
    // Use P(within ±0.5 cm of this height) from normal dist
    const frac = heightFractionAtPoint(parseFloat(answers.height), answers.sex);

    factors.push({
      key: 'height',
      icon: '📏',
      label: 'HEIGHT',
      value: `${answers.height} cm`,
      description: hr.label,
      rarityPct: Math.round(extremeness * 100),
      displayFrac: heightPct,
      frac: frac,
      barWidth: Math.round(extremeness * 100)
    });
  }

  // 2. Languages
  if (answers.languages) {
    const d = LANGUAGE_DATA[answers.languages];
    factors.push({
      key: 'languages',
      icon: '🌐',
      label: 'LANGUAGES',
      value: d.label,
      description: d.desc,
      rarityPct: Math.round((1 - d.fraction) * 100),
      frac: d.fraction,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // 3. Instruments
  if (answers.instruments !== undefined) {
    const d = INSTRUMENT_DATA[answers.instruments];
    factors.push({
      key: 'instruments',
      icon: '🎵',
      label: 'INSTRUMENTS',
      value: d.label,
      description: d.desc,
      rarityPct: Math.round((1 - d.fraction) * 100),
      frac: d.fraction,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // 4. Education
  if (answers.education) {
    const d = EDUCATION_DATA[answers.education];
    factors.push({
      key: 'education',
      icon: '🎓',
      label: 'EDUCATION',
      value: d.label,
      description: d.desc,
      rarityPct: Math.round((1 - d.fraction) * 100),
      frac: d.fraction,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // 5. Country
  if (answers.country) {
    const c = COUNTRY_DATA.find(x => x.name === answers.country);
    if (c) {
      factors.push({
        key: 'country',
        icon: '🌍',
        label: 'COUNTRY',
        value: c.name,
        description: `${(c.frac * 100).toFixed(2)}% of the world`,
        rarityPct: Math.round((1 - c.frac) * 100),
        frac: c.frac,
        barWidth: Math.round(Math.min(c.frac * 500, 100))
      });
    }
  }

  // 6. Handedness
  if (answers.handedness) {
    const d = HANDEDNESS_DATA[answers.handedness];
    factors.push({
      key: 'handedness',
      icon: d.icon,
      label: 'HANDEDNESS',
      value: d.label,
      description: d.desc,
      rarityPct: Math.round((1 - d.fraction) * 100),
      frac: d.fraction,
      barWidth: Math.round(d.fraction * 100)
    });
  }

  // Combined probability (multiply all fractions)
  let combined = 1;
  for (const f of factors) {
    combined *= f.frac;
  }

  // Convert to "rarer than X%" — how many people have ALL of these traits
  // combined = fraction of world with ALL traits
  // "rarer than" = 1 - combined (clamped reasonably)
  const rarerThan = Math.min(0.9999, Math.max(0, 1 - combined));

  return {
    factors,
    combined,
    rarerThanPct: Math.round(rarerThan * 1000) / 10  // 1 decimal place
  };
}

/**
 * Probability density at point cm (approximated as ±0.5 bin)
 */
function heightFractionAtPoint(cm, sex) {
  const { mean, sd } = HEIGHT_STATS[sex];
  const z1 = (cm - 0.5 - mean) / sd;
  const z2 = (cm + 0.5 - mean) / sd;
  return Math.max(0.001, normCDF(z2) - normCDF(z1));
}

/**
 * Generate a tagline based on rarity score
 */
function rarityTagline(pct) {
  if (pct >= 99.9) return 'You are one in a billion.';
  if (pct >= 99)   return 'You are extraordinarily rare.';
  if (pct >= 97)   return 'You are a remarkable outlier.';
  if (pct >= 95)   return 'You are exceptionally rare.';
  if (pct >= 90)   return 'You are genuinely quite rare.';
  if (pct >= 80)   return 'You are rarer than most.';
  if (pct >= 65)   return 'You are somewhat uncommon.';
  if (pct >= 50)   return 'You are above average in rarity.';
  if (pct >= 35)   return 'You are fairly typical globally.';
  return 'You are common globally — and that\'s okay.';
}
