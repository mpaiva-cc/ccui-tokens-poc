import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const distFolder = 'dist/tokens-studio';

// Legacy Mantine-compatible patterns (kept for backward compatibility)
const LEGACY_SEMANTIC_PATTERNS = [
    /^color\.text$/,
    /^color\.body$/,
    /^color\.bright$/,
    /^color\.error$/,
    /^color\.placeholder$/,
    /^color\.anchor$/,
    /^color\.default$/,
    /^color\.default-hover$/,
    /^color\.default-color$/,
    /^color\.default-border$/,
    /^color\.dimmed$/,
    /^color\.disabled$/,
    /^color\.disabled-color$/,
    /^color\.disabled-border$/,
    /^color\.primary\.(filled|light|contrast|filled-hover|light-hover|light-color)$/,
];

// Spec-compliant semantic patterns (category.concept.property.variant.state)
const SPEC_COMPLIANT_PATTERNS = [
    /^color\.content\.text\.\w+$/,           // color.content.text.default
    /^color\.surface\.bg\.\w+$/,             // color.surface.bg.canvas
    /^color\.surface\.border\.\w+$/,         // color.surface.border.default
    /^color\.action\.bg\.\w+(-\w+)?$/,       // color.action.bg.primary-hover
    /^color\.action\.text\.\w+(-\w+)?$/,     // color.action.text.primary-light
    /^color\.feedback\.text\.\w+$/,          // color.feedback.text.error
    /^color\.feedback\.bg\.\w+$/,            // color.feedback.bg.error
    /^color\.feedback\.border\.\w+$/,        // color.feedback.border.error
];

// Patterns to skip (primitive colors, scales, etc.)
const SKIP_PATTERNS = [
    /^color\.(white|black|transparent)$/,
    /^color\.(dark|gray|red|pink|grape|violet|indigo|blue|cyan|teal|green|lime|yellow|orange)\.\d+$/,
    /^color\.primary\.\d+$/,
    /^color\.overlay\./,
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

                it('should have content.text semantic tokens', () => {
                    const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                    const tokenPaths = extractTokenPaths(content);

                    const contentTextTokens = tokenPaths.filter(p => p.startsWith('color.content.text.'));
                    expect(contentTextTokens.length).toBeGreaterThan(0);
                    expect(contentTextTokens).toContain('color.content.text.default');
                    expect(contentTextTokens).toContain('color.content.text.muted');
                });

                it('should have surface semantic tokens', () => {
                    const content = JSON.parse(fs.readFileSync(semanticFilePath, 'utf8'));
                    const tokenPaths = extractTokenPaths(content);

                    const surfaceTokens = tokenPaths.filter(p => p.startsWith('color.surface.'));
                    expect(surfaceTokens.length).toBeGreaterThan(0);
                    expect(surfaceTokens).toContain('color.surface.bg.canvas');
                    expect(surfaceTokens).toContain('color.surface.bg.default');
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
