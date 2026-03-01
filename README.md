# CSS Noop Checker

Chrome DevTools (Elements sidebar) extension that detects CSS properties that currently have no effect on the selected element.

## Features

- **Selected-element mode** — inspects the currently selected element in DevTools
- **Full-page scan** — scans all elements on a page for violations
- **19 detection rules** — categorized by context (inline, block, container, item, static, overflow, etc.)
- **MCP server** — exposes rules as tools for AI-assisted analysis via Playwright
- **Actionable warnings** — each warning includes a title, explanation, and fix suggestion

## Detection Rules

| Rule ID                             | Detects                                                 |
| ----------------------------------- | ------------------------------------------------------- |
| **Inline**                          |                                                         |
| `inline-no-dimensions`              | `width`/`height` on non-replaced inline elements        |
| `inline-no-vertical-margin`         | Vertical `margin` on inline elements                    |
| **Block**                           |                                                         |
| `block-no-vertical-align`           | `vertical-align` on block-level elements                |
| **Container**                       |                                                         |
| `container-no-align`                | `align-items`/`justify-content` outside flex/grid       |
| `container-no-flex-props`           | `flex-direction`/`flex-wrap` on non-flex containers     |
| `container-no-gap`                  | `gap`/`row-gap`/`column-gap` outside flex/grid          |
| `container-no-grid-props`           | Grid container properties on non-grid containers        |
| `container-no-place`                | `place-items`/`place-content` outside flex/grid         |
| **Item**                            |                                                         |
| `item-no-flex-props`                | Flex item properties on non-flex children               |
| `item-no-float`                     | `float` on flex/grid items                              |
| `item-no-grid-props`                | Grid item properties on non-grid children               |
| `item-no-order`                     | `order` on non-flex/grid items                          |
| `item-no-self-align`                | `align-self` on non-flex/grid items                     |
| **Static position**                 |                                                         |
| `static-no-offset`                  | `top`/`right`/`bottom`/`left` on `position: static`     |
| `static-no-z-index`                 | `z-index` outside stacking context                      |
| **Other**                           |                                                         |
| `nonfloat-no-shape-outside`         | `shape-outside` on non-floated elements                 |
| `nonreplaced-no-object-fit`         | `object-fit`/`object-position` on non-replaced elements |
| `visible-overflow-no-resize`        | `resize` when overflow is visible                       |
| `visible-overflow-no-text-overflow` | `text-overflow` when overflow is visible                |

## Quick Start

```bash
pnpm install
pnpm build
```

1. Open `chrome://extensions` and enable Developer mode.
2. Click **Load unpacked** and select this project directory.
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

See the contributor guide in [`AGENTS.md`](./AGENTS.md) for project structure, adding new rules, coding style, and PR conventions.
