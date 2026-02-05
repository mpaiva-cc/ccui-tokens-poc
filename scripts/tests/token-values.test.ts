/**
 * Token Value Validation Tests
 *
 * Verifies that token values are valid for their declared types.
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadTokenJSON,
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
  isValidBorderRadius,
  TokenValue,
} from './test-utils';

/**
 * Get the validator function for a token type
 */
function getValidator(
  type: string
): ((value: string) => boolean) | null {
  const validators: Record<string, (value: string) => boolean> = {
    color: isValidColor,
    dimension: isValidDimension,
    fontWeight: isValidFontWeight,
    fontFamily: isValidFontFamily,
    duration: isValidDuration,
    cubicBezier: isValidEasing,
    shadow: isValidShadow,
    number: (v) => !isNaN(parseFloat(v)),
  };

  return validators[type] || null;
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
    if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value === 'transparent') {
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

  describe.each(themes)('Theme: %s', (themeName) => {
    const tokenData = loadTokenJSON(themeName);
    const tokens = collectTokens(tokenData);

    describe('Color Tokens', () => {
      it('should have valid color values', () => {
        const colorTokens = Array.from(tokens.entries()).filter(([path, token]) => {
          const type = token.$type || inferTokenType(path, token.$value);
          return type === 'color';
        });

        const invalidColors: string[] = [];

        for (const [path, token] of colorTokens) {
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

    describe('Dimension Tokens', () => {
      it('should have valid dimension values', () => {
        const dimensionTokens = Array.from(tokens.entries()).filter(
          ([path, token]) => {
            const type = token.$type || inferTokenType(path, token.$value);
            return type === 'dimension';
          }
        );

        const invalidDimensions: string[] = [];

        for (const [path, token] of dimensionTokens) {
          if (!isValidDimension(token.$value)) {
            invalidDimensions.push(`${path}: ${token.$value}`);
          }
        }

        expect(
          invalidDimensions,
          `Invalid dimension values:\n${invalidDimensions.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('Font Weight Tokens', () => {
      it('should have valid font weight values', () => {
        const fontWeightTokens = Array.from(tokens.entries()).filter(
          ([path, token]) => {
            const type = token.$type || inferTokenType(path, token.$value);
            return type === 'fontWeight';
          }
        );

        const invalidWeights: string[] = [];

        for (const [path, token] of fontWeightTokens) {
          if (!isValidFontWeight(token.$value)) {
            invalidWeights.push(`${path}: ${token.$value}`);
          }
        }

        expect(
          invalidWeights,
          `Invalid font weight values:\n${invalidWeights.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('Font Family Tokens', () => {
      it('should have valid font family values', () => {
        const fontFamilyTokens = Array.from(tokens.entries()).filter(
          ([path, token]) => {
            const type = token.$type || inferTokenType(path, token.$value);
            return type === 'fontFamily';
          }
        );

        const invalidFamilies: string[] = [];

        for (const [path, token] of fontFamilyTokens) {
          if (!isValidFontFamily(token.$value)) {
            invalidFamilies.push(`${path}: ${token.$value}`);
          }
        }

        expect(
          invalidFamilies,
          `Invalid font family values:\n${invalidFamilies.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('Duration Tokens', () => {
      it('should have valid duration values', () => {
        const durationTokens = Array.from(tokens.entries()).filter(
          ([path, token]) => {
            const type = token.$type || inferTokenType(path, token.$value);
            return type === 'duration';
          }
        );

        // Skip if no duration tokens (not all design systems have them)
        if (durationTokens.length === 0) return;

        const invalidDurations: string[] = [];

        for (const [path, token] of durationTokens) {
          if (!isValidDuration(token.$value)) {
            invalidDurations.push(`${path}: ${token.$value}`);
          }
        }

        expect(
          invalidDurations,
          `Invalid duration values:\n${invalidDurations.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('Easing Tokens', () => {
      it('should have valid easing values', () => {
        const easingTokens = Array.from(tokens.entries()).filter(
          ([path, token]) => {
            const type = token.$type || inferTokenType(path, token.$value);
            return type === 'cubicBezier';
          }
        );

        // Skip if no easing tokens
        if (easingTokens.length === 0) return;

        const invalidEasings: string[] = [];

        for (const [path, token] of easingTokens) {
          if (!isValidEasing(token.$value)) {
            invalidEasings.push(`${path}: ${token.$value}`);
          }
        }

        expect(
          invalidEasings,
          `Invalid easing values:\n${invalidEasings.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('Shadow Tokens', () => {
      it('should have valid shadow values', () => {
        const shadowTokens = Array.from(tokens.entries()).filter(
          ([path, token]) => {
            const type = token.$type || inferTokenType(path, token.$value);
            return type === 'shadow';
          }
        );

        // Skip if no shadow tokens
        if (shadowTokens.length === 0) return;

        const invalidShadows: string[] = [];

        for (const [path, token] of shadowTokens) {
          if (!isValidShadow(token.$value)) {
            invalidShadows.push(`${path}: ${token.$value}`);
          }
        }

        expect(
          invalidShadows,
          `Invalid shadow values:\n${invalidShadows.join('\n')}`
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
});
