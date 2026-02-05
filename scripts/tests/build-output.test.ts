/**
 * Build Output Validation Tests
 *
 * Verifies that the token build produces all expected outputs
 * with valid syntax and non-empty content.
 *
 * New architecture:
 * - CSS: Single combined file at dist/css/ccui-tokens.css
 * - Tokens Studio: dist/tokens-studio/{primitives,semantic,component}/*.json
 * - Themes: $themes.json with 3 groups (primitives, semantic, component)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  mainCSSExists,
  getMainCSSPath,
  loadMainCSS,
  hasPrimitives,
  hasSemanticTokens,
  hasComponentTokens,
  getThemeNames,
  getPrimitiveSetNames,
  getComponentSetNames,
  loadPrimitiveTokens,
  loadSemanticTokens,
  loadComponentTokens,
  loadThemesConfig,
  loadMetadata,
  themesConfigExists,
  metadataExists,
  getTokensStudioPath,
} from './test-utils';

describe('Build Output Validation', () => {
  describe('CSS Output', () => {
    it('should have main CSS file', () => {
      expect(mainCSSExists()).toBe(true);
    });

    it('main CSS file should be non-empty', () => {
      const content = loadMainCSS();
      expect(content.length).toBeGreaterThan(0);
    });

    it('main CSS file should have valid syntax (balanced braces)', () => {
      const content = loadMainCSS();
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });

    it('main CSS file should have :root section for primitives', () => {
      const content = loadMainCSS();
      expect(content).toContain(':root');
    });

    it('main CSS file should have light theme section', () => {
      const content = loadMainCSS();
      expect(content).toContain('[data-mantine-color-scheme="light"]');
    });

    it('main CSS file should have dark theme section', () => {
      const content = loadMainCSS();
      expect(content).toContain('[data-mantine-color-scheme="dark"]');
    });

    it('main CSS file should have CSS custom properties', () => {
      const content = loadMainCSS();
      expect(content).toMatch(/--[\w-]+\s*:/);
    });

    it('main CSS file should have ccui-prefixed variables', () => {
      const content = loadMainCSS();
      expect(content).toMatch(/--ccui-[\w-]+\s*:/);
    });
  });

  describe('Tokens Studio Structure', () => {
    it('should have primitives folder', () => {
      expect(hasPrimitives()).toBe(true);
    });

    it('should have semantic folder', () => {
      expect(hasSemanticTokens()).toBe(true);
    });

    it('should have component folder', () => {
      expect(hasComponentTokens()).toBe(true);
    });

    it('should have $themes.json', () => {
      expect(themesConfigExists()).toBe(true);
    });

    it('should have $metadata.json', () => {
      expect(metadataExists()).toBe(true);
    });
  });

  describe('Primitive Token Sets', () => {
    const primitives = getPrimitiveSetNames();

    it('should have at least one primitive token set', () => {
      expect(primitives.length).toBeGreaterThan(0);
    });

    it('should have expected primitive sets', () => {
      const expected = ['color', 'spacing', 'radius', 'typography', 'motion'];
      for (const setName of expected) {
        expect(
          primitives.includes(setName),
          `Missing primitive set: ${setName}`
        ).toBe(true);
      }
    });

    it.each(primitives)('primitive/%s.json should be valid JSON', (setName) => {
      expect(() => loadPrimitiveTokens(setName)).not.toThrow();
    });

    it.each(primitives)('primitive/%s.json should be non-empty', (setName) => {
      const tokens = loadPrimitiveTokens(setName);
      expect(Object.keys(tokens).length).toBeGreaterThan(0);
    });
  });

  describe('Semantic Token Sets (Themes)', () => {
    const themes = getThemeNames();

    it('should have at least one semantic theme', () => {
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should have expected themes', () => {
      const expected = ['light', 'dark', 'high-contrast'];
      for (const themeName of expected) {
        expect(
          themes.includes(themeName),
          `Missing theme: ${themeName}`
        ).toBe(true);
      }
    });

    it.each(themes)('semantic/%s.json should be valid JSON', (themeName) => {
      expect(() => loadSemanticTokens(themeName)).not.toThrow();
    });

    it.each(themes)('semantic/%s.json should be non-empty', (themeName) => {
      const tokens = loadSemanticTokens(themeName);
      expect(Object.keys(tokens).length).toBeGreaterThan(0);
    });
  });

  describe('Component Token Sets', () => {
    const components = getComponentSetNames();

    it('should have at least one component token set', () => {
      expect(components.length).toBeGreaterThan(0);
    });

    it('should have expected component sets', () => {
      const expected = ['button', 'input', 'modal'];
      for (const setName of expected) {
        expect(
          components.includes(setName),
          `Missing component set: ${setName}`
        ).toBe(true);
      }
    });

    it.each(components)('component/%s.json should be valid JSON', (setName) => {
      expect(() => loadComponentTokens(setName)).not.toThrow();
    });

    it.each(components)('component/%s.json should be non-empty', (setName) => {
      const tokens = loadComponentTokens(setName);
      expect(Object.keys(tokens).length).toBeGreaterThan(0);
    });
  });

  describe('Themes Configuration', () => {
    it('$themes.json should have valid structure', () => {
      const themes = loadThemesConfig();
      expect(Array.isArray(themes)).toBe(true);
      expect(themes.length).toBeGreaterThan(0);
    });

    it('$themes.json should have required theme groups', () => {
      const themes = loadThemesConfig();
      const groups = new Set(themes.map(t => t.group));

      expect(groups.has('primitives')).toBe(true);
      expect(groups.has('semantic')).toBe(true);
      expect(groups.has('component')).toBe(true);
    });

    it('$themes.json entries should have required fields', () => {
      const themes = loadThemesConfig();

      for (const theme of themes) {
        expect(theme.id).toBeDefined();
        expect(theme.name).toBeDefined();
        expect(theme.group).toBeDefined();
        expect(theme.selectedTokenSets).toBeDefined();
        expect(typeof theme.selectedTokenSets).toBe('object');
      }
    });

    it('semantic group should have light/dark/high-contrast themes', () => {
      const themes = loadThemesConfig();
      const semanticThemes = themes.filter(t => t.group === 'semantic');

      const themeNames = semanticThemes.map(t => t.name.toLowerCase());
      expect(themeNames).toContain('light');
      expect(themeNames).toContain('dark');
      expect(themeNames).toContain('high contrast');
    });
  });

  describe('Metadata Configuration', () => {
    it('$metadata.json should have valid structure', () => {
      const metadata = loadMetadata();
      expect(typeof metadata).toBe('object');
    });

    it('$metadata.json should have tokenSetOrder', () => {
      const metadata = loadMetadata();
      expect(metadata.tokenSetOrder).toBeDefined();
      expect(Array.isArray(metadata.tokenSetOrder)).toBe(true);
    });
  });

  describe('Token Set Coverage', () => {
    it('primitives should cover core categories', () => {
      const primitives = getPrimitiveSetNames();
      const coreCategories = [
        'color',
        'spacing',
        'radius',
        'typography',
        'motion',
        'border',
        'breakpoints',
        'interaction',
        'sizing',
      ];

      for (const category of coreCategories) {
        expect(
          primitives.includes(category),
          `Missing primitive category: ${category}`
        ).toBe(true);
      }
    });

    it('semantic themes should have consistent token categories', () => {
      const themes = getThemeNames();

      if (themes.length < 2) return;

      const firstThemeTokens = loadSemanticTokens(themes[0]);
      const firstCategories = new Set(Object.keys(firstThemeTokens).filter(k => !k.startsWith('$')));

      for (const theme of themes.slice(1)) {
        const themeTokens = loadSemanticTokens(theme);
        const categories = new Set(Object.keys(themeTokens).filter(k => !k.startsWith('$')));

        const missingInFirst = [...categories].filter(c => !firstCategories.has(c));
        const missingInCurrent = [...firstCategories].filter(c => !categories.has(c));

        if (missingInFirst.length > 0 || missingInCurrent.length > 0) {
          console.log(`Category differences between ${themes[0]} and ${theme}:`);
          if (missingInFirst.length > 0) console.log(`  Only in ${theme}: ${missingInFirst.join(', ')}`);
          if (missingInCurrent.length > 0) console.log(`  Only in ${themes[0]}: ${missingInCurrent.join(', ')}`);
        }

        // Categories should match for theme switching to work
        expect(
          missingInCurrent.length,
          `${theme} is missing categories: ${missingInCurrent.join(', ')}`
        ).toBe(0);
      }
    });
  });
});
