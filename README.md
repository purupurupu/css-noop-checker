# CSS Noop Checker

[![CI](https://github.com/purupurupu/css-noop-checker/actions/workflows/ci.yml/badge.svg)](https://github.com/purupurupu/css-noop-checker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Chrome DevTools (Elements sidebar) extension that detects CSS properties that currently have no effect on the selected element.

## Features

- **Selected-element mode** — inspects the currently selected element in DevTools
- **Full-page scan** — scans all elements on a page for violations
- **Detection rules** — categorized by context (inline, block, container, item, static, positioned, overflow, etc.)
- **MCP server** — exposes rules as tools for AI-assisted analysis via Playwright
- **Actionable warnings** — each warning includes a title, explanation, and fix suggestion

## Detection Rules

Rules are organized by context:
**Inline** · **Block** · **Container** · **Item** · **Static** · **Positioned** · **Overflow** · **Other**

Rule IDs follow Stylelint's `thing-no-qualifier` convention. See `src/rules/` for the full list, or run `list_rules` via the MCP server.

## Quick Start

```bash
pnpm install
pnpm build
```

1. Open `chrome://extensions` and enable Developer mode.
2. Click **Load unpacked** and select the `dist/` directory.
3. Open DevTools on any page → **Elements** tab → **CSS Noop** sidebar pane.

For development with watch-mode rebuilds:

```bash
pnpm dev
```

## Commands

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Watch-mode build (`vite build --watch`)  |
| `pnpm build`     | Type-check + production build            |
| `pnpm test`      | Run Vitest unit tests                    |
| `pnpm test:e2e`  | Run Playwright browser integration tests |
| `pnpm lint`      | Lint with Oxlint                         |
| `pnpm fmt`       | Format with Oxfmt                        |
| `pnpm fmt:check` | Check formatting without writing         |

## MCP Server

The `mcp-server/` directory provides an MCP server that exposes the rules engine as tools for AI-assisted analysis. It uses Playwright to open pages, extract computed styles, and run all detection rules.

See [`mcp-server/README.md`](./mcp-server/README.md) for setup instructions.

## Tech Stack

React 19 · TypeScript 5.9 · Vite 7 · Oxlint / Oxfmt · Vitest · Playwright · pnpm

## How It Works

- Analysis uses `getComputedStyle` and lightweight heuristics — no external network calls.
- Rules are pure functions with zero Chrome API dependency, making them fully testable.
- The extension targets only the current DevTools selection (`$0`) or scans all visible elements on the page.
- Each rule file is named after its rule ID (e.g. `container-no-gap.ts`), following Stylelint's `thing-no-qualifier` naming convention.

## Contributing

Contributions are welcome! See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for setup, adding new rules, coding style, and PR conventions.

## License

[MIT](./LICENSE)
