/**
 * Token Deprecation Tests
 *
 * This test suite tracks deprecated tokens in the design system.
 * Deprecated tokens are marked with a $deprecated field in the source JSON files.
 *
 * Example of marking a token as deprecated:
 * {
 *   "oldTokenName": {
 *     "$value": "{newTokenName}",
 *     "$type": "color",
 *     "$description": "Legacy token for backwards compatibility.",
 *     "$deprecated": "Use color.primary instead. Will be removed in v2.0."
 *   }
 * }
 *
 * The deprecation message should:
 * - Explain why the token is deprecated
 * - Suggest a replacement token
 * - Indicate when it will be removed (if known)
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import {
  collectDeprecatedTokens,
  DeprecatedTokenInfo,
  TokenStructure,
} from './test-utils';

// Paths to source token files
const CORE_DIR = join(__dirname, '../core');
const THEMES_DIR = join(__dirname, '../themes');

/**
 * Get all token files from a directory recursively
 */
function getTokenFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const files: string[] = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getTokenFiles(fullPath));
    } else if (entry.name.endsWith('.tokens.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Load and parse a token file
 */
function loadTokenFile(filePath: string): TokenStructure {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

describe('Token Deprecation', () => {
  let coreDeprecated: DeprecatedTokenInfo[] = [];
  let themeDeprecated: Map<string, DeprecatedTokenInfo[]> = new Map();
  let allDeprecated: DeprecatedTokenInfo[] = [];

  beforeAll(() => {
    // Load core tokens
    const coreFiles = getTokenFiles(CORE_DIR);
    for (const file of coreFiles) {
      const data = loadTokenFile(file);
      const deprecated = collectDeprecatedTokens(data);
      coreDeprecated.push(...deprecated);
    }

    // Load theme tokens
    if (existsSync(THEMES_DIR)) {
      const themeEntries = readdirSync(THEMES_DIR, { withFileTypes: true });
      for (const entry of themeEntries) {
        if (entry.isDirectory()) {
          const themeName = entry.name;
          const themeDir = join(THEMES_DIR, themeName);
          const themeFiles = getTokenFiles(themeDir);
          const deprecated: DeprecatedTokenInfo[] = [];

          for (const file of themeFiles) {
            const data = loadTokenFile(file);
            deprecated.push(...collectDeprecatedTokens(data));
          }

          themeDeprecated.set(themeName, deprecated);
        }
      }
    }

    // Combine all deprecated tokens
    allDeprecated = [...coreDeprecated];
    for (const [, tokens] of themeDeprecated) {
      allDeprecated.push(...tokens);
    }
  });

  describe('Deprecation Inventory', () => {
    it('should track deprecated tokens (informational)', () => {
      // This test is informational - it reports but doesn't fail
      if (allDeprecated.length > 0) {
        console.log('\n=== DEPRECATED TOKENS ===');
        console.log(`Found ${allDeprecated.length} deprecated token(s):\n`);

        for (const token of allDeprecated) {
          console.log(`  - ${token.path}`);
          console.log(`    Message: ${token.deprecationMessage}`);
          if (token.suggestedReplacement) {
            console.log(`    Replace with: ${token.suggestedReplacement}`);
          }
          console.log('');
        }
      } else {
        console.log('\nNo deprecated tokens found. All tokens are current.');
      }

      // Always pass - this is informational
      expect(true).toBe(true);
    });

    it('should report core deprecated tokens separately', () => {
      if (coreDeprecated.length > 0) {
        console.log(`\nCore tokens: ${coreDeprecated.length} deprecated`);
        for (const token of coreDeprecated) {
          console.log(`  - ${token.path}: ${token.deprecationMessage}`);
        }
      }
      expect(true).toBe(true);
    });

    it('should report theme deprecated tokens separately', () => {
      for (const [themeName, tokens] of themeDeprecated) {
        if (tokens.length > 0) {
          console.log(`\n${themeName}: ${tokens.length} deprecated`);
          for (const token of tokens) {
            console.log(`  - ${token.path}: ${token.deprecationMessage}`);
          }
        }
      }
      expect(true).toBe(true);
    });
  });

  describe('Deprecation Quality', () => {
    it('deprecated tokens should have meaningful deprecation messages', () => {
      const shortMessages = allDeprecated.filter(
        (t) => t.deprecationMessage.length < 20
      );

      if (shortMessages.length > 0) {
        console.log('\nDeprecated tokens with short messages:');
        for (const token of shortMessages) {
          console.log(`  - ${token.path}: "${token.deprecationMessage}"`);
        }
      }

      // Warn but don't fail - deprecation messages should be helpful
      expect(
        shortMessages.length,
        'Deprecated tokens should have descriptive messages (20+ chars)'
      ).toBe(0);
    });

    it('deprecated tokens should suggest replacements', () => {
      const withoutReplacement = allDeprecated.filter(
        (t) => !t.suggestedReplacement
      );

      if (withoutReplacement.length > 0 && allDeprecated.length > 0) {
        console.log('\nDeprecated tokens without replacement suggestions:');
        for (const token of withoutReplacement) {
          console.log(`  - ${token.path}`);
        }
      }

      // This is a recommendation, not a hard requirement
      // Allow up to 50% without explicit replacement
      const threshold = Math.ceil(allDeprecated.length * 0.5);
      expect(
        withoutReplacement.length,
        `${withoutReplacement.length} deprecated tokens lack replacement suggestions`
      ).toBeLessThanOrEqual(threshold);
    });
  });

  describe('Deprecation Limits', () => {
    it('should not have too many deprecated tokens', () => {
      // If more than 10% of tokens are deprecated, it may indicate
      // a need for a major version cleanup
      const MAX_DEPRECATED_PERCENTAGE = 0.1;

      // Count total tokens for context
      let totalTokens = 0;
      const coreFiles = getTokenFiles(CORE_DIR);
      for (const file of coreFiles) {
        const data = loadTokenFile(file);
        totalTokens += countTokens(data);
      }

      if (totalTokens > 0) {
        const deprecatedPercentage = allDeprecated.length / totalTokens;
        console.log(
          `\nDeprecation rate: ${allDeprecated.length}/${totalTokens} (${(deprecatedPercentage * 100).toFixed(1)}%)`
        );

        expect(
          deprecatedPercentage,
          `Too many deprecated tokens (${(deprecatedPercentage * 100).toFixed(1)}%)`
        ).toBeLessThanOrEqual(MAX_DEPRECATED_PERCENTAGE);
      }
    });
  });
});

/**
 * Count total tokens in a structure
 */
function countTokens(structure: TokenStructure): number {
  let count = 0;

  for (const [, value] of Object.entries(structure)) {
    if (typeof value === 'object' && value !== null) {
      if ('$value' in value) {
        count++;
      } else {
        count += countTokens(value as TokenStructure);
      }
    }
  }

  return count;
}
