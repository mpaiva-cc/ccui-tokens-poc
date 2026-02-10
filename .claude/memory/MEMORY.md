# CCUI Tokens POC - Project Memory

## Environment

- **Node.js 22 required** - Always use `nvm use 22` before running commands
- Build/test will fail with ERR_REQUIRE_ESM on older Node versions

## Architecture

### Source Structure
```
src/
├── primitives/     # Raw values (color, spacing, typography, motion, etc.)
└── themes/         # Semantic tokens (5 theme variants)
    ├── base/           # Shared semantic foundations
    ├── mantine-light/  # Vanilla Mantine light
    ├── mantine-dark/   # Vanilla Mantine dark
    ├── ccui-21-light/  # CCUI 2.1 brand
    ├── ccui-30-light/  # CCUI 3.0 light
    └── ccui-30-dark/   # CCUI 3.0 dark
```

### Build Output
```
dist/
└── tokens-studio/
    ├── $metadata.json            # Token set ordering
    ├── $themes.json              # Theme configurations
    ├── primitives/               # Primitive token sets
    ├── semantic/                 # 5 theme-specific JSON files
    └── components/               # Component token sets
```
**Note:** CSS output was removed in v1.1.0. Output is Tokens Studio JSON only.

## Token Format

CCUI outputs **Tokens Studio format** (using `$value` and `$type` prefixes).

**Important:** Tokens Studio types differ from W3C DTCG spec:
- `fontFamilies` (plural, not `fontFamily`)
- `fontWeights` (plural, not `fontWeight`)
- `fontSizes` (not `dimension`)
- `lineHeights` (not `number`)
- `spacing` (not `dimension`)
- `borderRadius` (not `dimension`)
- `boxShadow` - must be under "Box Shadow" group in Tokens Studio UI

### boxShadow Format
Shadows use array format for Tokens Studio compatibility:
```json
"boxShadow": {
  "md": {
    "$value": [
      { "x": "0", "y": "1rem", "blur": "1.5rem", "spread": "0", "color": "rgba(0,0,0,0.1)", "type": "dropShadow" }
    ],
    "$type": "boxShadow"
  }
}
```
- Use `type: "innerShadow"` for inset shadows
- Build transforms arrays to CSS `box-shadow` syntax

**Tokens Studio plugin must be set to "W3C DTCG" format** (not Legacy):
1. Open Tokens Studio in Figma
2. Settings → Click format indicator next to storage provider
3. Select W3C DTCG format

## Semantic Token Spec (v2.0)

See [semantic-token-spec.md](semantic-token-spec.md) for full reference.
- **Source file:** `/Users/mp/Downloads/Semantic-token-spec.md`
- **Pattern:** `[category].[concept].[property].[variant].[state].[scale]`
- Key naming (v2.0): `link` (not `anchor`), `canvas` (not `body`), `light` (not `subtle`), `onDefault`
- Primary uses variant structure (`filled`, `light`, `contrast`) not `primary.{0-9}` numeric scale
- `bg.status.*` and `border.status.*` removed (use `feedback.bg/border` instead)
- 67 total semantic color tokens

## Key Learnings

- Token references use curly braces: `{spacing.md}`, `{color.blue.500}`
- Easing values in Tokens Studio are arrays `[0, 0, 1, 1]`, not strings
- Semantic tokens contain references resolved during build
- CSS output pipeline was removed in v1.1.0; only Tokens Studio JSON remains
- 8 test files, 187 tests total (all against dist/ output)
