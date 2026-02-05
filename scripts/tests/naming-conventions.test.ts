/**
 * CSS Variable Naming Convention Tests
 *
 * Verifies that naming patterns are followed correctly.
 *
 * Build structure:
 * - Theme-specific: ccui-semantic.css, mantine-theme.css
 * - Shared primitives: ccui-primitives.css, mantine-primitives.css
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadThemeCSS,
  parseCSSVariables,
} from './test-utils';

describe('Naming Conventions', () => {
  const themes = getThemeNames();

  // Load shared primitives once
  const sharedPrimitivesCSS = loadThemeCSS('shared', 'ccui-primitives.css');
  const sharedPrimitives = parseCSSVariables(sharedPrimitivesCSS);

  describe.each(themes)('Theme: %s', (themeName) => {
    describe('CCUI Token Naming', () => {
      // Use ccui-semantic.css for theme-specific tokens
      const ccuiCSS = loadThemeCSS(themeName, 'ccui-semantic.css');
      const themeVariables = parseCSSVariables(ccuiCSS);
      // Combine with shared primitives
      const variables = new Map([...sharedPrimitives, ...themeVariables]);

      it('all CCUI tokens should start with --ccui-', () => {
        const nonCCUIVars: string[] = [];

        for (const name of variables.keys()) {
          if (!name.startsWith('--ccui-') && !name.startsWith('--mantine-')) {
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

        for (const name of variables.keys()) {
          if (name.startsWith('--ccui-')) {
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
        }

        expect(
          invalidVars,
          `CCUI variables with invalid naming:\n${invalidVars.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('Mantine Token Naming', () => {
      const mantineCSS = loadThemeCSS(themeName, 'mantine-theme.css');
      const variables = parseCSSVariables(mantineCSS);

      it('all Mantine tokens should start with --mantine-', () => {
        const nonMantineVars: string[] = [];

        for (const name of variables.keys()) {
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

        for (const name of variables.keys()) {
          if (name.startsWith('--mantine-')) {
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
        }

        expect(
          invalidVars,
          `Mantine variables with invalid naming:\n${invalidVars.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('No Duplicate Variables', () => {
      // Note: mantine-theme.css intentionally has duplicates from multiple token sources
      // Style Dictionary merges tokens and may produce duplicates which CSS handles gracefully
      const cssFiles = [
        { name: 'ccui-semantic.css', source: themeName, prefix: '--ccui-', allowDuplicates: false },
        { name: 'mantine-theme.css', source: themeName, prefix: '--mantine-', allowDuplicates: true },
      ];

      // Also test shared primitives
      const sharedFiles = [
        { name: 'ccui-primitives.css', source: 'shared', prefix: '--ccui-', allowDuplicates: false },
        { name: 'mantine-primitives.css', source: 'shared', prefix: '--mantine-', allowDuplicates: false },
      ];

      it.each([...cssFiles, ...sharedFiles])(
        '$name should have no unexpected duplicate variable declarations',
        ({ name, source, allowDuplicates }) => {
          const css = loadThemeCSS(source, name);

          // Find all variable declarations (not just parsed ones)
          const varRegex = /--([\w-]+)\s*:/g;
          const varNames: string[] = [];
          let match;

          while ((match = varRegex.exec(css)) !== null) {
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

          // Remove duplicate duplicates
          const uniqueDuplicates = [...new Set(duplicates)];

          if (allowDuplicates) {
            // Log but don't fail for files where duplicates are expected
            if (uniqueDuplicates.length > 0) {
              console.log(
                `${name}: ${uniqueDuplicates.length} duplicate variables (expected from Style Dictionary merge)`
              );
            }
          } else {
            expect(
              uniqueDuplicates,
              `Duplicate variables in ${name}:\n${uniqueDuplicates.join('\n')}`
            ).toHaveLength(0);
          }
        }
      );
    });

    describe('Valid CSS Custom Property Names', () => {
      const allCSS = [
        loadThemeCSS(themeName, 'ccui-semantic.css'),
        loadThemeCSS(themeName, 'mantine-theme.css'),
        loadThemeCSS('shared', 'ccui-primitives.css'),
        loadThemeCSS('shared', 'mantine-primitives.css'),
      ].join('\n');

      const allVariables = parseCSSVariables(allCSS);

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
      // Use the combined variables from CCUI Token Naming section
      const ccuiCSS = loadThemeCSS(themeName, 'ccui-semantic.css');
      const ccuiVariables = parseCSSVariables(ccuiCSS);
      const variables = new Map([...sharedPrimitives, ...ccuiVariables]);

      it('should use hyphens as path separators consistently', () => {
        const inconsistentNames: string[] = [];

        for (const name of variables.keys()) {
          if (name.startsWith('--ccui-')) {
            // Check for periods in token names (from JSON paths not converted)
            if (name.includes('.')) {
              inconsistentNames.push(name);
            }

            // Check for double underscores (alternative separator)
            if (name.includes('__')) {
              inconsistentNames.push(name);
            }
          }
        }

        expect(
          inconsistentNames,
          `Inconsistent path separators:\n${inconsistentNames.join('\n')}`
        ).toHaveLength(0);
      });
    });
  });
});
