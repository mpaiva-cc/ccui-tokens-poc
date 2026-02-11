/* this file runs in node, so it's intentionally written in JS */
import StyleDictionary from "style-dictionary";
import { formats, transformGroups } from 'style-dictionary/enums';
import fs from 'fs';

const primitivesFolder = 'src/primitives';
const sourceFolder = 'src/themes';
const distFolder = 'dist';

// Token collision warnings are expected and harmless.
// Style Dictionary warns when multiple tokens share the same final path segment
// (e.g., color.base.red.0, color.brand.clearco-21.navyBlue.0, opacity.0 all end in "0").
// This only affects SD's internal output name generation, which we don't use —
// our custom formats (json/tokens-studio-set, json/tokens-studio-semantic)
// write the full token path into the JSON structure. The output is deterministic
// and correct regardless of these warnings.
const LOG_CONFIG = {
    warnings: 'disabled',
    verbosity: 'default',
    errors: { brokenReferences: 'throw' }
};

// ========================================
// TOKEN CATEGORY DEFINITIONS
// ========================================

// Official Mantine color palettes
const MANTINE_PALETTES = ['dark', 'gray', 'red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange'];

// Official Mantine size scale
const MANTINE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];

// ========================================
// MULTI-THEME CONFIGURATION
// ========================================

// Map theme names to color schemes and whether they're default
const THEME_CONFIG = {
    'mantine-light': { colorScheme: 'light', isDefault: true, description: 'Vanilla Mantine light theme' },
    'mantine-dark': { colorScheme: 'dark', isDefault: false, description: 'Vanilla Mantine dark theme' },
    'ccui-21-light': { colorScheme: 'light', isDefault: false, description: 'CCUI 2.1 brand theme' },
    'ccui-30-light': { colorScheme: 'light', isDefault: false, description: 'CCUI 3.0 rebranding light' },
    'ccui-30-dark': { colorScheme: 'dark', isDefault: false, description: 'CCUI 3.0 rebranding dark' }
};

// Helper to identify primitive palette color tokens (these belong in core/color.json, not semantic)
function isPrimitiveColorToken(token) {
    const path = token.path;
    if (path[0] !== 'color') return false;

    // color.base.white, color.base.black, color.base.transparent
    if (path[1] === 'base' && path.length === 3 && ['white', 'black', 'transparent'].includes(path[2])) {
        return true;
    }

    // color.base.{palette}.{0-9} - primitive palette shades
    if (path[1] === 'base' && path.length === 4 && MANTINE_PALETTES.includes(path[2]) && /^[0-9]$/.test(path[3])) {
        return true;
    }

    // color.brand.{brand-version}.{palette}.{0-9} - brand palette shades
    if (path[1] === 'brand' && path.length === 5 && /^[0-9]$/.test(path[4])) {
        return true;
    }

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
        console.warn(`  Unresolved references in ${filePath}:`);
        matches.forEach(match => console.warn(`   - ${match}`));
        return matches;
    }
    return [];
}

// ========================================
// TOKENS STUDIO FORMATS
// ========================================

// Tokens Studio type mapping
// Note: Tokens Studio uses its own type vocabulary even in "DTCG mode"
// These are NOT W3C DTCG types - they're Tokens Studio-specific
const TOKENS_STUDIO_TYPE_MAP = {
    'color': 'color',
    'dimension': 'dimension',
    'fontFamily': 'fontFamilies',      // TS uses plural
    'fontWeight': 'fontWeights',       // TS uses plural
    'duration': 'duration',
    'cubicBezier': 'cubicBezier',
    'number': 'number',
    'strokeStyle': 'strokeStyle',
    'border': 'border',
    'transition': 'transition',
    'boxShadow': 'boxShadow',
    'gradient': 'gradient',
    'typography': 'typography',
    // Tokens Studio specific types (not in W3C DTCG)
    'fontSizes': 'fontSizes',
    'lineHeights': 'lineHeights',
    'letterSpacing': 'letterSpacing',
    'paragraphSpacing': 'paragraphSpacing',
    'paragraphIndent': 'dimension',     // TS uses dimension for paragraph indent
    'textDecoration': 'textDecoration',
    'textCase': 'textCase',
    'spacing': 'spacing',
    'borderRadius': 'borderRadius',
    'borderWidth': 'borderWidth',
    'opacity': 'opacity',
    'sizing': 'sizing'
};

// Infer Tokens Studio type from token context
// This outputs Tokens Studio-compatible types, not W3C DTCG types
function inferTokensStudioType(token) {
    const path = token.path;
    const value = token.$value ?? token.value;
    const originalType = token.$type || token.type;

    // If token has an explicit type, map it to Tokens Studio type
    if (originalType && TOKENS_STUDIO_TYPE_MAP[originalType]) {
        // Special handling: W3C DTCG uses 'fontFamily' but TS expects 'fontFamilies'
        if (originalType === 'fontFamily') return 'fontFamilies';
        if (originalType === 'fontWeight') return 'fontWeights';
        // For dimension/number, we need to look at context to determine specific TS type
        if (originalType === 'dimension' || originalType === 'number') {
            // Fall through to path-based inference
        } else {
            return TOKENS_STUDIO_TYPE_MAP[originalType];
        }
    }

    const rootCategory = path[0];

    // Color tokens
    if (rootCategory === 'color' || rootCategory === 'colorPalette' || rootCategory === 'brand') {
        return 'color';
    }

    // Component color tokens from theme files (e.g., button.filled.backgroundColor)
    // These are color tokens defined in component-colors.tokens.json
    if (TOKENS_STUDIO_COMPONENT_SETS[rootCategory] && originalType === 'color') {
        return 'color';
    }

    // Spacing tokens
    if (['spacing', 'gridSpacing', 'verticalRhythm'].includes(rootCategory)) {
        return 'spacing';
    }

    // Border radius
    if (rootCategory === 'radius') {
        return 'borderRadius';
    }

    // Sizing tokens
    if (rootCategory === 'sizing' || rootCategory === 'contentWidth' || rootCategory === 'breakpoints') {
        return 'sizing';
    }

    // Border width
    if (rootCategory === 'borderWidth') {
        return 'borderWidth';
    }

    // Flat typography categories
    if (rootCategory === 'fontFamilies') return 'fontFamilies';
    if (rootCategory === 'fontWeights') return 'fontWeights';
    if (rootCategory === 'fontSizes') return 'fontSizes';
    if (rootCategory === 'lineHeights') return 'lineHeights';
    if (rootCategory === 'letterSpacing') return 'letterSpacing';

    // Paragraph indent and spacing (typography properties)
    if (rootCategory === 'paragraphIndent') return 'dimension';
    if (rootCategory === 'paragraphSpacing') return 'dimension';

    // Text decoration and case (typography properties)
    if (rootCategory === 'textDecoration') return 'textDecoration';
    if (rootCategory === 'textCase') return 'textCase';

    // Composite typography styles
    if (rootCategory === 'typography') {
        if (originalType === 'typography') return 'typography';
        // For nested typography values within composite tokens
        if (path.includes('fontFamily')) return 'fontFamilies';
        if (path.includes('fontWeight')) return 'fontWeights';
        if (path.includes('fontSize')) return 'fontSizes';
        if (path.includes('lineHeight')) return 'lineHeights';
        if (path.includes('letterSpacing')) return 'letterSpacing';
        if (path.includes('paragraphSpacing')) return 'dimension';
        if (path.includes('paragraphIndent')) return 'dimension';
        if (path.includes('textDecoration')) return 'textDecoration';
        if (path.includes('textCase')) return 'textCase';
    }

    // Motion tokens
    if (rootCategory === 'motion') {
        if (path.includes('duration')) return 'duration';
        if (path.includes('easing')) return 'cubicBezier';
        if (path.includes('transition')) return 'transition';
    }

    // Shadow tokens
    if (rootCategory === 'boxShadow') return 'boxShadow';

    // Opacity (Tokens Studio uses 'opacity' type)
    if (rootCategory === 'opacity') return 'opacity';

    // Z-index
    if (rootCategory === 'zIndex') return 'number';

    // Border style
    if (rootCategory === 'borderStyle') return 'strokeStyle';

    // Value-based inference as fallback
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

const TOKENS_STUDIO_PRIMITIVE_SETS = {
    'color': 'primitives',
    'spacing': 'primitives',
    'gridSpacing': 'primitives',
    'verticalRhythm': 'primitives',
    'radius': 'primitives',
    'fontFamilies': 'primitives',
    'fontSizes': 'primitives',
    'fontWeights': 'primitives',
    'lineHeights': 'primitives',
    'letterSpacing': 'primitives',
    'paragraphIndent': 'primitives',
    'paragraphSpacing': 'primitives',
    'textDecoration': 'primitives',
    'textCase': 'primitives',
    'typography': 'primitives',
    'boxShadow': 'primitives',
    'motion': 'primitives',
    'borderWidth': 'primitives',
    'borderStyle': 'primitives',
    'breakpoints': 'primitives',
    'contentWidth': 'primitives',
    'zIndex': 'primitives',
    'opacity': 'primitives',
    'sizing': 'primitives',
    'focus': 'primitives',
    'scale': 'primitives',
    'cursor': 'primitives',
    'fontSmoothing': 'primitives',
    'heading': 'primitives'
};

const TOKENS_STUDIO_COMPONENT_SETS = {
    'button': 'components/button',
    'input': 'components/input',
    'modal': 'components/modal',
    'table': 'components/table',
    'card': 'components/card',
    'badge': 'components/badge',
    'select': 'components/select',
    'checkbox': 'components/checkbox',
    'switch': 'components/switch',
    'alert': 'components/alert',
    'tabs': 'components/tabs',
    'radio': 'components/radio',
    'avatar': 'components/avatar',
    'tooltip': 'components/tooltip',
    'progress': 'components/progress',
    'accordion': 'components/accordion',
    'pagination': 'components/pagination',
    'skeleton': 'components/skeleton',
    'breadcrumb': 'components/breadcrumb'
};

function getOriginalValue(token) {
    const original = token.original || token;
    const originalValue = original.$value ?? original.value;
    const resolvedValue = token.$value ?? token.value;
    const tokenType = token.$type || token.type;

    // For simple string references, preserve the original
    if (typeof originalValue === 'string' && originalValue.startsWith('{') && originalValue.endsWith('}')) {
        return originalValue;
    }

    // For composite tokens (typography, boxShadow, transition), preserve original references
    // These have object values where inner properties may be references
    if (tokenType === 'typography' && typeof originalValue === 'object' && originalValue !== null) {
        // Return the original value object which should contain unresolved references
        return originalValue;
    }

    // For transition objects, preserve original (may contain references to duration/easing)
    if (tokenType === 'transition' && typeof originalValue === 'object' && originalValue !== null) {
        return originalValue;
    }

    // For boxShadow arrays, preserve original (may contain references in color)
    if (tokenType === 'boxShadow' && Array.isArray(originalValue)) {
        return originalValue;
    }

    return resolvedValue;
}

/** Recursively sort object keys alphabetically. Leaf values pass through unchanged. */
function sortKeysDeep(obj) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
    const sorted = {};
    for (const key of Object.keys(obj).sort()) {
        sorted[key] = sortKeysDeep(obj[key]);
    }
    return sorted;
}

/**
 * Recursively collect dot-path token names from a Tokens Studio JSON structure.
 * A node is a token if it has $value or $type. Keys starting with $ are skipped.
 */
function collectTokenPaths(obj, prefix = '') {
    const paths = new Set();
    for (const [key, value] of Object.entries(obj)) {
        if (key.startsWith('$')) continue;
        const path = prefix ? `${prefix}.${key}` : key;
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            if ('$value' in value || '$type' in value) {
                paths.add(path);
            } else {
                for (const p of collectTokenPaths(value, path)) {
                    paths.add(p);
                }
            }
        }
    }
    return paths;
}

/**
 * Given a theme object, read its output files and collect all token paths.
 */
function collectThemeTokenPaths(theme) {
    const tokensStudioDir = `${distFolder}/tokens-studio`;
    const allPaths = new Set();

    for (const [setName, status] of Object.entries(theme.selectedTokenSets)) {
        if (status === 'disabled') continue;
        const filePath = `${tokensStudioDir}/${setName}.json`;
        if (!fs.existsSync(filePath)) continue;
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        for (const p of collectTokenPaths(content)) {
            allPaths.add(p);
        }
    }
    return allPaths;
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
        const tsType = inferTokensStudioType(token);

        const tokenObj = { "$value": getOriginalValue(token) };
        if (tsType) tokenObj["$type"] = tsType;

        const description = token.$description ?? token.description ?? token.comment;
        if (description) {
            const tokenPath = path.join('.');
            // Avoid double-prepending if description already starts with the token path
            if (description.startsWith(`${tokenPath} — `)) {
                tokenObj["$description"] = description;
            } else {
                tokenObj["$description"] = `${tokenPath} — ${description}`;
            }
        }

        // Merge into existing object to preserve children when a node
        // is both a token ($value) and a parent of nested tokens
        if (current[finalKey] && typeof current[finalKey] === 'object') {
            Object.assign(current[finalKey], tokenObj);
        } else {
            current[finalKey] = tokenObj;
        }
    });

    return sortKeysDeep(result);
}

function filterTokensBySet(tokens, setName) {
    return tokens.filter(token => {
        const category = token.path[0];
        if (TOKENS_STUDIO_COMPONENT_SETS[category] === setName) return true;
        if (TOKENS_STUDIO_PRIMITIVE_SETS[category] === setName) return true;
        return false;
    });
}

function generateTokensStudioMetadata() {
    return {
        tokenSetOrder: [
            "primitives",
            "semantic/ccui-21-light",
            "semantic/ccui-30-dark", "semantic/ccui-30-light",
            "semantic/mantine-dark", "semantic/mantine-light",
            "components/accordion", "components/alert", "components/avatar",
            "components/badge", "components/breadcrumb", "components/button",
            "components/card", "components/checkbox", "components/input",
            "components/modal", "components/pagination", "components/progress",
            "components/radio", "components/select", "components/skeleton",
            "components/switch", "components/table", "components/tabs",
            "components/tooltip"
        ]
    };
}

function generateTokensStudioThemes() {
    const allPrimitiveSets = ["primitives"];

    const allComponentSets = [
        "components/accordion", "components/alert", "components/avatar",
        "components/badge", "components/breadcrumb", "components/button",
        "components/card", "components/checkbox", "components/input",
        "components/modal", "components/pagination", "components/progress",
        "components/radio", "components/select", "components/skeleton",
        "components/switch", "components/table", "components/tabs",
        "components/tooltip"
    ];

    const allSemanticSetNames = [
        "semantic/ccui-21-light", "semantic/ccui-30-dark", "semantic/ccui-30-light",
        "semantic/mantine-dark", "semantic/mantine-light"
    ];

    const toStatus = (sets, status) =>
        Object.fromEntries(sets.map(s => [s, status]));

    // Group 1: Primitives — 1 mode, all primitives enabled
    const primitivesTheme = {
        id: "primitives-default",
        name: "Default",
        group: "Primitives",
        selectedTokenSets: toStatus(allPrimitiveSets, "enabled")
    };

    // Group 2: Semantic — 5 modes, one per theme
    const semanticThemes = Object.entries(THEME_CONFIG).map(([themeName, config]) => ({
        id: `semantic-${themeName}`,
        name: config.description,
        group: "Semantic",
        selectedTokenSets: {
            ...toStatus(allPrimitiveSets, "source"),
            ...toStatus(allSemanticSetNames, "disabled"),
            [`semantic/${themeName}`]: "enabled"
        }
    }));

    // Group 3: Components — 1 mode, all components enabled
    const componentsTheme = {
        id: "components-default",
        name: "Default",
        group: "Components",
        selectedTokenSets: {
            ...toStatus(allPrimitiveSets, "source"),
            ...toStatus(allComponentSets, "enabled")
        }
    };

    return [primitivesTheme, ...semanticThemes, componentsTheme];
}

StyleDictionary.registerFormat({
    name: 'json/tokens-studio-set',
    format: ({ dictionary, options }) => {
        const setName = options.setName;
        const excludeCategories = options.excludeCategories || [];
        let tokens = filterTokensBySet(dictionary.allTokens, setName);
        // Filter out excluded categories (used to prevent fontFamilies in primitives/typography
        // since theme-specific fontFamilies come from semantic files)
        if (excludeCategories.length > 0) {
            tokens = tokens.filter(token => !excludeCategories.includes(token.path[0]));
        }
        const structure = buildTokensStudioStructure(tokens);
        return JSON.stringify(structure, null, 2);
    }
});

// Component names that appear as top-level keys in theme component-colors files
const SEMANTIC_COMPONENT_NAMES = Object.keys(TOKENS_STUDIO_COMPONENT_SETS);

StyleDictionary.registerFormat({
    name: 'json/tokens-studio-semantic',
    format: ({ dictionary }) => {
        const semanticTokens = dictionary.allTokens.filter(token => {
            const category = token.path[0];
            // Include color-related semantic tokens and component color tokens from theme files
            if (!['color', 'colorPalette', 'boxShadow', 'mantine', 'opacity', 'brand', 'fontFamilies', ...SEMANTIC_COMPONENT_NAMES].includes(category)) {
                return false;
            }
            // Exclude primitive palette colors (including brand palettes) - they belong in primitives/color.json
            if (isPrimitiveColorToken(token)) {
                return false;
            }
            // For component categories, only include color tokens (not dimension/duration primitives)
            if (SEMANTIC_COMPONENT_NAMES.includes(category)) {
                const tokenType = token.$type || token.type;
                if (tokenType !== 'color') return false;
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

const allPrimitiveFiles = getTokenFiles(primitivesFolder);
console.log('Primitive token files:', allPrimitiveFiles.length);

const themesToBuild = [];
console.log('Scanning for themes in:', `${sourceFolder}`);
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
    console.log('\nBuilding shared primitives...');

    try {
        const sd = new StyleDictionary({
            source: allPrimitiveFiles,
            usesDtcg: true,
            platforms: {
                // Tokens Studio primitives — single merged file for alphabetical group ordering
                "tokens-studio-primitives": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/`,
                    "files": [{ "destination": "primitives.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives", "excludeCategories": ["fontFamilies"] } }]
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
                },
                "tokens-studio-components-table": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "table.json", "format": "json/tokens-studio-set", "options": { "setName": "components/table" } }]
                },
                "tokens-studio-components-card": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "card.json", "format": "json/tokens-studio-set", "options": { "setName": "components/card" } }]
                },
                "tokens-studio-components-badge": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "badge.json", "format": "json/tokens-studio-set", "options": { "setName": "components/badge" } }]
                },
                "tokens-studio-components-select": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "select.json", "format": "json/tokens-studio-set", "options": { "setName": "components/select" } }]
                },
                "tokens-studio-components-checkbox": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "checkbox.json", "format": "json/tokens-studio-set", "options": { "setName": "components/checkbox" } }]
                },
                "tokens-studio-components-switch": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "switch.json", "format": "json/tokens-studio-set", "options": { "setName": "components/switch" } }]
                },
                "tokens-studio-components-alert": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "alert.json", "format": "json/tokens-studio-set", "options": { "setName": "components/alert" } }]
                },
                "tokens-studio-components-tabs": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "tabs.json", "format": "json/tokens-studio-set", "options": { "setName": "components/tabs" } }]
                },
                "tokens-studio-components-radio": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "radio.json", "format": "json/tokens-studio-set", "options": { "setName": "components/radio" } }]
                },
                "tokens-studio-components-avatar": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "avatar.json", "format": "json/tokens-studio-set", "options": { "setName": "components/avatar" } }]
                },
                "tokens-studio-components-tooltip": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "tooltip.json", "format": "json/tokens-studio-set", "options": { "setName": "components/tooltip" } }]
                },
                "tokens-studio-components-progress": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "progress.json", "format": "json/tokens-studio-set", "options": { "setName": "components/progress" } }]
                },
                "tokens-studio-components-accordion": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "accordion.json", "format": "json/tokens-studio-set", "options": { "setName": "components/accordion" } }]
                },
                "tokens-studio-components-pagination": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "pagination.json", "format": "json/tokens-studio-set", "options": { "setName": "components/pagination" } }]
                },
                "tokens-studio-components-skeleton": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "skeleton.json", "format": "json/tokens-studio-set", "options": { "setName": "components/skeleton" } }]
                },
                "tokens-studio-components-breadcrumb": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/components/`,
                    "files": [{ "destination": "breadcrumb.json", "format": "json/tokens-studio-set", "options": { "setName": "components/breadcrumb" } }]
                }
            },
            log: LOG_CONFIG
        });
        await sd.buildAllPlatforms();
        console.log('Shared primitives built successfully');
        return true;
    } catch (error) {
        console.error('Error building shared primitives:', error.message);
        return false;
    }
}

async function buildThemes() {
    const builtThemes = [];

    for (const theme of themesToBuild) {
        console.log(`\nBuilding ${theme} theme...`);

        const themeTokenFiles = getTokenFiles(`${sourceFolder}/${theme}`);
        const baseThemeFiles = getTokenFiles(`${sourceFolder}/base`);

        const sourceFiles = [...allPrimitiveFiles, ...baseThemeFiles, ...themeTokenFiles];

        try {
            const sd = new StyleDictionary({
                source: sourceFiles,
                usesDtcg: true,
                platforms: {
                    "tokens-studio-semantic": {
                        "transformGroup": transformGroups.json,
                        "buildPath": `${distFolder}/tokens-studio/semantic/`,
                        "files": [{
                            "destination": `${theme}.json`,
                            "format": "json/tokens-studio-semantic"
                        }]
                    }
                },
                log: LOG_CONFIG
            });
            await sd.buildAllPlatforms();
            console.log(`${theme} theme built successfully`);
            builtThemes.push(theme);
        } catch (error) {
            console.error(`Error building ${theme} theme:`, error.message);
        }
    }

    console.log('\nAll themes built successfully!');
    return builtThemes;
}

async function validateBuild() {
    console.log('\nRunning post-build validation...');
    let hasErrors = false;

    // Validate Tokens Studio files
    const tokensStudioFiles = [
        `${distFolder}/tokens-studio/$metadata.json`,
        `${distFolder}/tokens-studio/$themes.json`
    ];

    for (const theme of themesToBuild) {
        tokensStudioFiles.push(`${distFolder}/tokens-studio/semantic/${theme}.json`);
    }

    for (const filePath of tokensStudioFiles) {
        if (!fs.existsSync(filePath)) {
            console.error(`Missing Tokens Studio file: ${filePath}`);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        console.error('\nValidation failed!');
        process.exit(1);
    } else {
        console.log('Validation passed');
    }
}

async function buildTokensStudioConfig() {
    console.log('\nBuilding Tokens Studio configuration...');

    const tokensStudioDir = `${distFolder}/tokens-studio`;
    if (!fs.existsSync(tokensStudioDir)) {
        fs.mkdirSync(tokensStudioDir, { recursive: true });
    }

    const newThemes = generateTokensStudioThemes();

    // Preserve Figma metadata from existing $themes.json
    const themesPath = `${tokensStudioDir}/$themes.json`;
    let existingThemes = [];
    if (fs.existsSync(themesPath)) {
        try {
            const parsed = JSON.parse(fs.readFileSync(themesPath, 'utf-8'));
            if (Array.isArray(parsed)) existingThemes = parsed;
        } catch (err) {
            console.warn('  Could not parse existing $themes.json, skipping merge:', err.message);
        }
    }

    // Index existing themes by id for O(1) lookup
    const existingById = {};
    for (const theme of existingThemes) {
        if (theme.id) existingById[theme.id] = theme;
    }

    // Merge Figma metadata and sort reference keys
    const figmaFields = ['$figmaCollectionId', '$figmaModeId', '$figmaVariableReferences', '$figmaStyleReferences'];
    const mergedThemes = newThemes.map(newTheme => {
        const existing = existingById[newTheme.id];
        if (!existing) return newTheme;

        const merged = { ...newTheme };
        for (const field of figmaFields) {
            if (existing[field] !== undefined) {
                merged[field] = existing[field];
            }
        }

        // Sort reference keys alphabetically
        if (merged.$figmaVariableReferences) {
            merged.$figmaVariableReferences = sortKeysDeep(merged.$figmaVariableReferences);
        }
        if (merged.$figmaStyleReferences) {
            merged.$figmaStyleReferences = sortKeysDeep(merged.$figmaStyleReferences);
        }

        // Prune stale Figma references (tokens that no longer exist in output)
        const validPaths = collectThemeTokenPaths(merged);
        if (merged.$figmaVariableReferences) {
            const before = Object.keys(merged.$figmaVariableReferences).length;
            for (const key of Object.keys(merged.$figmaVariableReferences)) {
                if (!validPaths.has(key)) {
                    delete merged.$figmaVariableReferences[key];
                }
            }
            const pruned = before - Object.keys(merged.$figmaVariableReferences).length;
            if (pruned > 0) {
                console.log(`  Pruned ${pruned} stale Figma variable ref(s) from ${newTheme.name}`);
            }
        }
        if (merged.$figmaStyleReferences) {
            const before = Object.keys(merged.$figmaStyleReferences).length;
            for (const key of Object.keys(merged.$figmaStyleReferences)) {
                if (!validPaths.has(key)) {
                    delete merged.$figmaStyleReferences[key];
                }
            }
            const pruned = before - Object.keys(merged.$figmaStyleReferences).length;
            if (pruned > 0) {
                console.log(`  Pruned ${pruned} stale Figma style ref(s) from ${newTheme.name}`);
            }
        }

        return merged;
    });

    fs.writeFileSync(`${tokensStudioDir}/$metadata.json`, JSON.stringify(generateTokensStudioMetadata(), null, 2));
    fs.writeFileSync(themesPath, JSON.stringify(mergedThemes, null, 2));
    console.log('Tokens Studio config built');
    return true;
}

async function build() {
    console.log('\nPre-build validation...');
    for (const theme of themesToBuild) {
        try {
            validateThemeExists(theme);
        } catch (error) {
            console.error(`${error.message}`);
            process.exit(1);
        }
    }
    console.log('All theme folders found');

    const sharedSuccess = await buildSharedPrimitives();
    if (!sharedSuccess) {
        console.error('Failed to build shared primitives');
        process.exit(1);
    }

    await buildThemes();
    await buildTokensStudioConfig();
    await validateBuild();

    // Print summary
    console.log('\n========================================');
    console.log('BUILD COMPLETE');
    console.log('========================================');
    console.log('Output files:');
    console.log('  Tokens Studio:');
    console.log('    dist/tokens-studio/$metadata.json');
    console.log('    dist/tokens-studio/$themes.json');
    for (const theme of themesToBuild) {
        console.log(`    dist/tokens-studio/semantic/${theme}.json`);
    }
}

await build().catch(console.error);
