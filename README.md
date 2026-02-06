# CCUI Design Tokens

DTCG-compliant design tokens for the ClearCo UI design system.

## Installation

```bash
npm install ccui-tokens
```

The `dist/` folder is automatically generated on install via postinstall hook.

## Usage

### CSS Variables

Import the single CSS file containing all tokens and themes:

```tsx
import 'ccui-tokens/css';
```

This includes:
- Shared primitives (`:root`)
- Light theme as default (`:root` + `[data-mantine-color-scheme="light"]`)
- Dark theme (`[data-mantine-color-scheme="dark"]`)

Theme switching works automatically with Mantine:

```tsx
import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import 'ccui-tokens/css';

function App() {
  return (
    <MantineProvider defaultColorScheme="light">
      <YourApp />
    </MantineProvider>
  );
}

function ThemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  return <button onClick={toggleColorScheme}>Toggle Theme</button>;
}
```

### Tokens Studio

Compatible with the [Tokens Studio Figma plugin](https://tokens.studio/):

```
dist/tokens-studio/
├── $metadata.json
├── $themes.json
├── primitives/         # Color, spacing, typography, motion, etc.
├── semantic/           # Theme-specific tokens (light/dark variants)
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

## Directory Structure

```
ccui-tokens/
├── src/
│   ├── primitives/     # Primitive tokens (color, spacing, typography, etc.)
│   └── themes/         # Semantic tokens (light/dark theme variants)
├── dist/               # Generated (not committed)
│   ├── css/
│   │   └── ccui-tokens.css
│   └── tokens-studio/
│       ├── $metadata.json
│       ├── $themes.json
│       ├── primitives/
│       ├── semantic/
│       └── components/
└── scripts/
    └── build.js
```

## Token Format

CCUI uses the [W3C Design Tokens Community Group (DTCG)](https://www.designtokens.org/) format:

```json
{
  "spacing": {
    "md": {
      "$value": "1rem",
      "$type": "dimension",
      "$description": "Medium spacing (16px)"
    }
  }
}
```

### Supported Token Types

| Type | Description | Example |
|------|-------------|---------|
| `color` | Color values | `#3b82f6` |
| `dimension` | Sizes with units | `1rem`, `16px` |
| `fontFamily` | Font stacks | `'Public Sans', sans-serif` |
| `fontWeight` | Numeric weights | `400`, `700` |
| `number` | Unitless values | `1.5` (line-height) |
| `duration` | Time values | `150ms` |
| `cubicBezier` | Easing functions | `[0.4, 0, 0.2, 1]` |
| `shadow` | Box shadows | Composite object |
| `typography` | Text styles | Composite object |
| `strokeStyle` | Border styles | `solid`, `dashed` |

## Development

```bash
npm run build    # Build all tokens
npm run clean    # Remove dist/
npm run watch    # Rebuild on changes
npm test         # Run tests
```

## License

MIT
