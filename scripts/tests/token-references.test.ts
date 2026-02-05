/**
 * Token Reference Resolution Tests
 *
 * Verifies that all token references resolve correctly
 * and there are no unresolved references in the output.
 *
 * Build structure (multi-theme):
 * - CSS: dist/css/primitives.css + dist/css/{theme}.css per theme
 * - Tokens Studio JSON: dist/tokens-studio/primitives/*.json, semantic/*.json
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  getThemeNames,
  hasPrimitivesCSS,
  loadAllCSS,
  parseCSSVariables,
  getDistPath,
} from './test-utils';

const DIST_DIR = getDistPath();
const TOKENS_STUDIO_DIR = join(DIST_DIR, 'tokens-studio');

describe('Token Reference Resolution', () => {
  const themes = getThemeNames();

  describe('Combined CSS Output', () => {
    it('should have no unresolved {references}', () => {
      const css = loadAllCSS();

      // Look for unresolved Style Dictionary references like {color.primary}
      const unresolvedRefs = css.match(/\{[a-zA-Z][a-zA-Z0-9.]+\}/g) || [];

      expect(
        unresolvedRefs,
        `Unresolved references in ccui-tokens.css:\n${unresolvedRefs.join('\n')}`
      ).toHaveLength(0);
    });

    it('should have no undefined values', () => {
      const css = loadAllCSS();
      const variables = parseCSSVariables(css);

      const undefinedVars: string[] = [];

      for (const [name, value] of variables) {
        if (
          value === 'undefined' ||
          value === 'null' ||
          value === '[object Object]'
        ) {
          undefinedVars.push(`${name}: ${value}`);
        }
      }

      expect(
        undefinedVars,
        `Undefined values in ccui-tokens.css:\n${undefinedVars.join('\n')}`
      ).toHaveLength(0);
    });

    it('should have no empty values', () => {
      const css = loadAllCSS();
      const variables = parseCSSVariables(css);

      const emptyVars: string[] = [];

      for (const [name, value] of variables) {
        if (value === '' || value.trim() === '') {
          emptyVars.push(name);
        }
      }

      expect(
        emptyVars,
        `Empty values in ccui-tokens.css:\n${emptyVars.join('\n')}`
      ).toHaveLength(0);
    });

    it('all var() references should reference existing variables', () => {
      const css = loadAllCSS();
      const allVariables = parseCSSVariables(css);

      // Find all var() references in the CSS
      const varRefRegex = /var\(\s*(--[a-zA-Z0-9-_]+)\s*(?:,\s*([^)]+))?\)/g;

      const missingRefs: string[] = [];
      let match;

      while ((match = varRefRegex.exec(css)) !== null) {
        const referencedVar = match[1];
        // Skip if it has a fallback value
        const hasFallback = match[2] !== undefined;

        if (!hasFallback && !allVariables.has(referencedVar)) {
          missingRefs.push(referencedVar);
        }
      }

      // Remove duplicates
      const uniqueMissing = [...new Set(missingRefs)];

      expect(
        uniqueMissing,
        `Missing referenced variables:\n${uniqueMissing.join('\n')}`
      ).toHaveLength(0);
    });
  });

  describe('Tokens Studio JSON Output', () => {
    describe.each(themes)('Theme: %s', (themeName) => {
      const semanticFilePath = join(TOKENS_STUDIO_DIR, 'semantic', `${themeName}.json`);

      it('semantic tokens should have valid structure', () => {
        if (!existsSync(semanticFilePath)) {
          return; // Skip if file doesn't exist (handled by build-output tests)
        }

        const content = readFileSync(semanticFilePath, 'utf-8');
        const parsed = JSON.parse(content);

        expect(typeof parsed).toBe('object');
        expect(Object.keys(parsed).length).toBeGreaterThan(0);
      });

      it('semantic tokens should not have undefined values', () => {
        if (!existsSync(semanticFilePath)) {
          return;
        }

        const content = readFileSync(semanticFilePath, 'utf-8');
        const parsed = JSON.parse(content);

        const checkForUndefined = (obj: unknown, path = ''): string[] => {
          const issues: string[] = [];
          if (typeof obj !== 'object' || obj === null) return issues;

          for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;

            if (value === undefined || value === null) {
              issues.push(`${currentPath}: ${value}`);
            } else if (typeof value === 'object' && value !== null && '$value' in value) {
              const tokenValue = (value as { $value: unknown }).$value;
              if (tokenValue === undefined || tokenValue === null) {
                issues.push(`${currentPath}.$value: ${tokenValue}`);
              }
            } else if (typeof value === 'object') {
              issues.push(...checkForUndefined(value, currentPath));
            }
          }

          return issues;
        };

        const undefinedValues = checkForUndefined(parsed);

        expect(
          undefinedValues,
          `Undefined values in ${themeName}.json:\n${undefinedValues.join('\n')}`
        ).toHaveLength(0);
      });
    });

    describe('Primitive Tokens', () => {
      const primitiveFiles = [
        'color.json',
        'spacing.json',
        'radius.json',
        'typography.json',
        'system.json',
      ];

      it.each(primitiveFiles)('primitives/%s should not have undefined values', (fileName) => {
        const filePath = join(TOKENS_STUDIO_DIR, 'primitives', fileName);
        if (!existsSync(filePath)) {
          return;
        }

        const content = readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);

        const checkForUndefined = (obj: unknown, path = ''): string[] => {
          const issues: string[] = [];
          if (typeof obj !== 'object' || obj === null) return issues;

          for (const [key, value] of Object.entries(obj)) {
            const currentPath = path ? `${path}.${key}` : key;

            if (value === undefined || value === null) {
              issues.push(`${currentPath}: ${value}`);
            } else if (typeof value === 'object' && value !== null && '$value' in value) {
              const tokenValue = (value as { $value: unknown }).$value;
              if (tokenValue === undefined || tokenValue === null) {
                issues.push(`${currentPath}.$value: ${tokenValue}`);
              }
            } else if (typeof value === 'object') {
              issues.push(...checkForUndefined(value, currentPath));
            }
          }

          return issues;
        };

        const undefinedValues = checkForUndefined(parsed);

        expect(
          undefinedValues,
          `Undefined values in ${fileName}:\n${undefinedValues.join('\n')}`
        ).toHaveLength(0);
      });
    });
  });

  describe('Cross-Theme Reference Consistency', () => {
    it('both themes should have semantic JSON files', () => {
      for (const theme of themes) {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
        expect(existsSync(filePath), `Missing semantic/${theme}.json`).toBe(true);
      }
    });
  });
});
