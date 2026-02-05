/**
 * Shared test utilities for design token validation
 *
 * Updated for new architecture:
 * - CSS: Single combined file at dist/css/ccui-tokens.css
 * - Tokens Studio: dist/tokens-studio/{primitives,semantic,component}/*.json
 * - Themes: light, dark, high-contrast (in semantic folder)
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';

// Paths - relative to repo root
const DIST_DIR = join(__dirname, '../../dist');
const CSS_DIR = join(DIST_DIR, 'css');
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

// ============================================
// Path and file helpers
// ============================================

export function getDistPath(): string {
  return DIST_DIR;
}

export function getCSSPath(): string {
  return CSS_DIR;
}

export function getTokensStudioPath(): string {
  return TOKENS_STUDIO_DIR;
}

/**
 * Get the main combined CSS file path
 */
export function getMainCSSPath(): string {
  return join(CSS_DIR, 'ccui-tokens.css');
}

/**
 * Check if the main CSS file exists
 */
export function mainCSSExists(): boolean {
  return existsSync(getMainCSSPath());
}

/**
 * Load the main CSS file
 */
export function loadMainCSS(): string {
  const filePath = getMainCSSPath();
  if (!existsSync(filePath)) {
    throw new Error(`CSS file not found: ${filePath}`);
  }
  return readFileSync(filePath, 'utf-8');
}

// ============================================
// Theme helpers
// ============================================

/**
 * Get all available theme names from the semantic folder
 * Returns: ['light', 'dark', 'high-contrast']
 */
export function getThemeNames(): string[] {
  const semanticDir = join(TOKENS_STUDIO_DIR, 'semantic');
  if (!existsSync(semanticDir)) {
    return [];
  }
  return readdirSync(semanticDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.json'))
    .map((dirent) => dirent.name.replace('.json', ''));
}

/**
 * Check if primitives folder exists
 */
export function hasPrimitives(): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, 'primitives'));
}

/**
 * Check if semantic folder exists
 */
export function hasSemanticTokens(): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, 'semantic'));
}

/**
 * Check if component folder exists
 */
export function hasComponentTokens(): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, 'component'));
}

/**
 * Get all primitive token set names
 */
export function getPrimitiveSetNames(): string[] {
  const primitivesDir = join(TOKENS_STUDIO_DIR, 'primitives');
  if (!existsSync(primitivesDir)) {
    return [];
  }
  return readdirSync(primitivesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.json'))
    .map((dirent) => dirent.name.replace('.json', ''));
}

/**
 * Get all component token set names
 */
export function getComponentSetNames(): string[] {
  const componentDir = join(TOKENS_STUDIO_DIR, 'component');
  if (!existsSync(componentDir)) {
    return [];
  }
  return readdirSync(componentDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile() && dirent.name.endsWith('.json'))
    .map((dirent) => dirent.name.replace('.json', ''));
}

// ============================================
// Token JSON loading
// ============================================

/**
 * Load a primitive token set JSON file
 */
export function loadPrimitiveTokens(setName: string): TokenStructure {
  const filePath = join(TOKENS_STUDIO_DIR, 'primitives', `${setName}.json`);
  if (!existsSync(filePath)) {
    throw new Error(`Primitive token file not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

/**
 * Load a semantic theme token JSON file
 */
export function loadSemanticTokens(themeName: string): TokenStructure {
  const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);
  if (!existsSync(filePath)) {
    throw new Error(`Semantic token file not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

/**
 * Load a component token set JSON file
 */
export function loadComponentTokens(setName: string): TokenStructure {
  const filePath = join(TOKENS_STUDIO_DIR, 'component', `${setName}.json`);
  if (!existsSync(filePath)) {
    throw new Error(`Component token file not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

/**
 * Load $themes.json
 */
export function loadThemesConfig(): ThemeConfig[] {
  const filePath = join(TOKENS_STUDIO_DIR, '$themes.json');
  if (!existsSync(filePath)) {
    throw new Error(`$themes.json not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

/**
 * Load $metadata.json
 */
export function loadMetadata(): Record<string, unknown> {
  const filePath = join(TOKENS_STUDIO_DIR, '$metadata.json');
  if (!existsSync(filePath)) {
    throw new Error(`$metadata.json not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

// ============================================
// Token structures and types
// ============================================

export interface TokenValue {
  $value: string | number | Record<string, unknown>;
  $type?: string;
  $description?: string;
  $deprecated?: string | boolean;
}

export interface TokenStructure {
  [key: string]: TokenValue | TokenStructure;
}

export interface ThemeConfig {
  id: string;
  name: string;
  group: string;
  selectedTokenSets: Record<string, 'enabled' | 'disabled' | 'source'>;
}

export interface DeprecatedTokenInfo {
  path: string;
  value: string | number | Record<string, unknown>;
  deprecationMessage: string;
  suggestedReplacement?: string;
}

/**
 * Check if an object is a token (has $value property)
 */
export function isToken(obj: unknown): obj is TokenValue {
  return typeof obj === 'object' && obj !== null && '$value' in obj;
}

/**
 * Check if a token is deprecated
 */
export function isDeprecated(token: TokenValue): boolean {
  return token.$deprecated !== undefined && token.$deprecated !== false;
}

/**
 * Get deprecation message from a token
 */
export function getDeprecationMessage(token: TokenValue): string {
  if (typeof token.$deprecated === 'string') {
    return token.$deprecated;
  }
  return 'This token is deprecated.';
}

/**
 * Extract suggested replacement from deprecation message
 */
export function extractReplacement(message: string): string | undefined {
  const patterns = [
    /use\s+([^\s.]+)\s+instead/i,
    /replace\s+with\s+([^\s.]+)/i,
    /migrate\s+to\s+([^\s.]+)/i,
    /see\s+([^\s.]+)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

/**
 * Collect all deprecated tokens from a structure
 */
export function collectDeprecatedTokens(
  structure: TokenStructure,
  path: string = ''
): DeprecatedTokenInfo[] {
  const deprecated: DeprecatedTokenInfo[] = [];

  for (const [key, value] of Object.entries(structure)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (isToken(value)) {
      if (isDeprecated(value)) {
        const message = getDeprecationMessage(value);
        deprecated.push({
          path: currentPath,
          value: value.$value,
          deprecationMessage: message,
          suggestedReplacement: extractReplacement(message),
        });
      }
    } else if (typeof value === 'object' && value !== null) {
      deprecated.push(...collectDeprecatedTokens(value as TokenStructure, currentPath));
    }
  }

  return deprecated;
}

/**
 * Recursively collect all tokens from a token structure
 */
export function collectTokens(
  structure: TokenStructure,
  path: string = ''
): Map<string, TokenValue> {
  const tokens = new Map<string, TokenValue>();

  for (const [key, value] of Object.entries(structure)) {
    // Skip metadata keys
    if (key.startsWith('$')) continue;

    const currentPath = path ? `${path}.${key}` : key;

    if (isToken(value)) {
      tokens.set(currentPath, value);
    } else if (typeof value === 'object' && value !== null) {
      const nested = collectTokens(value as TokenStructure, currentPath);
      nested.forEach((v, k) => tokens.set(k, v));
    }
  }

  return tokens;
}

/**
 * Flatten tokens to a simple key-value map
 */
export function flattenTokens(
  structure: TokenStructure,
  path: string = ''
): Record<string, string | number> {
  const flat: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(structure)) {
    if (key.startsWith('$')) continue;

    const currentPath = path ? `${path}.${key}` : key;

    if (isToken(value)) {
      flat[currentPath] = typeof value.$value === 'object'
        ? JSON.stringify(value.$value)
        : value.$value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flat, flattenTokens(value as TokenStructure, currentPath));
    }
  }

  return flat;
}

// ============================================
// CSS parsing utilities
// ============================================

/**
 * Parse CSS file and extract custom properties (CSS variables)
 * Returns a Map of variable name to value
 */
export function parseCSSVariables(cssContent: string): Map<string, string> {
  const variables = new Map<string, string>();

  // Match CSS custom properties: --name: value;
  const regex = /--([a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g;
  let match;

  while ((match = regex.exec(cssContent)) !== null) {
    const name = `--${match[1]}`;
    const value = match[2].trim();
    variables.set(name, value);
  }

  return variables;
}

/**
 * Extract CSS variables for a specific selector/section
 */
export function extractCSSSection(
  cssContent: string,
  selectorPattern: string | RegExp
): string | null {
  const pattern = typeof selectorPattern === 'string'
    ? new RegExp(`${selectorPattern}\\s*\\{([^}]+)\\}`, 's')
    : selectorPattern;

  const match = cssContent.match(pattern);
  return match ? match[1] : null;
}

/**
 * Get CSS variables from the :root section
 */
export function getRootVariables(cssContent: string): Map<string, string> {
  const rootSection = extractCSSSection(cssContent, ':root');
  if (!rootSection) return new Map();
  return parseCSSVariables(`:root { ${rootSection} }`);
}

/**
 * Get CSS variables for a specific theme
 */
export function getThemeVariables(
  cssContent: string,
  theme: 'light' | 'dark'
): Map<string, string> {
  const pattern = new RegExp(
    `\\[data-mantine-color-scheme="${theme}"\\]\\s*\\{([^}]+)\\}`,
    's'
  );
  const section = extractCSSSection(cssContent, pattern);
  if (!section) return new Map();
  return parseCSSVariables(`[data-mantine-color-scheme="${theme}"] { ${section} }`);
}

// ============================================
// Validation utilities
// ============================================

/**
 * Validate color format
 */
export function isValidColor(value: string | number | Record<string, unknown>): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim().toLowerCase();

  if (trimmed === 'transparent') return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return true;
  if (/^rgba?\s*\([^)]+\)$/i.test(trimmed)) return true;
  if (/^hsla?\s*\([^)]+\)$/i.test(trimmed)) return true;
  if (/^oklch\s*\([^)]+\)$/i.test(trimmed)) return true;

  const colorKeywords = [
    'inherit', 'initial', 'unset', 'currentcolor',
    'white', 'black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
    'gray', 'grey', 'pink', 'brown', 'cyan', 'magenta'
  ];
  if (colorKeywords.includes(trimmed)) return true;

  return false;
}

/**
 * Validate dimension format
 */
export function isValidDimension(value: string | number | Record<string, unknown>): boolean {
  if (typeof value === 'number') return true;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();

  if (trimmed === '0') return true;
  if (/^-?[\d.]+\s*(px|rem|em|%|vw|vh|vmin|vmax|ch|ex|cap|ic|lh|rlh|vi|vb|svw|svh|lvw|lvh|dvw|dvh)$/i.test(trimmed)) return true;
  if (/^calc\s*\([^)]+\)$/i.test(trimmed)) return true;
  if (/^var\s*\([^)]+\)$/i.test(trimmed)) return true;

  return false;
}

/**
 * Validate font weight
 */
export function isValidFontWeight(value: string | number | Record<string, unknown>): boolean {
  if (typeof value === 'number') return value >= 1 && value <= 1000;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim().toLowerCase();

  if (['normal', 'bold', 'lighter', 'bolder', 'inherit', 'initial', 'unset'].includes(trimmed)) return true;

  const num = parseInt(trimmed, 10);
  return !isNaN(num) && num >= 1 && num <= 1000;
}

/**
 * Validate font family
 */
export function isValidFontFamily(value: string | number | Record<string, unknown>): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();

  const genericFamilies = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong'];

  const families = trimmed.split(',').map(f => f.trim());

  for (const family of families) {
    if (!family) return false;
    if (genericFamilies.includes(family.toLowerCase())) continue;
    if (/^["'][^"']+["']$/.test(family)) continue;
    if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(family)) continue;
    if (/^var\s*\([^)]+\)$/i.test(family)) continue;
    return false;
  }

  return true;
}

/**
 * Validate duration (for animations)
 */
export function isValidDuration(value: string | number | Record<string, unknown>): boolean {
  if (typeof value === 'number') return value >= 0;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();

  if (trimmed === '0' || trimmed === '0s' || trimmed === '0ms') return true;
  if (/^[\d.]+\s*(ms|s)$/i.test(trimmed)) return true;

  return false;
}

/**
 * Validate easing function
 */
export function isValidEasing(value: string | number | Record<string, unknown> | number[]): boolean {
  // Accept arrays of 4 numbers (cubicBezier format from Tokens Studio)
  if (Array.isArray(value)) {
    if (value.length !== 4) return false;
    return value.every(v => typeof v === 'number' && !isNaN(v));
  }

  if (typeof value !== 'string') return false;
  const trimmed = value.trim().toLowerCase();

  const keywords = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];
  if (keywords.includes(trimmed)) return true;
  if (/^cubic-bezier\s*\(\s*[\d.]+\s*,\s*[\d.-]+\s*,\s*[\d.]+\s*,\s*[\d.-]+\s*\)$/i.test(trimmed)) return true;
  if (/^steps\s*\([^)]+\)$/i.test(trimmed)) return true;

  // Also accept raw cubic-bezier values (e.g., "0.25,0.1,0.25,1" or "0.25, 0.1, 0.25, 1")
  // This is the format used in Tokens Studio when serialized as string
  if (/^[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+\s*,\s*[\d.-]+$/.test(trimmed)) return true;

  return false;
}

/**
 * Check if a value is a token reference (e.g., "{color.blue.500}")
 */
export function isTokenReference(value: string | number | Record<string, unknown>): boolean {
  if (typeof value !== 'string') return false;
  return /^\{[a-zA-Z][a-zA-Z0-9.-]+\}$/.test(value.trim());
}

/**
 * Validate box-shadow
 */
export function isValidShadow(value: string | number | Record<string, unknown>): boolean {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim().toLowerCase();

  if (trimmed === 'none') return true;
  if (/\d+(px|rem|em)/.test(trimmed)) return true;
  if (/^var\s*\([^)]+\)$/i.test(trimmed)) return true;

  return false;
}

/**
 * Validate opacity (0-1)
 */
export function isValidOpacity(value: string | number | Record<string, unknown>): boolean {
  if (typeof value === 'number') return value >= 0 && value <= 1;
  if (typeof value !== 'string') return false;

  const num = parseFloat(value.trim());
  return !isNaN(num) && num >= 0 && num <= 1;
}

/**
 * Validate z-index (integer)
 */
export function isValidZIndex(value: string | number | Record<string, unknown>): boolean {
  if (typeof value === 'number') return Number.isInteger(value);
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();

  if (trimmed.toLowerCase() === 'auto') return true;

  const num = parseInt(trimmed, 10);
  return !isNaN(num) && num.toString() === trimmed;
}

/**
 * Validate border radius
 */
export function isValidBorderRadius(value: string | number | Record<string, unknown>): boolean {
  if (typeof value === 'number') return value >= 0;
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();

  if (trimmed === '0') return true;
  if (/^[\d.]+(px|rem|em|%)?(\s+[\d.]+(px|rem|em|%)?)*$/i.test(trimmed)) return true;
  if (/^var\s*\([^)]+\)$/i.test(trimmed)) return true;

  return false;
}

// ============================================
// WCAG Contrast Utilities
// ============================================

interface RGB {
  r: number;
  g: number;
  b: number;
}

function parseHexColor(hex: string): RGB | null {
  const cleanHex = hex.replace(/^#/, '');

  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6 || cleanHex.length === 8) {
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

  return { r, g, b };
}

function parseRgbColor(rgbStr: string): RGB | null {
  const match = rgbStr.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!match) return null;

  const r = parseFloat(match[1]);
  const g = parseFloat(match[2]);
  const b = parseFloat(match[3]);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

  return { r, g, b };
}

export function parseColorToRGB(colorValue: string): RGB | null {
  if (!colorValue || typeof colorValue !== 'string') return null;

  const trimmed = colorValue.trim().toLowerCase();

  if (trimmed === 'transparent') return null;

  const colorKeywords: Record<string, RGB> = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    orange: { r: 255, g: 165, b: 0 },
    purple: { r: 128, g: 0, b: 128 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
  };

  if (colorKeywords[trimmed]) return colorKeywords[trimmed];
  if (trimmed.startsWith('#')) return parseHexColor(trimmed);
  if (trimmed.startsWith('rgb')) return parseRgbColor(trimmed);

  return null;
}

function sRGBtoLinear(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance(rgb: RGB): number {
  const r = sRGBtoLinear(rgb.r);
  const g = sRGBtoLinear(rgb.g);
  const b = sRGBtoLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(foreground: string, background: string): number | null {
  const fgRGB = parseColorToRGB(foreground);
  const bgRGB = parseColorToRGB(background);

  if (!fgRGB || !bgRGB) return null;

  const L1 = getRelativeLuminance(fgRGB);
  const L2 = getRelativeLuminance(bgRGB);

  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsWCAG_AA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 4.5;
}

export function meetsWCAG_AA_LargeText(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 3;
}

export function meetsWCAG_AAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 7;
}

// ============================================
// File existence helpers (legacy compatibility)
// ============================================

export function primitiveFileExists(setName: string): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, 'primitives', `${setName}.json`));
}

export function semanticFileExists(themeName: string): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`));
}

export function componentFileExists(setName: string): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, 'component', `${setName}.json`));
}

export function themesConfigExists(): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, '$themes.json'));
}

export function metadataExists(): boolean {
  return existsSync(join(TOKENS_STUDIO_DIR, '$metadata.json'));
}
