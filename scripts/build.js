/* this file runs in node, so it's intentionally written in JS */
import StyleDictionary from "style-dictionary";
import { formats, transformGroups } from 'style-dictionary/enums';
import fs from 'fs';

const coreFolder = 'src/core';
const sourceFolder = 'src/themes';
const distFolder = 'dist';

// ========================================
// TOKEN CATEGORY DEFINITIONS
// ========================================

// Shared primitives - these tokens are theme-agnostic and identical across themes
const SHARED_PRIMITIVE_CATEGORIES = [
    'spacing',
    'gridSpacing',
    'verticalRhythm',
    'radius',
    'typography',
    'breakpoints',
    'contentWidth',
    'motion',
    'zIndex',
    'borderWidth',
    'borderStyle',
    'focus',
    'sizing',
    'button',
    'input',
    'modal'
];

// Theme-specific categories - these tokens vary between themes
const THEME_SPECIFIC_CATEGORIES = [
    'color',
    'colorPalette',
    'shadow',
    'shadows',
    'opacity',
    'typography',
    'mantine'
];

// Official Mantine size scale
const MANTINE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

// Map theme names to color schemes for CSS scoping
const THEME_COLOR_SCHEMES = {
    'clearco-light': 'light',
    'clearco-dark': 'dark'
};

function getThemeSelector(themeName) {
    const colorScheme = THEME_COLOR_SCHEMES[themeName];
    if (colorScheme) {
        return `[data-mantine-color-scheme="${colorScheme}"]`;
    }
    return ':root';
}

// Official Mantine color palettes
const MANTINE_PALETTES = ['dark', 'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

// Helper to identify primitive palette color tokens (these belong in core/color.json, not semantic)
function isPrimitiveColorToken(token) {
    const path = token.path;
    if (path[0] !== 'color') return false;

    // color.white, color.black, color.transparent
    if (path.length === 2 && ['white', 'black', 'transparent'].includes(path[1])) {
        return true;
    }

    // color.{palette}.{0-9} - primitive palette shades
    if (path.length === 3 && MANTINE_PALETTES.includes(path[1]) && /^[0-9]$/.test(path[2])) {
        return true;
    }

    return false;
}

// Official Mantine color variants
const MANTINE_COLOR_VARIANTS = ['filled', 'filled-hover', 'light', 'light-hover', 'light-color', 'outline', 'outline-hover', 'text'];

// Official Mantine semantic colors
const MANTINE_SEMANTIC_COLORS = ['white', 'black', 'text', 'body', 'bright', 'error', 'placeholder', 'anchor', 'dimmed', 'default', 'default-hover', 'default-color', 'default-border', 'disabled', 'disabled-color', 'disabled-border'];

// Official Mantine primary variants
const MANTINE_PRIMARY_VARIANTS = ['filled', 'filled-hover', 'light', 'light-hover', 'light-color', 'contrast', 'outline', 'outline-hover'];

function isMantineOfficialToken(token) {
    const path = token.path;

    if (path[0] === 'mantine') return true;

    if (path[0] === 'color' && path.length === 3) {
        const colorName = path[1];
        const shadeOrVariant = path[2];
        if (MANTINE_PALETTES.includes(colorName)) {
            if (/^[0-9]$/.test(shadeOrVariant)) return true;
            if (MANTINE_COLOR_VARIANTS.includes(shadeOrVariant)) return true;
        }
        return false;
    }

    if (path[0] === 'colorPalette') {
        const colorName = path[1];
        if (colorName === 'white' || colorName === 'black') return true;
        if (!MANTINE_PALETTES.includes(colorName)) return false;
        if (path.length === 3) {
            const shadeOrVariant = path[2];
            if (/^[0-9]$/.test(shadeOrVariant)) return true;
            if (MANTINE_COLOR_VARIANTS.includes(shadeOrVariant)) return true;
        }
        return false;
    }

    if (path[0] === 'color') {
        if (path.length === 2) {
            return MANTINE_SEMANTIC_COLORS.includes(path[1]);
        }
        if (path[1] === 'primary' && path.length === 3) {
            const shadeOrVariant = path[2];
            if (/^[0-9]$/.test(shadeOrVariant)) return true;
            if (MANTINE_PRIMARY_VARIANTS.includes(shadeOrVariant)) return true;
        }
        return false;
    }

    if (path[0] === 'spacing') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'radius') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'shadows' || path[0] === 'shadow') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'typography') {
        if (path[1] === 'fontFamily' && ['sans', 'mono', 'display'].includes(path[2])) {
            return true;
        }
        if (path[1] === 'fontSize' && MANTINE_SIZES.includes(path[2])) {
            return true;
        }
        if (path[1] === 'lineHeight' && MANTINE_SIZES.includes(path[2])) {
            return true;
        }
        if (path[1] === 'headings' && /^h[1-6]$/.test(path[2])) {
            return true;
        }
        return false;
    }

    if (path[0] === 'motion') return false;
    if (['button', 'input', 'modal'].includes(path[0])) return false;

    if (path[0] === 'breakpoints') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'zIndex') return false;

    const ccuiExtensions = ['gridSpacing', 'verticalRhythm', 'contentWidth', 'borderWidth', 'borderStyle', 'focus', 'sizing', 'opacity'];
    if (ccuiExtensions.includes(path[0])) return false;

    return false;
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

function validateThemeExists(themeName) {
    const themePath = `${sourceFolder}/${themeName}`;
    if (!fs.existsSync(themePath)) {
        throw new Error(`Theme folder not found: ${themePath}`);
    }
    return true;
}

function checkUnresolvedReferences(content, filePath) {
    const unresolvedPattern = /\{[a-zA-Z][a-zA-Z0-9.]*\}/g;
    const matches = content.match(unresolvedPattern);
    if (matches && matches.length > 0) {
        console.warn(`⚠️  Unresolved references in ${filePath}:`);
        matches.forEach(match => console.warn(`   - ${match}`));
        return matches;
    }
    return [];
}

// Register custom transform for CCUI CSS variable names
StyleDictionary.registerTransform({
    name: 'name/ccui',
    type: 'name',
    transform: (token) => {
        return `ccui-${token.path.join('-')}`;
    }
});

// Register custom transform for Mantine-compatible CSS variable names
StyleDictionary.registerTransform({
    name: 'name/mantine-theme',
    type: 'name',
    transform: (token) => {
        const path = token.path;

        if (path[0] === 'mantine') {
            if (path[1] === 'zIndex') return `mantine-z-index-${path[2]}`;
            if (path[1] === 'cursorType') return 'mantine-cursor-type';
            if (path[1] === 'webkitFontSmoothing') return 'mantine-webkit-font-smoothing';
            if (path[1] === 'mozFontSmoothing') return 'mantine-moz-font-smoothing';
            if (path[1] === 'headingFontWeight') return 'mantine-heading-font-weight';
            if (path[1] === 'headingTextWrap') return 'mantine-heading-text-wrap';
            if (path[1] === 'radiusDefault') return 'mantine-radius-default';
            return `mantine-${path.slice(1).join('-')}`;
        }

        if (path[0] === 'colorPalette') {
            return `mantine-color-${path.slice(1).join('-')}`;
        }

        if (path[0] === 'color') {
            if (path.length === 3 && MANTINE_PALETTES.includes(path[1])) {
                return `mantine-color-${path[1]}-${path[2]}`;
            }
            if (path[1] === 'primary') {
                return `mantine-primary-color-${path[2]}`;
            }
            return `mantine-color-${path.slice(1).join('-')}`;
        }

        if (path[0] === 'spacing') return `mantine-spacing-${path[1]}`;
        if (path[0] === 'radius') return `mantine-radius-${path[1]}`;

        if (path[0] === 'typography') {
            if (path[1] === 'fontFamily') {
                if (path[2] === 'sans') return 'mantine-font-family';
                if (path[2] === 'mono') return 'mantine-font-family-monospace';
                if (path[2] === 'heading') return 'mantine-font-family-headings';
                return `mantine-font-family-${path[2]}`;
            }
            if (path[1] === 'fontSize') return `mantine-font-size-${path[2]}`;
            if (path[1] === 'lineHeight') return `mantine-line-height-${path[2]}`;
            if (path[1] === 'headings') {
                if (path.length === 3) {
                    return `mantine-headings-${path[2].replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                }
                return `mantine-${path[2]}-${path[3].replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            }
        }

        if (path[0] === 'motion') {
            return `mantine-${path.join('-').replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        }

        if (['button', 'input', 'modal'].includes(path[0])) {
            return `mantine-${path.join('-').replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        }

        if (path[0] === 'shadows' || path[0] === 'shadow') {
            return `mantine-shadow-${path[1]}`;
        }

        if (path[0] === 'breakpoints') {
            return `mantine-breakpoint-${path[1]}`;
        }

        return `mantine-${path.join('-')}`;
    }
});

// Register transform groups
StyleDictionary.registerTransformGroup({
    name: 'ccui/css',
    transforms: ['attribute/cti', 'name/ccui']
});

StyleDictionary.registerTransformGroup({
    name: 'mantine/css',
    transforms: ['attribute/cti', 'name/mantine-theme']
});

// ========================================
// CSS FORMATS
// ========================================

StyleDictionary.registerFormat({
    name: 'css/ccui-shared-primitives',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const sharedTokens = dictionary.allTokens.filter(token => SHARED_PRIMITIVE_CATEGORIES.includes(token.path[0]));
        const variables = sharedTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * CCUI Shared Primitives - Auto-generated, do not edit directly\n * Theme-agnostic core tokens (spacing, typography, radius, etc.)\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'css/ccui-theme-specific',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const themeTokens = dictionary.allTokens.filter(token => THEME_SPECIFIC_CATEGORIES.includes(token.path[0]));
        const variables = themeTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * CCUI Theme-Specific Tokens - Auto-generated, do not edit directly\n * Tokens that vary between themes (colors, shadows, etc.)\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'css/mantine-shared-primitives',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const sharedTokens = dictionary.allTokens.filter(token =>
            SHARED_PRIMITIVE_CATEGORIES.includes(token.path[0]) && isMantineOfficialToken(token)
        );
        const variables = sharedTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * Mantine Shared Primitives - Auto-generated, do not edit directly\n * Theme-agnostic Mantine-compatible tokens\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'css/mantine-theme-specific',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const themeTokens = dictionary.allTokens.filter(token =>
            THEME_SPECIFIC_CATEGORIES.includes(token.path[0]) && isMantineOfficialToken(token)
        );
        const variables = themeTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * Mantine Theme-Specific Tokens - Auto-generated, do not edit directly\n * Tokens that vary between themes (colors, shadows)\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

// ========================================
// TOKENS STUDIO FORMATS
// ========================================

const DTCG_TYPE_MAP = {
    'color': 'color',
    'dimension': 'dimension',
    'fontFamily': 'fontFamily',
    'fontWeight': 'fontWeight',
    'duration': 'duration',
    'cubicBezier': 'cubicBezier',
    'number': 'number',
    'strokeStyle': 'strokeStyle',
    'border': 'border',
    'transition': 'transition',
    'shadow': 'shadow',
    'gradient': 'gradient',
    'typography': 'typography'
};

function inferDtcgType(token) {
    const path = token.path;
    const value = token.$value ?? token.value;

    if (token.$type && DTCG_TYPE_MAP[token.$type]) return DTCG_TYPE_MAP[token.$type];
    if (token.type && DTCG_TYPE_MAP[token.type]) return DTCG_TYPE_MAP[token.type];

    const rootCategory = path[0];

    if (rootCategory === 'color' || rootCategory === 'colorPalette') return 'color';

    if (['spacing', 'gridSpacing', 'verticalRhythm', 'radius', 'sizing',
         'borderWidth', 'contentWidth', 'breakpoints'].includes(rootCategory)) {
        return 'dimension';
    }

    if (rootCategory === 'typography' || rootCategory === 'fontFamily') {
        if (path.includes('fontFamily')) return 'fontFamily';
        if (path.includes('fontWeight')) return 'fontWeight';
        if (path.includes('fontSize') || path.includes('lineHeight') || path.includes('letterSpacing')) {
            return 'dimension';
        }
    }

    if (rootCategory === 'motion') {
        if (path.includes('duration')) return 'duration';
        if (path.includes('easing')) return 'cubicBezier';
    }

    if (rootCategory === 'shadow' || rootCategory === 'shadows') return 'shadow';
    if (rootCategory === 'zIndex' || rootCategory === 'opacity') return 'number';
    if (rootCategory === 'borderStyle') return 'strokeStyle';

    if (typeof value === 'string') {
        if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl') || value.startsWith('oklch')) {
            return 'color';
        }
        if (value.match(/^-?\d+(\.\d+)?(px|rem|em|%|vh|vw)$/)) return 'dimension';
        if (value.match(/^-?\d+(\.\d+)?(ms|s)$/)) return 'duration';
    }
    if (typeof value === 'number') return 'number';

    return null;
}

const TOKENS_STUDIO_CORE_SETS = {
    'color': 'core/color',
    'spacing': 'core/spacing',
    'gridSpacing': 'core/spacing',
    'verticalRhythm': 'core/spacing',
    'radius': 'core/radius',
    'typography': 'core/typography',
    'shadow': 'core/shadow',
    'shadows': 'core/shadow',
    'motion': 'core/motion',
    'borderWidth': 'core/border',
    'borderStyle': 'core/border',
    'breakpoints': 'core/breakpoints',
    'contentWidth': 'core/breakpoints',
    'zIndex': 'core/z-index',
    'opacity': 'core/opacity',
    'sizing': 'core/sizing',
    'focus': 'core/focus'
};

const TOKENS_STUDIO_COMPONENT_SETS = {
    'button': 'components/button',
    'input': 'components/input',
    'modal': 'components/modal'
};

function getOriginalValue(token) {
    const original = token.original || token;
    const value = original.$value ?? original.value;
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        return value;
    }
    return token.$value ?? token.value;
}

function buildTokensStudioStructure(tokens) {
    const result = {};

    tokens.forEach(token => {
        const path = token.path;
        let current = result;

        for (let i = 0; i < path.length - 1; i++) {
            const segment = path[i];
            if (!current[segment]) current[segment] = {};
            current = current[segment];
        }

        const finalKey = path[path.length - 1];
        const dtcgType = inferDtcgType(token);

        const tokenObj = { "$value": getOriginalValue(token) };
        if (dtcgType) tokenObj["$type"] = dtcgType;

        const description = token.$description ?? token.description ?? token.comment;
        if (description) tokenObj["$description"] = description;

        current[finalKey] = tokenObj;
    });

    return result;
}

function filterTokensBySet(tokens, setName) {
    return tokens.filter(token => {
        const category = token.path[0];
        if (TOKENS_STUDIO_COMPONENT_SETS[category] === setName) return true;
        if (TOKENS_STUDIO_CORE_SETS[category] === setName) return true;
        return false;
    });
}

function generateTokensStudioMetadata() {
    return {
        tokenSetOrder: [
            "core/color", "core/spacing", "core/radius", "core/typography",
            "core/shadow", "core/motion", "core/border", "core/breakpoints",
            "core/z-index", "core/opacity", "core/sizing", "core/focus",
            "semantic/light", "semantic/dark",
            "components/button", "components/input", "components/modal"
        ]
    };
}

function generateTokensStudioThemes() {
    const coreSetStatus = {
        "core/color": "source", "core/spacing": "source", "core/radius": "source",
        "core/typography": "source", "core/shadow": "source", "core/motion": "source",
        "core/border": "source", "core/breakpoints": "source", "core/z-index": "source",
        "core/opacity": "source", "core/sizing": "source", "core/focus": "source"
    };

    const componentSetStatus = {
        "components/button": "enabled",
        "components/input": "enabled",
        "components/modal": "enabled"
    };

    return [
        {
            id: "clearco-light", name: "Light", group: "mode",
            selectedTokenSets: { ...coreSetStatus, "semantic/light": "enabled", "semantic/dark": "disabled", ...componentSetStatus }
        },
        {
            id: "clearco-dark", name: "Dark", group: "mode",
            selectedTokenSets: { ...coreSetStatus, "semantic/light": "disabled", "semantic/dark": "enabled", ...componentSetStatus }
        }
    ];
}

StyleDictionary.registerFormat({
    name: 'json/tokens-studio-set',
    format: ({ dictionary, options }) => {
        const setName = options.setName;
        const tokens = filterTokensBySet(dictionary.allTokens, setName);
        const structure = buildTokensStudioStructure(tokens);
        return JSON.stringify(structure, null, 2);
    }
});

StyleDictionary.registerFormat({
    name: 'json/tokens-studio-semantic',
    format: ({ dictionary }) => {
        const semanticTokens = dictionary.allTokens.filter(token => {
            const category = token.path[0];
            if (!['color', 'colorPalette', 'shadows', 'mantine', 'opacity'].includes(category)) {
                return false;
            }
            // Exclude primitive palette colors - they belong in core/color.json
            if (isPrimitiveColorToken(token)) {
                return false;
            }
            return true;
        });
        const structure = buildTokensStudioStructure(semanticTokens);
        return JSON.stringify(structure, null, 2);
    }
});

// ========================================
// GET TOKEN FILES
// ========================================

const getTokenFiles = (dir) => {
    const files = [];
    if (!fs.existsSync(dir)) return files;

    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
        const fullPath = `${dir}/${entry.name}`;
        if (entry.isDirectory()) {
            files.push(...getTokenFiles(fullPath));
        } else if (entry.isFile() && entry.name.endsWith('.tokens.json')) {
            files.push(fullPath);
        }
    });
    return files;
};

const coreTokenFiles = getTokenFiles(coreFolder);
console.log('📦 Core token files:', coreTokenFiles.length);

const themesToBuild = [];
console.log('🔍 Scanning for themes in:', `${sourceFolder}`);
fs.readdirSync(`${sourceFolder}`, { withFileTypes: true })
    .forEach(file => {
        if (file.isDirectory() && file.name !== 'base') {
            themesToBuild.push(file.name);
        }
    });
console.log('Found themes to build:', themesToBuild);

// ========================================
// BUILD FUNCTIONS
// ========================================

async function buildSharedPrimitives() {
    console.log('\n📦 Building shared primitives...');

    try {
        const sd = new StyleDictionary({
            source: coreTokenFiles,
            usesDtcg: true,
            platforms: {
                "dist-shared-ccui": {
                    "transformGroup": "ccui/css",
                    "buildPath": `${distFolder}/css/shared/`,
                    "files": [{
                        "destination": "ccui-primitives.css",
                        "format": "css/ccui-shared-primitives",
                        "options": { "selector": ":root" }
                    }]
                },
                "dist-shared-mantine": {
                    "transformGroup": "mantine/css",
                    "buildPath": `${distFolder}/css/shared/`,
                    "files": [{
                        "destination": "mantine-primitives.css",
                        "format": "css/mantine-shared-primitives",
                        "options": { "selector": ":root" }
                    }]
                },
                // Tokens Studio core sets
                "tokens-studio-core-color": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "color.json", "format": "json/tokens-studio-set", "options": { "setName": "core/color" } }]
                },
                "tokens-studio-core-spacing": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "spacing.json", "format": "json/tokens-studio-set", "options": { "setName": "core/spacing" } }]
                },
                "tokens-studio-core-radius": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "radius.json", "format": "json/tokens-studio-set", "options": { "setName": "core/radius" } }]
                },
                "tokens-studio-core-typography": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "typography.json", "format": "json/tokens-studio-set", "options": { "setName": "core/typography" } }]
                },
                "tokens-studio-core-shadow": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "shadow.json", "format": "json/tokens-studio-set", "options": { "setName": "core/shadow" } }]
                },
                "tokens-studio-core-motion": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "motion.json", "format": "json/tokens-studio-set", "options": { "setName": "core/motion" } }]
                },
                "tokens-studio-core-border": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "border.json", "format": "json/tokens-studio-set", "options": { "setName": "core/border" } }]
                },
                "tokens-studio-core-breakpoints": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "breakpoints.json", "format": "json/tokens-studio-set", "options": { "setName": "core/breakpoints" } }]
                },
                "tokens-studio-core-z-index": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "z-index.json", "format": "json/tokens-studio-set", "options": { "setName": "core/z-index" } }]
                },
                "tokens-studio-core-opacity": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "opacity.json", "format": "json/tokens-studio-set", "options": { "setName": "core/opacity" } }]
                },
                "tokens-studio-core-sizing": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "sizing.json", "format": "json/tokens-studio-set", "options": { "setName": "core/sizing" } }]
                },
                "tokens-studio-core-focus": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/core/`,
                    "files": [{ "destination": "focus.json", "format": "json/tokens-studio-set", "options": { "setName": "core/focus" } }]
                },
                "tokens-studio-components-button": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "button.json", "format": "json/tokens-studio-set", "options": { "setName": "components/button" } }]
                },
                "tokens-studio-components-input": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "input.json", "format": "json/tokens-studio-set", "options": { "setName": "components/input" } }]
                },
                "tokens-studio-components-modal": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "modal.json", "format": "json/tokens-studio-set", "options": { "setName": "components/modal" } }]
                }
            },
            log: { verbosity: 'default' }
        });
        await sd.buildAllPlatforms();
        console.log('✅ Shared primitives built successfully');
        return true;
    } catch (error) {
        console.error('❌ Error building shared primitives:', error.message);
        return false;
    }
}

async function buildThemes() {
    const builtThemes = [];

    for (const theme of themesToBuild) {
        console.log(`\n🔨 Building ${theme} theme...`);

        const themeTokenFiles = getTokenFiles(`${sourceFolder}/${theme}`);
        const baseThemeFiles = getTokenFiles(`${sourceFolder}/base`);

        const sourceFiles = [...coreTokenFiles, ...baseThemeFiles, ...themeTokenFiles];

        try {
            const sd = new StyleDictionary({
                source: sourceFiles,
                usesDtcg: true,
                platforms: {
                    "dist-css": {
                        "transformGroup": "ccui/css",
                        "buildPath": `${distFolder}/css/${theme}/`,
                        "files": [{
                            "destination": "ccui-semantic.css",
                            "format": "css/ccui-theme-specific",
                            "options": { "selector": getThemeSelector(theme) }
                        }]
                    },
                    "dist-mantine": {
                        "transformGroup": "mantine/css",
                        "buildPath": `${distFolder}/css/${theme}/`,
                        "files": [{
                            "destination": "mantine-theme.css",
                            "format": "css/mantine-theme-specific",
                            "options": { "selector": getThemeSelector(theme) }
                        }]
                    },
                    "tokens-studio-semantic": {
                        "transformGroup": transformGroups.json,
                        "buildPath": `${distFolder}/tokens-studio/semantic/`,
                        "files": [{
                            "destination": `${theme === 'clearco-light' ? 'light' : 'dark'}.json`,
                            "format": "json/tokens-studio-semantic"
                        }]
                    }
                },
                log: { verbosity: 'verbose' }
            });
            await sd.buildAllPlatforms();
            console.log(`✅ ${theme} theme built successfully`);
            builtThemes.push(theme);
        } catch (error) {
            console.error(`❌ Error building ${theme} theme:`, error.message);
        }
    }

    console.log('\n🎉 All themes built successfully!');
}

// ========================================
// COMBINED CSS BUILD
// ========================================

async function buildCombinedCSS() {
    console.log('\n📦 Building combined CSS file...');

    const cssDir = `${distFolder}/css`;

    // Read all CSS parts
    const ccuiPrimitives = fs.readFileSync(`${cssDir}/shared/ccui-primitives.css`, 'utf8');
    const mantinePrimitives = fs.readFileSync(`${cssDir}/shared/mantine-primitives.css`, 'utf8');
    const ccuiLight = fs.readFileSync(`${cssDir}/clearco-light/ccui-semantic.css`, 'utf8');
    const mantineLight = fs.readFileSync(`${cssDir}/clearco-light/mantine-theme.css`, 'utf8');
    const ccuiDark = fs.readFileSync(`${cssDir}/clearco-dark/ccui-semantic.css`, 'utf8');
    const mantineDark = fs.readFileSync(`${cssDir}/clearco-dark/mantine-theme.css`, 'utf8');

    // Transform light theme selectors to include :root fallback
    // This ensures light theme is the default when no data attribute is set
    const transformLightSelector = (css) => {
        return css.replace(
            /\[data-mantine-color-scheme="light"\]/g,
            ':root,\n[data-mantine-color-scheme="light"]'
        );
    };

    // Build the combined file
    const combined = `/**
 * CCUI Design Tokens - All-in-One
 * Generated: ${new Date().toISOString()}
 *
 * Includes:
 * - Shared primitives (:root)
 * - Light theme (default, :root + [data-mantine-color-scheme="light"])
 * - Dark theme ([data-mantine-color-scheme="dark"])
 *
 * Usage:
 *   import 'ccui-tokens/css';
 *
 * Theme switching works automatically with Mantine's useMantineColorScheme()
 */

/* ========================================
   SHARED PRIMITIVES
   ======================================== */

${ccuiPrimitives}

${mantinePrimitives}

/* ========================================
   LIGHT THEME (Default)
   ======================================== */

${transformLightSelector(ccuiLight)}

${transformLightSelector(mantineLight)}

/* ========================================
   DARK THEME
   ======================================== */

${ccuiDark}

${mantineDark}
`;

    fs.writeFileSync(`${cssDir}/ccui-tokens.css`, combined);

    // Calculate file size
    const stats = fs.statSync(`${cssDir}/ccui-tokens.css`);
    const fileSizeKB = (stats.size / 1024).toFixed(1);

    // Clean up individual CSS folders - only keep the combined file
    fs.rmSync(`${cssDir}/shared`, { recursive: true, force: true });
    fs.rmSync(`${cssDir}/clearco-light`, { recursive: true, force: true });
    fs.rmSync(`${cssDir}/clearco-dark`, { recursive: true, force: true });

    console.log(`✅ Combined CSS file generated: dist/css/ccui-tokens.css (${fileSizeKB}K)`);
    return true;
}

async function validateBuild() {
    console.log('\n🔍 Running post-build validation...');
    let hasErrors = false;

    // Validate combined CSS file
    const combinedCssPath = `${distFolder}/css/ccui-tokens.css`;
    if (!fs.existsSync(combinedCssPath)) {
        console.error(`❌ Missing combined CSS file: ${combinedCssPath}`);
        hasErrors = true;
    } else {
        const content = fs.readFileSync(combinedCssPath, 'utf8');
        checkUnresolvedReferences(content, combinedCssPath);
    }

    const tokensStudioFiles = [
        `${distFolder}/tokens-studio/$metadata.json`,
        `${distFolder}/tokens-studio/$themes.json`,
        `${distFolder}/tokens-studio/semantic/light.json`,
        `${distFolder}/tokens-studio/semantic/dark.json`
    ];

    for (const filePath of tokensStudioFiles) {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Missing Tokens Studio file: ${filePath}`);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        console.error('\n❌ Validation failed!');
        process.exit(1);
    } else {
        console.log('✅ Validation passed');
    }
}

async function buildTokensStudioConfig() {
    console.log('\n📦 Building Tokens Studio configuration...');

    const tokensStudioDir = `${distFolder}/tokens-studio`;
    if (!fs.existsSync(tokensStudioDir)) {
        fs.mkdirSync(tokensStudioDir, { recursive: true });
    }

    fs.writeFileSync(`${tokensStudioDir}/$metadata.json`, JSON.stringify(generateTokensStudioMetadata(), null, 2));
    fs.writeFileSync(`${tokensStudioDir}/$themes.json`, JSON.stringify(generateTokensStudioThemes(), null, 2));
    console.log('✅ Tokens Studio config built');
    return true;
}

async function build() {
    console.log('\n🔍 Pre-build validation...');
    for (const theme of themesToBuild) {
        try {
            validateThemeExists(theme);
        } catch (error) {
            console.error(`❌ ${error.message}`);
            process.exit(1);
        }
    }
    console.log('✅ All theme folders found');

    const sharedSuccess = await buildSharedPrimitives();
    if (!sharedSuccess) {
        console.error('❌ Failed to build shared primitives');
        process.exit(1);
    }

    await buildThemes();
    await buildCombinedCSS();
    await buildTokensStudioConfig();
    await validateBuild();
}

await build().catch(console.error);
