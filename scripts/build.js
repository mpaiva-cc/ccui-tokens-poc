/* this file runs in node, so it's intentionally written in JS */
import StyleDictionary from "style-dictionary";
import { formats, transformGroups } from 'style-dictionary/enums';
import fs from 'fs';

const primitivesFolder = 'src/primitives';
const sourceFolder = 'src/themes';
const distFolder = 'dist';

// ========================================
// OUTPUT FORMAT CONFIGURATION
// ========================================

// Configurable output formats - each format produces CSS with different prefixes
const OUTPUT_FORMATS = {
    neutral: {
        prefix: '',
        transformName: 'name/neutral',
        description: 'Framework-agnostic output with no prefix'
    },
    ccui: {
        prefix: 'ccui',
        transformName: 'name/ccui',
        description: 'CCUI prefixed output (--ccui-*)'
    },
    mantine: {
        prefix: 'mantine',
        transformName: 'name/mantine-theme',
        description: 'Mantine-compatible output (--mantine-*)'
    }
};

// Which formats to generate (can be configured)
const ACTIVE_FORMATS = ['neutral', 'ccui', 'mantine'];

// ========================================
// TOKEN CATEGORY DEFINITIONS
// ========================================

// Shared primitives - these tokens are theme-agnostic and identical across themes
const SHARED_PRIMITIVE_CATEGORIES = [
    'spacing',
    'gridSpacing',
    'verticalRhythm',
    'radius',
    // Typography flat categories
    'fontFamilies',
    'fontSizes',
    'fontWeights',
    'lineHeights',
    'letterSpacing',
    'typography',  // Composite typography styles
    'breakpoints',
    'contentWidth',
    'motion',
    'zIndex',
    'borderWidth',
    'borderStyle',
    'focus',
    'sizing',
    // Component tokens
    'button',
    'input',
    'modal',
    'table',
    'card',
    'badge',
    'select',
    'checkbox',
    'switch',
    'alert',
    'tabs'
];

// Theme-specific categories - these tokens vary between themes
const THEME_SPECIFIC_CATEGORIES = [
    'color',
    'colorPalette',
    'boxShadow',
    'opacity',
    'typography',
    'mantine',
    'brand',
    'component',
    'componentColors'
];

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

// Get CSS selector for a theme using data-theme attribute
function getThemeSelector(themeName) {
    const config = THEME_CONFIG[themeName];
    if (config && config.isDefault) {
        // Default theme applies to :root and its specific selector
        return `:root,\n[data-theme="${themeName}"]`;
    }
    return `[data-theme="${themeName}"]`;
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
        // Handle palette colors (color.blue.5, color.red.filled, etc.)
        if (MANTINE_PALETTES.includes(colorName)) {
            if (/^[0-9]$/.test(shadeOrVariant)) return true;
            if (MANTINE_COLOR_VARIANTS.includes(shadeOrVariant)) return true;
            return false;
        }
        // Handle primary color tokens (color.primary.filled, color.primary.0, etc.)
        if (colorName === 'primary') {
            if (/^[0-9]$/.test(shadeOrVariant)) return true;
            if (MANTINE_PRIMARY_VARIANTS.includes(shadeOrVariant)) return true;
            return false;
        }
        // Unknown color category
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

    // Handle semantic colors like color.text, color.body (path.length === 2)
    if (path[0] === 'color' && path.length === 2) {
        return MANTINE_SEMANTIC_COLORS.includes(path[1]);
    }

    if (path[0] === 'spacing') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'radius') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'boxShadow') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    // Flat typography categories
    if (path[0] === 'fontFamilies') {
        return path.length === 2 && ['body', 'mono', 'heading'].includes(path[1]);
    }

    if (path[0] === 'fontSizes') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'lineHeights') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    // Composite typography styles (not Mantine official)
    if (path[0] === 'typography') {
        return false;
    }

    // fontWeights and letterSpacing are not Mantine official
    if (path[0] === 'fontWeights' || path[0] === 'letterSpacing') {
        return false;
    }

    if (path[0] === 'motion') return false;
    if (['button', 'input', 'modal', 'table', 'card', 'badge', 'select', 'checkbox', 'switch', 'alert', 'tabs'].includes(path[0])) return false;

    if (path[0] === 'breakpoints') {
        return path.length === 2 && MANTINE_SIZES.includes(path[1]);
    }

    if (path[0] === 'zIndex') return false;

    const ccuiExtensions = ['gridSpacing', 'verticalRhythm', 'contentWidth', 'borderWidth', 'borderStyle', 'focus', 'sizing', 'opacity', 'brand'];
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
        console.warn(`  Unresolved references in ${filePath}:`);
        matches.forEach(match => console.warn(`   - ${match}`));
        return matches;
    }
    return [];
}

// Register custom transform for neutral (no prefix) CSS variable names
StyleDictionary.registerTransform({
    name: 'name/neutral',
    type: 'name',
    transform: (token) => {
        return token.path.join('-');
    }
});

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

        // Flat typography categories
        if (path[0] === 'fontFamilies') {
            if (path[1] === 'body') return 'mantine-font-family';
            if (path[1] === 'mono') return 'mantine-font-family-monospace';
            if (path[1] === 'heading') return 'mantine-font-family-headings';
            return `mantine-font-family-${path[1]}`;
        }

        if (path[0] === 'fontSizes') {
            return `mantine-font-size-${path[1]}`;
        }

        if (path[0] === 'fontWeights') {
            return `mantine-font-weight-${path[1]}`;
        }

        if (path[0] === 'lineHeights') {
            return `mantine-line-height-${path[1]}`;
        }

        if (path[0] === 'letterSpacing') {
            return `mantine-letter-spacing-${path[1]}`;
        }

        // Composite typography styles
        if (path[0] === 'typography') {
            return `mantine-${path.join('-').replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        }

        if (path[0] === 'motion') {
            return `mantine-${path.join('-').replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        }

        if (['button', 'input', 'modal', 'table', 'card', 'badge', 'select', 'checkbox', 'switch', 'alert', 'tabs'].includes(path[0])) {
            return `mantine-${path.join('-').replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        }

        if (path[0] === 'boxShadow') {
            return `mantine-shadow-${path[1]}`;
        }

        if (path[0] === 'breakpoints') {
            return `mantine-breakpoint-${path[1]}`;
        }

        return `mantine-${path.join('-')}`;
    }
});

// Register boxShadow to CSS transform
StyleDictionary.registerTransform({
    name: 'boxShadow/css',
    type: 'value',
    filter: (token) => {
        const type = token.$type || token.type;
        return type === 'boxShadow';
    },
    transform: (token) => {
        const value = token.$value ?? token.value;
        // Handle "none" or other string values
        if (!Array.isArray(value)) return value;

        return value.map(shadow => {
            const inset = shadow.type === 'innerShadow' ? 'inset ' : '';
            const x = shadow.x || '0';
            const y = shadow.y || '0';
            const blur = shadow.blur || '0';
            const spread = shadow.spread || '0';
            const color = shadow.color || 'rgba(0, 0, 0, 0.1)';
            return `${inset}${x} ${y} ${blur} ${spread} ${color}`;
        }).join(', ');
    }
});

// Register transform groups
StyleDictionary.registerTransformGroup({
    name: 'neutral/css',
    transforms: ['attribute/cti', 'name/neutral', 'boxShadow/css']
});

StyleDictionary.registerTransformGroup({
    name: 'ccui/css',
    transforms: ['attribute/cti', 'name/ccui', 'boxShadow/css']
});

StyleDictionary.registerTransformGroup({
    name: 'mantine/css',
    transforms: ['attribute/cti', 'name/mantine-theme', 'boxShadow/css']
});

// ========================================
// CSS FORMATS
// ========================================

// System token categories (from src/primitives/)
const SYSTEM_TOKEN_CATEGORIES = [
    'scale',
    'cursor',
    'fontSmoothing',
    'heading'
];

// Helper to check if a token is a composite typography token (not valid for CSS output)
function isCompositeTypographyToken(token) {
    // Composite typography tokens have $type: "typography" with an object $value
    const type = token.$type || token.type;
    if (type === 'typography') {
        const value = token.$value ?? token.value;
        return typeof value === 'object' && value !== null;
    }
    return false;
}

StyleDictionary.registerFormat({
    name: 'css/neutral-shared-primitives',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const sharedTokens = dictionary.allTokens.filter(token =>
            (SHARED_PRIMITIVE_CATEGORIES.includes(token.path[0]) || SYSTEM_TOKEN_CATEGORIES.includes(token.path[0])) &&
            !isCompositeTypographyToken(token)
        );
        const variables = sharedTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * Design Tokens (Neutral) - Auto-generated, do not edit directly\n * Framework-agnostic core tokens (spacing, typography, radius, etc.)\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'css/neutral-theme-specific',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const themeTokens = dictionary.allTokens.filter(token =>
            THEME_SPECIFIC_CATEGORIES.includes(token.path[0]) &&
            !isCompositeTypographyToken(token)
        );
        const variables = themeTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * Design Tokens (Neutral) - Auto-generated, do not edit directly\n * Tokens that vary between themes (colors, shadows, etc.)\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'css/ccui-shared-primitives',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const sharedTokens = dictionary.allTokens.filter(token =>
            (SHARED_PRIMITIVE_CATEGORIES.includes(token.path[0]) || SYSTEM_TOKEN_CATEGORIES.includes(token.path[0])) &&
            !isCompositeTypographyToken(token)
        );
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
        const themeTokens = dictionary.allTokens.filter(token =>
            THEME_SPECIFIC_CATEGORIES.includes(token.path[0]) &&
            !isCompositeTypographyToken(token)
        );
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
            SHARED_PRIMITIVE_CATEGORIES.includes(token.path[0]) &&
            isMantineOfficialToken(token) &&
            !isCompositeTypographyToken(token)
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
            THEME_SPECIFIC_CATEGORIES.includes(token.path[0]) &&
            isMantineOfficialToken(token) &&
            !isCompositeTypographyToken(token)
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

    // Composite typography styles
    if (rootCategory === 'typography') {
        if (originalType === 'typography') return 'typography';
        // For nested typography values within composite tokens
        if (path.includes('fontFamily')) return 'fontFamilies';
        if (path.includes('fontWeight')) return 'fontWeights';
        if (path.includes('fontSize')) return 'fontSizes';
        if (path.includes('lineHeight')) return 'lineHeights';
        if (path.includes('letterSpacing')) return 'letterSpacing';
        if (path.includes('paragraphSpacing')) return 'paragraphSpacing';
    }

    // Motion tokens
    if (rootCategory === 'motion') {
        if (path.includes('duration')) return 'duration';
        if (path.includes('easing')) return 'cubicBezier';
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
    'color': 'primitives/color',
    'spacing': 'primitives/spacing',
    'gridSpacing': 'primitives/spacing',
    'verticalRhythm': 'primitives/spacing',
    'radius': 'primitives/radius',
    // Flat typography categories all map to typography output
    'fontFamilies': 'primitives/typography',
    'fontSizes': 'primitives/typography',
    'fontWeights': 'primitives/typography',
    'lineHeights': 'primitives/typography',
    'letterSpacing': 'primitives/typography',
    'typography': 'primitives/typography',  // Composite styles
    'boxShadow': 'primitives/shadow',
    'motion': 'primitives/motion',
    'borderWidth': 'primitives/border',
    'borderStyle': 'primitives/border',
    'breakpoints': 'primitives/breakpoints',
    'contentWidth': 'primitives/breakpoints',
    'zIndex': 'primitives/z-index',
    'opacity': 'primitives/opacity',
    'sizing': 'primitives/sizing',
    'focus': 'primitives/focus',
    'scale': 'primitives/system',
    'cursor': 'primitives/system',
    'fontSmoothing': 'primitives/system',
    'heading': 'primitives/system'
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
    'tabs': 'components/tabs'
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
        const tsType = inferTokensStudioType(token);

        const tokenObj = { "$value": getOriginalValue(token) };
        if (tsType) tokenObj["$type"] = tsType;

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
        if (TOKENS_STUDIO_PRIMITIVE_SETS[category] === setName) return true;
        return false;
    });
}

function generateTokensStudioMetadata() {
    return {
        tokenSetOrder: [
            "primitives/color", "primitives/spacing", "primitives/radius", "primitives/typography",
            "primitives/shadow", "primitives/motion", "primitives/border", "primitives/breakpoints",
            "primitives/z-index", "primitives/opacity", "primitives/sizing", "primitives/focus", "primitives/system",
            "semantic/mantine-light", "semantic/mantine-dark",
            "semantic/ccui-21-light",
            "semantic/ccui-30-light", "semantic/ccui-30-dark",
            "components/button", "components/input", "components/modal",
            "components/table", "components/card", "components/badge", "components/select",
            "components/checkbox", "components/switch", "components/alert", "components/tabs"
        ]
    };
}

function generateTokensStudioThemes() {
    const primitiveSetStatus = {
        "primitives/color": "source", "primitives/spacing": "source", "primitives/radius": "source",
        "primitives/typography": "source", "primitives/shadow": "source", "primitives/motion": "source",
        "primitives/border": "source", "primitives/breakpoints": "source", "primitives/z-index": "source",
        "primitives/opacity": "source", "primitives/sizing": "source", "primitives/focus": "source",
        "primitives/system": "source"
    };

    const componentSetStatus = {
        "components/button": "enabled",
        "components/input": "enabled",
        "components/modal": "enabled",
        "components/table": "enabled",
        "components/card": "enabled",
        "components/badge": "enabled",
        "components/select": "enabled",
        "components/checkbox": "enabled",
        "components/switch": "enabled",
        "components/alert": "enabled",
        "components/tabs": "enabled"
    };

    const allSemanticSets = {
        "semantic/mantine-light": "disabled",
        "semantic/mantine-dark": "disabled",
        "semantic/ccui-21-light": "disabled",
        "semantic/ccui-30-light": "disabled",
        "semantic/ccui-30-dark": "disabled"
    };

    return [
        {
            id: "mantine-light", name: "Mantine Light", group: "theme",
            selectedTokenSets: { ...primitiveSetStatus, ...allSemanticSets, "semantic/mantine-light": "enabled", ...componentSetStatus }
        },
        {
            id: "mantine-dark", name: "Mantine Dark", group: "theme",
            selectedTokenSets: { ...primitiveSetStatus, ...allSemanticSets, "semantic/mantine-dark": "enabled", ...componentSetStatus }
        },
        {
            id: "ccui-21-light", name: "CCUI 2.1 Light", group: "theme",
            selectedTokenSets: { ...primitiveSetStatus, ...allSemanticSets, "semantic/ccui-21-light": "enabled", ...componentSetStatus }
        },
        {
            id: "ccui-30-light", name: "CCUI 3.0 Light", group: "theme",
            selectedTokenSets: { ...primitiveSetStatus, ...allSemanticSets, "semantic/ccui-30-light": "enabled", ...componentSetStatus }
        },
        {
            id: "ccui-30-dark", name: "CCUI 3.0 Dark", group: "theme",
            selectedTokenSets: { ...primitiveSetStatus, ...allSemanticSets, "semantic/ccui-30-dark": "enabled", ...componentSetStatus }
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
            // Include color-related semantic tokens and component color tokens from theme files
            if (!['color', 'colorPalette', 'boxShadow', 'mantine', 'opacity', 'brand', 'component', 'componentColors'].includes(category)) {
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
                "dist-shared-neutral": {
                    "transformGroup": "neutral/css",
                    "buildPath": `${distFolder}/css/shared/`,
                    "files": [{
                        "destination": "neutral-primitives.css",
                        "format": "css/neutral-shared-primitives",
                        "options": { "selector": ":root" }
                    }]
                },
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
                // Tokens Studio primitive sets
                "tokens-studio-primitives-color": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "color.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/color" } }]
                },
                "tokens-studio-primitives-spacing": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "spacing.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/spacing" } }]
                },
                "tokens-studio-primitives-radius": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "radius.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/radius" } }]
                },
                "tokens-studio-primitives-typography": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "typography.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/typography" } }]
                },
                "tokens-studio-primitives-shadow": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "shadow.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/shadow" } }]
                },
                "tokens-studio-primitives-motion": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "motion.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/motion" } }]
                },
                "tokens-studio-primitives-border": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "border.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/border" } }]
                },
                "tokens-studio-primitives-breakpoints": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "breakpoints.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/breakpoints" } }]
                },
                "tokens-studio-primitives-z-index": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "z-index.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/z-index" } }]
                },
                "tokens-studio-primitives-opacity": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "opacity.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/opacity" } }]
                },
                "tokens-studio-primitives-sizing": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "sizing.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/sizing" } }]
                },
                "tokens-studio-primitives-focus": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "focus.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/focus" } }]
                },
                "tokens-studio-primitives-system": {
                    "transformGroup": transformGroups.json,
                    "buildPath": `${distFolder}/tokens-studio/primitives/`,
                    "files": [{ "destination": "system.json", "format": "json/tokens-studio-set", "options": { "setName": "primitives/system" } }]
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
                }
            },
            log: { verbosity: 'default' }
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
                    "dist-neutral": {
                        "transformGroup": "neutral/css",
                        "buildPath": `${distFolder}/css/${theme}/`,
                        "files": [{
                            "destination": "neutral-semantic.css",
                            "format": "css/neutral-theme-specific",
                            "options": { "selector": getThemeSelector(theme) }
                        }]
                    },
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
                            "destination": `${theme}.json`,
                            "format": "json/tokens-studio-semantic"
                        }]
                    }
                },
                log: { verbosity: 'default' }
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

// ========================================
// SEPARATE CSS FILES BUILD
// ========================================

async function buildSeparateCSSFiles() {
    console.log('\nBuilding separate CSS files per theme...');

    const cssDir = `${distFolder}/css`;

    // Read shared primitives
    const neutralPrimitives = fs.readFileSync(`${cssDir}/shared/neutral-primitives.css`, 'utf8');
    const ccuiPrimitives = fs.readFileSync(`${cssDir}/shared/ccui-primitives.css`, 'utf8');
    const mantinePrimitives = fs.readFileSync(`${cssDir}/shared/mantine-primitives.css`, 'utf8');

    // Build primitives.css (shared base file)
    const primitivesContent = `/**
 * CCUI Design Tokens - Shared Primitives
 * Generated: ${new Date().toISOString()}
 *
 * This file contains theme-agnostic tokens (spacing, typography, radius, etc.)
 * Load this file first, then load ONE theme file.
 *
 * Includes three output formats:
 * - Neutral (no prefix): --spacing-md, --radius-sm
 * - CCUI (--ccui-*): --ccui-spacing-md, --ccui-radius-sm
 * - Mantine (--mantine-*): --mantine-spacing-md, --mantine-radius-sm
 */

/* ========================================
   PRIMITIVES (Neutral - No Prefix)
   ======================================== */

${neutralPrimitives}

/* ========================================
   PRIMITIVES (CCUI Prefixed)
   ======================================== */

${ccuiPrimitives}

/* ========================================
   PRIMITIVES (Mantine Prefixed)
   ======================================== */

${mantinePrimitives}
`;

    fs.writeFileSync(`${cssDir}/primitives.css`, primitivesContent);

    // Build individual theme files
    for (const theme of themesToBuild) {
        const config = THEME_CONFIG[theme] || { description: theme };

        const neutralSemantic = fs.readFileSync(`${cssDir}/${theme}/neutral-semantic.css`, 'utf8');
        const ccuiSemantic = fs.readFileSync(`${cssDir}/${theme}/ccui-semantic.css`, 'utf8');
        const mantineSemantic = fs.readFileSync(`${cssDir}/${theme}/mantine-theme.css`, 'utf8');

        const themeContent = `/**
 * CCUI Design Tokens - ${theme}
 * ${config.description}
 * Generated: ${new Date().toISOString()}
 *
 * Usage:
 *   1. Load primitives.css first
 *   2. Load this theme file
 *   3. Set data-theme="${theme}" on <html> element
 *
 * Theme switching:
 *   document.documentElement.setAttribute('data-theme', '${theme}');
 */

/* ========================================
   ${theme.toUpperCase()} - Neutral
   ======================================== */

${neutralSemantic}

/* ========================================
   ${theme.toUpperCase()} - CCUI
   ======================================== */

${ccuiSemantic}

/* ========================================
   ${theme.toUpperCase()} - Mantine
   ======================================== */

${mantineSemantic}
`;

        fs.writeFileSync(`${cssDir}/${theme}.css`, themeContent);

        const stats = fs.statSync(`${cssDir}/${theme}.css`);
        const fileSizeKB = (stats.size / 1024).toFixed(1);
        console.log(`  Created ${theme}.css (${fileSizeKB}K)`);
    }

    // Calculate primitives file size
    const primitivesStats = fs.statSync(`${cssDir}/primitives.css`);
    const primitivesSizeKB = (primitivesStats.size / 1024).toFixed(1);
    console.log(`  Created primitives.css (${primitivesSizeKB}K)`);

    // Clean up intermediate build folders
    fs.rmSync(`${cssDir}/shared`, { recursive: true, force: true });
    for (const theme of themesToBuild) {
        fs.rmSync(`${cssDir}/${theme}`, { recursive: true, force: true });
    }

    console.log('Separate CSS files built successfully');
    return true;
}

async function validateBuild() {
    console.log('\nRunning post-build validation...');
    let hasErrors = false;

    // Validate primitives.css
    const primitivesPath = `${distFolder}/css/primitives.css`;
    if (!fs.existsSync(primitivesPath)) {
        console.error(`Missing primitives CSS file: ${primitivesPath}`);
        hasErrors = true;
    } else {
        const content = fs.readFileSync(primitivesPath, 'utf8');
        checkUnresolvedReferences(content, primitivesPath);
    }

    // Validate theme CSS files
    for (const theme of themesToBuild) {
        const themePath = `${distFolder}/css/${theme}.css`;
        if (!fs.existsSync(themePath)) {
            console.error(`Missing theme CSS file: ${themePath}`);
            hasErrors = true;
        } else {
            const content = fs.readFileSync(themePath, 'utf8');
            checkUnresolvedReferences(content, themePath);
        }
    }

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

    fs.writeFileSync(`${tokensStudioDir}/$metadata.json`, JSON.stringify(generateTokensStudioMetadata(), null, 2));
    fs.writeFileSync(`${tokensStudioDir}/$themes.json`, JSON.stringify(generateTokensStudioThemes(), null, 2));
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
    await buildSeparateCSSFiles();
    await buildTokensStudioConfig();
    await validateBuild();

    // Print summary
    console.log('\n========================================');
    console.log('BUILD COMPLETE');
    console.log('========================================');
    console.log('Output files:');
    console.log('  CSS:');
    console.log('    dist/css/primitives.css (shared base)');
    for (const theme of themesToBuild) {
        console.log(`    dist/css/${theme}.css`);
    }
    console.log('  Tokens Studio:');
    console.log('    dist/tokens-studio/$metadata.json');
    console.log('    dist/tokens-studio/$themes.json');
    for (const theme of themesToBuild) {
        console.log(`    dist/tokens-studio/semantic/${theme}.json`);
    }
    console.log('\nUsage:');
    console.log('  CSS: Include primitives.css + ONE theme file');
    console.log('  Theme switching: document.documentElement.setAttribute("data-theme", "ccui-30-dark")');
}

await build().catch(console.error);
