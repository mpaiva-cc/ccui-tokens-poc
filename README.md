# CCUI Design Tokens

DTCG-compliant design tokens for the ClearCo UI design system.

## Installation

```bash
npm install ccui-tokens
```

The `dist/` folder is automatically generated on install via postinstall hook.

## Output Formats

### CSS Variables

```css
/* Import shared primitives (once, at root) */
@import 'ccui-tokens/css/shared/ccui-primitives.css';
@import 'ccui-tokens/css/shared/mantine-primitives.css';

/* Import theme-specific tokens */
@import 'ccui-tokens/css/clearco-light/ccui-semantic.css';
@import 'ccui-tokens/css/clearco-light/mantine-theme.css';
```

### Tokens Studio

Compatible with the [Tokens Studio Figma plugin](https://tokens.studio/):

```
dist/tokens-studio/
├── $metadata.json
├── $themes.json
├── core/
├── semantic/
└── components/
```

## Directory Structure

```
ccui-tokens/
├── src/
│   ├── core/           # Primitive tokens
│   └── themes/         # Semantic tokens
├── dist/               # Generated (not committed)
│   ├── css/
│   │   ├── shared/
│   │   │   ├── ccui-primitives.css
│   │   │   └── mantine-primitives.css
│   │   └── {theme}/
│   │       ├── ccui-semantic.css
│   │       └── mantine-theme.css
│   └── tokens-studio/
│       ├── $metadata.json
│       ├── $themes.json
│       ├── core/
│       ├── semantic/
│       └── components/
└── scripts/
    └── build.js
```

## Development

```bash
npm run build    # Build all tokens
npm run clean    # Remove dist/
npm run watch    # Rebuild on changes
```

## License

MIT
