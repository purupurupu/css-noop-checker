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
- `__tests__/` — 38 tests covering all rules + engine integration

#### Rule ID Naming Convention

Rule IDs follow Stylelint's `thing-no-qualifier` pattern — the de facto standard in CSS lint tooling. This makes rule purposes immediately obvious without looking up documentation.

- **Format:** `<target>-no-<what-is-disallowed>`
- **`target`** — the element/context being checked (e.g. `inline`, `container`)
- **`no-<qualifier>`** — the property or behavior that has no effect in that context

| Rule ID                | Target                       | Disallowed                  |
| ---------------------- | ---------------------------- | --------------------------- |
| `inline-no-dimensions` | inline non-replaced elements | width/height                |
| `container-no-gap`     | non-flex/grid containers     | gap properties              |
| `container-no-align`   | non-flex/grid containers     | align-items/justify-content |
| `container-no-place`   | non-flex/grid containers     | place-items/place-content   |

When adding a new rule, pick a descriptive `target` and `qualifier` — avoid numbered IDs like `D-1` or `C-2`.

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

- 細かく意味のある単位でコミットする（1コミット = 1つの論理的変更）
- コミットメッセージは「なぜ（why）」を意識する。「何を変えたか」ではなく「なぜその変更が必要か」を伝える
- フォーマット: `<type>: <why-focused message>`
  - type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
- メッセージは英語で記述
- 本文（body）が必要な場合は空行を挟んで補足を書く
- コミット前に `pnpm build` または `pnpm lint` で壊れていないことを確認する

## PR Rules

- Title and body must be written in **English**
- Title: short (under 70 chars), format `<type>: <concise description>`
- Body structure:
  - `## Summary` — bullet points describing what and why
  - `## Test plan` — checklist of verification steps
- Include a table or list for any non-obvious design decisions
- Link to related issues if applicable
