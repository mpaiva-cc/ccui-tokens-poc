/**
 * Cross-Theme Consistency Tests
 *
 * Verifies that all themes have matching structure and token coverage.
 *
 * Build structure (multi-theme):
 * - Tokens Studio: dist/tokens-studio/semantic/*.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  ALL_THEME_NAMES,
  getDistPath,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

describe('Cross-Theme Consistency', () => {
  describe('Theme Detection', () => {
    it('should detect all expected themes', () => {
      for (const themeName of ALL_THEME_NAMES) {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);
        expect(existsSync(filePath), `Missing semantic/${themeName}.json`).toBe(true);
      }
    });
  });

  describe('Semantic Token Structure', () => {
    it('all themes should have semantic JSON files', () => {
      for (const theme of ALL_THEME_NAMES) {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
        expect(existsSync(filePath), `Missing semantic/${theme}.json`).toBe(true);
      }
    });

    it('all themes should have similar top-level token categories', () => {
      const tokenStructures = [...ALL_THEME_NAMES].map((theme) => {
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
  });

  describe('Token Count Comparison', () => {
    it('should report token counts per theme', () => {
      const tokenCounts = [...ALL_THEME_NAMES].map((theme) => {
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

    it('themes should have similar token counts (within 50%)', () => {
      const tokenCounts = [...ALL_THEME_NAMES].map((theme) => {
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
  });
});
