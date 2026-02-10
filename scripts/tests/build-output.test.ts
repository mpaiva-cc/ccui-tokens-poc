/**
 * Build Output Validation Tests
 *
 * Verifies that the token build produces all expected outputs
 * with valid syntax and non-empty content.
 *
 * Build structure (multi-theme):
 * - Tokens Studio JSON: dist/tokens-studio/primitives/*.json, semantic/*.json, components/*.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  ALL_THEME_NAMES,
  getDistPath,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

describe('Build Output Validation', () => {
  describe('Tokens Studio Output', () => {
    const expectedPrimitivesFile = 'primitives.json';

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

    describe('Primitives', () => {
      it('should have primitives.json', () => {
        const filePath = join(TOKENS_STUDIO_DIR, expectedPrimitivesFile);
        expect(existsSync(filePath)).toBe(true);
      });

      it('primitives.json should be valid JSON', () => {
        const filePath = join(TOKENS_STUDIO_DIR, expectedPrimitivesFile);
        const content = readFileSync(filePath, 'utf-8');
        expect(() => JSON.parse(content)).not.toThrow();
      });

      it('primitives.json should be non-empty object', () => {
        const filePath = join(TOKENS_STUDIO_DIR, expectedPrimitivesFile);
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
        'radio.json',
        'avatar.json',
        'tooltip.json',
        'progress.json',
        'accordion.json',
        'pagination.json',
        'skeleton.json',
        'breadcrumb.json',
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
    it('should have all expected themes', () => {
      for (const themeName of ALL_THEME_NAMES) {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);
        expect(existsSync(filePath), `Missing semantic/${themeName}.json`).toBe(true);
      }
    });

    it('should have exactly 5 themes', () => {
      expect(ALL_THEME_NAMES.length).toBe(5);
    });
  });
});
