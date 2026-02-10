/**
 * Token Value Range Validation Tests
 *
 * Validates that token values fall within expected ranges for their types:
 * - Opacity: 0-1
 * - Z-index: positive integers
 * - Duration: positive numbers
 * - Font weights: valid CSS values (100-900 or keywords)
 * - Spacing/dimension: non-negative values
 *
 * Runs against built output in dist/tokens-studio/
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  getDistPath,
  TokenValue,
  TokenStructure,
  isToken,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

/**
 * Recursively collect all tokens with their path and type
 */
function collectTokensWithType(
  structure: TokenStructure,
  path: string = ''
): Array<{ path: string; token: TokenValue }> {
  const results: Array<{ path: string; token: TokenValue }> = [];

  for (const [key, value] of Object.entries(structure)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (isToken(value)) {
      results.push({ path: currentPath, token: value });
    } else if (typeof value === 'object' && value !== null) {
      results.push(...collectTokensWithType(value as TokenStructure, currentPath));
    }
  }

  return results;
}

describe('Token Value Range Validation', () => {
  const primitivesPath = join(TOKENS_STUDIO_DIR, 'primitives.json');

  if (!existsSync(primitivesPath)) {
    it.skip('primitives.json not found', () => {});
    return;
  }

  const primitiveData = JSON.parse(readFileSync(primitivesPath, 'utf-8'));
  const allTokens = collectTokensWithType(primitiveData);

  describe('Opacity Values', () => {
    const opacityTokens = allTokens.filter(
      ({ token }) => token.$type === 'opacity' || token.$type === 'number'
    ).filter(({ path }) => path.startsWith('opacity.'));

    it('should have opacity tokens to validate', () => {
      expect(opacityTokens.length).toBeGreaterThan(0);
    });

    it('all opacity values should be between 0 and 1', () => {
      const outOfRange: string[] = [];

      for (const { path, token } of opacityTokens) {
        // Skip reference values
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const num = typeof token.$value === 'number'
          ? token.$value
          : parseFloat(String(token.$value));

        if (isNaN(num) || num < 0 || num > 1) {
          outOfRange.push(`${path}: ${token.$value} (expected 0-1)`);
        }
      }

      expect(
        outOfRange,
        `Opacity values out of range:\n${outOfRange.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Z-Index Values', () => {
    const zIndexTokens = allTokens.filter(({ path }) => path.startsWith('zIndex.'));

    it('should have z-index tokens to validate', () => {
      expect(zIndexTokens.length).toBeGreaterThan(0);
    });

    it('all z-index values should be non-negative integers', () => {
      const invalid: string[] = [];

      for (const { path, token } of zIndexTokens) {
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const num = typeof token.$value === 'number'
          ? token.$value
          : parseInt(String(token.$value), 10);

        if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
          invalid.push(`${path}: ${token.$value} (expected non-negative integer)`);
        }
      }

      expect(
        invalid,
        `Invalid z-index values:\n${invalid.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Duration Values', () => {
    const durationTokens = allTokens.filter(
      ({ token }) => token.$type === 'duration'
    );

    it('should have duration tokens to validate', () => {
      expect(durationTokens.length).toBeGreaterThan(0);
    });

    it('all duration values should be non-negative', () => {
      const invalid: string[] = [];

      for (const { path, token } of durationTokens) {
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const strValue = String(token.$value);
        // Extract numeric part from values like "200ms" or "0.5s"
        const match = strValue.match(/^(-?[\d.]+)(ms|s)?$/);
        if (!match) {
          // Allow "0" without unit
          if (strValue !== '0') {
            invalid.push(`${path}: ${token.$value} (invalid duration format)`);
          }
          continue;
        }

        const num = parseFloat(match[1]);
        if (isNaN(num) || num < 0) {
          invalid.push(`${path}: ${token.$value} (expected non-negative)`);
        }
      }

      expect(
        invalid,
        `Invalid duration values:\n${invalid.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Font Weight Values', () => {
    const fontWeightTokens = allTokens.filter(
      ({ token }) => token.$type === 'fontWeights'
    );

    it('should have font weight tokens to validate', () => {
      expect(fontWeightTokens.length).toBeGreaterThan(0);
    });

    it('all font weight values should be valid CSS font-weight values', () => {
      const validKeywords = ['normal', 'bold', 'lighter', 'bolder'];
      const invalid: string[] = [];

      for (const { path, token } of fontWeightTokens) {
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const strValue = String(token.$value).trim().toLowerCase();

        // Check keywords
        if (validKeywords.includes(strValue)) continue;

        // Check numeric range (100-900)
        const num = parseInt(strValue, 10);
        if (!isNaN(num) && num >= 100 && num <= 900 && num % 100 === 0) continue;

        // Also allow variable font weights (1-999)
        if (!isNaN(num) && num >= 1 && num <= 999) continue;

        invalid.push(`${path}: ${token.$value} (expected 100-900 or keyword)`);
      }

      expect(
        invalid,
        `Invalid font weight values:\n${invalid.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Spacing/Dimension Values', () => {
    const spacingTokens = allTokens.filter(
      ({ token }) => token.$type === 'spacing' || token.$type === 'borderRadius'
    );

    it('should have spacing tokens to validate', () => {
      expect(spacingTokens.length).toBeGreaterThan(0);
    });

    it('all spacing values should be non-negative', () => {
      const negative: string[] = [];

      for (const { path, token } of spacingTokens) {
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const strValue = String(token.$value);
        // Extract numeric part from values like "1rem", "8px", "0"
        const match = strValue.match(/^(-?[\d.]+)/);
        if (!match) continue;

        const num = parseFloat(match[1]);
        if (num < 0) {
          negative.push(`${path}: ${token.$value} (negative spacing)`);
        }
      }

      expect(
        negative,
        `Negative spacing values:\n${negative.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Font Size Values', () => {
    const fontSizeTokens = allTokens.filter(
      ({ token }) => token.$type === 'fontSizes'
    );

    it('should have font size tokens to validate', () => {
      expect(fontSizeTokens.length).toBeGreaterThan(0);
    });

    it('all font size values should be positive', () => {
      const invalid: string[] = [];

      for (const { path, token } of fontSizeTokens) {
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const strValue = String(token.$value);
        const match = strValue.match(/^(-?[\d.]+)/);
        if (!match) continue;

        const num = parseFloat(match[1]);
        if (num <= 0) {
          invalid.push(`${path}: ${token.$value} (expected positive)`);
        }
      }

      expect(
        invalid,
        `Invalid font size values:\n${invalid.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Line Height Values', () => {
    const lineHeightTokens = allTokens.filter(
      ({ token }) => token.$type === 'lineHeights'
    );

    it('should have line height tokens to validate', () => {
      expect(lineHeightTokens.length).toBeGreaterThan(0);
    });

    it('all line height values should be positive', () => {
      const invalid: string[] = [];

      for (const { path, token } of lineHeightTokens) {
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const strValue = String(token.$value);
        // Line heights can be unitless (1.5), percentages (150%), or dimensions (24px)
        const match = strValue.match(/^(-?[\d.]+)/);
        if (!match) continue;

        const num = parseFloat(match[1]);
        if (num <= 0) {
          invalid.push(`${path}: ${token.$value} (expected positive)`);
        }
      }

      expect(
        invalid,
        `Invalid line height values:\n${invalid.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Cubic Bezier Values', () => {
    const easingTokens = allTokens.filter(
      ({ token }) => token.$type === 'cubicBezier'
    );

    it('should have easing tokens to validate', () => {
      expect(easingTokens.length).toBeGreaterThan(0);
    });

    it('all cubic bezier values should be valid 4-element arrays', () => {
      const invalid: string[] = [];

      for (const { path, token } of easingTokens) {
        if (typeof token.$value === 'string' && token.$value.startsWith('{')) continue;

        const value = token.$value;
        if (!Array.isArray(value)) {
          invalid.push(`${path}: expected array, got ${typeof value}`);
          continue;
        }

        if (value.length !== 4) {
          invalid.push(`${path}: expected 4 elements, got ${value.length}`);
          continue;
        }

        // x1 and x2 must be 0-1, y1 and y2 can be any number
        const [x1, , x2] = value;
        if (x1 < 0 || x1 > 1) {
          invalid.push(`${path}: x1=${x1} out of range 0-1`);
        }
        if (x2 < 0 || x2 > 1) {
          invalid.push(`${path}: x2=${x2} out of range 0-1`);
        }
      }

      expect(
        invalid,
        `Invalid cubic bezier values:\n${invalid.join('\n')}`
      ).toHaveLength(0);
    });
  });
});
