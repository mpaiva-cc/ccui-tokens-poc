# Semantic Token Spec Reference

**Source:** `/Users/mp/Downloads/Semantic-token-spec.md`
**Version:** 1.0

## Naming Pattern

`[category].[concept].[property].[variant].[state].[scale]`

| Level | Purpose | Required | Values |
|-------|---------|----------|--------|
| Category | Token type | Yes | `color`, `typography`, `spacing`, `sizing`, `border`, `effect`, `opacity` |
| Concept | Usage context | Conditional | `action`, `feedback` |
| Property | CSS attribute | Yes | `bg`, `text`, `icon`, `border` |
| Variant | Style variation | Conditional | `primary`, `secondary`, `subtle`, `success`, `error`, `warning`, `info` |
| State | Interaction | For interactive | `default`, `hover`, `active`, `focus`, `disabled`, `selected` |
| Scale | Size | For sized | `0-9` |

## Complete Token Tree

```
color
├── text: default, secondary, placeholder, disabled, inverse, anchor, bright, error, success, warning, info
├── bg
│   ├── surface: default, body, elevated, muted
│   ├── interactive: default, hover, active, selected, disabled
│   └── status: error, success, warning, info
├── border
│   ├── surface: default, subtle, strong
│   ├── interactive: default, hover, focus, disabled
│   └── status: error, success, warning, info
├── focus: ring
├── action
│   ├── bg
│   │   ├── primary: default, hover, active, disabled
│   │   └── subtle: default, hover
│   ├── text
│   │   ├── primary: default
│   │   └── subtle: default
│   └── border
│       └── primary: default, hover
├── feedback
│   ├── bg: error, success, warning, info
│   ├── text: error, success, warning, info
│   ├── border: error, success, warning, info
│   └── icon: error, success, warning, info
└── primary: 0-9 scale
```

## Key Naming Choices

- `color.text.anchor` (not `link`)
- `color.bg.surface.body` (not `canvas`)
- `color.action.bg.subtle.*` (not `light` or `primaryLight`)
- `color.action.text.primary.default` (nested with `.default`, not flat)
- `color.action.text.subtle.default` (nested)
- `color.bg.status.*` — separate from `color.feedback.bg.*` (both exist)
- `color.border.status.*` — separate from `color.feedback.border.*` (both exist)
- `color.primary.{0-9}` — numeric scale only (no `filled`, `light`, `contrast` variants)
- No `color.text.onDefault` or `color.text.selected`
- No `color.text.link` (use `anchor`)
- No `color.focus.glow` (only `ring`)
- No `color.overlay.*`
- No `color.action.text.onSurface`
- No `color.primary.filled/light/contrast` variants

## Total: 72 Semantic Color Tokens

| Category | Count |
|----------|-------|
| color.text.* | 11 |
| color.bg.surface.* | 4 |
| color.bg.interactive.* | 5 |
| color.bg.status.* | 4 |
| color.border.surface.* | 3 |
| color.border.interactive.* | 4 |
| color.border.status.* | 4 |
| color.focus.* | 1 |
| color.action.* | 10 |
| color.feedback.* | 16 |
| color.primary.* | 10 |
