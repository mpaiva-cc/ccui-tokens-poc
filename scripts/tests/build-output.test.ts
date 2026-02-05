/**
 * Build Output Validation Tests
 *
 * Verifies that the token build produces all expected outputs
 * with valid syntax and non-empty content.
 *
 * Build structure:
 * - Themes (clearco-light, clearco-dark): ccui-semantic.css, mantine-theme.css, tokens.json, tokens-flat.json
 * - Shared primitives: ccui-primitives.css, mantine-primitives.css, primitives.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  getThemeNames,
  hasSharedPrimitives,
  getThemeCSSFiles,
  getThemeJSONFiles,
  getSharedCSSFiles,
  getSharedJSONFiles,
  cssFileExists,
  jsonFileExists,
  getCSSPath,
  getJSONPath,
} from './test-utils';

describe('Build Output Validation', () => {
  const themes = getThemeNames();
  const themeCSSFiles = getThemeCSSFiles();
  const themeJSONFiles = getThemeJSONFiles();
  const sharedCSSFiles = getSharedCSSFiles();
  const sharedJSONFiles = getSharedJSONFiles();

  it('should have at least one theme', () => {
    expect(themes.length).toBeGreaterThan(0);
  });

  it('should have shared primitives folder', () => {
    expect(hasSharedPrimitives()).toBe(true);
  });

  describe.each(themes)('Theme: %s', (themeName) => {
    describe('CSS Files', () => {
      it.each(themeCSSFiles)('should have %s', (fileName) => {
        expect(cssFileExists(themeName, fileName)).toBe(true);
      });

      it.each(themeCSSFiles)('%s should be non-empty', (fileName) => {
        const filePath = join(getCSSPath(themeName), fileName);
        const content = readFileSync(filePath, 'utf-8');
        expect(content.length).toBeGreaterThan(0);
      });

      it.each(themeCSSFiles)('%s should have valid CSS syntax', (fileName) => {
        const filePath = join(getCSSPath(themeName), fileName);
        const content = readFileSync(filePath, 'utf-8');

        // Check for balanced braces
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        expect(openBraces).toBe(closeBraces);

        // Check for color-scheme selector (theme-specific CSS uses data attribute for scoping)
        const hasColorSchemeSelector =
          content.includes('[data-mantine-color-scheme="light"]') ||
          content.includes('[data-mantine-color-scheme="dark"]');
        expect(hasColorSchemeSelector).toBe(true);

        // Check for CSS custom properties
        expect(content).toMatch(/--[\w-]+\s*:/);
      });
    });

    describe('JSON Files', () => {
      it.each(themeJSONFiles)('should have %s', (fileName) => {
        expect(jsonFileExists(themeName, fileName)).toBe(true);
      });

      it.each(themeJSONFiles)('%s should be valid JSON', (fileName) => {
        const filePath = join(getJSONPath(themeName), fileName);
        const content = readFileSync(filePath, 'utf-8');

        expect(() => JSON.parse(content)).not.toThrow();
      });

      it.each(themeJSONFiles)('%s should be non-empty object', (fileName) => {
        const filePath = join(getJSONPath(themeName), fileName);
        const content = readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);

        expect(typeof parsed).toBe('object');
        expect(Object.keys(parsed).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Shared Primitives', () => {
    describe('CSS Files', () => {
      it.each(sharedCSSFiles)('should have %s', (fileName) => {
        expect(cssFileExists('shared', fileName)).toBe(true);
      });

      it.each(sharedCSSFiles)('%s should be non-empty', (fileName) => {
        const filePath = join(getCSSPath('shared'), fileName);
        const content = readFileSync(filePath, 'utf-8');
        expect(content.length).toBeGreaterThan(0);
      });

      it.each(sharedCSSFiles)('%s should have valid CSS syntax', (fileName) => {
        const filePath = join(getCSSPath('shared'), fileName);
        const content = readFileSync(filePath, 'utf-8');

        // Check for balanced braces
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        expect(openBraces).toBe(closeBraces);

        // Check for :root selector
        expect(content).toContain(':root');

        // Check for CSS custom properties
        expect(content).toMatch(/--[\w-]+\s*:/);
      });
    });

    describe('JSON Files', () => {
      it.each(sharedJSONFiles)('should have %s', (fileName) => {
        expect(jsonFileExists('shared', fileName)).toBe(true);
      });

      it.each(sharedJSONFiles)('%s should be valid JSON', (fileName) => {
        const filePath = join(getJSONPath('shared'), fileName);
        const content = readFileSync(filePath, 'utf-8');

        expect(() => JSON.parse(content)).not.toThrow();
      });

      it.each(sharedJSONFiles)('%s should be non-empty object', (fileName) => {
        const filePath = join(getJSONPath('shared'), fileName);
        const content = readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);

        expect(typeof parsed).toBe('object');
        expect(Object.keys(parsed).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Cross-Theme Consistency', () => {
    it('should have same CSS files across all themes', () => {
      if (themes.length < 2) return;

      for (const theme of themes) {
        for (const file of themeCSSFiles) {
          expect(
            cssFileExists(theme, file),
            `${theme} should have ${file}`
          ).toBe(true);
        }
      }
    });

    it('should have same JSON files across all themes', () => {
      if (themes.length < 2) return;

      for (const theme of themes) {
        for (const file of themeJSONFiles) {
          expect(
            jsonFileExists(theme, file),
            `${theme} should have ${file}`
          ).toBe(true);
        }
      }
    });
  });
});
