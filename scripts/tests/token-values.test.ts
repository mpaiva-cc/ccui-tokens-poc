/**
 * Token Value Validation Tests
 *
 * Verifies that token values are valid for their declared types.
 *
 * New architecture:
 * - Primitives: Raw values (colors, dimensions, etc.)
 * - Semantic: Theme-specific values (references to primitives)
 * - Component: Component-specific tokens
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  getPrimitiveSetNames,
  getComponentSetNames,
  loadSemanticTokens,
  loadPrimitiveTokens,
  loadComponentTokens,
  collectTokens,
  isValidColor,
  isValidDimension,
  isValidFontWeight,
  isValidFontFamily,
  isValidDuration,
  isValidEasing,
  isValidShadow,
  isValidOpacity,
  isValidZIndex,
  isTokenReference,
  TokenValue,
} from './test-utils';

/**
 * Get the validator function for a token type
 */
function getValidator(
  type: string
): ((value: string | number | Record<string, unknown>) => boolean) | null {
  const validators: Record<string, (value: string | number | Record<string, unknown>) => boolean> = {
    color: isValidColor,
    dimension: isValidDimension,
    fontWeight: isValidFontWeight,
    fontFamily: isValidFontFamily,
    duration: isValidDuration,
    cubicBezier: isValidEasing,
    shadow: isValidShadow,
    number: (v) => typeof v === 'number' || (typeof v === 'string' && !isNaN(parseFloat(v))),
  };

  return validators[type] || null;
}

/**
 * Infer token type from path if not explicitly declared
 */
function inferTokenType(path: string, value: string | number | Record<string, unknown>): string | null {
  const pathLower = path.toLowerCase();

  // Color-related paths
  if (
    pathLower.includes('color') ||
    pathLower.includes('background') ||
    (pathLower.includes('border') && !pathLower.includes('radius') && !pathLower.includes('width'))
  ) {
    if (typeof value === 'string' && (
      value.startsWith('#') ||
      value.startsWith('rgb') ||
      value.startsWith('hsl') ||
      value === 'transparent'
    )) {
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
  describe('Primitive Tokens', () => {
    const primitives = getPrimitiveSetNames();

    describe.each(primitives)('Primitive: %s', (setName) => {
      const tokenData = loadPrimitiveTokens(setName);
      const tokens = collectTokens(tokenData);

      if (setName === 'color') {
        it('should have valid color values', () => {
          const invalidColors: string[] = [];

          for (const [path, token] of tokens) {
            if (token.$type === 'color' || !token.$type) {
              const value = token.$value;
              if (typeof value === 'string' && !isValidColor(value)) {
                invalidColors.push(`${path}: ${value}`);
              }
            }
          }

          expect(
            invalidColors.length,
            `Invalid color values:\n${invalidColors.slice(0, 10).join('\n')}`
          ).toBe(0);
        });
      }

      if (setName === 'spacing' || setName === 'sizing' || setName === 'radius') {
        it('should have valid dimension values', () => {
          const invalidDimensions: string[] = [];

          for (const [path, token] of tokens) {
            const type = token.$type || inferTokenType(path, token.$value);
            if (type === 'dimension') {
              if (!isValidDimension(token.$value)) {
                invalidDimensions.push(`${path}: ${token.$value}`);
              }
            }
          }

          expect(
            invalidDimensions.length,
            `Invalid dimension values:\n${invalidDimensions.slice(0, 10).join('\n')}`
          ).toBe(0);
        });
      }

      if (setName === 'typography') {
        it('should have valid font weight values', () => {
          const invalidWeights: string[] = [];

          for (const [path, token] of tokens) {
            if (path.toLowerCase().includes('weight') && token.$type !== 'fontFamily') {
              if (!isValidFontWeight(token.$value)) {
                invalidWeights.push(`${path}: ${token.$value}`);
              }
            }
          }

          expect(
            invalidWeights.length,
            `Invalid font weight values:\n${invalidWeights.slice(0, 10).join('\n')}`
          ).toBe(0);
        });

        it('should have valid font family values', () => {
          const invalidFamilies: string[] = [];

          for (const [path, token] of tokens) {
            if (token.$type === 'fontFamily' || path.toLowerCase().includes('family')) {
              if (!isValidFontFamily(token.$value)) {
                invalidFamilies.push(`${path}: ${token.$value}`);
              }
            }
          }

          expect(
            invalidFamilies.length,
            `Invalid font family values:\n${invalidFamilies.slice(0, 10).join('\n')}`
          ).toBe(0);
        });
      }

      if (setName === 'motion') {
        it('should have valid duration values', () => {
          const invalidDurations: string[] = [];

          for (const [path, token] of tokens) {
            if (token.$type === 'duration' || path.toLowerCase().includes('duration')) {
              if (!isValidDuration(token.$value)) {
                invalidDurations.push(`${path}: ${token.$value}`);
              }
            }
          }

          expect(
            invalidDurations.length,
            `Invalid duration values:\n${invalidDurations.slice(0, 10).join('\n')}`
          ).toBe(0);
        });

        it('should have valid easing values', () => {
          const invalidEasings: string[] = [];

          for (const [path, token] of tokens) {
            if (token.$type === 'cubicBezier' || path.toLowerCase().includes('easing')) {
              if (!isValidEasing(token.$value)) {
                invalidEasings.push(`${path}: ${token.$value}`);
              }
            }
          }

          expect(
            invalidEasings.length,
            `Invalid easing values:\n${invalidEasings.slice(0, 10).join('\n')}`
          ).toBe(0);
        });
      }

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
          emptyTokens.length,
          `Tokens with empty/null values:\n${emptyTokens.join('\n')}`
        ).toBe(0);
      });
    });
  });

  describe('Semantic Tokens', () => {
    const themes = getThemeNames();

    describe.each(themes)('Theme: %s', (themeName) => {
      const tokenData = loadSemanticTokens(themeName);
      const tokens = collectTokens(tokenData);

      it('should have valid color values or references', () => {
        // Semantic tokens in Tokens Studio format contain references like {color.blue.500}
        // These are valid and expected - they get resolved during build
        const invalidColors: string[] = [];

        for (const [path, token] of tokens) {
          if (token.$type === 'color') {
            const value = token.$value;
            if (typeof value === 'string') {
              // Accept either valid color values OR token references
              if (!isValidColor(value) && !isTokenReference(value)) {
                invalidColors.push(`${path}: ${value}`);
              }
            }
          }
        }

        expect(
          invalidColors.length,
          `Invalid color values (neither valid color nor reference):\n${invalidColors.slice(0, 10).join('\n')}`
        ).toBe(0);
      });

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
          emptyTokens.length,
          `Tokens with empty/null values:\n${emptyTokens.join('\n')}`
        ).toBe(0);
      });
    });
  });

  describe('Component Tokens', () => {
    const components = getComponentSetNames();

    describe.each(components)('Component: %s', (setName) => {
      const tokenData = loadComponentTokens(setName);
      const tokens = collectTokens(tokenData);

      it('should have valid dimension values or references', () => {
        // Component tokens may contain references to primitive tokens
        const invalidDimensions: string[] = [];

        for (const [path, token] of tokens) {
          const type = token.$type || inferTokenType(path, token.$value);
          if (type === 'dimension') {
            const value = token.$value;
            if (typeof value === 'string') {
              // Accept either valid dimensions OR token references
              if (!isValidDimension(value) && !isTokenReference(value)) {
                invalidDimensions.push(`${path}: ${value}`);
              }
            }
          }
        }

        expect(
          invalidDimensions.length,
          `Invalid dimension values (neither valid dimension nor reference):\n${invalidDimensions.slice(0, 10).join('\n')}`
        ).toBe(0);
      });

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
          emptyTokens.length,
          `Tokens with empty/null values:\n${emptyTokens.join('\n')}`
        ).toBe(0);
      });
    });
  });
});
