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

## Commit Rules

- 細かく意味のある単位でコミットする（1コミット = 1つの論理的変更）
- コミットメッセージは「なぜ（why）」を意識する。「何を変えたか」ではなく「なぜその変更が必要か」を伝える
- フォーマット: `<type>: <why-focused message>`
  - type: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
- メッセージは英語で記述
- 本文（body）が必要な場合は空行を挟んで補足を書く
- コミット前に `pnpm build` または `pnpm lint` で壊れていないことを確認する

## PR Rules

- Title and body must be written in **English**
- Title: short (under 70 chars), format `<type>: <concise description>`
- Body structure:
  - `## Summary` — bullet points describing what and why
  - `## Test plan` — checklist of verification steps
- Include a table or list for any non-obvious design decisions
- Link to related issues if applicable
