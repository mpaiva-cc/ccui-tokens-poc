/**
 * Token Value Validation Tests
 *
 * Verifies that token values are valid for their declared types.
 *
 * Build structure (consolidated):
 * - Tokens Studio: dist/tokens-studio/semantic/*.json, primitives/*.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  getThemeNames,
  isValidColor,
  isValidDimension,
  isValidFontWeight,
  isValidFontFamily,
  isValidDuration,
  isValidEasing,
  isValidShadow,
  getDistPath,
  TokenValue,
  TokenStructure,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

/**
 * Recursively collect all tokens from a token structure
 */
function collectTokens(
  structure: TokenStructure,
  path: string = ''
): Map<string, TokenValue> {
  const tokens = new Map<string, TokenValue>();

  for (const [key, value] of Object.entries(structure)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'object' && value !== null && '$value' in value) {
      tokens.set(currentPath, value as TokenValue);
    } else if (typeof value === 'object' && value !== null) {
      const nested = collectTokens(value as TokenStructure, currentPath);
      nested.forEach((v, k) => tokens.set(k, v));
    }
  }

  return tokens;
}

/**
 * Infer token type from path if not explicitly declared
 */
function inferTokenType(path: string, value: string): string | null {
  const pathLower = path.toLowerCase();

  // Color-related paths
  if (
    pathLower.includes('color') ||
    pathLower.includes('background') ||
    pathLower.includes('border') && !pathLower.includes('radius') && !pathLower.includes('width')
  ) {
    // Check if value looks like a color
    if (
      value.startsWith('#') ||
      value.startsWith('rgb') ||
      value.startsWith('hsl') ||
      value.startsWith('oklch') ||
      value === 'transparent'
    ) {
      return 'color';
    }
  }

  // Dimension-related paths
  if (
    pathLower.includes('spacing') ||
    pathLower.includes('size') ||
    pathLower.includes('width') ||
    pathLower.includes('height') ||
    pathLower.includes('padding') ||
    pathLower.includes('margin') ||
    pathLower.includes('gap') ||
    pathLower.includes('breakpoint')
  ) {
    return 'dimension';
  }

  // Font weight
  if (pathLower.includes('fontweight') || pathLower.includes('font-weight') || pathLower.includes('weight')) {
    return 'fontWeight';
  }

  // Font family
  if (pathLower.includes('fontfamily') || pathLower.includes('font-family') || pathLower.includes('family')) {
    return 'fontFamily';
  }

  // Duration
  if (pathLower.includes('duration') || pathLower.includes('delay')) {
    return 'duration';
  }

  // Easing
  if (pathLower.includes('easing') || pathLower.includes('timing')) {
    return 'cubicBezier';
  }

  // Shadow
  if (pathLower.includes('shadow') && !pathLower.includes('color')) {
    return 'shadow';
  }

  // Opacity
  if (pathLower.includes('opacity') || pathLower.includes('alpha')) {
    return 'number';
  }

  // Z-index
  if (pathLower.includes('zindex') || pathLower.includes('z-index')) {
    return 'number';
  }

  // Border radius
  if (pathLower.includes('radius')) {
    return 'dimension';
  }

  return null;
}

describe('Token Value Validation', () => {
  const themes = getThemeNames();

  describe.each(themes)('Semantic Theme: %s', (themeName) => {
    const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);

    if (!existsSync(filePath)) {
      it.skip('semantic file not found', () => {});
      return;
    }

    const tokenData = JSON.parse(readFileSync(filePath, 'utf-8'));
    const tokens = collectTokens(tokenData);

    describe('Color Tokens', () => {
      it('should have valid color values', () => {
        const colorTokens = Array.from(tokens.entries()).filter(([path, token]) => {
          const type = token.$type || inferTokenType(path, token.$value);
          return type === 'color';
        });

        const invalidColors: string[] = [];

        for (const [path, token] of colorTokens) {
          // Skip reference values
          if (typeof token.$value === 'string' && token.$value.startsWith('{')) {
            continue;
          }
          if (!isValidColor(token.$value)) {
            invalidColors.push(`${path}: ${token.$value}`);
          }
        }

        expect(
          invalidColors,
          `Invalid color values:\n${invalidColors.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('No Empty Values', () => {
      it('should not have empty or null values', () => {
        const emptyTokens: string[] = [];

        for (const [path, token] of tokens) {
          const value = token.$value;
          if (
            value === '' ||
            value === null ||
            value === undefined ||
            value === 'undefined' ||
            value === 'null'
          ) {
            emptyTokens.push(path);
          }
        }

        expect(
          emptyTokens,
          `Tokens with empty/null values:\n${emptyTokens.join('\n')}`
        ).toHaveLength(0);
      });
    });
  });

  describe('Primitive Token Sets', () => {
    const primitiveSets = [
      { name: 'color.json', expectedType: 'color' },
      { name: 'spacing.json', expectedType: 'dimension' },
      { name: 'radius.json', expectedType: 'dimension' },
      { name: 'typography.json', expectedType: null },
      { name: 'system.json', expectedType: null },
    ];

    describe.each(primitiveSets)('$name', ({ name, expectedType }) => {
      const filePath = join(TOKENS_STUDIO_DIR, 'primitives', name);

      if (!existsSync(filePath)) {
        it.skip('core file not found', () => {});
        return;
      }

      const tokenData = JSON.parse(readFileSync(filePath, 'utf-8'));
      const tokens = collectTokens(tokenData);

      it('should not have empty or null values', () => {
        const emptyTokens: string[] = [];

        for (const [path, token] of tokens) {
          const value = token.$value;
          if (
            value === '' ||
            value === null ||
            value === undefined ||
            value === 'undefined' ||
            value === 'null'
          ) {
            emptyTokens.push(path);
          }
        }

        expect(
          emptyTokens,
          `Tokens with empty/null values:\n${emptyTokens.join('\n')}`
        ).toHaveLength(0);
      });

      if (expectedType === 'color') {
        it('should have valid color values', () => {
          const invalidColors: string[] = [];

          for (const [path, token] of tokens) {
            // Skip reference values
            if (typeof token.$value === 'string' && token.$value.startsWith('{')) {
              continue;
            }
            if (!isValidColor(token.$value)) {
              invalidColors.push(`${path}: ${token.$value}`);
            }
          }

          expect(
            invalidColors,
            `Invalid color values:\n${invalidColors.join('\n')}`
          ).toHaveLength(0);
        });
      }

      if (expectedType === 'dimension') {
        it('should have valid dimension values', () => {
          const invalidDimensions: string[] = [];

          for (const [path, token] of tokens) {
            // Skip reference values
            if (typeof token.$value === 'string' && token.$value.startsWith('{')) {
              continue;
            }
            if (!isValidDimension(token.$value)) {
              invalidDimensions.push(`${path}: ${token.$value}`);
            }
          }

          expect(
            invalidDimensions,
            `Invalid dimension values:\n${invalidDimensions.join('\n')}`
          ).toHaveLength(0);
        });
      }
    });
  });
});
