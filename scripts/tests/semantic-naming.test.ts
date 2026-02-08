import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const distFolder = 'dist/tokens-studio';

// Legacy semantic patterns - no longer used (legacy tokens have been removed)
const LEGACY_SEMANTIC_PATTERNS: RegExp[] = [];

// Spec-compliant semantic patterns (new naming convention)
const SPEC_COMPLIANT_PATTERNS = [
    /^color\.text\.\w+$/,                     // color.text.default, color.text.onDefault
    /^color\.bg\.\w+\.\w+$/,                  // color.bg.surface.default, color.bg.interactive.disabled
    /^color\.border\.\w+\.\w+$/,              // color.border.surface.default, color.border.interactive.focus
    /^color\.action\.bg\.\w+$/,               // color.action.bg.primaryHover, primaryLightHover
    /^color\.action\.text\.\w+$/,             // color.action.text.primaryLight
    /^color\.action\.border\.\w+$/,           // color.action.border.primary
    /^color\.feedback\.\w+\.\w+$/,            // color.feedback.text.error, color.feedback.bg.error
    /^color\.overlay\.\w+$/,                  // color.overlay.default
    /^color\.focus\.\w+$/,                    // color.focus.ring
    /^color\.primary\.(filled|light|contrast|filledHover|lightHover|lightColor)$/,  // color.primary.* variants
];

// Patterns to skip (primitive colors, scales, etc.)
const SKIP_PATTERNS = [
    /^color\.(white|black|transparent)$/,
    /^color\.(dark|gray|red|pink|grape|violet|indigo|blue|cyan|teal|green|lime|yellow|orange)\.\d+$/,
    /^color\.alpha\./,
    /^colorPalette\./,
];

function extractTokenPaths(obj: any, prefix = ''): string[] {
    const paths: string[] = [];

    for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue;

        const currentPath = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === 'object') {
            if ('$value' in value || '$type' in value) {
                // This is a token
                paths.push(currentPath);
            } else {
                // This is a nested object
                paths.push(...extractTokenPaths(value, currentPath));
            }
        }
    }

    return paths;
}

function categorizeToken(tokenPath: string): 'legacy' | 'compliant' | 'primitive' | 'unknown' {
    // Check if it should be skipped (primitives)
    if (SKIP_PATTERNS.some(p => p.test(tokenPath))) {
        return 'primitive';
    }

    // Check if it matches legacy pattern
    if (LEGACY_SEMANTIC_PATTERNS.some(p => p.test(tokenPath))) {
        return 'legacy';
    }

    // Check if it matches compliant pattern
    if (SPEC_COMPLIANT_PATTERNS.some(p => p.test(tokenPath))) {
        return 'compliant';
    }

    return 'unknown';
}

describe('Semantic Token Naming Validation', () => {
    const themes = ['mantine-light', 'mantine-dark', 'ccui-21-light', 'ccui-30-light', 'ccui-30-dark'];

    describe('Semantic Color Tokens', () => {
        for (const theme of themes) {
            describe(`Theme: ${theme}`, () => {
                const semanticFilePath = path.join(distFolder, 'semantic', `${theme}.json`);

                it('should have semantic token file', () => {
                    expect(fs.existsSync(semanticFilePath)).toBe(true);
                });

                it('should have spec-compliant semantic aliases', () => {
                    const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                    const tokenPaths = extractTokenPaths(content);
                    const colorPaths = tokenPaths.filter(p => p.startsWith('color.'));

                    const categorized = colorPaths.map(p => ({
                        path: p,
                        category: categorizeToken(p)
                    }));

                    const compliant = categorized.filter(t => t.category === 'compliant');
                    const legacy = categorized.filter(t => t.category === 'legacy');

                    // Should have spec-compliant tokens
                    expect(compliant.length).toBeGreaterThan(0);

                    // Log the counts for visibility
                    console.log(`${theme}: ${compliant.length} compliant, ${legacy.length} legacy semantic tokens`);
                });

                it('should have text semantic tokens', () => {
                    const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                    const tokenPaths = extractTokenPaths(content);

                    const textTokens = tokenPaths.filter(p => p.startsWith('color.text.'));
                    expect(textTokens.length).toBeGreaterThan(0);
                    expect(textTokens).toContain('color.text.default');
                    expect(textTokens).toContain('color.text.secondary');
                });

                it('should have background semantic tokens', () => {
                    const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                    const tokenPaths = extractTokenPaths(content);

                    const bgTokens = tokenPaths.filter(p => p.startsWith('color.bg.'));
                    expect(bgTokens.length).toBeGreaterThan(0);
                    expect(bgTokens).toContain('color.bg.surface.canvas');
                    expect(bgTokens).toContain('color.bg.surface.default');
                });

                it('should have action semantic tokens', () => {
                    const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                    const tokenPaths = extractTokenPaths(content);

                    const actionTokens = tokenPaths.filter(p => p.startsWith('color.action.'));
                    expect(actionTokens.length).toBeGreaterThan(0);
                    expect(actionTokens).toContain('color.action.bg.primary');
                });

                it('should have feedback semantic tokens', () => {
                    const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                    const tokenPaths = extractTokenPaths(content);

                    const feedbackTokens = tokenPaths.filter(p => p.startsWith('color.feedback.'));
                    expect(feedbackTokens.length).toBeGreaterThan(0);
                    expect(feedbackTokens).toContain('color.feedback.text.error');
                });
            });
        }
    });

    describe('Naming Convention Report', () => {
        it('should report semantic naming statistics', () => {
            console.log('\nSemantic Token Naming Report:');
            console.log('==============================');

            for (const theme of themes) {
                const semanticFilePath = path.join(distFolder, 'semantic', `${theme}.json`);
                if (!fs.existsSync(semanticFilePath)) continue;

                const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                const tokenPaths = extractTokenPaths(content);
                const colorPaths = tokenPaths.filter(p => p.startsWith('color.'));

                const categorized = colorPaths.map(p => ({
                    path: p,
                    category: categorizeToken(p)
                }));

                const compliant = categorized.filter(t => t.category === 'compliant');
                const legacy = categorized.filter(t => t.category === 'legacy');
                const unknown = categorized.filter(t => t.category === 'unknown');

                console.log(`\n${theme}:`);
                console.log(`  Spec-compliant: ${compliant.length}`);
                console.log(`  Legacy (Mantine-compatible): ${legacy.length}`);
                if (unknown.length > 0) {
                    console.log(`  Unknown patterns: ${unknown.length}`);
                    unknown.forEach(t => console.log(`    - ${t.path}`));
                }
            }

            // This test always passes - it's just for reporting
            expect(true).toBe(true);
        });
    });
});
