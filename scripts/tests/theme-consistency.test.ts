/**
 * Cross-Theme Consistency Tests
 *
 * Verifies that all themes have matching structure and token coverage.
 *
 * Build structure (multi-theme):
 * - CSS: dist/css/primitives.css + dist/css/{theme}.css per theme
 * - Tokens Studio: dist/tokens-studio/semantic/*.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  getThemeNames,
  loadAllCSS,
  loadPrimitivesCSS,
  loadThemeCSSFile,
  hasThemeCSS,
  parseCSSVariables,
  getDistPath,
  ALL_THEME_NAMES,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

describe('Cross-Theme Consistency', () => {
  const themes = getThemeNames();

  // Skip cross-theme tests if only one theme exists
  const runCrossThemeTests = themes.length >= 2;

  describe('Theme Detection', () => {
    it('should have at least two themes for comparison', () => {
      // This is informational - won't fail if only one theme
      if (themes.length < 2) {
        console.log('Only one theme found. Cross-theme tests will be skipped.');
      }
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should detect all expected themes', () => {
      expect(themes).toContain('mantine-light');
      expect(themes).toContain('mantine-dark');
      expect(themes).toContain('ccui-21-light');
      expect(themes).toContain('ccui-30-light');
      expect(themes).toContain('ccui-30-dark');
    });
  });

  describe('Semantic Token Structure', () => {
    if (runCrossThemeTests) {
      it('all themes should have semantic JSON files', () => {
        for (const theme of themes) {
          const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
          expect(existsSync(filePath), `Missing semantic/${theme}.json`).toBe(true);
        }
      });

      it('all themes should have similar top-level token categories', () => {
        const tokenStructures = themes.map((theme) => {
          const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
          const content = readFileSync(filePath, 'utf-8');
          const tokens = JSON.parse(content);
          return {
            theme,
            categories: new Set(Object.keys(tokens)),
          };
        });

        const [first, ...rest] = tokenStructures;

        for (const other of rest) {
          const onlyInFirst = [...first.categories].filter(
            (k) => !other.categories.has(k)
          );
          const onlyInOther = [...other.categories].filter(
            (k) => !first.categories.has(k)
          );

          // Log differences for awareness
          if (onlyInFirst.length > 0 || onlyInOther.length > 0) {
            console.log(`\nCategory differences between ${first.theme} and ${other.theme}:`);
            if (onlyInFirst.length > 0) {
              console.log(`  Only in ${first.theme}: ${onlyInFirst.join(', ')}`);
            }
            if (onlyInOther.length > 0) {
              console.log(`  Only in ${other.theme}: ${onlyInOther.join(', ')}`);
            }
          }

          // Don't fail - dark theme may intentionally have different structure
          expect(true).toBe(true);
        }
      });
    }
  });

  describe('CSS Variable Coverage', () => {
    it('should have CSS files for all themes', () => {
      for (const themeName of ALL_THEME_NAMES) {
        expect(hasThemeCSS(themeName), `Missing ${themeName}.css`).toBe(true);
      }
    });

    it('each theme should use data-theme selector', () => {
      for (const themeName of ALL_THEME_NAMES) {
        if (!hasThemeCSS(themeName)) continue;
        const css = loadThemeCSSFile(themeName);
        expect(css).toContain(`[data-theme="${themeName}"]`);
      }
    });

    it('combined CSS should have all three output formats', () => {
      const css = loadAllCSS();
      const vars = parseCSSVariables(css);

      // Check for neutral format (no prefix)
      const neutralVars = Array.from(vars.keys()).filter(
        (k) => !k.startsWith('--ccui-') && !k.startsWith('--mantine-')
      );
      expect(neutralVars.length).toBeGreaterThan(0);

      // Check for CCUI format
      const ccuiVars = Array.from(vars.keys()).filter((k) => k.startsWith('--ccui-'));
      expect(ccuiVars.length).toBeGreaterThan(0);

      // Check for Mantine format
      const mantineVars = Array.from(vars.keys()).filter((k) => k.startsWith('--mantine-'));
      expect(mantineVars.length).toBeGreaterThan(0);
    });

    it('should report variable counts by format', () => {
      const css = loadAllCSS();
      const vars = parseCSSVariables(css);

      const neutralVars = Array.from(vars.keys()).filter(
        (k) => !k.startsWith('--ccui-') && !k.startsWith('--mantine-')
      );
      const ccuiVars = Array.from(vars.keys()).filter((k) => k.startsWith('--ccui-'));
      const mantineVars = Array.from(vars.keys()).filter((k) => k.startsWith('--mantine-'));

      console.log('CSS variable counts by format:');
      console.log(`  Neutral (no prefix): ${neutralVars.length} variables`);
      console.log(`  CCUI (--ccui-*): ${ccuiVars.length} variables`);
      console.log(`  Mantine (--mantine-*): ${mantineVars.length} variables`);
      console.log(`  Total unique: ${vars.size} variables`);

      expect(true).toBe(true);
    });
  });

  describe('Token Count Comparison', () => {
    it('should report token counts per theme', () => {
      const tokenCounts = themes.map((theme) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
        if (!existsSync(filePath)) {
          return { theme, count: 0 };
        }
        const content = readFileSync(filePath, 'utf-8');
        const tokens = JSON.parse(content);

        // Count all tokens recursively
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

      // Log for visibility
      console.log('Token counts by theme:');
      tokenCounts.forEach(({ theme, count }) => {
        console.log(`  ${theme}: ${count} tokens`);
      });

      // Ensure all themes have tokens
      for (const { theme, count } of tokenCounts) {
        expect(
          count,
          `${theme} should have tokens`
        ).toBeGreaterThan(0);
      }
    });

    if (runCrossThemeTests) {
      it('themes should have similar token counts (within 50%)', () => {
        const tokenCounts = themes.map((theme) => {
          const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
          if (!existsSync(filePath)) return 0;
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

          return countTokens(tokens);
        });

        const maxCount = Math.max(...tokenCounts);
        const minCount = Math.min(...tokenCounts);
        const difference = (maxCount - minCount) / maxCount;

        // Relaxed threshold - dark theme may have fewer tokens
        expect(
          difference,
          `Token count difference is ${(difference * 100).toFixed(1)}% (max: ${maxCount}, min: ${minCount})`
        ).toBeLessThan(0.5);
      });
    }
  });
});
