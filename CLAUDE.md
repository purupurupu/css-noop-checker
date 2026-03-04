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
- `pnpm test:e2e` — Run Playwright browser integration tests
- `pnpm test:e2e:ui` — Run Playwright tests with interactive UI

Package manager is **pnpm** (not npm/yarn). Runtime: Node.js 24, pnpm 10 (managed via `.mise.toml`).

## Tech Stack

- **Build**: Vite 7 + SWC via `@vitejs/plugin-react-swc`
- **Framework**: React 19 (`react-jsx` transform)
- **Language**: TypeScript 5.9 (strict, `verbatimModuleSyntax`, `erasableSyntaxOnly`)
- **Linting**: Oxlint (`.oxlintrc.json`) — plugins: typescript, react
- **Formatting**: Oxfmt (`.oxfmtrc.jsonc`) — singleQuote, trailingComma all, printWidth 100
- **Testing**: Vitest 4 (`vitest.config.ts`, separate from `vite.config.ts`), Playwright (`playwright.config.ts`) for browser integration tests

## Architecture

Chrome DevTools extension with two entry points (multi-page Vite build):

- `devtools.html` → `src/devtools.ts` — Creates "CSS Noop" sidebar pane in Elements tab
- `sidebar.html` → `src/sidebar/main.tsx` — React app rendered inside the sidebar pane

### Rules Engine (`src/rules/`)

Pure-function rules with zero Chrome API dependency — fully testable. Each rule file is named after its rule ID (e.g. `container-no-gap.ts` → rule ID `container-no-gap`).

Key infrastructure files:

- `types.ts` — `ElementData`, `Warning`, `Rule`, `RuleContext`, `RuleId`
- `context.ts` — `createRuleContext()` normalizes computed styles; helper predicates
- `stacking-context.ts` — `isStackingContext()` detects CSS stacking context triggers
- `engine.ts` — `analyzeElement()` creates context then runs all registered rules
- `registry.ts` — rule registration via side-effect imports in `engine.ts`

#### Rule ID Naming Convention

Rule IDs follow Stylelint's `thing-no-qualifier` pattern — the de facto standard in CSS lint tooling. This makes rule purposes immediately obvious without looking up documentation.

- **Format:** `<target>-no-<what-is-disallowed>`
- **`target`** — the element/context being checked (e.g. `inline`, `container`)
- **`no-<qualifier>`** — the property or behavior that has no effect in that context

When adding a new rule, pick a descriptive `target` and `qualifier` — avoid numbered IDs like `D-1` or `C-2`.

#### New Rule Checklist

1. Create `src/rules/<rule-id>.ts` — implement `RuleDescriptor`, call `registerRule()`, export the check function. Use `createWarning()` factory via a scoped `warn` helper for all warnings.
2. Add side-effect import in `src/rules/engine.ts` (keep alphabetical order)
3. Add `DEFAULT_COMPUTED_STYLES` entries in `src/rules/__tests__/helpers/make-element.ts` for any new `requiredProperties` (the validation test will fail if missed). If the rule uses `requiredInlineProperties`, ensure unit tests pass appropriate inline style overrides via `makeElement`'s third parameter.
4. Add unit tests in `src/rules/__tests__/<rule-id>.test.ts`
5. Add "should warn" and "should NOT warn" test cases to `examples/test.html` (keep alphabetical order by rule ID)
6. Update `EXPECTED_CASE_COUNT` in `e2e/integration/rules-against-real-styles.test.ts`
7. Run `pnpm test` and `pnpm test:e2e` to verify

#### test.html Test Case Format

Each test case in `examples/test.html` must include `data-target` and `data-rule` attributes for Playwright integration tests:

```html
<!-- "should warn" case -->
<div class="case expect-warn" data-rule="<rule-id>">
  <div class="label label-warn"><rule-id> warn: description</div>
  <TARGET_ELEMENT data-target style="...">...</TARGET_ELEMENT>
</div>

<!-- "should NOT warn" case -->
<div class="case expect-ok" data-rule="<rule-id>">
  <div class="label label-ok"><rule-id> ok: description</div>
  <TARGET_ELEMENT data-target style="...">...</TARGET_ELEMENT>
</div>
```

- **`data-rule`** — the rule ID being tested (e.g. `inline-no-dimensions`). Use `data-rule="none"` for cases that should produce zero warnings from any rule
- **`data-target`** — boolean attribute on the element to inspect (must be exactly one per `.case`)
- For cases where the target is a nested child (e.g. flex/grid items), place `data-target` on the actual inspectable element, not the wrapper
- **Ordering** — rule sections in `test.html` must be sorted alphabetically by rule ID (e.g. `block-no-vertical-align` before `container-no-align`). The "No issues" section stays at the end. This matches the Scan Page display order.
- **`EXPECTED_CASE_COUNT`** — after adding or removing test cases, update the `EXPECTED_CASE_COUNT` constant in `e2e/integration/rules-against-real-styles.test.ts`. This safeguard catches accidental additions/removals.

### MCP Server (`mcp-server/`)

Standalone MCP server that reuses the rules engine and e2e extraction helpers to analyze live pages via Playwright. Separate `package.json` managed as a pnpm workspace.

- `src/index.ts` — MCP tool handlers (`list_rules`, `analyze_element`, `scan_page`)
- `src/url-validation.ts` — SSRF-safe URL validation (scheme + private IP checks)

### Element Extraction: Dual Implementation

Element extraction (getting computed styles from in-page elements) exists in **two parallel implementations** due to different API constraints:

|             | Extension sidebar                                                            | E2E helpers / MCP server                                      |
| ----------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Files**   | `src/sidebar/hooks/build-eval-script.ts`, `build-scan-script.ts`             | `e2e/helpers/extract-element-data.ts`                         |
| **API**     | `chrome.devtools.inspectedWindow.eval()` — requires **string-serialized JS** | Playwright `page.evaluate()` — accepts **functions directly** |
| **Used by** | Chrome extension UI                                                          | Playwright e2e tests, MCP server                              |

**Adding a new rule does NOT require changes to either extraction implementation** — both dynamically query `registry.ts` for required CSS properties.

**However, changes to extraction behavior itself require updating both implementations.** The two implementations currently have known divergences:

Both implementations share `SKIP_TAGS` and other constants from `src/rules/scan-constants.ts`. The remaining divergences:

| Behavior            | Extension sidebar                     | E2E / MCP server                 |
| ------------------- | ------------------------------------- | -------------------------------- |
| **`display: none`** | Filters out (`cs.display === 'none'`) | Does not filter                  |
| **Query scope**     | `document.body.querySelectorAll('*')` | `document.querySelectorAll('*')` |
| **Selector format** | `CSS.escape()` + max 3 classes        | `nth-of-type` + all classes      |
| **Scan cap**        | Chunked pagination (offset/limit)     | Single pass, 5 000 element cap   |

When modifying any of these behaviors, update both `build-scan-script.ts` and `extract-element-data.ts`.

### Browser Integration Tests (`e2e/`)

Playwright-based tests that verify rules against real browser `getComputedStyle()`:

- `helpers/extract-element-data.ts` — registry-driven computed style extraction (mirrors extension eval script)
- `integration/rules-against-real-styles.test.ts` — opens `test.html`, extracts real styles, runs `analyzeElement()`, asserts against `data-rule` / `expect-warn` / `expect-ok`

New rules are automatically covered when test cases are added to `test.html` with proper `data-target` and `data-rule` attributes. No changes to the integration test code are needed.

### Sidebar UI (`src/sidebar/`)

- `hooks/useSelectedElement.ts` — Chrome DevTools bridge: `$0` eval with 150ms debounce, `requestIdRef` stale response guard, `isElementData()` runtime validation
- `components/` — PanelHeader, WarningList, WarningCard, PanelFooter

### Build Constraints

- `base: ''` in vite.config.ts — relative paths required for extension
- `modulePreload: false` — MV3 CSP blocks `<link rel="modulepreload">`. **Do not remove.**

## Code Style

- ESM modules (`"type": "module"`)
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled)
- **No barrel exports** — do not create `index.ts` re-export files. Import directly from the source module.
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
