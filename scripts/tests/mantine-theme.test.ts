/**
 * CSS Output Validation Tests
 *
 * Verifies that CSS variables are correctly generated
 * for the CCUI design system.
 *
 * New architecture:
 * - CSS: Single combined file at dist/css/ccui-tokens.css
 * - All tokens have --ccui- prefix
 */
import { describe, it, expect } from 'vitest';
import {
  loadMainCSS,
  parseCSSVariables,
} from './test-utils';

describe('CSS Output Validation', () => {
  const cssContent = loadMainCSS();
  const allVariables = parseCSSVariables(cssContent);

  describe('Color Palettes', () => {
    const colorPalettes = [
      'dark',
      'gray',
      'red',
      'pink',
      'grape',
      'violet',
      'indigo',
      'blue',
      'cyan',
      'teal',
      'green',
      'lime',
      'yellow',
      'orange',
    ];

    it('should have blue color scale (50-900)', () => {
      const missingShades: string[] = [];
      const expectedShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

      for (const shade of expectedShades) {
        const varName = `--ccui-color-blue-${shade}`;
        if (!allVariables.has(varName)) {
          missingShades.push(varName);
        }
      }

      expect(
        missingShades.length,
        `Missing blue color shades:\n${missingShades.join('\n')}`
      ).toBe(0);
    });

    it('should have gray color scale (50-900)', () => {
      const missingShades: string[] = [];
      const expectedShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

      for (const shade of expectedShades) {
        const varName = `--ccui-color-gray-${shade}`;
        if (!allVariables.has(varName)) {
          missingShades.push(varName);
        }
      }

      expect(
        missingShades.length,
        `Missing gray color shades:\n${missingShades.join('\n')}`
      ).toBe(0);
    });

    it('should have multiple color palettes', () => {
      const paletteCount = colorPalettes.filter(palette => {
        const varName = `--ccui-color-${palette}-500`;
        return allVariables.has(varName);
      }).length;

      expect(paletteCount).toBeGreaterThan(5);
      console.log(`Found ${paletteCount} color palettes with 500 shade`);
    });
  });

  describe('Spacing Scale', () => {
    const spacingScales = ['0', '50', '100', '200', '300', '400', '500', '600', '800', '1000'];

    it('should have numeric spacing scale', () => {
      const missingSpacing: string[] = [];

      for (const scale of spacingScales) {
        const varName = `--ccui-spacing-${scale}`;
        if (!allVariables.has(varName)) {
          missingSpacing.push(varName);
        }
      }

      expect(
        missingSpacing.length,
        `Missing spacing values:\n${missingSpacing.join('\n')}`
      ).toBe(0);
    });

    it('spacing values should be valid dimensions', () => {
      const invalidSpacing: string[] = [];

      for (const scale of spacingScales) {
        const varName = `--ccui-spacing-${scale}`;
        const value = allVariables.get(varName);

        if (value && !/^[\d.]+(px|rem|em)$/.test(value) && value !== '0' && !/^var\(/.test(value)) {
          invalidSpacing.push(`${varName}: ${value}`);
        }
      }

      expect(
        invalidSpacing.length,
        `Invalid spacing values:\n${invalidSpacing.join('\n')}`
      ).toBe(0);
    });
  });

  describe('Border Radius', () => {
    // Actual radius scale from dist output: 0, 100, 200, 300, 400, 600, 800, 1000, 1200
    const radiusScales = ['0', '100', '200', '300', '400', '600', '800', '1000', '1200'];

    it('should have numeric radius scale', () => {
      const missingRadius: string[] = [];

      for (const scale of radiusScales) {
        const varName = `--ccui-radius-${scale}`;
        if (!allVariables.has(varName)) {
          missingRadius.push(varName);
        }
      }

      expect(
        missingRadius.length,
        `Missing radius values:\n${missingRadius.join('\n')}`
      ).toBe(0);
    });
  });

  describe('Typography', () => {
    it('should have font-family variables', () => {
      const fontFamilyVars = Array.from(allVariables.keys())
        .filter(k => k.includes('font-family'));
      expect(fontFamilyVars.length).toBeGreaterThan(0);
    });

    it('should have font-size variables', () => {
      const fontSizeVars = Array.from(allVariables.keys())
        .filter(k => k.includes('font-size'));
      expect(fontSizeVars.length).toBeGreaterThan(0);
    });

    it('should have font-weight variables', () => {
      const fontWeightVars = Array.from(allVariables.keys())
        .filter(k => k.includes('font-weight'));
      expect(fontWeightVars.length).toBeGreaterThan(0);
    });

    it('should have line-height variables', () => {
      const lineHeightVars = Array.from(allVariables.keys())
        .filter(k => k.includes('line-height'));
      expect(lineHeightVars.length).toBeGreaterThan(0);
    });
  });

  describe('Semantic Colors', () => {
    it('should have text color variables', () => {
      const textColors = [
        '--ccui-color-text-primary',
        '--ccui-color-text-secondary',
        '--ccui-color-text-disabled',
      ];

      const missingColors: string[] = [];
      for (const varName of textColors) {
        if (!allVariables.has(varName)) {
          missingColors.push(varName);
        }
      }

      expect(
        missingColors.length,
        `Missing text color variables:\n${missingColors.join('\n')}`
      ).toBe(0);
    });

    it('should have surface color variables', () => {
      const surfaceColors = [
        '--ccui-color-surface-primary',
        '--ccui-color-surface-secondary',
      ];

      const missingColors: string[] = [];
      for (const varName of surfaceColors) {
        if (!allVariables.has(varName)) {
          missingColors.push(varName);
        }
      }

      expect(
        missingColors.length,
        `Missing surface color variables:\n${missingColors.join('\n')}`
      ).toBe(0);
    });

    it('should have action color variables', () => {
      const actionColors = [
        '--ccui-color-action-primary',
        '--ccui-color-action-primary-hover',
      ];

      const missingColors: string[] = [];
      for (const varName of actionColors) {
        if (!allVariables.has(varName)) {
          missingColors.push(varName);
        }
      }

      expect(
        missingColors.length,
        `Missing action color variables:\n${missingColors.join('\n')}`
      ).toBe(0);
    });
  });

  describe('Component Tokens', () => {
    it('should have button tokens', () => {
      const buttonVars = Array.from(allVariables.keys())
        .filter(k => k.startsWith('--ccui-button-'));
      expect(buttonVars.length).toBeGreaterThan(0);
      console.log(`Found ${buttonVars.length} button tokens`);
    });

    it('should have input tokens', () => {
      const inputVars = Array.from(allVariables.keys())
        .filter(k => k.startsWith('--ccui-input-'));
      expect(inputVars.length).toBeGreaterThan(0);
      console.log(`Found ${inputVars.length} input tokens`);
    });

    it('should have modal tokens', () => {
      const modalVars = Array.from(allVariables.keys())
        .filter(k => k.startsWith('--ccui-modal-'));
      expect(modalVars.length).toBeGreaterThan(0);
      console.log(`Found ${modalVars.length} modal tokens`);
    });
  });

  describe('Theme Switching', () => {
    it('should have light theme selector', () => {
      expect(cssContent).toContain('[data-mantine-color-scheme="light"]');
    });

    it('should have dark theme selector', () => {
      expect(cssContent).toContain('[data-mantine-color-scheme="dark"]');
    });

    it('should have :root selector for primitives', () => {
      expect(cssContent).toContain(':root');
    });
  });

  describe('All Variables Have Values', () => {
    it('should not have any empty variables', () => {
      const emptyVars: string[] = [];

      for (const [name, value] of allVariables) {
        if (!value || value.trim() === '') {
          emptyVars.push(name);
        }
      }

      expect(
        emptyVars.length,
        `Variables with empty values:\n${emptyVars.slice(0, 10).join('\n')}`
      ).toBe(0);
    });

    it('should not have undefined/null values', () => {
      const invalidVars: string[] = [];

      for (const [name, value] of allVariables) {
        if (value === 'undefined' || value === 'null' || value === '[object Object]') {
          invalidVars.push(`${name}: ${value}`);
        }
      }

      expect(
        invalidVars.length,
        `Variables with invalid values:\n${invalidVars.join('\n')}`
      ).toBe(0);
    });
  });
});
