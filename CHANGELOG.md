# Changelog

## [1.1.0] - 2026-02-07

### Removed
- CSS output (`dist/css/`) - project now outputs Tokens Studio JSON only
- CSS custom properties and Mantine CSS variable prefixes
- CSS-related tests (`color-contrast.test.ts`, `mantine-theme.test.ts`)

### Added
- Multi-theme support: Mantine Light/Dark, CCUI 2.1 Light, CCUI 3.0 Light/Dark
- New test coverage: `token-count`, `semantic-naming`, `token-values`, `token-descriptions`, `token-deprecation`

### Changed
- Build pipeline outputs only `dist/tokens-studio/` (no more `dist/css/`)
- Semantic tokens now have 5 theme variants instead of 2

## [1.0.0] - 2026-02-04

### Added
- Initial release extracted from clearco-ui repository
- CSS output with CCUI and Mantine variable prefixes
- Tokens Studio compatible output for Figma integration
- Postinstall build hook for seamless npm consumption

### Output Formats
- `dist/css/` - CSS custom properties
- `dist/tokens-studio/` - Tokens Studio plugin format
