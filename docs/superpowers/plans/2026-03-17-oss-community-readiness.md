# OSS Community Readiness Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add standard community files and GitHub metadata to improve contributor onboarding and discoverability.

**Architecture:** Documentation-only changes — no code, no dependencies, no CI changes. Five independent file tasks plus two GitHub CLI operations.

**Tech Stack:** Markdown, GitHub CLI (`gh`)

**Spec:** `docs/superpowers/specs/2026-03-17-oss-community-readiness-design.md`

---

## Chunk 1: Community Files and Metadata

All tasks are independent and can be executed in parallel.

### Task 1: Create CONTRIBUTING.md

**Files:**

- Create: `CONTRIBUTING.md`

- [ ] **Step 1: Create CONTRIBUTING.md**

Write the file with this exact content:

````markdown
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
````

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

### 4. Update `EXPECTED_CASE_COUNT`

In `e2e/integration/rules-against-real-styles.test.ts`, increment the `EXPECTED_CASE_COUNT` constant by the number of test cases you added.

### 5. Run tests

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

````

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: add CONTRIBUTING.md for human contributors"
````

---

### Task 2: Rewrite AGENTS.md

**Files:**

- Modify: `AGENTS.md`

- [ ] **Step 1: Rewrite AGENTS.md**

Replace the entire file with:

```markdown
# AI Agent Instructions

> **Human contributors:** see [CONTRIBUTING.md](./CONTRIBUTING.md) for the full contributor guide.

This file provides context for AI coding agents (Cursor, Copilot, Windsurf, etc.) working in this repository.

## Project Structure
```

src/
rules/ Detection rules + engine, registry, context, types
sidebar/ DevTools sidebar React UI (see src/sidebar/ for details)
devtools.ts Extension entrypoint — creates the sidebar pane
e2e/
helpers/ Playwright extraction helpers (shared with MCP server)
integration/ Browser integration tests against examples/test.html
mcp-server/ Standalone MCP server (separate package.json, pnpm workspace)
examples/
test.html Test cases for all rules — used by both manual testing and e2e
public/
manifest.json Chrome extension manifest (MV3)

````

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
````

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

### 4. Update `EXPECTED_CASE_COUNT`

In `e2e/integration/rules-against-real-styles.test.ts`, increment the `EXPECTED_CASE_COUNT` constant by the number of test cases you added.

### 5. Run tests

```bash
pnpm test          # unit tests
pnpm test:e2e      # browser integration tests
```

No changes to the extraction layer are needed — both the extension and MCP server dynamically read `registry.ts` for required CSS properties.

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

````

- [ ] **Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs: refocus AGENTS.md as AI agent instructions"
````

---

### Task 3: Create CODE_OF_CONDUCT.md

**Files:**

- Create: `CODE_OF_CONDUCT.md`

- [ ] **Step 1: Create CODE_OF_CONDUCT.md**

Use the Contributor Covenant v2.1 verbatim text. Fetch from https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md or write the standard content. Set the contact email to `purupurupu0prog@gmail.com`.

- [ ] **Step 2: Commit**

```bash
git add CODE_OF_CONDUCT.md
git commit -m "docs: add Contributor Covenant Code of Conduct v2.1"
```

---

### Task 4: Update README.md Contributing link

**Files:**

- Modify: `README.md:69-71`

- [ ] **Step 1: Update the Contributing section link**

Change line 71 from:

```markdown
Contributions are welcome! See the contributor guide in [`AGENTS.md`](./AGENTS.md) for project structure, adding new rules, coding style, and PR conventions.
```

to:

```markdown
Contributions are welcome! See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup, adding new rules, coding style, and PR conventions.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: point Contributing section to CONTRIBUTING.md"
```

---

### Task 5: Set GitHub repository metadata

**Files:** None (GitHub API only)

- [ ] **Step 1: Set description and topics**

```bash
gh repo edit purupurupu/css-noop-checker \
  --description "Chrome DevTools extension that detects CSS properties with no effect" \
  --add-topic css \
  --add-topic devtools \
  --add-topic chrome-extension \
  --add-topic linter \
  --add-topic model-context-protocol \
  --add-topic react \
  --add-topic typescript \
  --add-topic developer-tools
```

- [ ] **Step 2: Verify**

```bash
gh repo view purupurupu/css-noop-checker --json description,repositoryTopics
```

---

### Task 6: Create GitHub issue for screenshots

**Files:** None (GitHub API only)

- [ ] **Step 1: Create the issue**

```bash
gh issue create \
  --repo purupurupu/css-noop-checker \
  --title "docs: add screenshots/GIF demo to README" \
  --body "$(cat <<'EOF'
## Context

The README currently has no visual demo showing what the extension looks like in action. A screenshot or GIF would help potential contributors and users quickly understand the tool.

## Suggested visuals

- Screenshot of the CSS Noop sidebar showing warnings for a selected element
- GIF of the full-page scan feature in action
- Before/after showing a CSS fix based on a warning

## Location

Add to README.md between the project description and the Features section.
EOF
)"
```

---

## Verification

After all tasks are complete:

- [ ] **Check that GitHub Community Standards improved:** Visit `https://github.com/purupurupu/css-noop-checker/community`
- [ ] **Verify README link works:** `CONTRIBUTING.md` link in README points to the new file
- [ ] **Verify repo metadata:** `gh repo view` shows description and topics
