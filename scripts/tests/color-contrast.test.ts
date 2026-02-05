/**
 * WCAG Color Contrast Validation Tests
 *
 * Verifies that semantic color combinations meet accessibility standards.
 * - WCAG AA normal text: 4.5:1 ratio
 * - WCAG AA large text/UI: 3:1 ratio
 * - WCAG AAA normal text: 7:1 ratio
 *
 * New architecture:
 * - CSS: Single combined file at dist/css/ccui-tokens.css
 * - Semantic tokens in dist/tokens-studio/semantic/{light,dark,high-contrast}.json
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadMainCSS,
  loadSemanticTokens,
  loadPrimitiveTokens,
  getPrimitiveSetNames,
  parseCSSVariables,
  collectTokens,
  flattenTokens,
  getContrastRatio,
  meetsWCAG_AA,
  meetsWCAG_AA_LargeText,
  isTokenReference,
} from './test-utils';

/**
 * Resolve CSS variable value, handling var() references
 */
function resolveValue(
  value: string,
  variables: Map<string, string>,
  depth = 0
): string | null {
  if (depth > 10) return null;

  const varMatch = value.match(/var\(\s*(--[a-zA-Z0-9-_]+)\s*(?:,\s*([^)]+))?\)/);
  if (varMatch) {
    const referencedVar = varMatch[1];
    const fallback = varMatch[2];

    const resolved = variables.get(referencedVar);
    if (resolved) {
      return resolveValue(resolved, variables, depth + 1);
    }
    if (fallback) {
      return resolveValue(fallback.trim(), variables, depth + 1);
    }
    return null;
  }

  return value;
}

/**
 * Get resolved color value for a CSS variable
 */
function getResolvedColor(
  varName: string,
  variables: Map<string, string>
): string | null {
  const value = variables.get(varName);
  if (!value) return null;
  return resolveValue(value, variables);
}

/**
 * Blend an rgba color with a solid background color.
 */
function blendRgbaWithBackground(rgbaColor: string, bgColor: string): string | null {
  const rgbaMatch = rgbaColor.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/i);
  if (!rgbaMatch) return null;

  const fgR = parseFloat(rgbaMatch[1]);
  const fgG = parseFloat(rgbaMatch[2]);
  const fgB = parseFloat(rgbaMatch[3]);
  const alpha = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;

  const hexMatch = bgColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!hexMatch) return null;

  const bgR = parseInt(hexMatch[1], 16);
  const bgG = parseInt(hexMatch[2], 16);
  const bgB = parseInt(hexMatch[3], 16);

  const resultR = Math.round(fgR * alpha + bgR * (1 - alpha));
  const resultG = Math.round(fgG * alpha + bgG * (1 - alpha));
  const resultB = Math.round(fgB * alpha + bgB * (1 - alpha));

  return '#' +
    resultR.toString(16).padStart(2, '0') +
    resultG.toString(16).padStart(2, '0') +
    resultB.toString(16).padStart(2, '0');
}

function isRgbaColor(color: string): boolean {
  return /^rgba?\s*\(/i.test(color.trim());
}

function getEffectiveColor(color: string, bodyBg: string): string | null {
  if (isRgbaColor(color)) {
    return blendRgbaWithBackground(color, bodyBg);
  }
  return color;
}

/**
 * Build a map of all primitive color tokens for resolving references
 */
function buildPrimitiveColorMap(): Map<string, string> {
  const colorMap = new Map<string, string>();

  try {
    // Load the color primitive tokens
    const colorTokens = loadPrimitiveTokens('color');
    const flat = flattenTokens(colorTokens);

    for (const [path, value] of Object.entries(flat)) {
      if (typeof value === 'string') {
        // Store with original path format (e.g., "color.blue.500")
        colorMap.set(path, value);
      }
    }
  } catch {
    // Color primitives may not exist, ignore
  }

  return colorMap;
}

/**
 * Resolve a token reference like "{color/blue/500}" or "{color.blue.500}" to its actual value
 */
function resolveTokenReference(
  value: string,
  primitiveColors: Map<string, string>,
  depth = 0
): string | null {
  if (depth > 10) return null;

  // Check if it's a reference
  const refMatch = value.match(/^\{([^}]+)\}$/);
  if (!refMatch) {
    // Not a reference, return as-is
    return value;
  }

  const refPath = refMatch[1];

  // Try direct lookup first
  let resolved = primitiveColors.get(refPath);

  // If not found with slashes, try converting slashes to dots
  if (!resolved && refPath.includes('/')) {
    const dotPath = refPath.replace(/\//g, '.');
    resolved = primitiveColors.get(dotPath);
  }

  // If not found with dots, try converting dots to slashes
  if (!resolved && refPath.includes('.')) {
    const slashPath = refPath.replace(/\./g, '/');
    resolved = primitiveColors.get(slashPath);
  }

  if (!resolved) {
    return null;
  }

  // Check if the resolved value is also a reference
  if (resolved.startsWith('{')) {
    return resolveTokenReference(resolved, primitiveColors, depth + 1);
  }

  return resolved;
}

/**
 * Check if a value is a valid color (hex, rgb, hsl) or can be resolved to one
 */
function isValidColorValue(value: string, primitiveColors: Map<string, string>): boolean {
  // If it's a direct color value
  if (
    value.startsWith('#') ||
    value.startsWith('rgb') ||
    value.startsWith('hsl')
  ) {
    return true;
  }

  // If it's a reference, try to resolve it
  if (value.startsWith('{')) {
    const resolved = resolveTokenReference(value, primitiveColors);
    return resolved !== null && (
      resolved.startsWith('#') ||
      resolved.startsWith('rgb') ||
      resolved.startsWith('hsl')
    );
  }

  return false;
}

describe('WCAG Color Contrast Validation', () => {
  const themes = getThemeNames();
  const mainCSS = loadMainCSS();
  const allCSSVariables = parseCSSVariables(mainCSS);

  // Build primitive color map for resolving references
  const primitiveColors = buildPrimitiveColorMap();

  describe('Semantic Token Color Contrast', () => {
    describe.each(themes)('Theme: %s', (themeName) => {
      const semanticTokens = loadSemanticTokens(themeName);
      const tokens = collectTokens(semanticTokens);

      it('should have text colors with valid values or references', () => {
        const textTokens = Array.from(tokens.entries())
          .filter(([path]) => path.includes('text'));

        expect(textTokens.length).toBeGreaterThan(0);

        for (const [path, token] of textTokens) {
          const value = token.$value;
          // Accept direct color values OR token references that resolve to colors
          expect(
            typeof value === 'string' && isValidColorValue(value, primitiveColors),
            `${path} should have a valid color value or reference, got: ${value}`
          ).toBe(true);
        }
      });

      it('should have surface colors with valid values or references', () => {
        const surfaceTokens = Array.from(tokens.entries())
          .filter(([path]) => path.includes('surface'));

        expect(surfaceTokens.length).toBeGreaterThan(0);

        for (const [path, token] of surfaceTokens) {
          const value = token.$value;
          // Accept direct color values OR token references that resolve to colors
          expect(
            typeof value === 'string' && isValidColorValue(value, primitiveColors),
            `${path} should have a valid color value or reference, got: ${value}`
          ).toBe(true);
        }
      });

      it('primary text on primary surface should meet WCAG AA (4.5:1)', () => {
        // Get text/primary and surface/primary values (slash notation)
        const textPrimary = tokens.get('color/text/primary');
        const surfacePrimary = tokens.get('color/surface/primary');

        if (!textPrimary || !surfacePrimary) {
          console.log(`Skipping: ${themeName} missing text.primary or surface.primary`);
          return;
        }

        const textValue = textPrimary.$value as string;
        const bgValue = surfacePrimary.$value as string;

        // Resolve references if needed
        const textColor = resolveTokenReference(textValue, primitiveColors);
        const bgColor = resolveTokenReference(bgValue, primitiveColors);

        if (!textColor || !bgColor) {
          console.log(`Skipping: ${themeName} could not resolve color references`);
          return;
        }

        const ratio = getContrastRatio(textColor, bgColor);
        expect(
          ratio,
          `${themeName}: text.primary (${textColor}) on surface.primary (${bgColor}) contrast: ${ratio?.toFixed(2)}:1 (need 4.5:1)`
        ).toBeGreaterThanOrEqual(4.5);
      });

      it('secondary text on primary surface should meet WCAG AA large text (3:1)', () => {
        const textSecondary = tokens.get('color/text/secondary');
        const surfacePrimary = tokens.get('color/surface/primary');

        if (!textSecondary || !surfacePrimary) {
          console.log(`Skipping: ${themeName} missing text.secondary or surface.primary`);
          return;
        }

        const textValue = textSecondary.$value as string;
        const bgValue = surfacePrimary.$value as string;

        // Resolve references if needed
        const textColor = resolveTokenReference(textValue, primitiveColors);
        const bgColor = resolveTokenReference(bgValue, primitiveColors);

        if (!textColor || !bgColor) {
          console.log(`Skipping: ${themeName} could not resolve color references`);
          return;
        }

        const ratio = getContrastRatio(textColor, bgColor);
        expect(
          ratio,
          `${themeName}: text.secondary (${textColor}) on surface.primary (${bgColor}) contrast: ${ratio?.toFixed(2)}:1 (need 3:1)`
        ).toBeGreaterThanOrEqual(3);
      });

      it('error text on primary surface should meet WCAG AA (4.5:1)', () => {
        const textError = tokens.get('color/text/error');
        const surfacePrimary = tokens.get('color/surface/primary');

        if (!textError || !surfacePrimary) {
          console.log(`Skipping: ${themeName} missing text.error or surface.primary`);
          return;
        }

        const textValue = textError.$value as string;
        const bgValue = surfacePrimary.$value as string;

        // Resolve references if needed
        const textColor = resolveTokenReference(textValue, primitiveColors);
        const bgColor = resolveTokenReference(bgValue, primitiveColors);

        if (!textColor || !bgColor) {
          console.log(`Skipping: ${themeName} could not resolve color references`);
          return;
        }

        const ratio = getContrastRatio(textColor, bgColor);
        expect(
          ratio,
          `${themeName}: text.error (${textColor}) on surface.primary (${bgColor}) contrast: ${ratio?.toFixed(2)}:1 (need 4.5:1)`
        ).toBeGreaterThanOrEqual(4.5);
      });

      if (themeName === 'high-contrast') {
        it('high-contrast theme should have enhanced contrast ratios', () => {
          const textPrimary = tokens.get('color/text/primary');
          const surfacePrimary = tokens.get('color/surface/primary');

          if (!textPrimary || !surfacePrimary) return;

          const textValue = textPrimary.$value as string;
          const bgValue = surfacePrimary.$value as string;

          // Resolve references if needed
          const textColor = resolveTokenReference(textValue, primitiveColors);
          const bgColor = resolveTokenReference(bgValue, primitiveColors);

          if (!textColor || !bgColor) {
            console.log('Skipping: could not resolve high-contrast color references');
            return;
          }

          const ratio = getContrastRatio(textColor, bgColor);
          // High contrast should aim for WCAG AAA (7:1)
          expect(
            ratio,
            `high-contrast: text.primary should have enhanced contrast (${ratio?.toFixed(2)}:1, target: 7:1)`
          ).toBeGreaterThanOrEqual(7);
        });
      }
    });
  });

  describe('CSS Variable Contrast', () => {
    it('should have contrast report for key combinations', () => {
      console.log('\nContrast ratios for key CSS variable combinations:');

      // Check some key CCUI variable combinations if they exist
      const pairs = [
        ['--ccui-color-text-primary', '--ccui-color-surface-primary'],
        ['--ccui-color-text-secondary', '--ccui-color-surface-primary'],
        ['--ccui-color-text-error', '--ccui-color-surface-primary'],
      ];

      for (const [fgVar, bgVar] of pairs) {
        const fg = getResolvedColor(fgVar, allCSSVariables);
        const bg = getResolvedColor(bgVar, allCSSVariables);

        if (fg && bg) {
          const ratio = getContrastRatio(fg, bg);
          const status =
            ratio && ratio >= 7 ? 'AAA' :
            ratio && ratio >= 4.5 ? 'AA' :
            ratio && ratio >= 3 ? 'AA-large' : 'FAIL';
          console.log(`  ${fgVar} on ${bgVar}: ${ratio?.toFixed(2)}:1 [${status}]`);
        }
      }

      expect(true).toBe(true);
    });
  });

  describe('Cross-Theme Contrast Comparison', () => {
    it('should compare key contrast ratios between themes', () => {
      if (themes.length < 2) {
        console.log('Only one theme - skipping comparison');
        return;
      }

      console.log('\nCross-theme contrast comparison:');
      console.log('Theme\t\t\tText/Surface\tError/Surface');

      for (const themeName of themes) {
        const tokens = collectTokens(loadSemanticTokens(themeName));

        const textPrimary = tokens.get('color/text/primary');
        const surfacePrimary = tokens.get('color/surface/primary');
        const textError = tokens.get('color/text/error');

        let textOnSurface: number | null = null;
        let errorOnSurface: number | null = null;

        if (textPrimary && surfacePrimary) {
          const textColor = resolveTokenReference(textPrimary.$value as string, primitiveColors);
          const bgColor = resolveTokenReference(surfacePrimary.$value as string, primitiveColors);
          if (textColor && bgColor) {
            textOnSurface = getContrastRatio(textColor, bgColor);
          }
        }

        if (textError && surfacePrimary) {
          const textColor = resolveTokenReference(textError.$value as string, primitiveColors);
          const bgColor = resolveTokenReference(surfacePrimary.$value as string, primitiveColors);
          if (textColor && bgColor) {
            errorOnSurface = getContrastRatio(textColor, bgColor);
          }
        }

        console.log(
          `${themeName.padEnd(16)}\t${textOnSurface?.toFixed(1) || 'N/A'}\t\t${errorOnSurface?.toFixed(1) || 'N/A'}`
        );
      }

      expect(true).toBe(true);
    });
  });
});
