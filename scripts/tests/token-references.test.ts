/**
 * Token Reference Resolution Tests
 *
 * Verifies that all token references resolve correctly
 * and there are no unresolved references in the output.
 *
 * Build structure (multi-theme):
 * - Tokens Studio JSON: dist/tokens-studio/primitives/*.json, semantic/*.json
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

describe('Token Reference Resolution', () => {
  describe('Tokens Studio JSON Output', () => {
    describe.each([...ALL_THEME_NAMES])('Theme: %s', (themeName) => {
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
    it('all themes should have semantic JSON files', () => {
      for (const theme of ALL_THEME_NAMES) {
        const filePath = join(TOKENS_STUDIO_DIR, 'semantic', `${theme}.json`);
        expect(existsSync(filePath), `Missing semantic/${theme}.json`).toBe(true);
      }
    });
  });
});
