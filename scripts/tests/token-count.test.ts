/**
 * Token Count Regression Tests
 *
 * Prevents accidental token removal by enforcing minimum counts.
 * These thresholds should be updated when intentionally adding/removing tokens.
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadFlatTokenJSON,
  loadThemeCSS,
  parseCSSVariables,
} from './test-utils';

/**
 * Minimum expected token counts per category.
 * Update these when intentionally adding or removing tokens.
 *
 * Current baselines (as of initial implementation):
 * - Total tokens: ~90-100 per theme
 * - Color tokens: ~5+ (colorPalette tokens are separate)
 * - Spacing tokens: currently 0 (spacing is in core primitives)
 * - Typography tokens: ~1+ per theme
 */
const MIN_TOKEN_COUNTS = {
  total: 80, // Minimum total tokens per theme (dark=93, light=99)
  colors: 3, // Minimum color-related tokens (theme semantic colors)
  spacing: 0, // Spacing is in core primitives, not theme-specific
  typography: 1, // Minimum typography tokens
  ccuiVariables: 50, // Minimum --ccui-* CSS variables
  mantineVariables: 50, // Minimum --mantine-* CSS variables
};

describe('Token Count Regression', () => {
  const themes = getThemeNames();

  describe.each(themes)('Theme: %s', (themeName) => {
    const flatTokens = loadFlatTokenJSON(themeName);
    const tokenKeys = Object.keys(flatTokens);

    describe('Total Token Counts', () => {
      it(`should have at least ${MIN_TOKEN_COUNTS.total} total tokens`, () => {
        expect(tokenKeys.length).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.total);
      });

      it('should report current token count', () => {
        console.log(`${themeName}: ${tokenKeys.length} total tokens`);
        expect(true).toBe(true);
      });
    });

    describe('Color Token Counts', () => {
      const colorTokens = tokenKeys.filter(
        (key) =>
          key.toLowerCase().includes('color') ||
          key.toLowerCase().includes('background') ||
          (key.toLowerCase().includes('border') &&
            !key.toLowerCase().includes('radius') &&
            !key.toLowerCase().includes('width'))
      );

      it(`should have at least ${MIN_TOKEN_COUNTS.colors} color tokens`, () => {
        expect(colorTokens.length).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.colors);
      });

      it('should report color token count', () => {
        console.log(`${themeName}: ${colorTokens.length} color tokens`);
        expect(true).toBe(true);
      });
    });

    describe('Spacing Token Counts', () => {
      const spacingTokens = tokenKeys.filter(
        (key) =>
          key.toLowerCase().includes('spacing') ||
          key.toLowerCase().includes('gap') ||
          key.toLowerCase().includes('padding') ||
          key.toLowerCase().includes('margin')
      );

      it(`should have at least ${MIN_TOKEN_COUNTS.spacing} spacing tokens`, () => {
        expect(spacingTokens.length).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.spacing);
      });
    });

    describe('Typography Token Counts', () => {
      const typographyTokens = tokenKeys.filter(
        (key) =>
          key.toLowerCase().includes('font') ||
          key.toLowerCase().includes('text') ||
          key.toLowerCase().includes('line-height') ||
          key.toLowerCase().includes('letter-spacing')
      );

      it(`should have at least ${MIN_TOKEN_COUNTS.typography} typography tokens`, () => {
        expect(typographyTokens.length).toBeGreaterThanOrEqual(
          MIN_TOKEN_COUNTS.typography
        );
      });
    });

    describe('CSS Variable Counts', () => {
      // Load theme-specific and shared files
      const ccuiSemanticCSS = loadThemeCSS(themeName, 'ccui-semantic.css');
      const ccuiPrimitivesCSS = loadThemeCSS('shared', 'ccui-primitives.css');
      const ccuiSemanticVars = parseCSSVariables(ccuiSemanticCSS);
      const ccuiPrimitiveVars = parseCSSVariables(ccuiPrimitivesCSS);
      const ccuiCount = Array.from(ccuiSemanticVars.keys()).filter((k) =>
        k.startsWith('--ccui-')
      ).length + Array.from(ccuiPrimitiveVars.keys()).filter((k) =>
        k.startsWith('--ccui-')
      ).length;

      const mantineCSS = loadThemeCSS(themeName, 'mantine-theme.css');
      const mantinePrimitivesCSS = loadThemeCSS('shared', 'mantine-primitives.css');
      const mantineVars = parseCSSVariables(mantineCSS);
      const mantinePrimitiveVars = parseCSSVariables(mantinePrimitivesCSS);
      const mantineCount = Array.from(mantineVars.keys()).filter((k) =>
        k.startsWith('--mantine-')
      ).length + Array.from(mantinePrimitiveVars.keys()).filter((k) =>
        k.startsWith('--mantine-')
      ).length;

      it(`should have at least ${MIN_TOKEN_COUNTS.ccuiVariables} CCUI CSS variables`, () => {
        expect(ccuiCount).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.ccuiVariables);
      });

      it(`should have at least ${MIN_TOKEN_COUNTS.mantineVariables} Mantine CSS variables`, () => {
        expect(mantineCount).toBeGreaterThanOrEqual(
          MIN_TOKEN_COUNTS.mantineVariables
        );
      });

      it('should report CSS variable counts', () => {
        console.log(`${themeName}: ${ccuiCount} CCUI vars, ${mantineCount} Mantine vars`);
        expect(true).toBe(true);
      });
    });
  });

  describe('Token Count Change Detection', () => {
    it('should detect significant token count changes between themes', () => {
      if (themes.length < 2) {
        console.log('Only one theme - skipping comparison');
        return;
      }

      const counts = themes.map((theme) => {
        const flatTokens = loadFlatTokenJSON(theme);
        return {
          theme,
          count: Object.keys(flatTokens).length,
        };
      });

      const maxCount = Math.max(...counts.map((c) => c.count));
      const minCount = Math.min(...counts.map((c) => c.count));

      // Alert if there's more than 10% difference
      const percentDiff = ((maxCount - minCount) / maxCount) * 100;

      if (percentDiff > 10) {
        console.warn(
          `Token count difference between themes: ${percentDiff.toFixed(1)}%`
        );
        counts.forEach(({ theme, count }) => {
          console.warn(`  ${theme}: ${count} tokens`);
        });
      }

      // Don't fail, just warn
      expect(true).toBe(true);
    });
  });

  describe('Category Breakdown', () => {
    it('should report token breakdown by category', () => {
      const theme = themes[0];
      const flatTokens = loadFlatTokenJSON(theme);
      const tokenKeys = Object.keys(flatTokens);

      // Count tokens by prefix/category
      const categories = new Map<string, number>();

      for (const key of tokenKeys) {
        // Get first part of token path
        const category = key.split('.')[0];
        categories.set(category, (categories.get(category) || 0) + 1);
      }

      console.log(`\nToken breakdown for ${theme}:`);
      const sortedCategories = [...categories.entries()].sort(
        (a, b) => b[1] - a[1]
      );
      for (const [category, count] of sortedCategories) {
        console.log(`  ${category}: ${count}`);
      }

      expect(categories.size).toBeGreaterThan(0);
    });
  });
});
