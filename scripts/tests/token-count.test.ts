/**
 * Token Count Regression Tests
 *
 * Prevents accidental token removal by enforcing minimum counts.
 * These thresholds should be updated when intentionally adding/removing tokens.
 *
 * Build structure (multi-theme):
 * - CSS: dist/css/primitives.css + dist/css/{theme}.css per theme
 * - Tokens Studio: dist/tokens-studio/primitives/*.json, semantic/*.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  getThemeNames,
  loadAllCSS,
  parseCSSVariables,
  getDistPath,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

/**
 * Minimum expected token counts.
 * Update these when intentionally adding or removing tokens.
 */
const MIN_TOKEN_COUNTS = {
  cssVariablesTotal: 200, // Minimum total CSS variables (all formats combined)
  ccuiVariables: 50, // Minimum --ccui-* CSS variables
  mantineVariables: 50, // Minimum --mantine-* CSS variables
  neutralVariables: 50, // Minimum neutral (no prefix) CSS variables
  semanticTokens: 10, // Minimum tokens per semantic theme
};

describe('Token Count Regression', () => {
  const themes = getThemeNames();

  describe('Combined CSS Variable Counts', () => {
    const css = loadAllCSS();
    const allVars = parseCSSVariables(css);

    const neutralVars = Array.from(allVars.keys()).filter(
      (k) => !k.startsWith('--ccui-') && !k.startsWith('--mantine-')
    );
    const ccuiVars = Array.from(allVars.keys()).filter((k) => k.startsWith('--ccui-'));
    const mantineVars = Array.from(allVars.keys()).filter((k) => k.startsWith('--mantine-'));

    it(`should have at least ${MIN_TOKEN_COUNTS.cssVariablesTotal} total CSS variables`, () => {
      expect(allVars.size).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.cssVariablesTotal);
    });

    it(`should have at least ${MIN_TOKEN_COUNTS.neutralVariables} neutral CSS variables`, () => {
      expect(neutralVars.length).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.neutralVariables);
    });

    it(`should have at least ${MIN_TOKEN_COUNTS.ccuiVariables} CCUI CSS variables`, () => {
      expect(ccuiVars.length).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.ccuiVariables);
    });

    it(`should have at least ${MIN_TOKEN_COUNTS.mantineVariables} Mantine CSS variables`, () => {
      expect(mantineVars.length).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.mantineVariables);
    });

    it('should report CSS variable counts', () => {
      console.log('CSS variable counts:');
      console.log(`  Total: ${allVars.size}`);
      console.log(`  Neutral (no prefix): ${neutralVars.length}`);
      console.log(`  CCUI (--ccui-*): ${ccuiVars.length}`);
      console.log(`  Mantine (--mantine-*): ${mantineVars.length}`);
      expect(true).toBe(true);
    });
  });

  describe('Semantic Token Counts', () => {
    describe.each(themes)('Theme: %s', (themeName) => {
      const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);

      it(`should have at least ${MIN_TOKEN_COUNTS.semanticTokens} semantic tokens`, () => {
        if (!existsSync(filePath)) {
          return; // Handled by build-output tests
        }

        const content = readFileSync(filePath, 'utf-8');
        const tokens = JSON.parse(content);

        const countTokens = (obj: unknown): number => {
          if (typeof obj !== 'object' || obj === null) return 0;
          let count = 0;
          for (const value of Object.values(obj)) {
            if (typeof value === 'object' && value !== null && '$value' in value) {
              count++;
            } else if (typeof value === 'object') {
              count += countTokens(value);
            }
          }
          return count;
        };

        const tokenCount = countTokens(tokens);
        expect(tokenCount).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.semanticTokens);
      });

      it('should report semantic token count', () => {
        if (!existsSync(filePath)) {
          console.log(`${themeName}: file not found`);
          return;
        }

        const content = readFileSync(filePath, 'utf-8');
        const tokens = JSON.parse(content);

        const countTokens = (obj: unknown): number => {
          if (typeof obj !== 'object' || obj === null) return 0;
          let count = 0;
          for (const value of Object.values(obj)) {
            if (typeof value === 'object' && value !== null && '$value' in value) {
              count++;
            } else if (typeof value === 'object') {
              count += countTokens(value);
            }
          }
          return count;
        };

        console.log(`${themeName}: ${countTokens(tokens)} semantic tokens`);
        expect(true).toBe(true);
      });
    });
  });

  describe('Primitive Token Set Counts', () => {
    const primitiveSets = [
      'color.json',
      'spacing.json',
      'radius.json',
      'typography.json',
      'system.json',
    ];

    it.each(primitiveSets)('primitives/%s should have tokens', (fileName) => {
      const filePath = join(TOKENS_STUDIO_DIR, 'primitives', fileName);
      if (!existsSync(filePath)) {
        return;
      }

      const content = readFileSync(filePath, 'utf-8');
      const tokens = JSON.parse(content);

      const countTokens = (obj: unknown): number => {
        if (typeof obj !== 'object' || obj === null) return 0;
        let count = 0;
        for (const value of Object.values(obj)) {
          if (typeof value === 'object' && value !== null && '$value' in value) {
            count++;
          } else if (typeof value === 'object') {
            count += countTokens(value);
          }
        }
        return count;
      };

      expect(countTokens(tokens)).toBeGreaterThan(0);
    });

    it('should report primitive token set counts', () => {
      console.log('Primitive token set counts:');
      for (const fileName of primitiveSets) {
        const filePath = join(TOKENS_STUDIO_DIR, 'primitives', fileName);
        if (!existsSync(filePath)) {
          console.log(`  ${fileName}: not found`);
          continue;
        }

        const content = readFileSync(filePath, 'utf-8');
        const tokens = JSON.parse(content);

        const countTokens = (obj: unknown): number => {
          if (typeof obj !== 'object' || obj === null) return 0;
          let count = 0;
          for (const value of Object.values(obj)) {
            if (typeof value === 'object' && value !== null && '$value' in value) {
              count++;
            } else if (typeof value === 'object') {
              count += countTokens(value);
            }
          }
          return count;
        };

        console.log(`  ${fileName}: ${countTokens(tokens)} tokens`);
      }
      expect(true).toBe(true);
    });
  });

  describe('Token Count Change Detection', () => {
    it('should detect significant token count changes between themes', () => {
      if (themes.length < 2) {
        console.log('Only one theme - skipping comparison');
        return;
      }

      const counts = themes.map((theme) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
        if (!existsSync(filePath)) {
          return { theme, count: 0 };
        }

        const content = readFileSync(filePath, 'utf-8');
        const tokens = JSON.parse(content);

        const countTokens = (obj: unknown): number => {
          if (typeof obj !== 'object' || obj === null) return 0;
          let count = 0;
          for (const value of Object.values(obj)) {
            if (typeof value === 'object' && value !== null && '$value' in value) {
              count++;
            } else if (typeof value === 'object') {
              count += countTokens(value);
            }
          }
          return count;
        };

        return {
          theme,
          count: countTokens(tokens),
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
      const css = loadAllCSS();
      const vars = parseCSSVariables(css);

      // Filter to just neutral variables for analysis
      const neutralVars = Array.from(vars.keys()).filter(
        (k) => !k.startsWith('--ccui-') && !k.startsWith('--mantine-')
      );

      // Count tokens by prefix/category
      const categories = new Map<string, number>();

      for (const varName of neutralVars) {
        // Get first part after -- prefix
        const withoutPrefix = varName.replace(/^--/, '');
        const category = withoutPrefix.split('-')[0];
        categories.set(category, (categories.get(category) || 0) + 1);
      }

      console.log('\nToken breakdown by category (neutral format):');
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
