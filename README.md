# CCUI Design Tokens

DTCG-compliant design tokens for the ClearCo UI design system.

## Installation

```bash
npm install ccui-tokens
```

The `dist/` folder is automatically generated on install via postinstall hook.

## Usage

### Tokens Studio

Compatible with the [Tokens Studio Figma plugin](https://tokens.studio/):

```
dist/tokens-studio/
├── $metadata.json
├── $themes.json
├── primitives/         # Color, spacing, typography, motion, etc.
├── semantic/           # Theme-specific tokens (5 theme variants)
└── components/         # Component tokens (button, input, modal, etc.)
```

#### Figma Plugin Configuration

CCUI outputs tokens in **W3C DTCG format** (using `$value` and `$type` prefixes). To use these tokens in Figma:

1. Open Tokens Studio in Figma
2. Go to **Settings** (gear icon)
3. Click the format indicator next to your storage provider
4. Select **W3C DTCG** format (not "Legacy")
5. Re-sync tokens from the `dist/tokens-studio/` directory

If tokens appear without proper types in Figma, the plugin is likely set to Legacy format.

#### Testing Tokens with Tokens Studio

Follow these steps to import and test the design tokens in Figma:

**1. Build the tokens**

```bash
npm run build
```

This generates the `dist/tokens-studio/` directory with all token files.

**2. Import tokens into Tokens Studio**

1. Open a Figma file and launch the **Tokens Studio** plugin
2. Click the **Settings** icon (gear)
3. Under **Sync providers**, choose your sync method:
   - **Local**: Click "Load from file/folder" and select the `dist/tokens-studio/` directory
   - **GitHub/GitLab/etc.**: Configure your repository and point to `dist/tokens-studio/`
4. Ensure the format is set to **W3C DTCG** (not Legacy)
5. Click **Sync** or **Pull** to load the tokens

**3. Select a theme**

1. In Tokens Studio, click the **Themes** dropdown (top of the panel)
2. Select a theme to activate:
   - `Mantine Light` / `Mantine Dark`
   - `CCUI 2.1 Light`
   - `CCUI 3.0 Light` / `CCUI 3.0 Dark`
3. The token sets will update to show enabled/disabled status

**4. Export styles to Figma**

1. Click the **Export** button (or **Styles & Variables** in newer versions)
2. In the export dialog, enable the style types to create:
   - **Color Styles** - Creates color styles from `color`, `colorPalette`, `brand` tokens
   - **Text Styles** - Creates text styles from `typography` composite tokens
   - **Effect Styles** - Creates shadow styles from `boxShadow` tokens
3. Click **Export** or **Create styles**

**5. Verify exported styles**

Open Figma's **Styles** panel (right sidebar) to verify:

| Style Type | Expected Groups |
|------------|-----------------|
| Color styles | `color`, `colorPalette`, `componentColors`, `component`, `brand` |
| Text styles | `typography/body`, `typography/heading`, `typography/display`, `typography/label`, etc. |
| Effect styles | `boxShadow` |

**Troubleshooting**

| Issue | Solution |
|-------|----------|
| No text styles created | Ensure `primitives/typography` is set to `enabled` (not `source`) in the theme |
| Tokens show without types | Switch plugin format from "Legacy" to "W3C DTCG" in Settings |
| Missing token references | Check that all primitive token sets are included in the theme |
| Styles not updating | Delete existing styles in Figma and re-export |

## Directory Structure

```
ccui-tokens/
├── src/
│   ├── primitives/     # Primitive tokens (color, spacing, typography, etc.)
│   └── themes/         # Semantic tokens (5 theme variants)
├── dist/               # Generated (not committed)
│   └── tokens-studio/
│       ├── $metadata.json
│       ├── $themes.json
│       ├── primitives/
│       ├── semantic/   # mantine-light, mantine-dark, ccui-21-light,
│       │               # ccui-30-light, ccui-30-dark
│       └── components/
└── scripts/
    └── build.js
```

## Token Format

CCUI uses the Tokens Studio format with `$value` and `$type` prefixes:

```json
{
  "spacing": {
    "md": {
      "$value": "1rem",
      "$type": "spacing",
      "$description": "Medium spacing (16px)"
    }
  }
}
```

### Supported Token Types

| Type | Description | Example |
|------|-------------|---------|
| `color` | Color values | `#3b82f6` |
| `spacing` | Spacing/padding | `1rem`, `16px` |
| `borderRadius` | Corner radii | `0.25rem`, `4px` |
| `fontFamilies` | Font stacks | `'Public Sans', sans-serif` |
| `fontSizes` | Font sizes | `1rem`, `14px` |
| `fontWeights` | Font weights | `400`, `700` |
| `lineHeights` | Line heights | `1.5`, `150%` |
| `letterSpacing` | Letter spacing | `-0.025em` |
| `duration` | Animation duration | `150ms` |
| `cubicBezier` | Easing functions | `[0.4, 0, 0.2, 1]` |
| `shadow` | Box shadows | Composite object |
| `typography` | Text styles | Composite object |
| `opacity` | Opacity values | `50%` |

## Development

```bash
npm run build    # Build all tokens (Tokens Studio JSON)
npm run clean    # Remove dist/
npm run watch    # Rebuild on changes
npm test         # Run tests
```

## License

MIT
