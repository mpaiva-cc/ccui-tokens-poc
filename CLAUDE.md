# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

CCUI Design Tokens is a DTCG-compliant design token system for the ClearCo UI design system. It outputs Tokens Studio-compatible JSON using Style Dictionary v4.

## Requirements

- **Node.js 22** - Always use Node 22 for this project (`nvm use 22`)

## Commands

```bash
npm run build      # Build all tokens (Tokens Studio JSON)
npm run clean      # Remove dist/
npm run watch      # Rebuild on changes (nodemon)
npm test           # Run vitest tests
npm run test:watch # Run tests in watch mode
```

## Architecture

### Token Sources (src/)

```
src/
├── primitives/         # Primitive tokens (theme-agnostic)
│   ├── border/         # Border width, style
│   ├── color/          # Color palette
│   ├── components/     # Button, input, modal tokens
│   ├── dimension/      # Spacing, radius, breakpoints, sizing
│   ├── elevation/      # Shadow primitives
│   ├── interaction/    # z-index, focus
│   ├── motion/         # Duration, easing
│   ├── system/         # System tokens (scale, cursor, font smoothing)
│   ├── typography/     # Font families, sizes, weights, headings
│   └── visibility/     # Opacity
└── themes/
    ├── base/           # Shared semantic foundations
    ├── mantine-light/  # Vanilla Mantine light theme
    ├── mantine-dark/   # Vanilla Mantine dark theme
    ├── ccui-21-light/  # CCUI 2.1 brand theme
    ├── ccui-30-light/  # CCUI 3.0 rebranding light
    └── ccui-30-dark/   # CCUI 3.0 rebranding dark
```

### Build Output (dist/)

```
dist/
└── tokens-studio/
    ├── $metadata.json    # Tokens Studio config
    ├── $themes.json      # Theme definitions (5 themes)
    ├── primitives/       # Primitive token sets
    ├── semantic/         # mantine-light.json, mantine-dark.json,
    │                     # ccui-21-light.json, ccui-30-light.json,
    │                     # ccui-30-dark.json
    └── components/       # Component token sets
```

### Build System (scripts/build.js)

The build uses Style Dictionary with custom transforms and formats:

- **Output**: Tokens Studio JSON with DTCG-compatible type mapping
- **Formats**: Separate formats for shared primitives vs theme-specific semantic tokens
- **Token Categories**:
  - Shared primitives: spacing, radius, typography, motion, breakpoints, z-index, border, focus, sizing, components
  - Theme-specific: color, colorPalette, shadow, opacity
- **Type Mapping**: DTCG types are mapped to Tokens Studio types during build (e.g., `dimension` to `spacing`, `fontFamily` to `fontFamilies`)

### Test Suite (scripts/tests/)

Tests run against built output in `dist/`. Key test files:
- `build-output.test.ts` - Validates all expected files exist with valid syntax
- `token-references.test.ts` - Validates token references resolve
- `theme-consistency.test.ts` - Ensures themes have matching tokens
- `token-count.test.ts` - Verifies expected token counts per file
- `semantic-naming.test.ts` - Validates semantic token naming conventions
- `token-values.test.ts` - Checks token values are well-formed
- `token-descriptions.test.ts` - Ensures tokens have descriptions
- `token-deprecation.test.ts` - Validates deprecation metadata

Shared utilities in `test-utils.ts` provide token parsing and validation helpers.

## Token File Format

Uses DTCG (Design Token Community Group) format with `$value` and `$type`:

```json
{
  "spacing": {
    "xs": {
      "$value": "0.25rem",
      "$type": "dimension"
    }
  }
}
```

Tokens can reference other tokens using `{category.path.name}` syntax.

## Theme Variants

Five theme variants are available as Tokens Studio token sets:
- **Mantine Light / Dark** - Vanilla Mantine themes
- **CCUI 2.1 Light** - ClearCo legacy brand theme
- **CCUI 3.0 Light / Dark** - ClearCo rebrand themes

Each theme is a separate semantic JSON file that can be activated in the Tokens Studio Figma plugin.

## Claude Code Tooling

This project includes Claude Code agents, skills, and memory files for AI-assisted token development. See [`.claude/README.md`](.claude/README.md) for setup instructions and documentation.
