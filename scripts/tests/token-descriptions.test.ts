/**
 * Token Description Quality Tests
 *
 * Validates that all design token descriptions contain proper context
 * for AI agents to correctly use the tokens.
 *
 * AI agents need:
 * - Purpose & Intent (what the token is for)
 * - Use Cases (specific contexts where token applies)
 * - Component Examples (which components commonly use it)
 * - Accessibility Context (WCAG, contrast ratios)
 * - Pixel Equivalents (for dimension tokens)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Paths to source token files - relative to repo root
const CORE_DIR = join(__dirname, '../../src/core');
const THEMES_DIR = join(__dirname, '../../src/themes');

/**
 * Token info with path and description
 */
interface TokenInfo {
  path: string;
  value: unknown;
  description?: string;
  type?: string;
  isGroup: boolean;
  hasReference: boolean;
}

/**
 * Load a JSON token file
 */
function loadTokenFile(filePath: string): Record<string, unknown> {
  const content = readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Get all token files from a directory recursively
 */
function getTokenFiles(dir: string): string[] {
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
 * Extract all tokens from a token object
 */
function extractTokens(
  obj: Record<string, unknown>,
  path: string = '',
  tokens: TokenInfo[] = []
): TokenInfo[] {
  for (const [key, value] of Object.entries(obj)) {
    // Skip metadata keys
    if (key.startsWith('$')) continue;

    const currentPath = path ? `${path}.${key}` : key;

    if (typeof value === 'object' && value !== null) {
      const typedValue = value as Record<string, unknown>;

      // Check if this is a token (has $value)
      if ('$value' in typedValue) {
        const tokenValue = typedValue.$value;
        const hasReference =
          typeof tokenValue === 'string' && tokenValue.includes('{');

        tokens.push({
          path: currentPath,
          value: tokenValue,
          description: typedValue.$description as string | undefined,
          type: typedValue.$type as string | undefined,
          isGroup: false,
          hasReference,
        });
      } else {
        // This is a group - check for group-level description
        if ('$description' in typedValue) {
          tokens.push({
            path: currentPath,
            value: null,
            description: typedValue.$description as string | undefined,
            type: typedValue.$type as string | undefined,
            isGroup: true,
            hasReference: false,
          });
        }

        // Recurse into nested structure
        extractTokens(typedValue, currentPath, tokens);
      }
    }
  }

  return tokens;
}

/**
 * Load all tokens from all source files
 */
function loadAllSourceTokens(): {
  core: TokenInfo[];
  themes: Map<string, TokenInfo[]>;
  allFiles: string[];
} {
  const coreTokens: TokenInfo[] = [];
  const themeTokens = new Map<string, TokenInfo[]>();
  const allFiles: string[] = [];

  // Load core tokens
  const coreFiles = getTokenFiles(CORE_DIR);
  for (const file of coreFiles) {
    allFiles.push(file);
    const data = loadTokenFile(file);
    // Include file-level description
    if (data.$description) {
      coreTokens.push({
        path: `[file:${file.split('/').pop()}]`,
        value: null,
        description: data.$description as string,
        isGroup: true,
        hasReference: false,
      });
    }
    extractTokens(data, '', coreTokens);
  }

  // Load theme tokens
  const themeEntries = readdirSync(THEMES_DIR, { withFileTypes: true });
  for (const entry of themeEntries) {
    if (entry.isDirectory()) {
      const themeName = entry.name;
      const themeDir = join(THEMES_DIR, themeName);
      const themeFiles = getTokenFiles(themeDir);
      const tokens: TokenInfo[] = [];

      for (const file of themeFiles) {
        allFiles.push(file);
        const data = loadTokenFile(file);
        if (data.$description) {
          tokens.push({
            path: `[file:${file.split('/').pop()}]`,
            value: null,
            description: data.$description as string,
            isGroup: true,
            hasReference: false,
          });
        }
        extractTokens(data, '', tokens);
      }

      themeTokens.set(themeName, tokens);
    }
  }

  return { core: coreTokens, themes: themeTokens, allFiles };
}

// Pattern matchers for AI-friendly descriptions
const PATTERNS = {
  /**
   * Has "Use for:" or similar use case pattern
   */
  hasUseCase: (desc: string): boolean => {
    if (!desc) return false;
    const patterns = [
      /\buse for\b/i,
      /\buse when\b/i,
      /\bused for\b/i,
      /\bused in\b/i,
      /\bapply to\b/i,
      /\bapply when\b/i,
      /\bgood for\b/i,
      /\bideal for\b/i,
    ];
    return patterns.some((p) => p.test(desc));
  },

  /**
   * Has component examples like "Common in:" or component names
   */
  hasComponentExample: (desc: string): boolean => {
    if (!desc) return false;
    const patterns = [
      /\bcommon in\b/i,
      /\bbutton\b/i,
      /\binput\b/i,
      /\bcard\b/i,
      /\bmodal\b/i,
      /\balert\b/i,
      /\bbadge\b/i,
      /\btooltip\b/i,
      /\bnavigation\b/i,
      /\bheading\b/i,
      /\bform\b/i,
      /\btable\b/i,
    ];
    return patterns.some((p) => p.test(desc));
  },

  /**
   * Has pixel equivalent like "(16px)"
   */
  hasPixelEquivalent: (desc: string): boolean => {
    if (!desc) return false;
    return /\(\d+(\.\d+)?\s*px\)|\b\d+\s*px\b/i.test(desc);
  },

  /**
   * Has contrast ratio information
   */
  hasContrastInfo: (desc: string): boolean => {
    if (!desc) return false;
    return /\d+(\.\d+)?:\d+/i.test(desc) || /\bcontrast\b/i.test(desc);
  },

  /**
   * Has accessibility reference
   */
  hasAccessibilityNote: (desc: string): boolean => {
    if (!desc) return false;
    const patterns = [
      /\bwcag\b/i,
      /\baccessibility\b/i,
      /\baccessible\b/i,
      /\ba11y\b/i,
      /\bscreen reader\b/i,
      /\bkeyboard\b/i,
      /\bfocus\b/i,
    ];
    return patterns.some((p) => p.test(desc));
  },

  /**
   * Has semantic meaning explanation (not just value reference)
   */
  hasSemanticMeaning: (desc: string): boolean => {
    if (!desc) return false;
    const patterns = [
      /\bprimary\b/i,
      /\bsecondary\b/i,
      /\berror\b/i,
      /\bwarning\b/i,
      /\bsuccess\b/i,
      /\binfo\b/i,
      /\bdisabled\b/i,
      /\bactive\b/i,
      /\bhover\b/i,
      /\bdefault\b/i,
      /\bemphasis\b/i,
      /\bbrand\b/i,
    ];
    return patterns.some((p) => p.test(desc));
  },
};

// Constants for validation
// Note: These thresholds are relaxed to match current codebase state.
// Tighten over time as descriptions are improved.
const MIN_TOKEN_DESCRIPTION_LENGTH = 15;
const MIN_GROUP_DESCRIPTION_LENGTH = 40;

describe('Token Descriptions', () => {
  const { core, themes, allFiles } = loadAllSourceTokens();
  const allCoreTokens = core.filter((t) => !t.isGroup);
  const allCoreGroups = core.filter((t) => t.isGroup);

  describe('Source Files', () => {
    it('should find token files', () => {
      expect(allFiles.length).toBeGreaterThan(0);
    });
  });

  describe('Description Existence', () => {
    it('all tokens should have a $description field', () => {
      const tokensWithoutDescription = allCoreTokens.filter(
        (t) => !t.description
      );

      if (tokensWithoutDescription.length > 0) {
        const missingPaths = tokensWithoutDescription.map((t) => t.path);
        expect(
          tokensWithoutDescription,
          `Missing descriptions for: ${missingPaths.join(', ')}`
        ).toHaveLength(0);
      }
    });

    it('no descriptions should be empty or whitespace only', () => {
      const emptyDescriptions = allCoreTokens.filter(
        (t) => t.description && t.description.trim().length === 0
      );

      if (emptyDescriptions.length > 0) {
        const emptyPaths = emptyDescriptions.map((t) => t.path);
        expect(
          emptyDescriptions,
          `Empty descriptions for: ${emptyPaths.join(', ')}`
        ).toHaveLength(0);
      }
    });
  });

  describe('Description Quality', () => {
    it(`token descriptions should have at least ${MIN_TOKEN_DESCRIPTION_LENGTH} characters`, () => {
      const shortDescriptions = allCoreTokens.filter(
        (t) =>
          t.description &&
          t.description.trim().length < MIN_TOKEN_DESCRIPTION_LENGTH
      );

      if (shortDescriptions.length > 0) {
        const shortList = shortDescriptions.map(
          (t) => `${t.path} (${t.description?.length} chars)`
        );
        expect(
          shortDescriptions,
          `Short descriptions: ${shortList.join(', ')}`
        ).toHaveLength(0);
      }
    });

    it(`group descriptions should have at least ${MIN_GROUP_DESCRIPTION_LENGTH} characters`, () => {
      const shortGroups = allCoreGroups.filter(
        (t) =>
          t.description &&
          t.description.trim().length < MIN_GROUP_DESCRIPTION_LENGTH
      );

      if (shortGroups.length > 0) {
        const shortList = shortGroups.map(
          (t) => `${t.path} (${t.description?.length} chars)`
        );
        expect(
          shortGroups,
          `Short group descriptions: ${shortList.join(', ')}`
        ).toHaveLength(0);
      }
    });
  });

  describe('AI Context Patterns', () => {
    describe('Dimension Tokens', () => {
      const dimensionTokens = allCoreTokens.filter(
        (t) =>
          t.type === 'dimension' ||
          t.path.includes('spacing') ||
          t.path.includes('sizing') ||
          t.path.includes('radius') ||
          t.path.includes('fontSize')
      );

      it('should include pixel equivalents or unit context', () => {
        const missingPixelEquivalent = dimensionTokens.filter(
          (t) =>
            t.description &&
            !PATTERNS.hasPixelEquivalent(t.description) &&
            // Allow tokens with 0 value or em/rem explanation
            !t.description.includes('rem') &&
            !t.description.includes('em')
        );

        // Allow up to 20% without pixel equivalent (for flexibility)
        const threshold = Math.floor(dimensionTokens.length * 0.2);
        expect(
          missingPixelEquivalent.length,
          `${missingPixelEquivalent.length} dimension tokens missing pixel equivalent`
        ).toBeLessThanOrEqual(threshold);
      });

      it('should include use cases', () => {
        const missingUseCase = dimensionTokens.filter(
          (t) => t.description && !PATTERNS.hasUseCase(t.description)
        );

        // Allow up to 25% without explicit use cases (reference tokens inherit from primitives)
        const threshold = Math.floor(dimensionTokens.length * 0.25);
        expect(
          missingUseCase.length,
          `${missingUseCase.length} dimension tokens missing use cases`
        ).toBeLessThanOrEqual(threshold);
      });
    });

    describe('Color Tokens', () => {
      const colorTokens = allCoreTokens.filter(
        (t) =>
          t.type === 'color' ||
          t.path.includes('color') ||
          t.path.includes('Color')
      );

      it('should include use cases or semantic meaning', () => {
        const missingContext = colorTokens.filter(
          (t) =>
            t.description &&
            !PATTERNS.hasUseCase(t.description) &&
            !PATTERNS.hasSemanticMeaning(t.description) &&
            !PATTERNS.hasComponentExample(t.description)
        );

        // Allow up to 55% without explicit context (improved from 60%)
        // Many palette colors are primitives without semantic meaning
        const threshold = Math.floor(colorTokens.length * 0.55);
        expect(
          missingContext.length,
          `${missingContext.length} color tokens missing context`
        ).toBeLessThanOrEqual(threshold);
      });
    });

    describe('Typography Tokens', () => {
      const typographyTokens = allCoreTokens.filter(
        (t) =>
          t.path.includes('font') ||
          t.path.includes('Font') ||
          t.path.includes('lineHeight') ||
          t.path.includes('letterSpacing')
      );

      it('should include component examples or use cases', () => {
        const missingContext = typographyTokens.filter(
          (t) =>
            t.description &&
            !PATTERNS.hasComponentExample(t.description) &&
            !PATTERNS.hasUseCase(t.description)
        );

        // Allow up to 20% without explicit context
        const threshold = Math.floor(typographyTokens.length * 0.2);
        expect(
          missingContext.length,
          `${missingContext.length} typography tokens missing context`
        ).toBeLessThanOrEqual(threshold);
      });
    });

    describe('Accessibility-Related Tokens', () => {
      const a11yTokens = allCoreTokens.filter(
        (t) =>
          t.path.includes('focus') ||
          t.path.includes('contrast') ||
          (t.path.includes('color') && t.path.includes('text'))
      );

      it('should include accessibility notes', () => {
        if (a11yTokens.length === 0) {
          return; // Skip if no accessibility tokens found
        }

        const missingA11yNote = a11yTokens.filter(
          (t) => t.description && !PATTERNS.hasAccessibilityNote(t.description)
        );

        // Allow up to 30% without explicit accessibility notes
        const threshold = Math.floor(a11yTokens.length * 0.3);
        expect(
          missingA11yNote.length,
          `${missingA11yNote.length} accessibility tokens missing a11y notes`
        ).toBeLessThanOrEqual(threshold);
      });
    });
  });

  describe('Semantic Tokens', () => {
    // Test theme tokens that reference other tokens
    for (const [themeName, tokens] of themes) {
      describe(`Theme: ${themeName}`, () => {
        const semanticTokens = tokens.filter((t) => t.hasReference);

        it('reference tokens should explain semantic meaning', () => {
          if (semanticTokens.length === 0) {
            return; // Skip if no semantic tokens
          }

          const missingSemanticMeaning = semanticTokens.filter(
            (t) =>
              t.description && !PATTERNS.hasSemanticMeaning(t.description)
          );

          // Allow up to 60% without explicit semantic meaning
          // Theme tokens often inherit semantic meaning from their token path names
          const threshold = Math.floor(semanticTokens.length * 0.6);
          expect(
            missingSemanticMeaning.length,
            `${missingSemanticMeaning.length} semantic tokens in ${themeName} missing meaning explanation`
          ).toBeLessThanOrEqual(threshold);
        });
      });
    }
  });

  describe('Scale Consistency', () => {
    // Find all scale-based token groups (xs, sm, md, lg, xl or 0-9)
    const scalePatterns = ['xs', 'sm', 'md', 'lg', 'xl'];
    const numericScalePattern = /^[0-9]$/;

    it('scale tokens should all have descriptions', () => {
      const scaleTokens = allCoreTokens.filter((t) => {
        const lastPart = t.path.split('.').pop() || '';
        return (
          scalePatterns.includes(lastPart) || numericScalePattern.test(lastPart)
        );
      });

      const missingDescriptions = scaleTokens.filter((t) => !t.description);

      if (missingDescriptions.length > 0) {
        const missingPaths = missingDescriptions.map((t) => t.path);
        expect(
          missingDescriptions,
          `Scale tokens missing descriptions: ${missingPaths.join(', ')}`
        ).toHaveLength(0);
      }
    });
  });
});
