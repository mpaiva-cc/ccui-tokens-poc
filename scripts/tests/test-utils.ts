/**
 * Shared test utilities for design token validation
 */
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// Paths - relative to repo root
const DIST_DIR = join(__dirname, '../../dist');
const CSS_DIR = join(DIST_DIR, 'css');
const JSON_DIR = join(DIST_DIR, 'tokens-studio');

/**
 * Get all available theme names from the dist directory
 * Excludes the 'shared' folder which contains primitives, not a theme
 */
export function getThemeNames(): string[] {
  if (!existsSync(CSS_DIR)) {
    return [];
  }
  return readdirSync(CSS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== 'shared')
    .map((dirent) => dirent.name);
}

/**
 * Check if shared primitives folder exists
 */
export function hasSharedPrimitives(): boolean {
  return existsSync(join(CSS_DIR, 'shared'));
}

/**
 * Get expected CSS files for a theme (not shared primitives)
 */
export function getThemeCSSFiles(): string[] {
  return ['ccui-semantic.css', 'mantine-theme.css'];
}

/**
 * Get expected JSON files for a theme (not shared primitives)
 */
export function getThemeJSONFiles(): string[] {
  return ['tokens.json', 'tokens-flat.json'];
}

/**
 * Get expected CSS files for shared primitives
 */
export function getSharedCSSFiles(): string[] {
  return ['ccui-primitives.css', 'mantine-primitives.css'];
}

/**
 * Get expected JSON files for shared primitives
 */
export function getSharedJSONFiles(): string[] {
  return ['primitives.json'];
}

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
 * Load CSS file for a theme
 */
export function loadThemeCSS(themeName: string, fileName: string): string {
  const filePath = join(CSS_DIR, themeName, fileName);
  if (!existsSync(filePath)) {
    throw new Error(`CSS file not found: ${filePath}`);
  }
  return readFileSync(filePath, 'utf-8');
}

/**
 * Load JSON tokens for a theme
 */
export function loadTokenJSON(themeName: string, fileName: string = 'tokens.json'): TokenStructure {
  const filePath = join(JSON_DIR, themeName, fileName);
  if (!existsSync(filePath)) {
    throw new Error(`JSON file not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

/**
 * Load flat JSON tokens for a theme
 */
export function loadFlatTokenJSON(themeName: string): Record<string, string> {
  const filePath = join(JSON_DIR, themeName, 'tokens-flat.json');
  if (!existsSync(filePath)) {
    throw new Error(`JSON file not found: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf-8'));
}

/**
 * Token structure from Style Dictionary output
 */
export interface TokenValue {
  $value: string;
  $type?: string;
  $description?: string;
  $deprecated?: string | boolean; // Deprecation notice or flag
}

export interface TokenStructure {
  [key: string]: TokenValue | TokenStructure;
}

/**
 * Information about a deprecated token
 */
export interface DeprecatedTokenInfo {
  path: string;
  value: string;
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
 * Looks for patterns like "Use X instead" or "Replace with X"
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
 * Validate color format
 * Supports: #hex, rgb(), rgba(), hsl(), hsla(), transparent, color keywords
 */
export function isValidColor(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim().toLowerCase();

  // transparent keyword
  if (trimmed === 'transparent') return true;

  // Hex colors: #RGB, #RRGGBB, #RGBA, #RRGGBBAA
  if (/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) {
    return true;
  }

  // RGB/RGBA
  if (/^rgba?\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  // HSL/HSLA
  if (/^hsla?\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  // oklch (modern color space)
  if (/^oklch\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  // CSS color keywords (common ones)
  const colorKeywords = [
    'inherit', 'initial', 'unset', 'currentcolor',
    'white', 'black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple',
    'gray', 'grey', 'pink', 'brown', 'cyan', 'magenta'
  ];
  if (colorKeywords.includes(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Validate dimension format
 * Supports: px, rem, em, %, vw, vh, etc.
 */
export function isValidDimension(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();

  // Zero without unit
  if (trimmed === '0') return true;

  // Number with unit
  if (/^-?[\d.]+\s*(px|rem|em|%|vw|vh|vmin|vmax|ch|ex|cap|ic|lh|rlh|vi|vb|svw|svh|lvw|lvh|dvw|dvh)$/i.test(trimmed)) {
    return true;
  }

  // calc() expressions
  if (/^calc\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  // var() references
  if (/^var\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Validate font weight
 * Supports: 100-900, normal, bold, lighter, bolder
 */
export function isValidFontWeight(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim().toLowerCase();

  // Keywords
  if (['normal', 'bold', 'lighter', 'bolder', 'inherit', 'initial', 'unset'].includes(trimmed)) {
    return true;
  }

  // Numeric (100-900 in steps of 100, or any number 1-1000)
  const num = parseInt(trimmed, 10);
  if (!isNaN(num) && num >= 1 && num <= 1000) {
    return true;
  }

  return false;
}

/**
 * Validate font family
 * Should be a string with proper quotes for multi-word fonts
 */
export function isValidFontFamily(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();

  // Generic families
  const genericFamilies = ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', 'emoji', 'math', 'fangsong'];

  // Split by comma and validate each family
  const families = trimmed.split(',').map(f => f.trim());

  for (const family of families) {
    if (!family) return false;

    // Generic family (unquoted)
    if (genericFamilies.includes(family.toLowerCase())) continue;

    // Quoted font name
    if (/^["'][^"']+["']$/.test(family)) continue;

    // Unquoted single-word font name
    if (/^[a-zA-Z][a-zA-Z0-9-]*$/.test(family)) continue;

    // var() reference
    if (/^var\s*\([^)]+\)$/i.test(family)) continue;

    // If none match, it's invalid
    return false;
  }

  return true;
}

/**
 * Validate duration (for animations)
 * Supports: ms, s
 */
export function isValidDuration(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();

  // Zero
  if (trimmed === '0' || trimmed === '0s' || trimmed === '0ms') return true;

  // Number with unit
  if (/^[\d.]+\s*(ms|s)$/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Validate easing function
 * Supports: keywords and cubic-bezier()
 */
export function isValidEasing(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim().toLowerCase();

  // Keywords
  const keywords = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'step-start', 'step-end'];
  if (keywords.includes(trimmed)) return true;

  // cubic-bezier()
  if (/^cubic-bezier\s*\(\s*[\d.]+\s*,\s*[\d.-]+\s*,\s*[\d.]+\s*,\s*[\d.-]+\s*\)$/i.test(trimmed)) {
    return true;
  }

  // steps()
  if (/^steps\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Validate box-shadow
 */
export function isValidShadow(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim().toLowerCase();

  // none keyword
  if (trimmed === 'none') return true;

  // Shadow value should contain at least some numeric values with units
  // and optionally colors. This is a loose check.
  if (/\d+(px|rem|em)/.test(trimmed)) {
    return true;
  }

  // var() reference
  if (/^var\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Validate opacity (0-1)
 */
export function isValidOpacity(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const num = parseFloat(value.trim());
  return !isNaN(num) && num >= 0 && num <= 1;
}

/**
 * Validate z-index (integer)
 */
export function isValidZIndex(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();

  // auto keyword
  if (trimmed.toLowerCase() === 'auto') return true;

  // Integer
  const num = parseInt(trimmed, 10);
  return !isNaN(num) && num.toString() === trimmed;
}

/**
 * Validate border radius
 */
export function isValidBorderRadius(value: string): boolean {
  if (!value || typeof value !== 'string') return false;

  const trimmed = value.trim();

  // Zero
  if (trimmed === '0') return true;

  // Single value or multiple values with units
  if (/^[\d.]+(px|rem|em|%)?(\s+[\d.]+(px|rem|em|%)?)*$/i.test(trimmed)) {
    return true;
  }

  // var() reference
  if (/^var\s*\([^)]+\)$/i.test(trimmed)) {
    return true;
  }

  return false;
}

// ============================================
// WCAG Contrast Utilities (No External Dependencies)
// ============================================

/**
 * RGB color interface
 */
interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Parse hex color to RGB values (0-255)
 */
function parseHexColor(hex: string): RGB | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    // #RGB
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6 || cleanHex.length === 8) {
    // #RRGGBB or #RRGGBBAA
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }

  return { r, g, b };
}

/**
 * Parse rgb() or rgba() color to RGB values
 */
function parseRgbColor(rgbStr: string): RGB | null {
  const match = rgbStr.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (!match) return null;

  const r = parseFloat(match[1]);
  const g = parseFloat(match[2]);
  const b = parseFloat(match[3]);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;

  return { r, g, b };
}

/**
 * Parse any supported color format to RGB
 */
export function parseColorToRGB(colorValue: string): RGB | null {
  if (!colorValue || typeof colorValue !== 'string') return null;

  const trimmed = colorValue.trim().toLowerCase();

  // Handle transparent
  if (trimmed === 'transparent') return null;

  // Handle common color keywords
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

  if (colorKeywords[trimmed]) {
    return colorKeywords[trimmed];
  }

  // Hex colors
  if (trimmed.startsWith('#')) {
    return parseHexColor(trimmed);
  }

  // RGB/RGBA
  if (trimmed.startsWith('rgb')) {
    return parseRgbColor(trimmed);
  }

  return null;
}

/**
 * Convert sRGB component to linear RGB
 * Per WCAG 2.1 algorithm
 */
function sRGBtoLinear(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Calculate relative luminance per WCAG 2.1
 * https://www.w3.org/WAI/WCAG21/Techniques/general/G17.html
 */
export function getRelativeLuminance(rgb: RGB): number {
  const r = sRGBtoLinear(rgb.r);
  const g = sRGBtoLinear(rgb.g);
  const b = sRGBtoLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate WCAG 2.1 contrast ratio between two colors
 * Returns ratio as a number (e.g., 4.5 for 4.5:1)
 */
export function getContrastRatio(foreground: string, background: string): number | null {
  const fgRGB = parseColorToRGB(foreground);
  const bgRGB = parseColorToRGB(background);

  if (!fgRGB || !bgRGB) return null;

  const L1 = getRelativeLuminance(fgRGB);
  const L2 = getRelativeLuminance(bgRGB);

  // Lighter color should be L1
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA for normal text (4.5:1)
 */
export function meetsWCAG_AA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 4.5;
}

/**
 * Check if contrast meets WCAG AA for large text (3:1)
 */
export function meetsWCAG_AA_LargeText(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 3;
}

/**
 * Check if contrast meets WCAG AAA for normal text (7:1)
 */
export function meetsWCAG_AAA(foreground: string, background: string): boolean {
  const ratio = getContrastRatio(foreground, background);
  return ratio !== null && ratio >= 7;
}

// ============================================
// File existence helpers
// ============================================

export function cssFileExists(themeName: string, fileName: string): boolean {
  return existsSync(join(CSS_DIR, themeName, fileName));
}

export function jsonFileExists(themeName: string, fileName: string): boolean {
  return existsSync(join(JSON_DIR, themeName, fileName));
}

export function getDistPath(): string {
  return DIST_DIR;
}

export function getCSSPath(themeName: string): string {
  return join(CSS_DIR, themeName);
}

export function getJSONPath(themeName: string): string {
  return join(JSON_DIR, themeName);
}
