# Contributing to CSS Noop Checker

Thank you for your interest in contributing! The most common contribution is adding a new detection rule.

## Getting Started

### Prerequisites

- [Node.js 24](https://nodejs.org/) (managed via [mise](https://mise.jdx.dev/) — see `.mise.toml`)
- [pnpm 10](https://pnpm.io/)

### Setup

```bash
git clone https://github.com/purupurupu/css-noop-checker.git
cd css-noop-checker
pnpm install
pnpm build
```

To run browser integration tests, install Playwright's Chromium:

```bash
pnpm exec playwright install chromium
```

Verify everything works:

```bash
pnpm test        # unit tests
pnpm test:e2e    # browser integration tests
```

## Adding a New Rule

This is the most common type of contribution. Follow these steps:

### 1. Create the rule file

Add `src/rules/<target>-no-<qualifier>.ts`. The filename **is** the rule ID.

Rule IDs follow Stylelint's `thing-no-qualifier` convention (e.g. `inline-no-dimensions`, `container-no-gap`).

```ts
import type { RuleContext, Warning } from './types.ts';
import { registerRule } from './registry.ts';

registerRule({
  id: '<target>-no-<qualifier>',
  label: '<short human-readable description>',
  requiredProperties: ['<css-prop-1>', '<css-prop-2>'],
  // requiredParentProperties: [],  // optional, if parent styles are needed
  check(ctx: RuleContext): Warning[] {
    // Return warnings for properties that have no effect
    return [];
  },
});
```

### 2. Register in engine.ts

Add a side-effect import at the top of `src/rules/engine.ts` (keep alphabetical order):

```ts
import './<target>-no-<qualifier>.ts';
```

### 3. Add test cases to `examples/test.html`

Add both "should warn" and "should NOT warn" cases. Sections are ordered alphabetically by rule ID.

```html
<!-- should warn -->
<div class="case expect-warn" data-rule="<rule-id>">
  <div class="label label-warn"><rule-id> warn: description</div>
  <div data-target style="...">example</div>
</div>

<!-- should NOT warn -->
<div class="case expect-ok" data-rule="<rule-id>">
  <div class="label label-ok"><rule-id> ok: description</div>
  <div data-target style="...">example</div>
</div>
```

### 4. Run tests

```bash
pnpm test          # unit tests
pnpm test:e2e      # browser integration tests
```

No changes to the extraction layer are needed — both the extension and MCP server dynamically read `registry.ts` for required CSS properties.

## Project Structure

```
src/
  rules/           Detection rules + engine, registry, context, types
  sidebar/         DevTools sidebar React UI
  devtools.ts      Extension entrypoint — creates the sidebar pane
e2e/
  helpers/         Playwright extraction helpers (shared with MCP server)
  integration/     Browser integration tests against examples/test.html
mcp-server/        Standalone MCP server (separate package.json, pnpm workspace)
examples/
  test.html        Test cases for all rules — used by both manual testing and e2e
public/
  manifest.json    Chrome extension manifest (MV3)
```

## Code Style

- ESM modules, `import type` for type-only imports (`verbatimModuleSyntax`)
- **No barrel exports** — import directly from source modules
- File names use kebab-case (e.g. `static-no-offset.ts`)
- Tests follow `*.test.ts` / `*.test.tsx` naming, colocated in `__tests__/` directories
- Format with Oxfmt (`singleQuote`, trailing commas, `printWidth: 100`)

## Commit & PR Guidelines

- Format: `<type>: <why-focused message>` — types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
- One logical change per commit
- PR title: under 70 chars, format `<type>: <concise description>`
- PR body: `## Summary` (bullet points) + `## Test plan` (checklist)
- Write everything in English

## Pre-PR Checklist

```bash
pnpm fmt            # format
pnpm lint           # lint
pnpm build          # type-check + build
pnpm test           # unit tests
pnpm test:e2e       # integration tests
```

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.
