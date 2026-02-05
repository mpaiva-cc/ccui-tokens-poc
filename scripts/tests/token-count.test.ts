/**
 * Token Count Regression Tests
 *
 * Prevents accidental token removal by enforcing minimum counts.
 * These thresholds should be updated when intentionally adding/removing tokens.
 *
 * New architecture:
 * - Primitives: dist/tokens-studio/primitives/*.json
 * - Semantic: dist/tokens-studio/semantic/{light,dark,high-contrast}.json
 * - Component: dist/tokens-studio/component/*.json
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  getPrimitiveSetNames,
  getComponentSetNames,
  loadSemanticTokens,
  loadPrimitiveTokens,
  loadComponentTokens,
  loadMainCSS,
  parseCSSVariables,
  flattenTokens,
} from './test-utils';

/**
 * Minimum expected token counts per category.
 * Update these when intentionally adding or removing tokens.
 */
const MIN_TOKEN_COUNTS = {
  primitivesPerSet: 5, // Minimum tokens per primitive set
  semanticPerTheme: 30, // Minimum semantic tokens per theme
  componentPerSet: 5, // Minimum component tokens per set
  cssVariables: 100, // Minimum total CSS variables
};

describe('Token Count Regression', () => {
  describe('Primitive Token Counts', () => {
    const primitives = getPrimitiveSetNames();

    it('should have expected number of primitive sets', () => {
      expect(primitives.length).toBeGreaterThanOrEqual(5);
    });

    describe.each(primitives)('Primitive: %s', (setName) => {
      const tokens = loadPrimitiveTokens(setName);
      const flat = flattenTokens(tokens);
      const count = Object.keys(flat).length;

      it(`should have at least ${MIN_TOKEN_COUNTS.primitivesPerSet} tokens`, () => {
        expect(count).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.primitivesPerSet);
      });

      it('should report token count', () => {
        console.log(`primitives/${setName}: ${count} tokens`);
        expect(true).toBe(true);
      });
    });

    it('should report total primitive tokens', () => {
      let total = 0;
      for (const setName of primitives) {
        const tokens = loadPrimitiveTokens(setName);
        const flat = flattenTokens(tokens);
        total += Object.keys(flat).length;
      }
      console.log(`Total primitives: ${total} tokens across ${primitives.length} sets`);
      expect(total).toBeGreaterThan(50);
    });
  });

  describe('Semantic Token Counts', () => {
    const themes = getThemeNames();

    describe.each(themes)('Theme: %s', (themeName) => {
      const tokens = loadSemanticTokens(themeName);
      const flat = flattenTokens(tokens);
      const count = Object.keys(flat).length;

      it(`should have at least ${MIN_TOKEN_COUNTS.semanticPerTheme} tokens`, () => {
        expect(count).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.semanticPerTheme);
      });

      it('should report token count', () => {
        console.log(`semantic/${themeName}: ${count} tokens`);
        expect(true).toBe(true);
      });

      it('should have color tokens', () => {
        const colorTokens = Object.keys(flat).filter(k => k.includes('color'));
        expect(colorTokens.length).toBeGreaterThan(10);
      });
    });

    it('all themes should have identical token counts', () => {
      const counts = themes.map((theme) => {
        const tokens = loadSemanticTokens(theme);
        const flat = flattenTokens(tokens);
        return Object.keys(flat).length;
      });

      const uniqueCounts = new Set(counts);
      expect(
        uniqueCounts.size,
        `All themes should have same count. Found: ${themes.map((t, i) => `${t}=${counts[i]}`).join(', ')}`
      ).toBe(1);
    });
  });

  describe('Component Token Counts', () => {
    const components = getComponentSetNames();

    it('should have expected number of component sets', () => {
      expect(components.length).toBeGreaterThanOrEqual(3);
    });

    describe.each(components)('Component: %s', (setName) => {
      const tokens = loadComponentTokens(setName);
      const flat = flattenTokens(tokens);
      const count = Object.keys(flat).length;

      it(`should have at least ${MIN_TOKEN_COUNTS.componentPerSet} tokens`, () => {
        expect(count).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.componentPerSet);
      });

      it('should report token count', () => {
        console.log(`component/${setName}: ${count} tokens`);
        expect(true).toBe(true);
      });
    });
  });

  describe('CSS Variable Counts', () => {
    const css = loadMainCSS();
    const allVars = parseCSSVariables(css);

    it(`should have at least ${MIN_TOKEN_COUNTS.cssVariables} CSS variables`, () => {
      expect(allVars.size).toBeGreaterThanOrEqual(MIN_TOKEN_COUNTS.cssVariables);
    });

    it('should have CCUI-prefixed variables', () => {
      const ccuiVars = Array.from(allVars.keys()).filter(k => k.startsWith('--ccui-'));
      expect(ccuiVars.length).toBeGreaterThan(50);
      console.log(`CCUI CSS variables: ${ccuiVars.length}`);
    });

    it('should report total CSS variable count', () => {
      console.log(`Total CSS variables: ${allVars.size}`);
      expect(true).toBe(true);
    });
  });

  describe('Category Breakdown', () => {
    it('should report token breakdown by category for primitives', () => {
      console.log('\nPrimitive token breakdown:');

      for (const setName of getPrimitiveSetNames()) {
        const tokens = loadPrimitiveTokens(setName);
        const flat = flattenTokens(tokens);
        const categories = new Map<string, number>();

        for (const key of Object.keys(flat)) {
          const category = key.split('.')[0];
          categories.set(category, (categories.get(category) || 0) + 1);
        }

        console.log(`  ${setName}:`);
        for (const [category, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
          console.log(`    ${category}: ${count}`);
        }
      }

      expect(true).toBe(true);
    });

    it('should report token breakdown by category for semantic tokens', () => {
      const theme = getThemeNames()[0];
      const tokens = loadSemanticTokens(theme);
      const flat = flattenTokens(tokens);
      const categories = new Map<string, number>();

      for (const key of Object.keys(flat)) {
        const category = key.split('.')[0];
        categories.set(category, (categories.get(category) || 0) + 1);
      }

      console.log(`\nSemantic token breakdown (${theme}):`);
      for (const [category, count] of [...categories.entries()].sort((a, b) => b[1] - a[1])) {
        console.log(`  ${category}: ${count}`);
      }

      expect(categories.size).toBeGreaterThan(0);
    });
  });
});
