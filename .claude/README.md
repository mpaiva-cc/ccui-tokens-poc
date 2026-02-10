# Claude Code Tooling for CCUI Tokens

This directory contains all the Claude Code tooling needed to work on CCUI Design Tokens. It provides project context, specialized agents, skills, and pre-configured settings so new developers can be productive immediately.

## What is Claude Code?

Claude Code is Anthropic's CLI tool for AI-assisted software development. It reads project instructions, remembers context across sessions, and can be extended with specialized agents and skills.

- Install: `npm install -g @anthropic-ai/claude-code`
- Docs: https://docs.anthropic.com/en/docs/claude-code

## Project Setup

1. Clone this repo and install dependencies:

```bash
git clone <repo-url>
cd ccui-tokens-poc
nvm use 22
npm install
```

2. Open the project with Claude Code:

```bash
cd ccui-tokens-poc
claude
```

Claude Code automatically reads `CLAUDE.md` at the project root for instructions. No additional setup is needed to start working.

## Project Instructions (`CLAUDE.md`)

The root `CLAUDE.md` file tells Claude Code about the project: architecture, commands, token format, and conventions. Claude loads it automatically every session. Keep it up to date when the project changes.

## Settings (`.claude/settings.local.json`)

Pre-approved permissions for common operations so Claude Code won't prompt you every time:

- **Build/test commands**: `npm run build`, `npm test`, `npm run clean`
- **Node version management**: `nvm use`, `node --version`
- **Web searches**: enabled for research tasks
- **Reference domains**: mantine.dev, tokens.studio, designtokens.org, and other design system resources

This file is local and not committed (it may contain user-specific paths). If you need to recreate it, run common commands once and approve them when prompted.

## Memory System (`.claude/memory/`)

Memory files provide persistent project knowledge that Claude loads automatically each session:

| File | Purpose |
|------|---------|
| `MEMORY.md` | Environment setup, architecture, token format, Tokens Studio type mappings, key learnings |
| `semantic-token-spec.md` | Complete semantic token naming spec (v1.0) with the full token tree and naming conventions |

### Updating Memory

Memory files are regular Markdown. Edit them directly when:
- You discover something important about the project (gotchas, conventions)
- Architecture changes (new token categories, build changes)
- Key decisions are made that future sessions should know about

Claude Code also updates these files automatically when it learns something new. Keep `MEMORY.md` under 200 lines (it's loaded into every session).

## Agents (`.claude/agents/`)

Agents are specialized AI personas with deep expertise in specific domains. They're used via the Task tool within Claude Code sessions.

### Installation

Copy the agents to your global Claude Code directory:

```bash
cp -r .claude/agents/design-systems/ ~/.claude/agents/design-systems/
```

### Available Agents

| Agent | File | Purpose |
|-------|------|---------|
| Token Architect | `ds-token-architect.md` | Token system architecture, naming conventions, hierarchy design, multi-platform strategies |
| Token Operator | `ds-token-operator.md` | Day-to-day token ops: DTCG validation, accessibility checks, usage analysis, lifecycle management |
| A11y Specialist | `ds-a11y-specialist.md` | Baking accessibility into components from the ground up, ARIA patterns, inclusive APIs |
| A11y Validator | `ds-a11y-validator.md` | Automated accessibility testing, WCAG conformance validation, AT compatibility testing |
| Brand Guardian | `ds-brand-guardian.md` | Brand consistency enforcement, visual identity systems, cross-platform harmonization |
| Component Architect | `ds-component-architect.md` | Component API design, composition patterns, state management, type-safe architectures |
| CSS Architect | `ds-css-architect.md` | CSS architecture, design token implementation, theming solutions, specificity management |
| Documentation Curator | `ds-documentation-curator.md` | Design system documentation, interactive examples, onboarding guides |
| Frontend Engineer | `ds-frontend-engineer.md` | Translating design specs into production-ready code, performance optimization |
| React Specialist | `ds-react-specialist.md` | React-specific DS patterns: compound components, hooks, performance, SSR |
| Systems Architect | `ds-systems-architect.md` | Overall design system architecture, governance, cross-platform strategy |

### Token Work: Architect vs Operator

- Use **Token Architect** for strategic decisions: designing token hierarchies, establishing naming conventions, planning multi-theme support
- Use **Token Operator** for execution: validating DTCG compliance, checking accessibility, analyzing usage, managing deprecation

## Skills (`.claude/skills/`)

Skills are knowledge bundles that give Claude Code specialized expertise. They're invoked with slash commands (e.g., `/design-tokens-architect`).

### Installation

Copy the skill files to your global Claude Code directory:

```bash
cp .claude/skills/*.skill ~/.claude/
```

### Available Skills

| Skill | File | Slash Command | Purpose |
|-------|------|---------------|---------|
| Design Tokens Architect | `design-tokens-architect.skill` | `/design-tokens-architect` | Token system architecture, DTCG compliance, Style Dictionary transforms |
| Mantine Expert | `mantine-expert.skill` | `/mantine-expert` | Mantine UI v7/v8 components, theming, Styles API, hooks |
| ClearCo UI | `clearco-ui.skill` | `/clearco-ui` | ClearCo component library, ThemeProvider, design tokens integration |
| Accessibility Specialist | `accessibility-specialist.skill` | `/accessibility-specialist` | WCAG 2.1/2.2 compliance, ARIA patterns, assistive technology testing |
| Plain Language Editor | `plain-language-editor.skill` | `/plain-language-editor` | UI content writing, 6th-8th grade reading level, microcopy |
| Storybook Master | `storybook-master.skill` | `/storybook-master` | Storybook configuration, CSF3 stories, MDX docs, visual testing |

## Key Workflows

### Creating New Component Tokens

1. Add primitive values in `src/primitives/components/`
2. Add semantic references in `src/themes/base/` (shared) or theme-specific directories
3. Build: `npm run build`
4. Test: `npm test`
5. Use the **Token Operator** agent to validate DTCG compliance

### Validating DTCG Compliance

```
Use the Token Operator agent: "Validate all tokens for DTCG compliance"
```

Or run the test suite directly:

```bash
npm test
```

The test suite (8 files, 187+ tests) validates build output, token references, theme consistency, naming conventions, values, descriptions, and deprecation metadata.

### Running Builds and Tests

```bash
nvm use 22          # Required: Node 22
npm run build       # Build all tokens (Tokens Studio JSON)
npm test            # Run vitest test suite
npm run test:watch  # Watch mode for development
npm run watch       # Rebuild on file changes
```

### Adding a New Theme

1. Create a new directory under `src/themes/` (e.g., `src/themes/my-brand-light/`)
2. Add semantic token files referencing primitives
3. Update `scripts/build.js` to include the new theme in the build
4. Run build and tests to validate

### Using Skills for Token Work

```bash
# Get architecture guidance
/design-tokens-architect

# Validate accessibility of color tokens
/accessibility-specialist

# Write clear token descriptions
/plain-language-editor
```
