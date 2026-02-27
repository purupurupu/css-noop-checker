# CSS Noop Checker

Chrome DevTools (Elements sidebar) extension that detects CSS properties that currently have no effect on the selected element.

## Current MVP Rules

- `D-1`: `width` / `height` on `display: inline` non-replaced elements
- `C-1`: `gap` / `row-gap` / `column-gap` used outside valid layout contexts
- `C-2`: `align-items` / `justify-content` used outside flex/grid containers
- `C-3`: `place-items` / `place-content` used outside grid containers

Each warning shows:

- severity (`warning`)
- short title
- why it has no effect
- suggestion for a fix

## Development

```bash
pnpm install
pnpm dev
```

## Build & Test Commands

Build extension assets:

```bash
pnpm build
```

Run unit/component tests:

```bash
pnpm test
```

Run E2E tests (Playwright):

```bash
pnpm test:e2e
```

Run lint/format checks:

```bash
pnpm lint
pnpm fmt:check
```

## Load in Chrome

1. Run `pnpm build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click "Load unpacked" and select this project directory.
5. Open DevTools on any page and go to `Elements`.
6. Open the `CSS Noop` sidebar pane.

## Scope Notes

- Analysis target is only the current DevTools selection (`$0`).
- Detection is based on `getComputedStyle` and lightweight heuristics.
- No external network calls.
- CSS declaration origin tracking (which file/selector set the value) is not included in MVP.

## Contributing

See the contributor guide in [`AGENTS.md`](./AGENTS.md) for repository structure, coding style, testing expectations, and PR conventions.
