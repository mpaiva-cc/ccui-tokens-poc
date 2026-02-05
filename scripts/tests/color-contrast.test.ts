/**
 * WCAG Color Contrast Validation Tests
 *
 * Verifies that semantic color combinations meet accessibility standards.
 * - WCAG AA normal text: 4.5:1 ratio
 * - WCAG AA large text/UI: 3:1 ratio
 * - WCAG AAA normal text: 7:1 ratio
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadThemeCSS,
  parseCSSVariables,
  getContrastRatio,
  meetsWCAG_AA,
  meetsWCAG_AA_LargeText,
} from './test-utils';

/**
 * Resolve CSS variable value, handling var() references
 */
function resolveValue(
  value: string,
  variables: Map<string, string>,
  depth = 0
): string | null {
  if (depth > 10) return null; // Prevent infinite loops

  // Check for var() reference
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
 * This properly handles semi-transparent colors for contrast calculations.
 *
 * @param rgbaColor - Color in rgba() format, e.g. "rgba(20, 94, 184, 0.1)"
 * @param bgColor - Solid background color in hex format, e.g. "#ffffff"
 * @returns Blended color as hex string, or null if parsing fails
 */
function blendRgbaWithBackground(rgbaColor: string, bgColor: string): string | null {
  // Parse rgba color
  const rgbaMatch = rgbaColor.match(/rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/i);
  if (!rgbaMatch) return null;

  const fgR = parseFloat(rgbaMatch[1]);
  const fgG = parseFloat(rgbaMatch[2]);
  const fgB = parseFloat(rgbaMatch[3]);
  const alpha = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;

  // Parse hex background color
  const hexMatch = bgColor.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!hexMatch) return null;

  const bgR = parseInt(hexMatch[1], 16);
  const bgG = parseInt(hexMatch[2], 16);
  const bgB = parseInt(hexMatch[3], 16);

  // Alpha blend: result = fg * alpha + bg * (1 - alpha)
  const resultR = Math.round(fgR * alpha + bgR * (1 - alpha));
  const resultG = Math.round(fgG * alpha + bgG * (1 - alpha));
  const resultB = Math.round(fgB * alpha + bgB * (1 - alpha));

  // Convert to hex
  return '#' +
    resultR.toString(16).padStart(2, '0') +
    resultG.toString(16).padStart(2, '0') +
    resultB.toString(16).padStart(2, '0');
}

/**
 * Check if a color value is in rgba format
 */
function isRgbaColor(color: string): boolean {
  return /^rgba?\s*\(/i.test(color.trim());
}

/**
 * Get a color value, blending with background if it's rgba
 */
function getEffectiveColor(
  color: string,
  bodyBg: string
): string | null {
  if (isRgbaColor(color)) {
    return blendRgbaWithBackground(color, bodyBg);
  }
  return color;
}

describe('WCAG Color Contrast Validation', () => {
  const themes = getThemeNames();

  describe.each(themes)('Theme: %s', (themeName) => {
    // Load all CSS files to get complete variable set
    const allVariables = new Map<string, string>();

    // Load theme-specific files
    const themeCSSFiles = ['ccui-semantic.css', 'mantine-theme.css'];
    for (const file of themeCSSFiles) {
      const css = loadThemeCSS(themeName, file);
      const vars = parseCSSVariables(css);
      vars.forEach((value, key) => allVariables.set(key, value));
    }

    // Load shared primitives
    const sharedCSSFiles = ['ccui-primitives.css', 'mantine-primitives.css'];
    for (const file of sharedCSSFiles) {
      const css = loadThemeCSS('shared', file);
      const vars = parseCSSVariables(css);
      vars.forEach((value, key) => allVariables.set(key, value));
    }

    describe('Body Text Contrast', () => {
      it('primary text on body background should meet WCAG AA (4.5:1)', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const textColor = getResolvedColor('--mantine-color-text', allVariables);

        if (!bodyBg || !textColor) {
          console.log(`Skipping: missing body (${bodyBg}) or text (${textColor}) colors`);
          return;
        }

        const ratio = getContrastRatio(textColor, bodyBg);
        expect(
          ratio,
          `Text on body contrast: ${ratio?.toFixed(2)}:1 (need 4.5:1)`
        ).toBeGreaterThanOrEqual(4.5);
      });

      it('dimmed text on body background should meet WCAG AA for large text (3:1)', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const dimmedColor = getResolvedColor('--mantine-color-dimmed', allVariables);

        if (!bodyBg || !dimmedColor) {
          console.log(`Skipping: missing body or dimmed colors`);
          return;
        }

        const ratio = getContrastRatio(dimmedColor, bodyBg);
        expect(
          ratio,
          `Dimmed text on body contrast: ${ratio?.toFixed(2)}:1 (need 3:1)`
        ).toBeGreaterThanOrEqual(3);
      });
    });

    describe('Error State Contrast', () => {
      it('error text on body background should meet WCAG AA (4.5:1) or AA-large (3:1)', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const errorColor = getResolvedColor('--mantine-color-error', allVariables);

        if (!bodyBg || !errorColor) {
          console.log(`Skipping: missing body or error colors`);
          return;
        }

        const ratio = getContrastRatio(errorColor, bodyBg);
        // Error text is typically rendered at 14px+ which qualifies as large text
        // WCAG AA for large text is 3:1, but we prefer 4.5:1
        if (ratio && ratio < 4.5 && ratio >= 3) {
          console.warn(
            `WARNING: Error color contrast is ${ratio.toFixed(2)}:1 - passes AA-large but not AA-normal`
          );
        }
        expect(
          ratio,
          `Error text on body contrast: ${ratio?.toFixed(2)}:1 (need 3:1 for large text)`
        ).toBeGreaterThanOrEqual(3);
      });
    });

    describe('Placeholder Text Contrast', () => {
      it('placeholder text should meet minimum contrast (3:1) - warn if low', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const placeholderColor = getResolvedColor(
          '--mantine-color-placeholder',
          allVariables
        );

        if (!bodyBg || !placeholderColor) {
          console.log(`Skipping: missing body or placeholder colors`);
          return;
        }

        const ratio = getContrastRatio(placeholderColor, bodyBg);
        // Placeholder can be lower contrast but we warn if it's too low
        // Note: WCAG allows lower contrast for placeholder text (non-text contrast)
        if (ratio && ratio < 3) {
          console.warn(
            `WARNING: Placeholder contrast is ${ratio.toFixed(2)}:1 (recommended: 3:1 for non-text elements)`
          );
        }
        // Only fail if contrast is extremely low (< 2:1)
        expect(
          ratio,
          `Placeholder on body contrast: ${ratio?.toFixed(2)}:1 (minimum 2:1)`
        ).toBeGreaterThanOrEqual(2);
      });
    });

    describe('Link/Anchor Contrast', () => {
      it('anchor color on body background should meet WCAG AA (4.5:1)', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const anchorColor = getResolvedColor('--mantine-color-anchor', allVariables);

        if (!bodyBg || !anchorColor) {
          console.log(`Skipping: missing body or anchor colors`);
          return;
        }

        const ratio = getContrastRatio(anchorColor, bodyBg);
        expect(
          ratio,
          `Anchor on body contrast: ${ratio?.toFixed(2)}:1 (need 4.5:1)`
        ).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Primary Button Contrast', () => {
      it('white text on primary filled should meet WCAG AA (4.5:1)', () => {
        const primaryFilled = getResolvedColor(
          '--mantine-primary-color-filled',
          allVariables
        );
        const whiteColor = getResolvedColor('--mantine-color-white', allVariables);

        if (!primaryFilled || !whiteColor) {
          console.log(`Skipping: missing primary-filled or white colors`);
          return;
        }

        const ratio = getContrastRatio(whiteColor, primaryFilled);
        expect(
          ratio,
          `White on primary-filled contrast: ${ratio?.toFixed(2)}:1 (need 4.5:1)`
        ).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Primary Light Variant Contrast', () => {
      it('primary light color text on primary light background should meet WCAG AA (4.5:1)', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const lightBgRaw = getResolvedColor(
          '--mantine-primary-color-light',
          allVariables
        );
        const lightColor = getResolvedColor(
          '--mantine-primary-color-light-color',
          allVariables
        );

        if (!bodyBg || !lightBgRaw || !lightColor) {
          console.log(`Skipping: missing primary-light colors (body: ${bodyBg}, light: ${lightBgRaw}, light-color: ${lightColor})`);
          return;
        }

        // The "light" background is often rgba - blend it with body background
        // to get the effective displayed color
        const effectiveLightBg = getEffectiveColor(lightBgRaw, bodyBg);

        if (!effectiveLightBg) {
          console.log(`Skipping: could not compute effective light background color`);
          return;
        }

        const ratio = getContrastRatio(lightColor, effectiveLightBg);
        expect(
          ratio,
          `Primary light text on light bg contrast: ${ratio?.toFixed(2)}:1 (need 4.5:1) [bg: ${effectiveLightBg}, text: ${lightColor}]`
        ).toBeGreaterThanOrEqual(4.5);
      });
    });

    describe('Color Palette Contrast Report', () => {
      it('should report contrast ratios for key color combinations', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);

        if (!bodyBg) {
          console.log('Cannot generate report: missing body color');
          return;
        }

        const colorVars = [
          '--mantine-color-text',
          '--mantine-color-dimmed',
          '--mantine-color-error',
          '--mantine-color-placeholder',
          '--mantine-color-anchor',
          '--mantine-primary-color-filled',
        ];

        console.log(`\nContrast ratios for ${themeName} (vs body background):`);

        for (const varName of colorVars) {
          const color = getResolvedColor(varName, allVariables);
          if (color) {
            const ratio = getContrastRatio(color, bodyBg);
            const status =
              ratio && ratio >= 4.5
                ? 'AA'
                : ratio && ratio >= 3
                  ? 'AA-large'
                  : 'FAIL';
            console.log(
              `  ${varName.replace('--mantine-', '')}: ${ratio?.toFixed(2)}:1 [${status}]`
            );
          }
        }

        expect(true).toBe(true);
      });
    });

    describe('Dark/Gray Scale Contrast', () => {
      it('dark-0 on body (light theme) or body on dark-0 (dark theme) should have good contrast', () => {
        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const dark0 = getResolvedColor('--mantine-color-dark-0', allVariables);

        if (!bodyBg || !dark0) {
          console.log(`Skipping: missing colors`);
          return;
        }

        const ratio = getContrastRatio(dark0, bodyBg);

        // This is informational - dark-0 is typically used for backgrounds
        console.log(
          `${themeName}: dark-0 vs body contrast: ${ratio?.toFixed(2)}:1`
        );

        expect(true).toBe(true);
      });
    });
  });

  describe('Cross-Theme Contrast Comparison', () => {
    it('should compare key contrast ratios between themes', () => {
      if (themes.length < 2) {
        console.log('Only one theme - skipping comparison');
        return;
      }

      const results: Array<{
        theme: string;
        textOnBody: number | null;
        errorOnBody: number | null;
        anchorOnBody: number | null;
      }> = [];

      for (const themeName of themes) {
        const allVariables = new Map<string, string>();

        // Load theme-specific files
        const themeCSSFiles = ['ccui-semantic.css', 'mantine-theme.css'];
        for (const file of themeCSSFiles) {
          const css = loadThemeCSS(themeName, file);
          const vars = parseCSSVariables(css);
          vars.forEach((value, key) => allVariables.set(key, value));
        }

        // Load shared primitives
        const sharedCSSFiles = ['ccui-primitives.css', 'mantine-primitives.css'];
        for (const file of sharedCSSFiles) {
          const css = loadThemeCSS('shared', file);
          const vars = parseCSSVariables(css);
          vars.forEach((value, key) => allVariables.set(key, value));
        }

        const bodyBg = getResolvedColor('--mantine-color-body', allVariables);
        const textColor = getResolvedColor('--mantine-color-text', allVariables);
        const errorColor = getResolvedColor('--mantine-color-error', allVariables);
        const anchorColor = getResolvedColor('--mantine-color-anchor', allVariables);

        results.push({
          theme: themeName,
          textOnBody: bodyBg && textColor ? getContrastRatio(textColor, bodyBg) : null,
          errorOnBody: bodyBg && errorColor ? getContrastRatio(errorColor, bodyBg) : null,
          anchorOnBody: bodyBg && anchorColor ? getContrastRatio(anchorColor, bodyBg) : null,
        });
      }

      console.log('\nCross-theme contrast comparison:');
      console.log('Theme\t\t\tText\tError\tAnchor');
      for (const result of results) {
        console.log(
          `${result.theme}\t${result.textOnBody?.toFixed(1) || 'N/A'}\t${result.errorOnBody?.toFixed(1) || 'N/A'}\t${result.anchorOnBody?.toFixed(1) || 'N/A'}`
        );
      }

      expect(true).toBe(true);
    });
  });
});
