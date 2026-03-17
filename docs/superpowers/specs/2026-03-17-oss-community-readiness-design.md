# OSS Community Readiness

## Goal

Improve the project's discoverability and contributor onboarding experience by adding standard community files and GitHub metadata. Primary target: OSS contributors who want to add detection rules.

## Scope

### In scope

1. **CONTRIBUTING.md** — human-oriented contributor guide (migrated from AGENTS.md)
2. **AGENTS.md rewrite** — refocused as AI coding agent instructions only
3. **CODE_OF_CONDUCT.md** — Contributor Covenant v2.1 (verbatim)
4. **GitHub metadata** — repository description and topics via `gh repo edit`
5. **README.md update** — link to CONTRIBUTING.md, screenshot placeholder TODO

### Out of scope

- Screenshots / GIF demos (no assets available; separate issue to track)
- SECURITY.md (low attack surface, Security Advisory link already in issue template)
- CHANGELOG (deferred until release workflow is established)
- README rewrite (current content is adequate)

## Design

### 1. CONTRIBUTING.md

Migrates the human-readable content from AGENTS.md into the GitHub-conventional filename. Structure:

```
# Contributing to CSS Noop Checker

## Getting Started
  - Prerequisites (Node 24, pnpm 10 via mise)
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
- **Getting Started** section with prerequisites and setup commands
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
```

Changes from current AGENTS.md:
- Title: "Contributor Guide" → "AI Agent Instructions"
- Added human contributor redirect at top
- Removed "Pre-PR Checklist" section (redundant with CLAUDE.md commands section for agents)
- Same technical content, different framing

### 3. CODE_OF_CONDUCT.md

Contributor Covenant v2.1, verbatim. Contact method: GitHub Issues (consistent with existing issue template setup).

### 4. GitHub Metadata

Set via `gh repo edit`:
- **Description:** `Chrome DevTools extension that detects CSS properties with no effect`
- **Topics:** `css`, `devtools`, `chrome-extension`, `linter`, `mcp`, `react`, `typescript`, `developer-tools`

### 5. README.md Changes

Minimal updates:
- **Contributing section:** Change link target from AGENTS.md to CONTRIBUTING.md
- **Add note about screenshots:** Either a TODO comment in source or a separate GitHub issue for adding visual demos

## File Impact

| File | Action |
|------|--------|
| `CONTRIBUTING.md` | Create (new) |
| `AGENTS.md` | Rewrite (reframe for AI agents) |
| `CODE_OF_CONDUCT.md` | Create (new, Contributor Covenant v2.1) |
| `README.md` | Edit (update Contributing link) |
| GitHub repo settings | Edit via `gh repo edit` |

## Non-Goals

- No changes to CI/CD workflows
- No changes to the rules engine or sidebar UI
- No new dependencies
