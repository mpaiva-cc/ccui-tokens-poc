/**
 * OKLCH Color Palette Generator
 *
 * Generates perceptually uniform color scales using OKLCH color space.
 * Chroma values are accessibility-validated to ensure:
 * - Shade 6+ achieves 4.5:1 contrast ratio against white (WCAG AA)
 * - Shade 5+ achieves 3:1 contrast for UI components
 * - All colors stay within sRGB gamut
 *
 * Usage: node generate-palette.js
 * Output: Writes to ../core/color/palette.tokens.json
 */

import Color from 'colorjs.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lightness scale: 0 = lightest (97%), 9 = darkest (25%)
// 8% uniform steps for perceptual consistency
const LIGHTNESS_SCALE = [97, 89, 81, 73, 65, 57, 49, 41, 33, 25];

/**
 * Color definitions with accessibility-validated chroma values
 *
 * Each color has:
 * - h: Hue angle (0-360)
 * - maxC: Maximum chroma (at peak shade)
 * - peakShade: Where chroma peaks (typically 4-6)
 * - chromaByShade: Explicit chroma values for each shade (0-9)
 *
 * Chroma values validated by pd-accessibility-designer agent for:
 * - WCAG AA contrast compliance
 * - sRGB gamut containment
 * - Visual vibrancy balance
 */
const COLOR_DEFINITIONS = {
    // Neutrals - very low chroma, flat curve
    gray: {
        h: 260, // Cool gray tint
        chromaByShade: [0.005, 0.008, 0.010, 0.012, 0.012, 0.012, 0.010, 0.010, 0.008, 0.005],
    },
    dark: {
        h: 280, // Warm dark tint
        chromaByShade: [0.008, 0.012, 0.015, 0.018, 0.018, 0.018, 0.015, 0.015, 0.012, 0.010],
    },

    // High-contrast colors - can support higher chroma
    blue: {
        h: 250,
        chromaByShade: [0.03, 0.06, 0.10, 0.14, 0.17, 0.18, 0.17, 0.14, 0.11, 0.08],
    },
    indigo: {
        h: 270,
        chromaByShade: [0.03, 0.06, 0.09, 0.13, 0.15, 0.16, 0.15, 0.13, 0.10, 0.07],
    },
    violet: {
        h: 290,
        chromaByShade: [0.04, 0.08, 0.12, 0.16, 0.18, 0.19, 0.17, 0.14, 0.11, 0.08],
    },
    grape: {
        h: 310,
        chromaByShade: [0.04, 0.08, 0.12, 0.15, 0.17, 0.18, 0.16, 0.13, 0.10, 0.07],
    },

    // Medium-contrast colors
    red: {
        h: 27,
        chromaByShade: [0.03, 0.07, 0.11, 0.15, 0.17, 0.18, 0.16, 0.13, 0.10, 0.07],
    },
    pink: {
        h: 350,
        chromaByShade: [0.03, 0.07, 0.10, 0.13, 0.15, 0.16, 0.14, 0.12, 0.09, 0.06],
    },
    cyan: {
        h: 200,
        chromaByShade: [0.02, 0.05, 0.08, 0.10, 0.11, 0.12, 0.11, 0.09, 0.07, 0.05],
    },
    teal: {
        h: 180,
        chromaByShade: [0.02, 0.04, 0.07, 0.09, 0.10, 0.11, 0.10, 0.08, 0.06, 0.04],
    },

    // Problematic colors - constrained chroma for accessibility
    orange: {
        h: 55,
        chromaByShade: [0.03, 0.07, 0.11, 0.14, 0.16, 0.15, 0.13, 0.11, 0.08, 0.06],
    },
    yellow: {
        h: 95,
        // Yellow requires very low chroma for contrast - use dark text on shade 6
        chromaByShade: [0.03, 0.06, 0.09, 0.11, 0.11, 0.10, 0.08, 0.07, 0.06, 0.04],
    },
    lime: {
        h: 130,
        chromaByShade: [0.03, 0.06, 0.10, 0.13, 0.14, 0.13, 0.11, 0.09, 0.07, 0.05],
    },
    green: {
        h: 145,
        chromaByShade: [0.03, 0.07, 0.11, 0.14, 0.15, 0.14, 0.13, 0.11, 0.08, 0.06],
    },
};

/**
 * Generate OKLCH color string
 */
function toOklch(lightness, chroma, hue) {
    return `oklch(${lightness}% ${chroma.toFixed(3)} ${hue})`;
}

/**
 * Convert OKLCH to hex (for validation)
 */
function oklchToHex(oklchString) {
    try {
        const color = new Color(oklchString);
        // Clamp to sRGB gamut
        if (!color.inGamut('srgb')) {
            color.toGamut('srgb');
        }
        return color.to('srgb').toString({ format: 'hex' });
    } catch (e) {
        console.error(`Error converting ${oklchString}:`, e.message);
        return null;
    }
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1, color2) {
    const c1 = new Color(color1);
    const c2 = new Color(color2);
    return c1.contrast(c2, 'WCAG21');
}

/**
 * Generate a complete color scale
 */
function generateColorScale(colorName, definition) {
    const scale = {};

    for (let shade = 0; shade <= 9; shade++) {
        const lightness = LIGHTNESS_SCALE[shade];
        const chroma = definition.chromaByShade[shade];
        const hue = definition.h;

        const oklchValue = toOklch(lightness, chroma, hue);

        scale[shade] = {
            $value: oklchValue,
        };

        // Add descriptions for key shades
        if (shade === 0) {
            scale[shade].$description = `${colorName} ${shade} - lightest`;
        } else if (shade === 6) {
            scale[shade].$description = `${colorName} ${shade} - primary`;
        } else if (shade === 9) {
            scale[shade].$description = `${colorName} ${shade} - darkest`;
        }
    }

    return scale;
}

/**
 * Validate color scale for accessibility
 */
function validateColorScale(colorName, scale) {
    const white = new Color('#ffffff');
    const issues = [];

    for (let shade = 5; shade <= 9; shade++) {
        const oklchValue = scale[shade].$value;
        const color = new Color(oklchValue);

        // Check sRGB gamut
        if (!color.inGamut('srgb')) {
            issues.push(`Shade ${shade}: Out of sRGB gamut`);
        }

        // Check contrast
        const contrast = color.contrast(white, 'WCAG21');

        if (shade === 5 && contrast < 3) {
            issues.push(`Shade ${shade}: Contrast ${contrast.toFixed(2)} < 3:1 (UI components)`);
        }
        if (shade >= 6 && contrast < 4.5) {
            issues.push(`Shade ${shade}: Contrast ${contrast.toFixed(2)} < 4.5:1 (text)`);
        }
    }

    return issues;
}

/**
 * Generate the complete palette tokens
 */
function generatePaletteTokens() {
    const palette = {
        color: {
            $type: 'color',
            $description: 'Core color palette using OKLCH color space for perceptually uniform scales',
        },
    };

    // Generate each color scale
    for (const [colorName, definition] of Object.entries(COLOR_DEFINITIONS)) {
        palette.color[colorName] = generateColorScale(colorName, definition);
    }

    // Add special colors
    palette.color.white = {
        $value: 'oklch(100% 0 0)',
        $description: 'Pure white',
    };
    palette.color.black = {
        $value: 'oklch(0% 0 0)',
        $description: 'Pure black',
    };
    palette.color.transparent = {
        $value: 'transparent',
        $description: 'Fully transparent',
    };

    return palette;
}

/**
 * Validate all color scales
 */
function validatePalette(palette) {
    console.log('\n=== Accessibility Validation ===\n');

    let hasIssues = false;

    for (const [colorName, definition] of Object.entries(COLOR_DEFINITIONS)) {
        const scale = palette.color[colorName];
        const issues = validateColorScale(colorName, scale);

        if (issues.length > 0) {
            hasIssues = true;
            console.log(`${colorName.toUpperCase()}:`);
            issues.forEach((issue) => console.log(`  - ${issue}`));
        }
    }

    if (!hasIssues) {
        console.log('All colors pass accessibility validation!');
    }

    return !hasIssues;
}

/**
 * Print color preview with hex values
 */
function printColorPreview(palette) {
    console.log('\n=== Color Preview (OKLCH -> Hex) ===\n');

    for (const [colorName, definition] of Object.entries(COLOR_DEFINITIONS)) {
        const scale = palette.color[colorName];
        const hexValues = [];

        for (let shade = 0; shade <= 9; shade++) {
            const hex = oklchToHex(scale[shade].$value);
            hexValues.push(hex);
        }

        console.log(`${colorName.padEnd(8)}: ${hexValues.join(' ')}`);
    }
}

/**
 * Main execution
 */
function main() {
    console.log('Generating OKLCH color palette...\n');

    const palette = generatePaletteTokens();

    // Validate
    const isValid = validatePalette(palette);

    // Print preview
    printColorPreview(palette);

    // Write output
    const outputPath = path.join(__dirname, '../core/color/palette.tokens.json');
    fs.writeFileSync(outputPath, JSON.stringify(palette, null, 4));

    console.log(`\nWritten to: ${outputPath}`);

    if (!isValid) {
        console.log('\nWarning: Some colors have accessibility issues. Review and adjust chroma values.');
        process.exit(1);
    }

    console.log('\nPalette generation complete!');
}

main();
