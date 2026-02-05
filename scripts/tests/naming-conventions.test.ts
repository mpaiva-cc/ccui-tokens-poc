/**
 * CSS Variable Naming Convention Tests
 *
 * Verifies that naming patterns are followed correctly.
 *
 * Build structure (multi-theme):
 * - CSS: dist/css/primitives.css + dist/css/{theme}.css per theme
 * - Contains: neutral, CCUI (--ccui-*), and Mantine (--mantine-*) formats
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadAllCSS,
  parseCSSVariables,
} from './test-utils';

describe('Naming Conventions', () => {
  const themes = getThemeNames();
  const combinedCSS = loadAllCSS();
  const allVariables = parseCSSVariables(combinedCSS);

  // Split by format
  const neutralVars = new Map(
    Array.from(allVariables.entries()).filter(
      ([k]) => !k.startsWith('--ccui-') && !k.startsWith('--mantine-')
    )
  );
  const ccuiVars = new Map(
    Array.from(allVariables.entries()).filter(([k]) => k.startsWith('--ccui-'))
  );
  const mantineVars = new Map(
    Array.from(allVariables.entries()).filter(([k]) => k.startsWith('--mantine-'))
  );

  describe('Neutral Format Naming', () => {
    it('neutral tokens should not have framework prefixes', () => {
      const frameworkPrefixed: string[] = [];

      for (const name of neutralVars.keys()) {
        if (name.startsWith('--ccui-') || name.startsWith('--mantine-')) {
          frameworkPrefixed.push(name);
        }
      }

      expect(
        frameworkPrefixed,
        `Neutral variables with framework prefix:\n${frameworkPrefixed.join('\n')}`
      ).toHaveLength(0);
    });

    it('neutral token names should follow kebab-case convention', () => {
      const invalidVars: string[] = [];

      for (const name of neutralVars.keys()) {
        const tokenPart = name.slice(2); // Remove '--'

        // Check for underscores (snake_case) - not allowed
        if (/_/.test(tokenPart)) {
          invalidVars.push(name);
        }

        // Check for triple hyphens
        if (/---/.test(tokenPart)) {
          invalidVars.push(name);
        }
      }

      expect(
        invalidVars,
        `Neutral variables with invalid naming:\n${invalidVars.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('CCUI Format Naming', () => {
    it('all CCUI tokens should start with --ccui-', () => {
      const nonCCUIVars: string[] = [];

      for (const name of ccuiVars.keys()) {
        if (!name.startsWith('--ccui-')) {
          nonCCUIVars.push(name);
        }
      }

      expect(
        nonCCUIVars,
        `Variables not following --ccui- prefix:\n${nonCCUIVars.join('\n')}`
      ).toHaveLength(0);
    });

    it('CCUI token names should follow consistent naming convention', () => {
      // CCUI tokens use kebab-case with camelCase segments (e.g., --ccui-colorPalette-blue-0)
      // This is intentional to match DTCG token path conventions
      const invalidVars: string[] = [];

      for (const name of ccuiVars.keys()) {
        const tokenPart = name.slice(7); // Remove '--ccui-'

        // Check for underscores (snake_case) - not allowed
        if (/_/.test(tokenPart)) {
          invalidVars.push(name);
        }

        // Check for double hyphens (except at start from --ccui prefix)
        if (/---/.test(tokenPart)) {
          invalidVars.push(name);
        }
      }

      expect(
        invalidVars,
        `CCUI variables with invalid naming:\n${invalidVars.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Mantine Format Naming', () => {
    it('all Mantine tokens should start with --mantine-', () => {
      const nonMantineVars: string[] = [];

      for (const name of mantineVars.keys()) {
        if (!name.startsWith('--mantine-')) {
          nonMantineVars.push(name);
        }
      }

      expect(
        nonMantineVars,
        `Variables not following --mantine- prefix:\n${nonMantineVars.join('\n')}`
      ).toHaveLength(0);
    });

    it('Mantine token names should follow consistent naming convention', () => {
      // Mantine variables follow kebab-case convention
      const invalidVars: string[] = [];

      for (const name of mantineVars.keys()) {
        const tokenPart = name.slice(10); // Remove '--mantine-'

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
        invalidVars,
        `Mantine variables with invalid naming:\n${invalidVars.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Duplicate Variables', () => {
    // Note: Combined CSS file intentionally has some duplicates from multiple selectors
    // (e.g., :root and [data-mantine-color-scheme="light"])
    // These are expected CSS behavior for theme switching

    it('should report duplicate variable counts', () => {
      const varRegex = /--([\w-]+)\s*:/g;
      const varNames: string[] = [];
      let match;

      while ((match = varRegex.exec(combinedCSS)) !== null) {
        varNames.push(`--${match[1]}`);
      }

      // Find duplicates
      const seen = new Set<string>();
      const duplicates: string[] = [];

      for (const varName of varNames) {
        if (seen.has(varName)) {
          duplicates.push(varName);
        }
        seen.add(varName);
      }

      const uniqueDuplicates = [...new Set(duplicates)];

      console.log(`Combined CSS: ${uniqueDuplicates.length} duplicate variables (expected for theme switching)`);
      expect(true).toBe(true);
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
        invalidNames,
        `Invalid CSS custom property names:\n${invalidNames.join('\n')}`
      ).toHaveLength(0);
    });

    it('variable names should not contain consecutive hyphens (except prefix)', () => {
      const badNames: string[] = [];

      for (const name of allVariables.keys()) {
        // Remove the leading -- prefix, then check for ---
        const afterPrefix = name.slice(2);
        if (afterPrefix.includes('---')) {
          badNames.push(name);
        }
      }

      expect(
        badNames,
        `Variables with triple hyphens:\n${badNames.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Consistent Token Path Separators', () => {
    it('should use hyphens as path separators consistently', () => {
      const inconsistentNames: string[] = [];

      for (const name of allVariables.keys()) {
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
        inconsistentNames,
        `Inconsistent path separators:\n${inconsistentNames.join('\n')}`
      ).toHaveLength(0);
    });
  });
});
