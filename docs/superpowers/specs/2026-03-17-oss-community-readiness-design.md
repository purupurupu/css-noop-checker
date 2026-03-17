# OSS Community Readiness

## Goal

Improve the project's discoverability and contributor onboarding experience by adding standard community files and GitHub metadata. Primary target: OSS contributors who want to add detection rules.

## Scope

### In scope

1. **CONTRIBUTING.md** — human-oriented contributor guide (migrated from AGENTS.md)
2. **AGENTS.md rewrite** — refocused as AI coding agent instructions only
3. **CODE_OF_CONDUCT.md** — Contributor Covenant v2.1 (verbatim)
4. **GitHub metadata** — repository description and topics via `gh repo edit`
5. **README.md update** — link to CONTRIBUTING.md
6. **GitHub Issue** — tracking screenshot/demo addition

### Out of scope

- Screenshots / GIF demos (no assets available; tracked via GitHub issue)
- SECURITY.md (low attack surface, Security Advisory link already in issue template)
- CHANGELOG (deferred until release workflow is established)
- README rewrite (current content is adequate)
- `.github/ISSUE_TEMPLATE/config.yml` changes (CoC link not standard practice there)

## File Role Clarification

Three files serve overlapping but distinct audiences:

| File              | Audience                          | Auto-loaded by                                   | Purpose                                                                          |
| ----------------- | --------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- |
| `CLAUDE.md`       | Claude Code                       | Claude Code (always)                             | Detailed project context, commands, architecture. Authoritative source of truth. |
| `AGENTS.md`       | AI agents (Cursor, Copilot, etc.) | Convention-based (agents look for this filename) | Concise project structure + rule checklist + code style.                         |
| `CONTRIBUTING.md` | Human contributors                | GitHub UI (auto-linked on issues/PRs)            | Onboarding, prerequisites, full guide with explanations.                         |

Content duplication across these files is **intentional**. AI agents perform better with inline content than link-following, and CLAUDE.md is only available to Claude Code. Each file is self-contained for its audience.

## Design

### 1. CONTRIBUTING.md

Migrates the human-readable content from AGENTS.md into the GitHub-conventional filename. Structure:

```
# Contributing to CSS Noop Checker

## Getting Started
  - Prerequisites (Node 24, pnpm 10 via mise)
  - Playwright browser installation (`pnpm exec playwright install chromium`)
  - Clone, install, build, test

## Adding a New Rule
  (migrated from AGENTS.md — the 5-step checklist with code examples)

## Code Style
  (migrated from AGENTS.md — ESM, import type, no barrel exports, Oxfmt)

## Commit & PR Guidelines
  (migrated from AGENTS.md — conventional commits, PR template)

## Pre-PR Checklist
  (migrated from AGENTS.md — fmt, lint, build, test, test:e2e)

## Code of Conduct
  Link to CODE_OF_CONDUCT.md
```

Key additions beyond what AGENTS.md has today:

- **Getting Started** section with prerequisites, setup commands, and Playwright browser install
- Link to Code of Conduct

### 2. AGENTS.md (rewrite)

Refocused as instructions for AI coding agents (Claude Code, Cursor, Copilot, etc.). Retains project structure and technical context that agents need, but removes the contributor-guide framing.

```
# AI Agent Instructions

> Human contributors: see [CONTRIBUTING.md](./CONTRIBUTING.md)

## Project Structure
  (kept as-is — agents need this for navigation)

## Adding a New Rule
  (kept as-is — agents need the checklist and code templates)

## Code Style
  (kept as-is — agents need formatting/import rules)

## Commit & PR Guidelines
  (kept as-is — agents need commit conventions)

## Pre-PR Checklist
  (kept — non-Claude agents don't have CLAUDE.md access)
```

Changes from current AGENTS.md:

- Title: "Contributor Guide" → "AI Agent Instructions"
- Added human contributor redirect at top
- Pre-PR Checklist **retained** (non-Claude agents need it; only CLAUDE.md is auto-loaded by Claude Code)
- Same technical content, different framing

### 3. CODE_OF_CONDUCT.md

Contributor Covenant v2.1, verbatim. Contact method: repository owner's email address (private reporting, not GitHub Issues — public issue reporting defeats the purpose of CoC incident handling).

### 4. GitHub Metadata

Set via `gh repo edit`:

- **Description:** `Chrome DevTools extension that detects CSS properties with no effect`
- **Topics:** `css`, `devtools`, `chrome-extension`, `linter`, `model-context-protocol`, `react`, `typescript`, `developer-tools`

Note: Using `model-context-protocol` instead of `mcp` for topic discoverability (established community convention).

### 5. README.md Changes

Minimal update:

- **Contributing section:** Change link target from AGENTS.md to CONTRIBUTING.md

No TODO comments or placeholders in README — keeps it presentable. Screenshot tracking goes to a GitHub issue instead.

### 6. GitHub Issue for Screenshots

Create a GitHub issue to track adding visual demos to README. This keeps the README clean while ensuring the task isn't forgotten.

## File Impact

| File                 | Action                                  |
| -------------------- | --------------------------------------- |
| `CONTRIBUTING.md`    | Create (new)                            |
| `AGENTS.md`          | Rewrite (reframe for AI agents)         |
| `CODE_OF_CONDUCT.md` | Create (new, Contributor Covenant v2.1) |
| `README.md`          | Edit (update Contributing link)         |
| GitHub repo settings | Edit via `gh repo edit`                 |
| GitHub issue         | Create (screenshot tracking)            |

## Non-Goals

- No changes to CI/CD workflows
- No changes to the rules engine or sidebar UI
- No new dependencies
