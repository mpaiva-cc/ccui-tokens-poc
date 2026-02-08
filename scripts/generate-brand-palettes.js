/**
 * Generate OKLCH-derived brand color palettes (0-9 tint scales).
 *
 * For each brand color the script:
 *  1. Converts the base hex to OKLCH
 *  2. Finds the closest step on a reference lightness curve
 *  3. Pins that step to the exact brand hex
 *  4. Generates the remaining steps by adjusting L while keeping H constant
 *  5. Gamut-maps out-of-sRGB steps by reducing C (binary search)
 *  6. Writes a brand-palette.tokens.json for each theme
 *
 * Usage:  node scripts/generate-brand-palettes.js
 */

import { parse, converter, formatHex, displayable } from 'culori';
import fs from 'fs';
import path from 'path';

// ---------------------------------------------------------------------------
// Reference L curve — matches Mantine-style 10-step palette distribution
// Step 0 = lightest, Step 9 = darkest
// ---------------------------------------------------------------------------
const REF_L = [0.97, 0.91, 0.82, 0.72, 0.61, 0.52, 0.45, 0.37, 0.29, 0.22];

// ---------------------------------------------------------------------------
// Brand color definitions per theme
// ---------------------------------------------------------------------------
const THEMES = {
  'ccui-30': {
    outputDirs: ['src/themes/ccui-30-light', 'src/themes/ccui-30-dark'],
    colors: {
      whiteGold:  { hex: '#F4EBD7', label: 'White Gold — warm cream neutral' },
      brass:      { hex: '#C3B497', label: 'Brass — muted warm accent' },
      alloy:      { hex: '#FFA680', label: 'Alloy — warm highlight, lighter companion to Copper' },
      copper:     { hex: '#FF7A52', label: 'Copper — signature accent' },
      bronze:     { hex: '#6C3A2A', label: 'Bronze — deep earthy anchor' },
      verdigris:  { hex: '#9EB4AB', label: 'Verdigris — nature-inspired supporting color' },
      steel:      { hex: '#697771', label: 'Steel — balanced mid-tone neutral' },
      pewter:     { hex: '#A1B4BA', label: 'Pewter — cool light neutral' },
      castIron:   { hex: '#37352A', label: 'Cast Iron — primary dark neutral' }
    }
  },
  'ccui-21': {
    outputDirs: ['src/themes/ccui-21-light'],
    colors: {
      navyBlue:   { hex: '#254677', label: 'Navy Blue — primary logo color' },
      skyBlue:    { hex: '#55BAEA', label: 'Sky Blue — secondary logo color' },
      purple:     { hex: '#822275', label: 'Purple — typography accent' },
      yellow:     { hex: '#E6E651', label: 'Yellow — decorative highlight' }
    }
  }
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const toOklch = converter('oklch');

/** Find the reference step whose L is closest to the given L value. */
function closestStep(l) {
  let best = 0;
  let bestDist = Math.abs(REF_L[0] - l);
  for (let i = 1; i < REF_L.length; i++) {
    const d = Math.abs(REF_L[i] - l);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

/**
 * Gamut-map an OKLCH color into sRGB by reducing chroma via binary search.
 * Preserves L and H.
 */
function gamutMap(l, c, h) {
  const candidate = { mode: 'oklch', l, c, h };
  if (displayable(candidate)) return candidate;

  let lo = 0;
  let hi = c;
  for (let i = 0; i < 32; i++) {
    const mid = (lo + hi) / 2;
    if (displayable({ mode: 'oklch', l, c: mid, h })) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return { mode: 'oklch', l, c: lo, h };
}

/**
 * Generate a 10-step palette for a single brand color.
 * Returns an array of 10 hex strings, index 0 = lightest.
 */
function generatePalette(hex) {
  const oklch = toOklch(parse(hex));
  const baseL = oklch.l;
  const baseC = oklch.c;
  const baseH = oklch.h ?? 0; // achromatic colors have undefined hue

  const pinnedStep = closestStep(baseL);
  const palette = new Array(10);

  for (let step = 0; step < 10; step++) {
    if (step === pinnedStep) {
      // Pin the exact brand color at this step
      palette[step] = hex.toUpperCase();
    } else {
      const targetL = REF_L[step];
      const mapped = gamutMap(targetL, baseC, baseH);
      palette[step] = formatHex(mapped).toUpperCase();
    }
  }

  return { palette, pinnedStep };
}

// ---------------------------------------------------------------------------
// Token file generation
// ---------------------------------------------------------------------------

function buildTokensJson(colorEntries, themeLabel) {
  const paletteObj = {};

  for (const [key, config] of Object.entries(colorEntries)) {
    const { palette, pinnedStep } = generatePalette(config.hex);

    paletteObj[key] = {};
    for (let step = 0; step < 10; step++) {
      const isPinned = step === pinnedStep;
      paletteObj[key][String(step)] = {
        $value: palette[step],
        $type: 'color',
        $description: isPinned
          ? `${config.label} — base color (step ${step}, pinned to official brand hex).`
          : `${config.label} — tint step ${step}.`
      };
    }
  }

  return {
    $description: `${themeLabel} brand palette. OKLCH-derived 0-9 tint scales for each brand color. Generated by scripts/generate-brand-palettes.js.`,
    brand: {
      palette: paletteObj
    }
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  for (const [themeKey, themeConfig] of Object.entries(THEMES)) {
    const themeLabel = themeKey === 'ccui-30' ? 'CCUI 3.0' : 'CCUI 2.1';
    const tokensJson = buildTokensJson(themeConfig.colors, themeLabel);
    const content = JSON.stringify(tokensJson, null, 4) + '\n';

    for (const dir of themeConfig.outputDirs) {
      const outPath = path.join(dir, 'brand-palette.tokens.json');
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(outPath, content, 'utf-8');
      console.log(`Wrote ${outPath}`);
    }

    // Print a summary table
    console.log(`\n${themeLabel} palette summary:`);
    console.log('Color'.padEnd(14), 'Pinned', 'Steps 0–9');
    console.log('-'.repeat(90));
    for (const [key, config] of Object.entries(themeConfig.colors)) {
      const { palette, pinnedStep } = generatePalette(config.hex);
      const swatches = palette.map((h, i) => i === pinnedStep ? `[${h}]` : h).join(' ');
      console.log(key.padEnd(14), String(pinnedStep).padEnd(6), swatches);
    }
    console.log();
  }
}

main();
