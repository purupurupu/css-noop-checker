# Repository Guidelines

## Project Structure & Module Organization
Core source lives in `src/`:
- `src/rules/`: CSS noop detection rules and scan engine (`engine.ts`, `registry.ts`, `context.ts`).
- `src/sidebar/`: DevTools sidebar React UI (components, hooks, utilities).
- `src/devtools.ts`: DevTools entrypoint wiring the extension pane.
- `src/**/__tests__/`: unit/component tests colocated with features.

Other important directories:
- `e2e/`: Playwright integration tests.
- `public/manifest.json`: Chrome extension manifest.
- `dist/`: build output (generated).
- `examples/test.html`: manual validation page for rules.

## Build, Test, and Development Commands
- `pnpm dev`: watch build for extension assets during development.
- `pnpm build`: type-check (`tsc -b`) and production build via Vite.
- `pnpm test`: run all Vitest unit/component tests once.
- `pnpm test:watch`: run Vitest in watch mode.
- `pnpm test:e2e`: run Playwright tests in `e2e/`.
- `pnpm lint`: run `oxlint`.
- `pnpm fmt` / `pnpm fmt:check`: apply/check `oxfmt`.

CI runs `fmt:check`, `lint`, `build`, `test`, and `test:e2e`; keep local runs green before opening a PR.

## Coding Style & Naming Conventions
- Language: TypeScript + React (ES modules).
- Formatting: `oxfmt` (`singleQuote: true`, trailing commas, `printWidth: 100`).
- Linting: `oxlint` with TypeScript/React plugins.
- TS config is strict (`strict`, `noUnusedLocals`, `noUnusedParameters`).
- File names use kebab-case (for example `static-position-offset.ts`).
- Tests follow `*.test.ts` / `*.test.tsx` naming.

## Testing Guidelines
- Unit and component tests use Vitest; include patterns are `src/**/*.test.ts` and `src/**/*.test.tsx`.
- E2E tests use Playwright (`e2e/`, Chromium project).
- Add/adjust tests with every rule or UI behavior change; cover both valid and noop scenarios for rule logic.
- For UI changes, prefer component tests plus at least one integration path if behavior spans hooks + rendering.

## Commit & Pull Request Guidelines
- Follow Conventional Commit style seen in history: `feat: ...`, `fix: ...`, `test: ...`, `chore: ...`, `docs: ...`.
- Keep commits focused and descriptive (one logical change per commit when practical).
- PRs should include a clear summary of behavior changes, linked issue (if applicable), screenshots/GIFs for sidebar UI updates, and notes on tests added/updated with local command results.
