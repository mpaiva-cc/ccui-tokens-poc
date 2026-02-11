/**
 * Generate Color Doc-Data JSON for Figma Data Populator
 *
 * Reads built color primitives from dist/tokens-studio/primitives.json
 * and generates a single consolidated JSON file at dist/doc-data/colors.json.
 *
 * Usage: npm run generate:doc-data (after npm run build)
 */
import fs from 'fs';
import path from 'path';
import { parse, converter, formatHex } from 'culori';

const distDir = 'dist/tokens-studio';
const outputDir = 'dist/doc-data';
const outputFile = path.join(outputDir, 'colors.json');

const toOklch = converter('oklch');

// Base palette scale names (explicit list to avoid picking up meta keys or singletons)
const BASE_SCALES = [
  'blue', 'cyan', 'dark', 'grape', 'gray', 'green',
  'indigo', 'lime', 'orange', 'pink', 'red', 'teal', 'violet', 'yellow',
];
const BASE_SINGLETONS = ['white', 'black', 'transparent'];

// ------------------------------------
// Helpers
// ------------------------------------

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Strip the build-prepended "path — " prefix from descriptions.
 */
function cleanDescription(desc, tokenPath) {
  if (!desc) return '';
  const prefix = `${tokenPath} — `;
  if (desc.startsWith(prefix)) {
    return desc.slice(prefix.length);
  }
  const dashIdx = desc.indexOf(' — ');
  if (dashIdx !== -1 && dashIdx < 60) {
    return desc.slice(dashIdx + 3);
  }
  return desc;
}

/**
 * Convert a color value string to a formatted OKLCH string.
 * Returns "N/A" for keyword values like "transparent".
 */
function toOklchString(rawValue) {
  if (rawValue.toLowerCase() === 'transparent') return 'N/A';

  const color = parse(rawValue);
  if (!color) return 'N/A';

  const oklch = toOklch(color);
  const L = (oklch.l * 100).toFixed(1);
  const C = oklch.c.toFixed(4);
  const H = (oklch.h ?? 0).toFixed(1);
  return `${L}% ${C} ${H}°`;
}

/**
 * Normalize a color value for hex display (uppercase).
 * Keyword values like "transparent" are returned uppercased as-is.
 */
function normalizeHex(rawValue) {
  if (rawValue.toLowerCase() === 'transparent') return 'TRANSPARENT';

  const color = parse(rawValue);
  if (!color) return rawValue.toUpperCase();
  return formatHex(color).toUpperCase();
}

/**
 * Convert a group name like "dark" under "base" to "Base / Dark".
 */
function toGroupLabel(category, name) {
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  return `${cap(category)} / ${cap(name)}`;
}

// ------------------------------------
// Processing
// ------------------------------------

/**
 * Process a scale group (object with keys "0"-"9") into doc-data entries.
 */
function processScale(scaleObj, tokenPrefix, groupName) {
  const entries = [];
  const steps = Object.keys(scaleObj)
    .filter(k => !k.startsWith('$'))
    .sort((a, b) => Number(a) - Number(b));

  for (const step of steps) {
    const token = scaleObj[step];
    if (!token || !token.$value) continue;

    const tokenName = `${tokenPrefix}.${step}`;
    entries.push({
      tokenName,
      groupName,
      description: cleanDescription(token.$description, tokenName),
      hex: normalizeHex(token.$value),
      oklch: toOklchString(token.$value),
    });
  }
  return entries;
}

/**
 * Process a singleton token into a single doc-data entry.
 */
function processSingleton(token, tokenName, groupName) {
  return {
    tokenName,
    groupName,
    description: cleanDescription(token.$description, tokenName),
    hex: normalizeHex(token.$value),
    oklch: toOklchString(token.$value),
  };
}

// ------------------------------------
// Main
// ------------------------------------

function main() {
  if (!fs.existsSync(distDir)) {
    console.error(`Build output not found at ${distDir}. Run "npm run build" first.`);
    process.exit(1);
  }

  const primitives = readJSON(path.join(distDir, 'primitives.json'));
  const colorData = primitives.color;

  const allColors = [];

  // --- Base palette scales ---
  for (const scaleName of BASE_SCALES) {
    const scaleObj = colorData.base[scaleName];
    if (!scaleObj) {
      console.warn(`Warning: base scale "${scaleName}" not found, skipping.`);
      continue;
    }

    const groupName = toGroupLabel('base', scaleName);
    allColors.push(...processScale(scaleObj, `color.base.${scaleName}`, groupName));
  }

  // --- Base singletons ---
  for (const name of BASE_SINGLETONS) {
    const token = colorData.base[name];
    if (!token || !token.$value) continue;

    allColors.push(
      processSingleton(token, `color.base.${name}`, toGroupLabel('base', name)),
    );
  }

  // --- Brand palettes (dynamic) ---
  for (const [brandGroup, brandColors] of Object.entries(colorData.brand)) {
    const colorNames = Object.keys(brandColors).filter(k => !k.startsWith('$'));

    for (const colorName of colorNames) {
      const scaleObj = brandColors[colorName];
      if (!scaleObj || typeof scaleObj !== 'object') continue;

      const groupName = toGroupLabel('brand', `${brandGroup} / ${colorName}`);
      allColors.push(
        ...processScale(scaleObj, `color.brand.${brandGroup}.${colorName}`, groupName),
      );
    }
  }

  // --- Write single consolidated file ---
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(allColors, null, 2) + '\n', 'utf-8');

  console.log(`Doc-data written to ${outputFile}`);
  console.log(`  Total colors: ${allColors.length}`);
}

main();
