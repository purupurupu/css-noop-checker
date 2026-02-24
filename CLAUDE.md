# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

css-noop-checker is a React 19 + TypeScript web application built with Vite 7. Currently in early development (scaffolded from the Vite React-TS template).

## Commands

- `pnpm dev` — Start dev server with HMR
- `pnpm build` — Type-check with `tsc -b` then bundle with Vite
- `pnpm lint` — Run ESLint across the project
- `pnpm preview` — Preview the production build locally

Package manager is **pnpm** (not npm/yarn).

## Tech Stack

- **Build**: Vite 7 with SWC via `@vitejs/plugin-react-swc` (not Babel)
- **Framework**: React 19 with `react-jsx` transform
- **Language**: TypeScript 5.9 (strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly`)
- **Linting**: ESLint 9 flat config (`eslint.config.js`) with typescript-eslint, react-hooks, and react-refresh plugins

## Architecture

- `src/main.tsx` — App entry point, renders `<App />` inside `<StrictMode>`
- `src/App.tsx` — Root component
- `src/index.css` — Global styles (light/dark color scheme support)
- `src/App.css` — Component-scoped styles
- `index.html` — Vite HTML entry point (references `/src/main.tsx`)

## TypeScript Configuration

Uses project references with two configs:
- `tsconfig.app.json` — App source (`src/`), targets ES2022, includes `vite/client` types
- `tsconfig.node.json` — Node tooling config (`vite.config.ts`), targets ES2023

Both enforce: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`.

## Code Style

- ESM modules (`"type": "module"` in package.json)
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled)
- No test framework configured yet
