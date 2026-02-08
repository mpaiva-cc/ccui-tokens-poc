/**
 * Token Catalog Generator
 *
 * Reads built token JSON from dist/tokens-studio/ and generates
 * a markdown catalog at dist/token-catalog.md.
 *
 * Usage: npm run catalog (after npm run build)
 */
import fs from 'fs';
import path from 'path';

const distDir = 'dist/tokens-studio';
const outputFile = 'dist/token-catalog.md';

// Reference semantic theme shown in full detail
const REFERENCE_THEME = 'mantine-light';

// ------------------------------------
// Helpers
// ------------------------------------

function readJSON(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

/**
 * Recursively walk a JSON tree and collect leaf tokens (objects with $value).
 * Returns an array of { path, $value, $type, $description }.
 */
function collectTokens(obj, prefix = []) {
  const tokens = [];

  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith('$')) continue; // skip meta keys at group level

    const currentPath = [...prefix, key];

    if (value && typeof value === 'object' && '$value' in value) {
      tokens.push({
        path: currentPath.join('.'),
        $value: formatValue(value.$value),
        $type: value.$type || '',
        $description: cleanDescription(value.$description, currentPath.join('.')),
      });
    } else if (value && typeof value === 'object') {
      tokens.push(...collectTokens(value, currentPath));
    }
  }

  return tokens;
}

/**
 * Format a token value for display in the table.
 */
function formatValue(val) {
  if (Array.isArray(val)) {
    // boxShadow arrays — summarize
    return val
      .map(s => {
        const parts = [s.x, s.y, s.blur, s.spread].filter(Boolean).join(' ');
        return `${s.type || 'dropShadow'}: ${parts} ${s.color || ''}`.trim();
      })
      .join('; ');
  }
  if (val && typeof val === 'object') {
    // composite token (typography) — show key=value pairs
    return Object.entries(val)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }
  return String(val);
}

/**
 * Strip the "path — " prefix from descriptions since the token path
 * is already shown in the Token column.
 */
function cleanDescription(desc, tokenPath) {
  if (!desc) return '';
  const prefix = `${tokenPath} — `;
  if (desc.startsWith(prefix)) {
    return desc.slice(prefix.length);
  }
  // Also handle variants where the description's path might differ slightly
  const dashIdx = desc.indexOf(' — ');
  if (dashIdx !== -1 && dashIdx < 60) {
    return desc.slice(dashIdx + 3);
  }
  return desc;
}

/**
 * Escape pipe characters in a string for markdown table cells.
 */
function escapeCell(str) {
  return str.replace(/\|/g, '\\|');
}

/**
 * Generate a markdown table from an array of tokens.
 */
function tokenTable(tokens) {
  const lines = [
    '| Token | Type | Value | Description |',
    '|-------|------|-------|-------------|',
  ];

  for (const t of tokens) {
    const token = escapeCell(t.path);
    const type = escapeCell(t.$type);
    const value = escapeCell(truncate(t.$value, 80));
    const desc = escapeCell(truncate(t.$description, 120));
    lines.push(`| ${token} | ${type} | \`${value}\` | ${desc} |`);
  }

  return lines.join('\n');
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '\u2026';
}

/**
 * Derive a human-friendly set name from a filename.
 * e.g. "z-index.json" -> "z-index", "mantine-light.json" -> "mantine-light"
 */
function setName(filename) {
  return path.basename(filename, '.json');
}

// ------------------------------------
// Main
// ------------------------------------

function buildCatalog() {
  // Verify dist exists
  if (!fs.existsSync(distDir)) {
    console.error(`Build output not found at ${distDir}. Run "npm run build" first.`);
    process.exit(1);
  }

  const sections = [];

  // --- Primitives ---
  const primDir = path.join(distDir, 'primitives');
  const primFiles = fs.readdirSync(primDir).filter(f => f.endsWith('.json')).sort();
  const primSection = ['## Primitives\n'];

  for (const file of primFiles) {
    const data = readJSON(path.join(primDir, file));
    const tokens = collectTokens(data).sort((a, b) => a.path.localeCompare(b.path));
    const name = setName(file);
    primSection.push(`### ${name} (${tokens.length} tokens)\n`);
    primSection.push(tokenTable(tokens));
    primSection.push('');
  }
  sections.push(primSection.join('\n'));

  // --- Components ---
  const compDir = path.join(distDir, 'components');
  const compFiles = fs.readdirSync(compDir).filter(f => f.endsWith('.json')).sort();
  const compSection = ['## Components\n'];

  for (const file of compFiles) {
    const data = readJSON(path.join(compDir, file));
    const tokens = collectTokens(data).sort((a, b) => a.path.localeCompare(b.path));
    const name = setName(file);
    compSection.push(`### ${name} (${tokens.length} tokens)\n`);
    compSection.push(tokenTable(tokens));
    compSection.push('');
  }
  sections.push(compSection.join('\n'));

  // --- Semantic Themes ---
  const semDir = path.join(distDir, 'semantic');
  const semFiles = fs.readdirSync(semDir).filter(f => f.endsWith('.json')).sort();
  const semSection = ['## Semantic Themes\n'];

  for (const file of semFiles) {
    const data = readJSON(path.join(semDir, file));
    const tokens = collectTokens(data).sort((a, b) => a.path.localeCompare(b.path));
    const name = setName(file);

    if (name === REFERENCE_THEME) {
      semSection.push(`### ${name} (${tokens.length} tokens) — reference theme\n`);
      semSection.push(tokenTable(tokens));
    } else {
      semSection.push(`### ${name} (${tokens.length} tokens)\n`);
      semSection.push(`_Same structure as ${REFERENCE_THEME}. See reference theme above for full token list._`);
    }
    semSection.push('');
  }
  sections.push(semSection.join('\n'));

  // --- Assemble ---
  const header = [
    '# Token Catalog',
    '',
    '> Auto-generated from build output. Do not edit manually.',
    `> Generated: ${new Date().toISOString().split('T')[0]}`,
    '',
  ].join('\n');

  const md = header + '\n' + sections.join('\n---\n\n');

  fs.writeFileSync(outputFile, md, 'utf-8');

  // Summary
  const totalPrim = primFiles.reduce((sum, f) => {
    return sum + collectTokens(readJSON(path.join(primDir, f))).length;
  }, 0);
  const totalComp = compFiles.reduce((sum, f) => {
    return sum + collectTokens(readJSON(path.join(compDir, f))).length;
  }, 0);
  const totalSem = semFiles.reduce((sum, f) => {
    return sum + collectTokens(readJSON(path.join(semDir, f))).length;
  }, 0);

  console.log(`Token catalog written to ${outputFile}`);
  console.log(`  Primitives: ${primFiles.length} sets, ${totalPrim} tokens`);
  console.log(`  Components: ${compFiles.length} sets, ${totalComp} tokens`);
  console.log(`  Semantic:   ${semFiles.length} sets, ${totalSem} tokens`);
}

buildCatalog();
