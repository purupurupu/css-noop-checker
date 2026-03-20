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

## Detected Patterns

CSS Noop Checker finds CSS properties that have **no visible effect** on the element they are applied to. These "no-op" declarations are not syntax errors — they are valid CSS that the browser silently ignores due to layout context. For example, `width` on an inline `<span>`, or `gap` on a non-flex/grid container.

### Inline

| Rule                                                                                          | Description                              |
| --------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [`inline-no-box-sizing`](./src/rules/inline-no-box-sizing.ts)                                 | box-sizing on inline                     |
| [`inline-no-dimensions`](./src/rules/inline-no-dimensions.ts)                                 | width/height on inline                   |
| [`inline-no-logical-dimensions`](./src/rules/inline-no-logical-dimensions.ts)                 | inline-size/block-size on inline         |
| [`inline-no-logical-vertical-margin`](./src/rules/inline-no-logical-vertical-margin.ts)       | margin-block on inline                   |
| [`inline-no-min-max-dimensions`](./src/rules/inline-no-min-max-dimensions.ts)                 | min/max width/height on inline           |
| [`inline-no-min-max-logical-dimensions`](./src/rules/inline-no-min-max-logical-dimensions.ts) | min/max inline-size/block-size on inline |
| [`inline-no-overflow`](./src/rules/inline-no-overflow.ts)                                     | overflow on inline                       |
| [`inline-no-text-indent`](./src/rules/inline-no-text-indent.ts)                               | text-indent on inline                    |
| [`inline-no-vertical-margin`](./src/rules/inline-no-vertical-margin.ts)                       | vertical margin on inline                |

### Block

| Rule                                                                | Description                           |
| ------------------------------------------------------------------- | ------------------------------------- |
| [`block-no-vertical-align`](./src/rules/block-no-vertical-align.ts) | vertical-align on block-level element |

### Container (flex/grid)

| Rule                                                                      | Description                                 |
| ------------------------------------------------------------------------- | ------------------------------------------- |
| [`container-no-align`](./src/rules/container-no-align.ts)                 | align/justify on non-flex/grid/multi-column |
| [`container-no-columns`](./src/rules/container-no-columns.ts)             | column properties on flex/grid container    |
| [`container-no-flex-props`](./src/rules/container-no-flex-props.ts)       | flex-direction/wrap on non-flex             |
| [`container-no-gap`](./src/rules/container-no-gap.ts)                     | gap on non-flex/grid                        |
| [`container-no-grid-props`](./src/rules/container-no-grid-props.ts)       | grid container props on non-grid            |
| [`container-no-justify-items`](./src/rules/container-no-justify-items.ts) | justify-items on non-grid                   |
| [`container-no-place`](./src/rules/container-no-place.ts)                 | place-\* on non-flex/grid                   |

### Item (flex/grid)

| Rule                                                          | Description                                      |
| ------------------------------------------------------------- | ------------------------------------------------ |
| [`item-no-flex-props`](./src/rules/item-no-flex-props.ts)     | flex item props on non-flex child                |
| [`item-no-float`](./src/rules/item-no-float.ts)               | float on flex/grid item                          |
| [`item-no-grid-props`](./src/rules/item-no-grid-props.ts)     | grid item props on non-grid child                |
| [`item-no-justify-self`](./src/rules/item-no-justify-self.ts) | justify-self on non-grid, non-positioned element |
| [`item-no-order`](./src/rules/item-no-order.ts)               | order on non-flex/grid item                      |
| [`item-no-self-align`](./src/rules/item-no-self-align.ts)     | align-self on non-flex/grid item                 |

### Static positioning

| Rule                                                                  | Description                             |
| --------------------------------------------------------------------- | --------------------------------------- |
| [`static-no-logical-offset`](./src/rules/static-no-logical-offset.ts) | logical offset on static position       |
| [`static-no-offset`](./src/rules/static-no-offset.ts)                 | offset on static position               |
| [`static-no-z-index`](./src/rules/static-no-z-index.ts)               | z-index on static non-flex/grid element |

### Positioned

| Rule                                                        | Description                                |
| ----------------------------------------------------------- | ------------------------------------------ |
| [`positioned-no-clear`](./src/rules/positioned-no-clear.ts) | clear on absolute/fixed positioned element |
| [`positioned-no-float`](./src/rules/positioned-no-float.ts) | float on out-of-flow positioned element    |

### Table

| Rule                                                                                    | Description                       |
| --------------------------------------------------------------------------------------- | --------------------------------- |
| [`collapsed-table-no-border-spacing`](./src/rules/collapsed-table-no-border-spacing.ts) | border-spacing on collapsed table |
| [`element-no-table-props`](./src/rules/element-no-table-props.ts)                       | table props on non-table          |
| [`nontable-no-border-spacing`](./src/rules/nontable-no-border-spacing.ts)               | border-spacing on non-table       |
| [`nontable-no-empty-cells`](./src/rules/nontable-no-empty-cells.ts)                     | empty-cells on non-table-cell     |
| [`table-no-margin`](./src/rules/table-no-margin.ts)                                     | margin on internal table element  |
| [`table-no-padding`](./src/rules/table-no-padding.ts)                                   | padding on table internals        |

### Overflow

| Rule                                                                                    | Description                       |
| --------------------------------------------------------------------------------------- | --------------------------------- |
| [`visible-overflow-no-resize`](./src/rules/visible-overflow-no-resize.ts)               | resize on visible overflow        |
| [`visible-overflow-no-text-overflow`](./src/rules/visible-overflow-no-text-overflow.ts) | text-overflow on visible overflow |

### Scroll

| Rule                                                                                    | Description                                                  |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`scroll-no-scroll-padding`](./src/rules/scroll-no-scroll-padding.ts)                   | scroll-padding on non-scroll container                       |
| [`scroll-snap-no-align-without-type`](./src/rules/scroll-snap-no-align-without-type.ts) | scroll-snap child properties without parent scroll-snap-type |

### Transform & Perspective

| Rule                                                            | Description                            |
| --------------------------------------------------------------- | -------------------------------------- |
| [`perspective-no-origin`](./src/rules/perspective-no-origin.ts) | perspective-origin without perspective |
| [`transform-no-origin`](./src/rules/transform-no-origin.ts)     | transform-origin without transform     |

### Animation

| Rule                                                              | Description                                 |
| ----------------------------------------------------------------- | ------------------------------------------- |
| [`animation-no-sub-props`](./src/rules/animation-no-sub-props.ts) | animation properties without animation-name |

### Other

| Rule                                                                        | Description                                        |
| --------------------------------------------------------------------------- | -------------------------------------------------- |
| [`contents-no-box-props`](./src/rules/contents-no-box-props.ts)             | box properties on display:contents                 |
| [`multicol-no-column-rule`](./src/rules/multicol-no-column-rule.ts)         | column-rule/column-fill on non-multicol container  |
| [`nonfloat-no-shape-outside`](./src/rules/nonfloat-no-shape-outside.ts)     | shape-outside on non-floated element               |
| [`nonreplaced-no-aspect-ratio`](./src/rules/nonreplaced-no-aspect-ratio.ts) | aspect-ratio on inline non-replaced element        |
| [`nonreplaced-no-object-fit`](./src/rules/nonreplaced-no-object-fit.ts)     | object-fit/object-position on non-replaced element |
| [`outline-no-style`](./src/rules/outline-no-style.ts)                       | outline properties without outline-style           |

Rule IDs follow Stylelint's `thing-no-qualifier` convention. See individual source files for details, or run `list_rules` via the MCP server.

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
