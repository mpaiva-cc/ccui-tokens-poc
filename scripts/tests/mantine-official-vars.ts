/**
 * Mantine 8.x Official CSS Variables Whitelist
 *
 * This file defines the exact list of CSS variables that Mantine 8.x uses.
 * The mantine-theme.css output should contain ONLY these variables.
 * Any CCUI-specific extensions should go to ccui-tokens.css instead.
 *
 * Reference: https://mantine.dev/styles/css-variables-list/
 */

// Mantine color palette names
export const MANTINE_COLOR_PALETTES = [
  'dark',
  'gray',
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
] as const;

// Color shades (0-9)
export const MANTINE_COLOR_SHADES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

// Color variants for each palette
export const MANTINE_COLOR_VARIANTS = [
  'filled',
  'filled-hover',
  'light',
  'light-hover',
  'light-color',
  'outline',
  'outline-hover',
  'text',
] as const;

// Semantic colors
export const MANTINE_SEMANTIC_COLORS = [
  'white',
  'black',
  'text',
  'body',
  'bright',
  'error',
  'placeholder',
  'anchor',
  'dimmed',
  'default',
  'default-hover',
  'default-color',
  'default-border',
  'disabled',
  'disabled-color',
  'disabled-border',
] as const;

// Primary color variants
export const MANTINE_PRIMARY_VARIANTS = [
  'filled',
  'filled-hover',
  'light',
  'light-hover',
  'light-color',
  'contrast',
  'outline',
  'outline-hover',
] as const;

// Size scale (used by spacing, radius, shadows, font-sizes, line-heights)
export const MANTINE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

// Breakpoints
export const MANTINE_BREAKPOINTS = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

// Z-index layers
export const MANTINE_Z_INDEX_LAYERS = [
  'app',
  'modal',
  'popover',
  'overlay',
  'max',
] as const;

// Heading levels
export const MANTINE_HEADING_LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

// Heading properties
export const MANTINE_HEADING_PROPS = [
  'font-size',
  'font-weight',
  'line-height',
] as const;

/**
 * Generate the complete list of official Mantine CSS variable names
 */
export function generateMantineOfficialVars(): Set<string> {
  const vars = new Set<string>();

  // Core settings
  vars.add('--mantine-scale');
  vars.add('--mantine-cursor-type');
  vars.add('--mantine-webkit-font-smoothing');
  vars.add('--mantine-moz-font-smoothing');
  vars.add('--mantine-color-scheme');

  // Typography core
  vars.add('--mantine-font-family');
  vars.add('--mantine-font-family-monospace');
  vars.add('--mantine-font-family-headings');
  vars.add('--mantine-line-height');
  vars.add('--mantine-heading-font-weight');
  vars.add('--mantine-heading-text-wrap');

  // Radius default
  vars.add('--mantine-radius-default');

  // Color palettes (0-9 shades + variants)
  for (const palette of MANTINE_COLOR_PALETTES) {
    for (const shade of MANTINE_COLOR_SHADES) {
      vars.add(`--mantine-color-${palette}-${shade}`);
    }
    for (const variant of MANTINE_COLOR_VARIANTS) {
      vars.add(`--mantine-color-${palette}-${variant}`);
    }
  }

  // Semantic colors
  for (const color of MANTINE_SEMANTIC_COLORS) {
    vars.add(`--mantine-color-${color}`);
  }

  // Primary color (0-9 shades + variants)
  for (const shade of MANTINE_COLOR_SHADES) {
    vars.add(`--mantine-primary-color-${shade}`);
  }
  for (const variant of MANTINE_PRIMARY_VARIANTS) {
    vars.add(`--mantine-primary-color-${variant}`);
  }

  // Spacing
  for (const size of MANTINE_SIZES) {
    vars.add(`--mantine-spacing-${size}`);
  }

  // Radius
  for (const size of MANTINE_SIZES) {
    vars.add(`--mantine-radius-${size}`);
  }

  // Shadows
  for (const size of MANTINE_SIZES) {
    vars.add(`--mantine-shadow-${size}`);
  }

  // Font sizes
  for (const size of MANTINE_SIZES) {
    vars.add(`--mantine-font-size-${size}`);
  }

  // Line heights
  for (const size of MANTINE_SIZES) {
    vars.add(`--mantine-line-height-${size}`);
  }

  // Breakpoints
  for (const bp of MANTINE_BREAKPOINTS) {
    vars.add(`--mantine-breakpoint-${bp}`);
  }

  // Z-index
  for (const layer of MANTINE_Z_INDEX_LAYERS) {
    vars.add(`--mantine-z-index-${layer}`);
  }

  // Headings (h1-h6)
  for (const level of MANTINE_HEADING_LEVELS) {
    for (const prop of MANTINE_HEADING_PROPS) {
      vars.add(`--mantine-${level}-${prop}`);
    }
  }

  return vars;
}

/**
 * Check if a variable name is an official Mantine variable
 */
export function isOfficialMantineVar(varName: string): boolean {
  const officialVars = generateMantineOfficialVars();
  return officialVars.has(varName);
}

/**
 * Get the count of official Mantine variables
 */
export function getOfficialMantineVarCount(): number {
  return generateMantineOfficialVars().size;
}

// Pre-generate for performance
export const MANTINE_OFFICIAL_VARS = generateMantineOfficialVars();

/**
 * Variables that CCUI adds but are NOT in Mantine official
 * These should go to ccui-tokens.css instead
 */
export const CCUI_EXTENSION_PATTERNS = [
  /^--mantine-gridSpacing-/,
  /^--mantine-verticalRhythm-/,
  /^--mantine-contentWidth-/,
  /^--mantine-borderWidth-/,
  /^--mantine-borderStyle-/,
  /^--mantine-focus-ring-/,
  /^--mantine-duration-/,
  /^--mantine-easing-/,
  /^--mantine-opacity-/,
  /^--mantine-fontSize-(2xl|3xl|4xl)/,
  /^--mantine-fontFamily-(sans|display|mono)/,
  /^--mantine-fontWeight-/,
  /^--mantine-lineHeight-/,  // camelCase version
  /^--mantine-shadow-(inset|footer|none)/,
  /^--mantine-radius-full/,
  /^--mantine-breakpoints-/,  // plural version (should be singular)
  /^--mantine-zIndex-/,  // camelCase version (should be kebab-case)
] as const;

/**
 * Check if a variable is a CCUI extension (not official Mantine)
 */
export function isCCUIExtension(varName: string): boolean {
  return CCUI_EXTENSION_PATTERNS.some(pattern => pattern.test(varName));
}
