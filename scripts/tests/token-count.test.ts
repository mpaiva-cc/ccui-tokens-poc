/**
 * Token Count Regression Tests
 *
 * Prevents accidental token removal by enforcing minimum counts.
 * These thresholds should be updated when intentionally adding/removing tokens.
 *
 * Build structure (multi-theme):
 * - Tokens Studio: dist/tokens-studio/primitives/*.json, semantic/*.json
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

/**
 * Minimum expected token counts.
 * Update these when intentionally adding or removing tokens.
 */
const MIN_TOKEN_COUNTS = {
  semanticTokens: 10, // Minimum tokens per semantic theme
};

describe('Token Count Regression', () => {
  describe('Semantic Token Counts', () => {
    describe.each([...ALL_THEME_NAMES])('Theme: %s', (themeName) => {
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

  describe('Primitive Token Counts', () => {
    it('primitives.json should have tokens', () => {
      const filePath = join(TOKENS_STUDIO_DIR, 'primitives.json');
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

    it('should report primitive token count', () => {
      const filePath = join(TOKENS_STUDIO_DIR, 'primitives.json');
      if (!existsSync(filePath)) {
        console.log('  primitives.json: not found');
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

      console.log(`  primitives.json: ${countTokens(tokens)} tokens`);
      expect(true).toBe(true);
    });
  });

  describe('Token Count Change Detection', () => {
    it('should detect significant token count changes between themes', () => {
      const counts = [...ALL_THEME_NAMES].map((theme) => {
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
});
