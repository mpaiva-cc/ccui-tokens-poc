/**
 * Build Output Validation Tests
 *
 * Verifies that the token build produces all expected outputs
 * with valid syntax and non-empty content.
 *
 * Build structure (multi-theme):
 * - CSS: dist/css/primitives.css + dist/css/{theme}.css per theme
 * - Tokens Studio JSON: dist/tokens-studio/primitives/*.json, semantic/*.json, components/*.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  getThemeNames,
  hasSharedPrimitives,
  hasPrimitivesCSS,
  hasThemeCSS,
  loadPrimitivesCSS,
  loadThemeCSSFile,
  loadAllCSS,
  ALL_THEME_NAMES,
  getDistPath,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

describe('Build Output Validation', () => {
  const themes = getThemeNames();

  describe('CSS Output - Primitives', () => {
    it('should have primitives.css file', () => {
      expect(hasPrimitivesCSS()).toBe(true);
    });

    it('should have non-empty primitives CSS', () => {
      const content = loadPrimitivesCSS();
      expect(content.length).toBeGreaterThan(0);
    });

    it('primitives.css should have valid CSS syntax', () => {
      const content = loadPrimitivesCSS();

      // Check for balanced braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);

      // Check for :root selector
      expect(content).toContain(':root');

      // Check for CSS custom properties
      expect(content).toMatch(/--[\w-]+\s*:/);
    });

    it('primitives should include neutral format (no prefix)', () => {
      const content = loadPrimitivesCSS();
      // Neutral format uses no prefix: --spacing-md, --color-blue-5
      expect(content).toMatch(/--spacing-md:/);
      expect(content).toMatch(/--radius-sm:/);
    });

    it('primitives should include CCUI format (--ccui-* prefix)', () => {
      const content = loadPrimitivesCSS();
      expect(content).toMatch(/--ccui-spacing-md:/);
      expect(content).toMatch(/--ccui-radius-sm:/);
    });

    it('primitives should include Mantine format (--mantine-* prefix)', () => {
      const content = loadPrimitivesCSS();
      expect(content).toMatch(/--mantine-spacing-md:/);
      expect(content).toMatch(/--mantine-radius-sm:/);
    });

    it('primitives should include system tokens', () => {
      const content = loadPrimitivesCSS();
      // Check for framework-agnostic system tokens
      expect(content).toMatch(/--scale:/);
      expect(content).toMatch(/--cursor-interactive:/);
      expect(content).toMatch(/--cursor-default:/);
      expect(content).toMatch(/--fontSmoothing-webkit:/);
      expect(content).toMatch(/--fontSmoothing-moz:/);
      expect(content).toMatch(/--heading-fontWeight:/);
    });

    it('primitives should include z-index tokens', () => {
      const content = loadPrimitivesCSS();
      expect(content).toMatch(/--zIndex-app:/);
      expect(content).toMatch(/--zIndex-max:/);
      expect(content).toMatch(/--zIndex-dropdown:/);
    });

    it('primitives should include radius.default token', () => {
      const content = loadPrimitivesCSS();
      expect(content).toMatch(/--radius-default:/);
    });
  });

  describe('CSS Output - Theme Files', () => {
    it.each(ALL_THEME_NAMES)('should have %s.css file', (themeName) => {
      expect(hasThemeCSS(themeName)).toBe(true);
    });

    it.each(ALL_THEME_NAMES)('%s.css should have valid CSS syntax', (themeName) => {
      if (!hasThemeCSS(themeName)) return;

      const content = loadThemeCSSFile(themeName);

      // Check for balanced braces
      const openBraces = (content.match(/{/g) || []).length;
      const closeBraces = (content.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);

      // Check for CSS custom properties
      expect(content).toMatch(/--[\w-]+\s*:/);
    });

    it.each(ALL_THEME_NAMES)('%s.css should use data-theme selector', (themeName) => {
      if (!hasThemeCSS(themeName)) return;

      const content = loadThemeCSSFile(themeName);
      expect(content).toContain(`[data-theme="${themeName}"]`);
    });

    it('mantine-light should be default (:root)', () => {
      if (!hasThemeCSS('mantine-light')) return;

      const content = loadThemeCSSFile('mantine-light');
      expect(content).toContain(':root');
    });
  });

  describe('Tokens Studio Output', () => {
    const expectedPrimitiveSets = [
      'color.json',
      'spacing.json',
      'radius.json',
      'typography.json',
      'shadow.json',
      'motion.json',
      'border.json',
      'breakpoints.json',
      'z-index.json',
      'opacity.json',
      'sizing.json',
      'focus.json',
      'system.json',
    ];

    it('should have $metadata.json', () => {
      const filePath = join(TOKENS_STUDIO_DIR, '$metadata.json');
      expect(existsSync(filePath)).toBe(true);
    });

    it('should have $themes.json', () => {
      const filePath = join(TOKENS_STUDIO_DIR, '$themes.json');
      expect(existsSync(filePath)).toBe(true);
    });

    it('$metadata.json should be valid JSON', () => {
      const filePath = join(TOKENS_STUDIO_DIR, '$metadata.json');
      const content = readFileSync(filePath, 'utf-8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    it('$themes.json should be valid JSON array', () => {
      const filePath = join(TOKENS_STUDIO_DIR, '$themes.json');
      const content = readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThan(0);
    });

    describe('Primitive Sets', () => {
      it.each(expectedPrimitiveSets)('should have primitives/%s', (fileName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'primitives', fileName);
        expect(existsSync(filePath)).toBe(true);
      });

      it.each(expectedPrimitiveSets)('primitives/%s should be valid JSON', (fileName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'primitives', fileName);
        const content = readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
      });

      it.each(expectedPrimitiveSets)('primitives/%s should be non-empty object', (fileName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'primitives', fileName);
        const content = readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        expect(typeof parsed).toBe('object');
        expect(Object.keys(parsed).length).toBeGreaterThan(0);
      });
    });

    describe('Semantic Sets', () => {
      it.each(ALL_THEME_NAMES)('should have semantic/%s.json', (themeName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);
        expect(existsSync(filePath)).toBe(true);
      });

      it.each(ALL_THEME_NAMES)('semantic/%s.json should be valid JSON', (themeName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);
        if (!existsSync(filePath)) return;
        const content = readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
      });
    });

    describe('Component Sets', () => {
      const componentFiles = [
        'button.json',
        'input.json',
        'modal.json',
        'table.json',
        'card.json',
        'badge.json',
        'select.json',
        'checkbox.json',
        'switch.json',
        'alert.json',
        'tabs.json',
      ];

      it.each(componentFiles)('should have components/%s', (fileName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'components', fileName);
        expect(existsSync(filePath)).toBe(true);
      });

      it.each(componentFiles)('components/%s should be valid JSON', (fileName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'components', fileName);
        const content = readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
      });
    });
  });

  describe('Theme Detection', () => {
    it('should have at least one theme', () => {
      expect(themes.length).toBeGreaterThan(0);
    });

    it('should detect all expected themes', () => {
      expect(themes).toContain('mantine-light');
      expect(themes).toContain('mantine-dark');
      expect(themes).toContain('ccui-21-light');
      expect(themes).toContain('ccui-30-light');
      expect(themes).toContain('ccui-30-dark');
    });

    it('should have exactly 5 themes', () => {
      expect(themes.length).toBe(5);
    });
  });

  describe('Backwards Compatibility', () => {
    it('hasSharedPrimitives should return true', () => {
      // This should return true with combined CSS
      expect(hasSharedPrimitives()).toBe(true);
    });
  });
});
