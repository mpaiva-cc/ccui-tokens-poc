/**
 * Cross-Theme Consistency Tests
 *
 * Verifies that all semantic themes have matching structure and token coverage.
 * This is critical for theme switching to work correctly.
 *
 * New architecture:
 * - Semantic themes: light.json, dark.json, high-contrast.json
 * - All themes should have identical token paths (only values differ)
 */
import { describe, it, expect } from 'vitest';
import {
  getThemeNames,
  loadSemanticTokens,
  loadMainCSS,
  parseCSSVariables,
  collectTokens,
  flattenTokens,
} from './test-utils';

describe('Cross-Theme Consistency', () => {
  const themes = getThemeNames();
  const runCrossThemeTests = themes.length >= 2;

  describe('Theme Availability', () => {
    it('should have at least two themes for comparison', () => {
      if (themes.length < 2) {
        console.log('Only one theme found. Cross-theme tests will be limited.');
      }
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should have light and dark themes', () => {
      expect(themes).toContain('light');
      expect(themes).toContain('dark');
    });

    it('should have high-contrast accessibility theme', () => {
      expect(themes).toContain('high-contrast');
    });
  });

  describe('Token Structure Consistency', () => {
    if (runCrossThemeTests) {
      it('all themes should have identical top-level categories', () => {
        const tokenStructures = themes.map((theme) => {
          const tokens = loadSemanticTokens(theme);
          return {
            theme,
            categories: new Set(Object.keys(tokens).filter(k => !k.startsWith('$'))),
          };
        });

        const [first, ...rest] = tokenStructures;

        for (const other of rest) {
          const onlyInFirst = [...first.categories].filter(k => !other.categories.has(k));
          const onlyInOther = [...other.categories].filter(k => !first.categories.has(k));

          expect(
            onlyInFirst.length,
            `Categories in ${first.theme} but not ${other.theme}: ${onlyInFirst.join(', ')}`
          ).toBe(0);

          expect(
            onlyInOther.length,
            `Categories in ${other.theme} but not ${first.theme}: ${onlyInOther.join(', ')}`
          ).toBe(0);
        }
      });

      it('all themes should have matching token paths', () => {
        const flatTokenSets = themes.map((theme) => {
          const tokens = loadSemanticTokens(theme);
          const flat = flattenTokens(tokens);
          return {
            theme,
            paths: new Set(Object.keys(flat)),
          };
        });

        const [first, ...rest] = flatTokenSets;

        for (const other of rest) {
          const onlyInFirst = [...first.paths].filter(p => !other.paths.has(p));
          const onlyInOther = [...other.paths].filter(p => !first.paths.has(p));

          // Log differences for debugging
          if (onlyInFirst.length > 0 || onlyInOther.length > 0) {
            console.log(`Token path differences between ${first.theme} and ${other.theme}:`);
            if (onlyInFirst.length > 0) {
              console.log(`  Only in ${first.theme} (${onlyInFirst.length}):`, onlyInFirst.slice(0, 5).join(', '), onlyInFirst.length > 5 ? '...' : '');
            }
            if (onlyInOther.length > 0) {
              console.log(`  Only in ${other.theme} (${onlyInOther.length}):`, onlyInOther.slice(0, 5).join(', '), onlyInOther.length > 5 ? '...' : '');
            }
          }

          // Tokens should match exactly for theme switching to work
          expect(
            onlyInFirst.length,
            `Tokens in ${first.theme} but not ${other.theme}`
          ).toBe(0);

          expect(
            onlyInOther.length,
            `Tokens in ${other.theme} but not ${first.theme}`
          ).toBe(0);
        }
      });
    }
  });

  describe('CSS Variable Coverage', () => {
    it('CSS should contain variables for light theme', () => {
      const css = loadMainCSS();
      expect(css).toContain('[data-mantine-color-scheme="light"]');

      // Extract light theme section and verify it has variables
      const lightMatch = css.match(/\[data-mantine-color-scheme="light"\]\s*\{([^}]+)\}/s);
      expect(lightMatch).not.toBeNull();
      expect(lightMatch![1]).toMatch(/--[\w-]+\s*:/);
    });

    it('CSS should contain variables for dark theme', () => {
      const css = loadMainCSS();
      expect(css).toContain('[data-mantine-color-scheme="dark"]');

      // Extract dark theme section and verify it has variables
      const darkMatch = css.match(/\[data-mantine-color-scheme="dark"\]\s*\{([^}]+)\}/s);
      expect(darkMatch).not.toBeNull();
      expect(darkMatch![1]).toMatch(/--[\w-]+\s*:/);
    });

    it('light and dark themes should have similar CSS variable counts', () => {
      const css = loadMainCSS();

      const lightMatch = css.match(/\[data-mantine-color-scheme="light"\]\s*\{([^}]+)\}/s);
      const darkMatch = css.match(/\[data-mantine-color-scheme="dark"\]\s*\{([^}]+)\}/s);

      if (!lightMatch || !darkMatch) {
        console.log('Could not extract theme sections from CSS');
        return;
      }

      const lightVars = parseCSSVariables(`selector { ${lightMatch[1]} }`);
      const darkVars = parseCSSVariables(`selector { ${darkMatch[1]} }`);

      console.log(`CSS variable counts: light=${lightVars.size}, dark=${darkVars.size}`);

      // Themes should have the same number of variables (within 5%)
      const maxCount = Math.max(lightVars.size, darkVars.size);
      const minCount = Math.min(lightVars.size, darkVars.size);
      const diffRatio = (maxCount - minCount) / maxCount;

      expect(
        diffRatio,
        `CSS variable count difference is ${(diffRatio * 100).toFixed(1)}% (should be < 5%)`
      ).toBeLessThan(0.05);
    });
  });

  describe('Token Count Comparison', () => {
    it('should report token counts per theme', () => {
      const tokenCounts = themes.map((theme) => {
        const tokens = loadSemanticTokens(theme);
        const flat = flattenTokens(tokens);
        return {
          theme,
          count: Object.keys(flat).length,
        };
      });

      console.log('Token counts by theme:');
      tokenCounts.forEach(({ theme, count }) => {
        console.log(`  ${theme}: ${count} tokens`);
      });

      // All themes should have a reasonable number of tokens
      for (const { theme, count } of tokenCounts) {
        expect(
          count,
          `${theme} should have a reasonable number of tokens`
        ).toBeGreaterThan(20);
      }
    });

    if (runCrossThemeTests) {
      it('themes should have identical token counts', () => {
        const tokenCounts = themes.map((theme) => {
          const tokens = loadSemanticTokens(theme);
          const flat = flattenTokens(tokens);
          return Object.keys(flat).length;
        });

        const uniqueCounts = new Set(tokenCounts);

        expect(
          uniqueCounts.size,
          `All themes should have the same token count. Found: ${tokenCounts.join(', ')}`
        ).toBe(1);
      });
    }
  });

  describe('Token Type Consistency', () => {
    if (runCrossThemeTests) {
      it('same tokens should have same $type across themes', () => {
        const tokenMaps = themes.map((theme) => {
          const tokens = loadSemanticTokens(theme);
          return {
            theme,
            tokens: collectTokens(tokens),
          };
        });

        const [first, ...rest] = tokenMaps;
        const typeMismatches: string[] = [];

        for (const [path, token] of first.tokens) {
          if (!token.$type) continue;

          for (const other of rest) {
            const otherToken = other.tokens.get(path);
            if (otherToken && otherToken.$type && otherToken.$type !== token.$type) {
              typeMismatches.push(
                `${path}: ${first.theme}=${token.$type}, ${other.theme}=${otherToken.$type}`
              );
            }
          }
        }

        expect(
          typeMismatches.length,
          `Token type mismatches:\n${typeMismatches.join('\n')}`
        ).toBe(0);
      });
    }
  });

  describe('Color Token Consistency', () => {
    if (runCrossThemeTests) {
      it('color tokens should exist in all themes', () => {
        const colorPaths = new Set<string>();

        // Collect all color token paths from all themes
        for (const theme of themes) {
          const tokens = loadSemanticTokens(theme);
          const collected = collectTokens(tokens);

          for (const [path, token] of collected) {
            if (token.$type === 'color' || path.toLowerCase().includes('color')) {
              colorPaths.add(path);
            }
          }
        }

        // Verify each color path exists in all themes
        for (const theme of themes) {
          const tokens = loadSemanticTokens(theme);
          const collected = collectTokens(tokens);
          const themePaths = new Set(collected.keys());

          const missingColors = [...colorPaths].filter(p => !themePaths.has(p));

          expect(
            missingColors.length,
            `${theme} is missing color tokens:\n${missingColors.slice(0, 10).join('\n')}`
          ).toBe(0);
        }
      });
    }
  });
});
