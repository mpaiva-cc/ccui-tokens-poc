/* this file runs in node, so it's intentionally written in JS */
import StyleDictionary from "style-dictionary";
import { formats, transformGroups } from 'style-dictionary/enums';
import fs from 'fs';

const primitivesFolder = 'src/primitives';
const semanticFolder = 'src/semantic';
const componentFolder = 'src/component';
const distFolder = 'dist';

// ========================================
// TOKEN CATEGORY DEFINITIONS
// ========================================

// Primitive categories - theme-agnostic raw values
const PRIMITIVE_CATEGORIES = [
    'color',
    'spacing',
    'gridSpacing',
    'verticalRhythm',
    'radius',
    'typography',
    'motion',
    'border',
    'breakpoint',
    'content-width',
    'z-index',
    'focus',
    'opacity',
    'sizing'
];

// Semantic categories - theme-specific meanings
const SEMANTIC_CATEGORIES = [
    'color',
    'shadow'
];

// Component categories
const COMPONENT_CATEGORIES = [
    'button',
    'input',
    'modal'
];

// Theme definitions
const THEMES = ['light', 'dark', 'high-contrast'];

// Map theme names to color schemes for CSS scoping
const THEME_COLOR_SCHEMES = {
    'light': 'light',
    'dark': 'dark',
    'high-contrast': 'high-contrast'
};

function getThemeSelector(themeName) {
    const colorScheme = THEME_COLOR_SCHEMES[themeName];
    if (colorScheme) {
        return `[data-mantine-color-scheme="${colorScheme}"]`;
    }
    return ':root';
}

// ========================================
// VALIDATION FUNCTIONS
// ========================================

function checkUnresolvedReferences(content, filePath) {
    const unresolvedPattern = /\{[a-zA-Z][a-zA-Z0-9./\-]*\}/g;
    const matches = content.match(unresolvedPattern);
    if (matches && matches.length > 0) {
        console.warn(`⚠️  Unresolved references in ${filePath}:`);
        matches.forEach(match => console.warn(`   - ${match}`));
        return matches;
    }
    return [];
}

// ========================================
// CUSTOM TRANSFORMS & PREPROCESSORS
// ========================================

// Preprocessor to convert slash references to dot notation for Style Dictionary resolution
// Style Dictionary resolves references using dot paths internally
StyleDictionary.registerPreprocessor({
    name: 'slash-to-dot-references',
    preprocessor: (dictionary) => {
        function convertReferences(obj) {
            if (typeof obj === 'string') {
                // Convert {color/blue/500} to {color.blue.500}
                return obj.replace(/\{([^}]+)\}/g, (match, ref) => {
                    return `{${ref.replace(/\//g, '.')}}`;
                });
            }
            if (Array.isArray(obj)) {
                return obj.map(convertReferences);
            }
            if (obj && typeof obj === 'object') {
                const result = {};
                for (const [key, value] of Object.entries(obj)) {
                    result[key] = convertReferences(value);
                }
                return result;
            }
            return obj;
        }
        return convertReferences(dictionary);
    }
});

// Register custom transform for CCUI CSS variable names
StyleDictionary.registerTransform({
    name: 'name/ccui',
    type: 'name',
    transform: (token) => {
        // Use path with hyphens for CSS variable names
        return `ccui-${token.path.join('-')}`;
    }
});

// Register custom transform for Mantine-compatible CSS variable names
StyleDictionary.registerTransform({
    name: 'name/mantine-theme',
    type: 'name',
    transform: (token) => {
        const path = token.path;

        // Handle color tokens
        if (path[0] === 'color') {
            return `mantine-color-${path.slice(1).join('-')}`;
        }

        // Handle spacing
        if (path[0] === 'spacing') {
            return `mantine-spacing-${path.slice(1).join('-')}`;
        }

        // Handle radius
        if (path[0] === 'radius') {
            return `mantine-radius-${path.slice(1).join('-')}`;
        }

        // Handle typography
        if (path[0] === 'typography') {
            if (path[1] === 'font-family') {
                if (path[2] === 'sans') return 'mantine-font-family';
                if (path[2] === 'mono') return 'mantine-font-family-monospace';
                if (path[2] === 'heading') return 'mantine-font-family-headings';
                return `mantine-font-family-${path[2]}`;
            }
            if (path[1] === 'font-size') {
                return `mantine-font-size-${path[2]}`;
            }
            if (path[1] === 'font-weight') {
                return `mantine-font-weight-${path[2]}`;
            }
            if (path[1] === 'line-height') {
                return `mantine-line-height-${path[2]}`;
            }
        }

        // Handle shadow
        if (path[0] === 'shadow') {
            return `mantine-shadow-${path.slice(1).join('-')}`;
        }

        // Handle breakpoints
        if (path[0] === 'breakpoint') {
            return `mantine-breakpoint-${path.slice(1).join('-')}`;
        }

        // Handle z-index
        if (path[0] === 'z-index') {
            return `mantine-z-index-${path.slice(1).join('-')}`;
        }

        // Handle motion
        if (path[0] === 'motion') {
            return `mantine-${path.join('-')}`;
        }

        // Handle components
        if (COMPONENT_CATEGORIES.includes(path[0])) {
            return `mantine-${path.join('-')}`;
        }

        // Default
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

StyleDictionary.registerTransformGroup({
    name: 'tokens-studio/json',
    transforms: []
});

// ========================================
// CSS FORMATS
// ========================================

StyleDictionary.registerFormat({
    name: 'css/ccui-primitives',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const variables = dictionary.allTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * CCUI Primitives - Auto-generated, do not edit directly\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'css/ccui-semantic',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const variables = dictionary.allTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * CCUI Semantic Tokens - Auto-generated, do not edit directly\n */\n\n${selector} {\n${variables}\n}\n`;
    }
});

StyleDictionary.registerFormat({
    name: 'css/ccui-components',
    format: ({ dictionary, options }) => {
        const selector = options.selector || ':root';
        const variables = dictionary.allTokens
            .map(token => `  --${token.name}: ${token.$value};`)
            .join('\n');
        return `/**\n * CCUI Component Tokens - Auto-generated, do not edit directly\n */\n\n${selector} {\n${variables}\n}\n`;
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
    'shadow': 'shadow'
};

function inferDtcgType(token) {
    const path = token.path;
    const value = token.$value ?? token.value;

    if (token.$type && DTCG_TYPE_MAP[token.$type]) return DTCG_TYPE_MAP[token.$type];
    if (token.type && DTCG_TYPE_MAP[token.type]) return DTCG_TYPE_MAP[token.type];

    const rootCategory = path[0];

    if (rootCategory === 'color') return 'color';
    if (['spacing', 'gridSpacing', 'verticalRhythm', 'radius', 'sizing', 'breakpoint', 'content-width'].includes(rootCategory)) {
        return 'dimension';
    }
    if (rootCategory === 'typography') {
        if (path.includes('font-family')) return 'fontFamily';
        if (path.includes('font-weight')) return 'fontWeight';
        if (path.includes('font-size') || path.includes('line-height')) return 'dimension';
    }
    if (rootCategory === 'motion') {
        if (path.includes('duration')) return 'duration';
        if (path.includes('easing')) return 'cubicBezier';
    }
    if (rootCategory === 'shadow') return 'shadow';
    if (rootCategory === 'z-index' || rootCategory === 'opacity') return 'number';
    if (rootCategory === 'border') {
        if (path.includes('width')) return 'dimension';
        if (path.includes('style')) return 'strokeStyle';
    }

    if (typeof value === 'string') {
        if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) return 'color';
        if (value.match(/^-?\d+(\.\d+)?(px|rem|em|%)$/)) return 'dimension';
        if (value.match(/^-?\d+(\.\d+)?(ms|s)$/)) return 'duration';
    }
    if (typeof value === 'number') return 'number';

    return null;
}

function getOriginalValue(token) {
    const original = token.original || token;
    const value = original.$value ?? original.value;
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        // Convert references back to slash notation for Tokens Studio output
        // e.g., {color.blue.500} -> {color/blue/500}
        return value.replace(/\{([^}]+)\}/g, (match, ref) => {
            return `{${ref.replace(/\./g, '/')}}`;
        });
    }
    return token.$value ?? token.value;
}

function buildTokensStudioStructure(tokens) {
    const result = {};

    tokens.forEach(token => {
        // Create flat key with slash separators for Figma sub-groups
        const flatKey = token.path.join('/');
        const dtcgType = inferDtcgType(token);

        const tokenObj = { "$value": getOriginalValue(token) };
        if (dtcgType) tokenObj["$type"] = dtcgType;

        const description = token.$description ?? token.description ?? token.comment;
        if (description) tokenObj["$description"] = description;

        result[flatKey] = tokenObj;
    });

    return result;
}

StyleDictionary.registerFormat({
    name: 'json/tokens-studio-set',
    format: ({ dictionary, options }) => {
        const structure = buildTokensStudioStructure(dictionary.allTokens);
        return JSON.stringify(structure, null, 2);
    }
});

// ========================================
// $themes.json and $metadata.json GENERATION
// ========================================

function generateTokensStudioMetadata() {
    return {
        tokenSetOrder: [
            "primitives",
            "semantic/light",
            "semantic/dark",
            "semantic/high-contrast",
            "components"
        ]
    };
}

function generateTokensStudioThemes() {
    return [
        // Primitives theme group - single "Base" theme (no modes needed)
        {
            id: "primitives-base",
            name: "Base",
            group: "primitives",
            selectedTokenSets: {
                "primitives": "enabled"
            }
        },
        // Semantic theme group - light/dark/high-contrast modes
        {
            id: "semantic-light",
            name: "Light",
            group: "semantic",
            selectedTokenSets: {
                "primitives": "source",
                "semantic/light": "enabled",
                "semantic/dark": "disabled",
                "semantic/high-contrast": "disabled"
            }
        },
        {
            id: "semantic-dark",
            name: "Dark",
            group: "semantic",
            selectedTokenSets: {
                "primitives": "source",
                "semantic/light": "disabled",
                "semantic/dark": "enabled",
                "semantic/high-contrast": "disabled"
            }
        },
        {
            id: "semantic-high-contrast",
            name: "High Contrast",
            group: "semantic",
            selectedTokenSets: {
                "primitives": "source",
                "semantic/light": "disabled",
                "semantic/dark": "disabled",
                "semantic/high-contrast": "enabled"
            }
        },
        // Component theme group - single "Base" theme (inherits from semantic)
        {
            id: "component-base",
            name: "Base",
            group: "component",
            selectedTokenSets: {
                "primitives": "source",
                "components": "enabled"
            }
        }
    ];
}

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

// ========================================
// BUILD FUNCTIONS
// ========================================

async function buildPrimitives() {
    console.log('\n📦 Building primitives...');

    const primitiveFiles = getTokenFiles(primitivesFolder);
    console.log('📦 Primitive token files:', primitiveFiles.length);

    try {
        const sd = new StyleDictionary({
            source: primitiveFiles,
            usesDtcg: true,
            preprocessors: ['slash-to-dot-references'],
            platforms: {
                "css-ccui": {
                    "transformGroup": "ccui/css",
                    "buildPath": `${distFolder}/css/primitives/`,
                    "files": [{
                        "destination": "ccui-primitives.css",
                        "format": "css/ccui-primitives",
                        "options": { "selector": ":root" }
                    }]
                },
                "tokens-studio-primitives": {
                    "transformGroup": "tokens-studio/json",
                    "buildPath": `${distFolder}/tokens-studio/`,
                    "files": [{
                        "destination": "primitives.json",
                        "format": "json/tokens-studio-set"
                    }]
                }
            },
            log: { verbosity: 'verbose' }
        });
        await sd.buildAllPlatforms();
        console.log('✅ Primitives built successfully');
        return true;
    } catch (error) {
        console.error('❌ Error building primitives:', error.message);
        console.error(error.stack);
        return false;
    }
}

async function buildSemanticTheme(themeName) {
    console.log(`\n🔨 Building ${themeName} theme...`);

    const primitiveFiles = getTokenFiles(primitivesFolder);
    const themeFiles = getTokenFiles(`${semanticFolder}/${themeName}`);
    const sourceFiles = [...primitiveFiles, ...themeFiles];

    try {
        const sd = new StyleDictionary({
            source: sourceFiles,
            usesDtcg: true,
            preprocessors: ['slash-to-dot-references'],
            platforms: {
                "css-semantic": {
                    "transformGroup": "ccui/css",
                    "buildPath": `${distFolder}/css/semantic/`,
                    "files": [{
                        "destination": `${themeName}.css`,
                        "format": "css/ccui-semantic",
                        "options": { "selector": getThemeSelector(themeName) },
                        "filter": (token) => SEMANTIC_CATEGORIES.includes(token.path[0])
                    }]
                },
                "tokens-studio-semantic": {
                    "transformGroup": "tokens-studio/json",
                    "buildPath": `${distFolder}/tokens-studio/semantic/`,
                    "files": [{
                        "destination": `${themeName}.json`,
                        "format": "json/tokens-studio-set",
                        "filter": (token) => SEMANTIC_CATEGORIES.includes(token.path[0])
                    }]
                }
            },
            log: { verbosity: 'default' }
        });
        await sd.buildAllPlatforms();
        console.log(`✅ ${themeName} theme built successfully`);
        return true;
    } catch (error) {
        console.error(`❌ Error building ${themeName} theme:`, error.message);
        console.error(error.stack);
        return false;
    }
}

async function buildComponents() {
    console.log('\n📦 Building components...');

    const primitiveFiles = getTokenFiles(primitivesFolder);
    const componentFiles = getTokenFiles(componentFolder);
    const sourceFiles = [...primitiveFiles, ...componentFiles];

    try {
        const sd = new StyleDictionary({
            source: sourceFiles,
            usesDtcg: true,
            preprocessors: ['slash-to-dot-references'],
            platforms: {
                "css-components": {
                    "transformGroup": "ccui/css",
                    "buildPath": `${distFolder}/css/components/`,
                    "files": [{
                        "destination": "ccui-components.css",
                        "format": "css/ccui-components",
                        "options": { "selector": ":root" },
                        "filter": (token) => COMPONENT_CATEGORIES.includes(token.path[0])
                    }]
                },
                "tokens-studio-components": {
                    "transformGroup": "tokens-studio/json",
                    "buildPath": `${distFolder}/tokens-studio/`,
                    "files": [{
                        "destination": "components.json",
                        "format": "json/tokens-studio-set",
                        "filter": (token) => COMPONENT_CATEGORIES.includes(token.path[0])
                    }]
                }
            },
            log: { verbosity: 'default' }
        });
        await sd.buildAllPlatforms();
        console.log('✅ Components built successfully');
        return true;
    } catch (error) {
        console.error('❌ Error building components:', error.message);
        console.error(error.stack);
        return false;
    }
}

async function buildCombinedCSS() {
    console.log('\n📦 Building combined CSS file...');

    const cssDir = `${distFolder}/css`;

    // Read all CSS parts
    const primitives = fs.readFileSync(`${cssDir}/primitives/ccui-primitives.css`, 'utf8');
    const lightTheme = fs.readFileSync(`${cssDir}/semantic/light.css`, 'utf8');
    const darkTheme = fs.readFileSync(`${cssDir}/semantic/dark.css`, 'utf8');
    const highContrastTheme = fs.readFileSync(`${cssDir}/semantic/high-contrast.css`, 'utf8');
    const components = fs.readFileSync(`${cssDir}/components/ccui-components.css`, 'utf8');

    // Transform light theme selectors to include :root fallback
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
 * - Primitives (:root)
 * - Components (:root)
 * - Light theme (default, :root + [data-mantine-color-scheme="light"])
 * - Dark theme ([data-mantine-color-scheme="dark"])
 * - High Contrast theme ([data-mantine-color-scheme="high-contrast"])
 *
 * Usage:
 *   import 'ccui-tokens/css';
 *
 * Theme switching works automatically with Mantine's useMantineColorScheme()
 */

/* ========================================
   PRIMITIVES
   ======================================== */

${primitives}

/* ========================================
   COMPONENTS
   ======================================== */

${components}

/* ========================================
   LIGHT THEME (Default)
   ======================================== */

${transformLightSelector(lightTheme)}

/* ========================================
   DARK THEME
   ======================================== */

${darkTheme}

/* ========================================
   HIGH CONTRAST THEME
   ======================================== */

${highContrastTheme}
`;

    fs.writeFileSync(`${cssDir}/ccui-tokens.css`, combined);

    // Calculate file size
    const stats = fs.statSync(`${cssDir}/ccui-tokens.css`);
    const fileSizeKB = (stats.size / 1024).toFixed(1);

    // Clean up individual CSS folders - only keep the combined file
    fs.rmSync(`${cssDir}/primitives`, { recursive: true, force: true });
    fs.rmSync(`${cssDir}/semantic`, { recursive: true, force: true });
    fs.rmSync(`${cssDir}/components`, { recursive: true, force: true });

    console.log(`✅ Combined CSS file generated: dist/css/ccui-tokens.css (${fileSizeKB}K)`);
    return true;
}

async function buildTokensStudioConfig() {
    console.log('\n📦 Building Tokens Studio configuration...');

    const tokensStudioDir = `${distFolder}/tokens-studio`;
    if (!fs.existsSync(tokensStudioDir)) {
        fs.mkdirSync(tokensStudioDir, { recursive: true });
    }

    fs.writeFileSync(`${tokensStudioDir}/$metadata.json`, JSON.stringify(generateTokensStudioMetadata(), null, 2));
    fs.writeFileSync(`${tokensStudioDir}/$themes.json`, JSON.stringify(generateTokensStudioThemes(), null, 2));

    // Clean up old folder structure (now consolidated into single files)
    const oldDirs = [
        `${tokensStudioDir}/primitives`,
        `${tokensStudioDir}/component`
    ];
    for (const dir of oldDirs) {
        if (fs.existsSync(dir)) {
            fs.rmSync(dir, { recursive: true, force: true });
            console.log(`🧹 Removed legacy folder: ${dir}`);
        }
    }

    console.log('✅ Tokens Studio config built');
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

    // Validate consolidated Tokens Studio files
    const tokensStudioFiles = [
        `${distFolder}/tokens-studio/$metadata.json`,
        `${distFolder}/tokens-studio/$themes.json`,
        `${distFolder}/tokens-studio/primitives.json`,
        `${distFolder}/tokens-studio/semantic/light.json`,
        `${distFolder}/tokens-studio/semantic/dark.json`,
        `${distFolder}/tokens-studio/semantic/high-contrast.json`,
        `${distFolder}/tokens-studio/components.json`
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

async function build() {
    console.log('🚀 CCUI Design Tokens Build');
    console.log('===========================\n');

    // Build primitives first (they're referenced by everything else)
    const primitivesSuccess = await buildPrimitives();
    if (!primitivesSuccess) {
        console.error('❌ Failed to build primitives');
        process.exit(1);
    }

    // Build semantic themes
    for (const theme of THEMES) {
        const success = await buildSemanticTheme(theme);
        if (!success) {
            console.error(`❌ Failed to build ${theme} theme`);
            process.exit(1);
        }
    }

    // Build components
    const componentsSuccess = await buildComponents();
    if (!componentsSuccess) {
        console.error('❌ Failed to build components');
        process.exit(1);
    }

    // Combine CSS files
    await buildCombinedCSS();

    // Build Tokens Studio config
    await buildTokensStudioConfig();

    // Validate
    await validateBuild();

    console.log('\n🎉 Build complete!');
}

await build().catch(console.error);
