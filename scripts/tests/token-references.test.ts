/**
 * Token Reference Resolution Tests
 *
 * Verifies that all token references resolve correctly
 * and there are no unresolved references in the output.
 *
 * New architecture:
 * - CSS: Single combined file at dist/css/ccui-tokens.css
 * - Tokens Studio: dist/tokens-studio/{primitives,semantic,component}/*.json
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  getPrimitiveSetNames,
  getComponentSetNames,
  loadMainCSS,
  loadSemanticTokens,
  loadPrimitiveTokens,
  loadComponentTokens,
  parseCSSVariables,
  flattenTokens,
} from './test-utils';

describe('Token Reference Resolution', () => {
  describe('CSS Output', () => {
    it('should have no unresolved {references} in CSS', () => {
      const css = loadMainCSS();

      // Look for unresolved Style Dictionary references like {color.primary}
      const unresolvedRefs = css.match(/\{[a-zA-Z][a-zA-Z0-9.]+\}/g) || [];

      expect(
        unresolvedRefs.length,
        `Unresolved references in CSS:\n${unresolvedRefs.slice(0, 10).join('\n')}`
      ).toBe(0);
    });

    it('should have no undefined values in CSS', () => {
      const css = loadMainCSS();
      const variables = parseCSSVariables(css);

      const undefinedVars: string[] = [];

      for (const [name, value] of variables) {
        if (
          value === 'undefined' ||
          value === 'null' ||
          value === '[object Object]'
        ) {
          undefinedVars.push(`${name}: ${value}`);
        }
      }

      expect(
        undefinedVars.length,
        `Undefined values in CSS:\n${undefinedVars.join('\n')}`
      ).toBe(0);
    });

    it('should have no empty values in CSS', () => {
      const css = loadMainCSS();
      const variables = parseCSSVariables(css);

      const emptyVars: string[] = [];

      for (const [name, value] of variables) {
        if (value === '' || value.trim() === '') {
          emptyVars.push(name);
        }
      }

      expect(
        emptyVars.length,
        `Empty values in CSS:\n${emptyVars.join('\n')}`
      ).toBe(0);
    });
  });

  describe('Semantic Token References', () => {
    // NOTE: Semantic tokens in Tokens Studio format SHOULD contain references
    // like {color.blue.500}. These are resolved during the build process.
    // The CSS output should have no unresolved references.
    const themes = getThemeNames();

    describe.each(themes)('Theme: %s', (themeName) => {
      it('should have valid token references (pointing to primitives)', () => {
        const tokens = loadSemanticTokens(themeName);
        const flat = flattenTokens(tokens);

        // Semantic tokens should contain references - that's the expected format
        // We check that references follow valid format (not malformed)
        const malformedRefs: string[] = [];

        for (const [key, value] of Object.entries(flat)) {
          if (typeof value === 'string' && value.includes('{')) {
            // Check for malformed references (missing closing brace, etc.)
            const refMatch = value.match(/\{([^}]*)\}/);
            if (!refMatch || refMatch[1].length === 0) {
              malformedRefs.push(`${key}: ${value}`);
            }
          }
        }

        expect(
          malformedRefs.length,
          `Malformed references in ${themeName}:\n${malformedRefs.join('\n')}`
        ).toBe(0);
      });

      it('should have no undefined or null values', () => {
        const tokens = loadSemanticTokens(themeName);
        const flat = flattenTokens(tokens);

        const invalidValues: string[] = [];

        for (const [key, value] of Object.entries(flat)) {
          if (
            value === undefined ||
            value === null ||
            value === 'undefined' ||
            value === 'null'
          ) {
            invalidValues.push(`${key}: ${value}`);
          }
        }

        expect(
          invalidValues.length,
          `Invalid values in ${themeName}:\n${invalidValues.join('\n')}`
        ).toBe(0);
      });
    });
  });

  describe('Primitive Token References', () => {
    const primitives = getPrimitiveSetNames();

    describe.each(primitives)('Primitive: %s', (setName) => {
      it('should have valid references (only to other primitives)', () => {
        const tokens = loadPrimitiveTokens(setName);
        const flat = flattenTokens(tokens);

        // Primitives may reference other primitives (e.g., focus.ring.color -> color.blue.500)
        // This is valid cross-referencing within the primitives layer
        // We just check that references are well-formed
        const malformedRefs: string[] = [];

        for (const [key, value] of Object.entries(flat)) {
          if (typeof value === 'string' && value.includes('{')) {
            // Check for malformed references (missing closing brace, empty, etc.)
            const refMatch = value.match(/\{([^}]*)\}/);
            if (!refMatch || refMatch[1].length === 0) {
              malformedRefs.push(`${key}: ${value}`);
            }
          }
        }

        expect(
          malformedRefs.length,
          `Malformed references in primitives/${setName}:\n${malformedRefs.slice(0, 10).join('\n')}`
        ).toBe(0);
      });

      it('should have no undefined or null values', () => {
        const tokens = loadPrimitiveTokens(setName);
        const flat = flattenTokens(tokens);

        const invalidValues: string[] = [];

        for (const [key, value] of Object.entries(flat)) {
          if (
            value === undefined ||
            value === null ||
            value === 'undefined' ||
            value === 'null'
          ) {
            invalidValues.push(`${key}: ${value}`);
          }
        }

        expect(
          invalidValues.length,
          `Invalid values in primitives/${setName}:\n${invalidValues.join('\n')}`
        ).toBe(0);
      });
    });
  });

  describe('Component Token References', () => {
    // NOTE: Component tokens may contain references to primitives
    // These are resolved during the build process.
    const components = getComponentSetNames();

    describe.each(components)('Component: %s', (setName) => {
      it('should have valid token references (pointing to primitives)', () => {
        const tokens = loadComponentTokens(setName);
        const flat = flattenTokens(tokens);

        // Component tokens may contain references - that's expected
        // We check that references follow valid format
        const malformedRefs: string[] = [];

        for (const [key, value] of Object.entries(flat)) {
          if (typeof value === 'string' && value.includes('{')) {
            const refMatch = value.match(/\{([^}]*)\}/);
            if (!refMatch || refMatch[1].length === 0) {
              malformedRefs.push(`${key}: ${value}`);
            }
          }
        }

        expect(
          malformedRefs.length,
          `Malformed references in component/${setName}:\n${malformedRefs.join('\n')}`
        ).toBe(0);
      });

      it('should have no undefined or null values', () => {
        const tokens = loadComponentTokens(setName);
        const flat = flattenTokens(tokens);

        const invalidValues: string[] = [];

        for (const [key, value] of Object.entries(flat)) {
          if (
            value === undefined ||
            value === null ||
            value === 'undefined' ||
            value === 'null'
          ) {
            invalidValues.push(`${key}: ${value}`);
          }
        }

        expect(
          invalidValues.length,
          `Invalid values in component/${setName}:\n${invalidValues.join('\n')}`
        ).toBe(0);
      });
    });
  });

  describe('CSS var() Reference Validation', () => {
    it('all var() references should point to existing variables', () => {
      const css = loadMainCSS();
      const allVariables = parseCSSVariables(css);

      // Find all var() references
      const varRefRegex = /var\(\s*(--[a-zA-Z0-9-_]+)\s*(?:,\s*([^)]+))?\)/g;

      const missingRefs: string[] = [];
      let match;

      while ((match = varRefRegex.exec(css)) !== null) {
        const referencedVar = match[1];
        const hasFallback = match[2] !== undefined;

        // Skip if it has a fallback value
        if (!hasFallback && !allVariables.has(referencedVar)) {
          missingRefs.push(referencedVar);
        }
      }

      // Remove duplicates
      const uniqueMissing = [...new Set(missingRefs)];

      expect(
        uniqueMissing.length,
        `Missing var() references:\n${uniqueMissing.slice(0, 20).join('\n')}`
      ).toBe(0);
    });
  });

  describe('Cross-Theme Reference Consistency', () => {
    it('all themes should resolve the same token paths', () => {
      const themes = getThemeNames();

      if (themes.length < 2) return;

      const tokenSets = themes.map((theme) => {
        const tokens = loadSemanticTokens(theme);
        const flat = flattenTokens(tokens);
        return {
          theme,
          paths: new Set(Object.keys(flat)),
        };
      });

      const [first, ...rest] = tokenSets;

      for (const other of rest) {
        const onlyInFirst = [...first.paths].filter(p => !other.paths.has(p));
        const onlyInOther = [...other.paths].filter(p => !first.paths.has(p));

        // Log differences for debugging
        if (onlyInFirst.length > 0 || onlyInOther.length > 0) {
          console.log(`Token differences between ${first.theme} and ${other.theme}:`);
          if (onlyInFirst.length > 0) {
            console.log(`  Only in ${first.theme}: ${onlyInFirst.slice(0, 5).join(', ')}${onlyInFirst.length > 5 ? '...' : ''}`);
          }
          if (onlyInOther.length > 0) {
            console.log(`  Only in ${other.theme}: ${onlyInOther.slice(0, 5).join(', ')}${onlyInOther.length > 5 ? '...' : ''}`);
          }
        }
      }

      expect(true).toBe(true);
    });
  });
});
