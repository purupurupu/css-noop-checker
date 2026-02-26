# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

css-noop-checker is a Chrome DevTools extension (Manifest V3) that detects "no-op" CSS properties on the selected element. Built with React 19, TypeScript 5.9, and Vite 7.

## Commands

- `pnpm dev` — Watch-mode build (`vite build --watch`)
- `pnpm build` — Type-check with `tsc -b` then bundle with Vite
- `pnpm lint` — Lint with Oxlint
- `pnpm fmt` — Format with Oxfmt
- `pnpm fmt:check` — Check formatting without writing
- `pnpm test` — Run tests with Vitest
- `pnpm test:watch` — Run tests in watch mode

Package manager is **pnpm** (not npm/yarn).

## Tech Stack

- **Build**: Vite 7 + SWC via `@vitejs/plugin-react-swc`
- **Framework**: React 19 (`react-jsx` transform)
- **Language**: TypeScript 5.9 (strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`)
- **Linting**: Oxlint (`.oxlintrc.json`) — plugins: typescript, react
- **Formatting**: Oxfmt (`.oxfmtrc.jsonc`) — singleQuote, trailingComma all, printWidth 100
- **Testing**: Vitest 4 (`vitest.config.ts`, separate from `vite.config.ts`)

## Architecture

Chrome DevTools extension with two entry points (multi-page Vite build):

- `devtools.html` → `src/devtools.ts` — Creates "CSS Noop" sidebar pane in Elements tab
- `sidebar.html` → `src/sidebar/main.tsx` — React app rendered inside the sidebar pane

### Rules Engine (`src/rules/`)

Pure-function rules with zero Chrome API dependency — fully testable:

- `types.ts` — `ElementData`, `Warning`, `Rule`, `RuleContext`, `RuleId` (Stylelint-convention `string` type)
- `context.ts` — `createRuleContext()` normalizes computed styles; helper predicates (`isFlexOrGridContainer`, etc.)
- `engine.ts` — `analyzeElement()` creates context then `rules.flatMap(r => r.check(ctx))`
- `inline-dimensions.ts` — `inline-no-dimensions`: width/height on inline non-replaced elements
- `gap.ts` — `container-no-gap`: gap on non-flex/grid/multi-column containers
- `alignment.ts` — `container-no-align`: align-items/justify-content on non-flex/grid
- `place.ts` — `container-no-place`: place-content/place-items on non-flex/grid
- `static-position-offset.ts` — `static-no-offset`: top/right/bottom/left on static position
- `self-alignment.ts` — `item-no-self-align`: align-self on non-flex/grid items
- `order.ts` — `item-no-order`: order on non-flex/grid items
- `block-vertical-align.ts` — `block-no-vertical-align`: vertical-align on block-level elements
- `__tests__/` — tests covering all rules + engine integration

#### Rule ID Naming Convention

Rule IDs follow Stylelint's `thing-no-qualifier` pattern — the de facto standard in CSS lint tooling. This makes rule purposes immediately obvious without looking up documentation.

- **Format:** `<target>-no-<what-is-disallowed>`
- **`target`** — the element/context being checked (e.g. `inline`, `container`)
- **`no-<qualifier>`** — the property or behavior that has no effect in that context

| Rule ID                   | Target                       | Disallowed                  |
| ------------------------- | ---------------------------- | --------------------------- |
| `inline-no-dimensions`    | inline non-replaced elements | width/height                |
| `container-no-gap`        | non-flex/grid containers     | gap properties              |
| `container-no-align`      | non-flex/grid containers     | align-items/justify-content |
| `container-no-place`      | non-flex/grid containers     | place-content               |
| `static-no-offset`        | static-positioned elements   | top/right/bottom/left       |
| `item-no-self-align`      | non-flex/grid items          | align-self                  |
| `item-no-order`           | non-flex/grid items          | order                       |
| `block-no-vertical-align` | block-level elements         | vertical-align              |

When adding a new rule, pick a descriptive `target` and `qualifier` — avoid numbered IDs like `D-1` or `C-2`.

When adding a new rule, also add "should warn" and "should NOT warn" test cases to `examples/test.html` so the rule can be verified manually in Chrome DevTools.

### Sidebar UI (`src/sidebar/`)

- `hooks/useSelectedElement.ts` — Chrome DevTools bridge: `$0` eval with 150ms debounce, `requestIdRef` stale response guard, `isElementData()` runtime validation
- `components/` — PanelHeader, WarningList, WarningCard, PanelFooter

### Build Constraints

- `base: ''` in vite.config.ts — relative paths required for extension
- `modulePreload: false` — MV3 CSP blocks `<link rel="modulepreload">`. **Do not remove.**

## Code Style

- ESM modules (`"type": "module"`)
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled)
- Format with Oxfmt before committing

## Commit Rules

- Make small, meaningful commits (1 commit = 1 logical change)
- Focus on "why" in commit messages, not "what" changed
- Format: `<type>: <why-focused message>`
  - type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
- Write messages in English
- Add a body after a blank line when extra context is needed
- Run `pnpm fmt` before committing to apply formatting
- Run `pnpm build` or `pnpm lint` before committing to verify nothing is broken

## PR Rules

- Title and body must be written in **English**
- Title: short (under 70 chars), format `<type>: <concise description>`
- Body structure:
  - `## Summary` — bullet points describing what and why
  - `## Test plan` — checklist of verification steps
- Include a table or list for any non-obvious design decisions
- Link to related issues if applicable
