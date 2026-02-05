/**
 * CSS Variable Naming Convention Tests
 *
 * Verifies that naming patterns are followed correctly.
 *
 * New architecture:
 * - CSS: Single combined file at dist/css/ccui-tokens.css
 */
import { describe, it, expect } from 'vitest';
import {
  loadMainCSS,
  parseCSSVariables,
} from './test-utils';

describe('Naming Conventions', () => {
  const cssContent = loadMainCSS();
  const allVariables = parseCSSVariables(cssContent);

  describe('CCUI Token Naming', () => {
    const ccuiVariables = new Map(
      Array.from(allVariables.entries()).filter(([name]) => name.startsWith('--ccui-'))
    );

    it('should have CCUI-prefixed variables', () => {
      expect(ccuiVariables.size).toBeGreaterThan(0);
    });

    it('CCUI token names should follow consistent naming convention', () => {
      const invalidVars: string[] = [];

      for (const name of ccuiVariables.keys()) {
        const tokenPart = name.slice(7); // Remove '--ccui-'

        // Check for underscores (snake_case) - not allowed
        if (/_/.test(tokenPart)) {
          invalidVars.push(name);
        }

        // Check for triple hyphens - not allowed
        if (/---/.test(tokenPart)) {
          invalidVars.push(name);
        }
      }

      expect(
        invalidVars.length,
        `CCUI variables with invalid naming:\n${invalidVars.join('\n')}`
      ).toBe(0);
    });

    it('should use hyphens as path separators consistently', () => {
      const inconsistentNames: string[] = [];

      for (const name of ccuiVariables.keys()) {
        // Check for periods in token names (from JSON paths not converted)
        if (name.includes('.')) {
          inconsistentNames.push(name);
        }

        // Check for double underscores (alternative separator)
        if (name.includes('__')) {
          inconsistentNames.push(name);
        }
      }

      expect(
        inconsistentNames.length,
        `Inconsistent path separators:\n${inconsistentNames.join('\n')}`
      ).toBe(0);
    });
  });

  describe('Valid CSS Custom Property Names', () => {
    it('all variable names should be valid CSS custom property identifiers', () => {
      const invalidNames: string[] = [];

      // CSS custom properties must start with -- and can contain:
      // letters, digits, hyphens, underscores
      // Cannot start with a digit after the --
      const validPattern = /^--[a-zA-Z_][a-zA-Z0-9_-]*$/;

      for (const name of allVariables.keys()) {
        if (!validPattern.test(name)) {
          invalidNames.push(name);
        }
      }

      expect(
        invalidNames.length,
        `Invalid CSS custom property names:\n${invalidNames.slice(0, 10).join('\n')}`
      ).toBe(0);
    });

    it('variable names should not contain triple hyphens (except prefix)', () => {
      const badNames: string[] = [];

      for (const name of allVariables.keys()) {
        // Remove the leading -- prefix, then check for ---
        const afterPrefix = name.slice(2);
        if (afterPrefix.includes('---')) {
          badNames.push(name);
        }
      }

      expect(
        badNames.length,
        `Variables with triple hyphens:\n${badNames.join('\n')}`
      ).toBe(0);
    });
  });

  describe('Token Hierarchy', () => {
    it('should have primitives with numeric scale (0-9 or 50-900)', () => {
      const colorVars = Array.from(allVariables.keys())
        .filter(k => k.startsWith('--ccui-color-'));

      // Check for numeric palette tokens like --ccui-color-blue-500
      const numericPaletteVars = colorVars.filter(k =>
        /--ccui-color-\w+-\d+$/.test(k)
      );

      expect(numericPaletteVars.length).toBeGreaterThan(50);
      console.log(`Found ${numericPaletteVars.length} numeric palette color variables`);
    });

    it('should have semantic color tokens', () => {
      const semanticPatterns = [
        '--ccui-color-text-',
        '--ccui-color-surface-',
        '--ccui-color-border-',
        '--ccui-color-action-',
      ];

      for (const pattern of semanticPatterns) {
        const matches = Array.from(allVariables.keys())
          .filter(k => k.startsWith(pattern));
        expect(
          matches.length,
          `Expected semantic colors matching ${pattern}`
        ).toBeGreaterThan(0);
      }
    });

    it('should have component tokens', () => {
      const componentPatterns = [
        '--ccui-button-',
        '--ccui-input-',
        '--ccui-modal-',
      ];

      for (const pattern of componentPatterns) {
        const matches = Array.from(allVariables.keys())
          .filter(k => k.startsWith(pattern));
        expect(
          matches.length,
          `Expected component tokens matching ${pattern}`
        ).toBeGreaterThan(0);
      }
    });
  });

  describe('No Problematic Characters', () => {
    it('should not have variables with special characters that could cause issues', () => {
      const problematicVars: string[] = [];

      for (const name of allVariables.keys()) {
        // Check for characters that could cause CSS parsing issues
        if (/[<>="'`]/.test(name)) {
          problematicVars.push(name);
        }
      }

      expect(
        problematicVars.length,
        `Variables with problematic characters:\n${problematicVars.join('\n')}`
      ).toBe(0);
    });
  });
});
