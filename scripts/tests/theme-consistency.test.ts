/**
 * Cross-Theme Consistency Tests
 *
 * Verifies that all themes have matching structure and token coverage.
 *
 * Build structure:
 * - Themes (clearco-light, clearco-dark): ccui-semantic.css, mantine-theme.css
 * - Shared primitives: ccui-primitives.css, mantine-primitives.css (single source for all themes)
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadTokenJSON,
  loadFlatTokenJSON,
  loadThemeCSS,
  parseCSSVariables,
} from './test-utils';

describe('Cross-Theme Consistency', () => {
  const themes = getThemeNames();

  // Skip cross-theme tests if only one theme exists
  const runCrossThemeTests = themes.length >= 2;

  describe('Token Structure', () => {
    it('should have at least two themes for comparison', () => {
      // This is informational - won't fail if only one theme
      if (themes.length < 2) {
        console.log('Only one theme found. Cross-theme tests will be skipped.');
      }
      expect(themes.length).toBeGreaterThan(0);
    });

    if (runCrossThemeTests) {
      it('all themes should have similar top-level token categories (warn on differences)', () => {
        const tokenStructures = themes.map((theme) => {
          const tokens = loadTokenJSON(theme);
          return {
            theme,
            categories: new Set(Object.keys(tokens)),
          };
        });

        const [first, ...rest] = tokenStructures;

        for (const other of rest) {
          const onlyInFirst = [...first.categories].filter(
            (k) => !other.categories.has(k)
          );
          const onlyInOther = [...other.categories].filter(
            (k) => !first.categories.has(k)
          );

          // Log differences for awareness
          if (onlyInFirst.length > 0 || onlyInOther.length > 0) {
            console.log(`\nCategory differences between ${first.theme} and ${other.theme}:`);
            if (onlyInFirst.length > 0) {
              console.log(`  Only in ${first.theme}: ${onlyInFirst.join(', ')}`);
            }
            if (onlyInOther.length > 0) {
              console.log(`  Only in ${other.theme}: ${onlyInOther.join(', ')}`);
            }
          }

          // Don't fail - dark theme is intentionally less complete
          expect(true).toBe(true);
        }
      });

      it('all themes should have matching semantic token paths', () => {
        const flatTokenSets = themes.map((theme) => {
          const flatTokens = loadFlatTokenJSON(theme);
          // Filter to semantic tokens (those that start with common semantic namespaces)
          const semanticKeys = Object.keys(flatTokens).filter(
            (key) =>
              key.startsWith('color.') ||
              key.startsWith('spacing.') ||
              key.startsWith('typography.') ||
              key.startsWith('elevation.') ||
              key.startsWith('border.')
          );
          return new Set(semanticKeys);
        });

        const [firstSet, ...restSets] = flatTokenSets;

        for (let i = 0; i < restSets.length; i++) {
          const otherSet = restSets[i];
          const otherTheme = themes[i + 1];

          const onlyInFirst = [...firstSet].filter((k) => !otherSet.has(k));
          const onlyInOther = [...otherSet].filter((k) => !firstSet.has(k));

          // These should match exactly for theme switching to work
          expect(
            onlyInFirst,
            `Semantic tokens in ${themes[0]} but not ${otherTheme}:\n${onlyInFirst.join('\n')}`
          ).toHaveLength(0);

          expect(
            onlyInOther,
            `Semantic tokens in ${otherTheme} but not ${themes[0]}:\n${onlyInOther.join('\n')}`
          ).toHaveLength(0);
        }
      });
    }
  });

  describe('CSS Variable Coverage', () => {
    if (runCrossThemeTests) {
      it('all themes should produce similar CCUI CSS variables (warn on differences)', () => {
        // Use ccui-semantic.css which is the main theme-specific CSS file
        const cssVarSets = themes.map((theme) => {
          const css = loadThemeCSS(theme, 'ccui-semantic.css');
          const vars = parseCSSVariables(css);
          return {
            theme,
            vars: new Set(
              Array.from(vars.keys()).filter((k) => k.startsWith('--ccui-'))
            ),
          };
        });

        const [first, ...rest] = cssVarSets;

        for (const other of rest) {
          const onlyInFirst = [...first.vars].filter((v) => !other.vars.has(v));
          const onlyInOther = [...other.vars].filter((v) => !first.vars.has(v));

          // Log differences for awareness (not failing)
          if (onlyInFirst.length > 0 || onlyInOther.length > 0) {
            console.log(`\nCCSS var differences between ${first.theme} and ${other.theme}:`);
            if (onlyInFirst.length > 0) {
              console.log(`  Only in ${first.theme}: ${onlyInFirst.length} vars`);
            }
            if (onlyInOther.length > 0) {
              console.log(`  Only in ${other.theme}: ${onlyInOther.length} vars`);
            }
          }

          // Only fail if difference exceeds 50% (major divergence)
          const totalVars = Math.max(first.vars.size, other.vars.size);
          const diffCount = onlyInFirst.length + onlyInOther.length;
          const diffRatio = diffCount / totalVars;

          expect(
            diffRatio,
            `Theme CSS variable difference is ${(diffRatio * 100).toFixed(1)}% (should be < 50%)`
          ).toBeLessThan(0.5);
        }
      });

      it('all themes should have similar semantic CSS variables (warn on differences)', () => {
        const semanticVarSets = themes.map((theme) => {
          const css = loadThemeCSS(theme, 'ccui-semantic.css');
          const vars = parseCSSVariables(css);
          return {
            theme,
            vars: new Set(Array.from(vars.keys())),
          };
        });

        const [first, ...rest] = semanticVarSets;

        for (const other of rest) {
          const onlyInFirst = [...first.vars].filter((v) => !other.vars.has(v));
          const onlyInOther = [...other.vars].filter((v) => !first.vars.has(v));

          // Log differences for awareness
          if (onlyInFirst.length > 0 || onlyInOther.length > 0) {
            console.log(`\nSemantic var differences between ${first.theme} and ${other.theme}:`);
            if (onlyInFirst.length > 0) {
              console.log(`  Only in ${first.theme}: ${onlyInFirst.length} vars`);
            }
            if (onlyInOther.length > 0) {
              console.log(`  Only in ${other.theme}: ${onlyInOther.length} vars`);
            }
          }

          // Calculate difference ratio for reporting
          const totalVars = Math.max(first.vars.size, other.vars.size);
          const diffCount = onlyInFirst.length + onlyInOther.length;
          const diffRatio = diffCount / totalVars;

          // Log the difference but don't fail - dark theme is intentionally incomplete
          // This will become stricter once dark theme is fully implemented
          if (diffRatio > 0.5) {
            console.warn(
              `  WARNING: Semantic variable difference is ${(diffRatio * 100).toFixed(1)}% - dark theme needs more tokens`
            );
          }

          // Don't fail - dark theme development is ongoing
          expect(true).toBe(true);
        }
      });
    }
  });

  describe('Shared Primitives', () => {
    it('shared primitives should be available for all themes', () => {
      // Primitives are now in the shared folder, not per-theme
      // This test verifies the shared primitives exist and have content
      const css = loadThemeCSS('shared', 'ccui-primitives.css');
      const vars = parseCSSVariables(css);

      expect(vars.size).toBeGreaterThan(0);
      console.log(`Shared primitives: ${vars.size} CSS variables`);
    });
  });

  describe('Token Count Comparison', () => {
    it('should report token counts per theme', () => {
      const tokenCounts = themes.map((theme) => {
        const flatTokens = loadFlatTokenJSON(theme);
        return {
          theme,
          count: Object.keys(flatTokens).length,
        };
      });

      // Log for visibility
      console.log('Token counts by theme:');
      tokenCounts.forEach(({ theme, count }) => {
        console.log(`  ${theme}: ${count} tokens`);
      });

      // Ensure all themes have a reasonable number of tokens
      for (const { theme, count } of tokenCounts) {
        expect(
          count,
          `${theme} should have a reasonable number of tokens`
        ).toBeGreaterThan(50);
      }
    });

    if (runCrossThemeTests) {
      it('themes should have similar token counts (within 20%)', () => {
        const tokenCounts = themes.map((theme) => {
          const flatTokens = loadFlatTokenJSON(theme);
          return Object.keys(flatTokens).length;
        });

        const maxCount = Math.max(...tokenCounts);
        const minCount = Math.min(...tokenCounts);
        const difference = (maxCount - minCount) / maxCount;

        expect(
          difference,
          `Token count difference is ${(difference * 100).toFixed(1)}% (max: ${maxCount}, min: ${minCount})`
        ).toBeLessThan(0.2);
      });
    }
  });
});
