import { execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)), '../..');
const DIST = resolve(ROOT, 'dist');

beforeAll(() => {
  if (!existsSync(DIST)) {
    execSync('pnpm build', { cwd: ROOT, stdio: 'pipe', timeout: 60_000 });
  }
}, 120_000);

function extractScriptSrcs(html: string): string[] {
  return [...html.matchAll(/<script\b[^>]*>/g)]
    .map((m) => m[0].match(/\bsrc="([^"]+)"/)?.[1] ?? null)
    .filter((s): s is string => s !== null);
}

function extractStylesheetHrefs(html: string): string[] {
  return [...html.matchAll(/<link\b[^>]*>/g)]
    .map((m) => {
      if (!/rel=["']stylesheet["']/.test(m[0])) return null;
      return m[0].match(/\bhref="([^"]+)"/)?.[1] ?? null;
    })
    .filter((s): s is string => s !== null);
}

function resolveAssetPath(ref: string): string {
  return resolve(DIST, ref.replace(/^\.\//, ''));
}

describe('build output', () => {
  describe('required files', () => {
    it('dist/manifest.json exists', () => {
      expect(
        existsSync(resolve(DIST, 'manifest.json')),
        'dist/manifest.json is missing — Chrome will not load the extension without it',
      ).toBe(true);
    });

    it('dist/devtools.html exists', () => {
      expect(
        existsSync(resolve(DIST, 'devtools.html')),
        'dist/devtools.html is missing — the sidebar pane cannot be registered',
      ).toBe(true);
    });

    it('dist/sidebar.html exists', () => {
      expect(
        existsSync(resolve(DIST, 'sidebar.html')),
        'dist/sidebar.html is missing — the sidebar UI cannot render',
      ).toBe(true);
    });
  });

  describe('manifest.json', () => {
    let manifest: Record<string, unknown>;

    beforeAll(() => {
      const raw = readFileSync(resolve(DIST, 'manifest.json'), 'utf-8');
      manifest = JSON.parse(raw) as Record<string, unknown>;
    });

    it('has manifest_version 3', () => {
      expect(manifest.manifest_version, 'manifest_version must be the number 3 for MV3').toBe(3);
    });

    it('has a name', () => {
      expect(typeof manifest.name, 'name is required for Chrome extension loading').toBe('string');
    });

    it('has devtools_page pointing to an existing file', () => {
      expect(
        typeof manifest.devtools_page,
        'devtools_page is required — without it the sidebar pane is never registered',
      ).toBe('string');
      expect(
        existsSync(resolve(DIST, manifest.devtools_page as string)),
        `devtools_page "${manifest.devtools_page}" does not exist in dist/`,
      ).toBe(true);
    });
  });

  describe('sidebar.html bundle references', () => {
    let sidebarHtml: string;

    beforeAll(() => {
      sidebarHtml = readFileSync(resolve(DIST, 'sidebar.html'), 'utf-8');
    });

    it('all script src files exist in dist/', () => {
      const srcs = extractScriptSrcs(sidebarHtml);
      expect(srcs.length, 'sidebar.html should have at least one <script src>').toBeGreaterThan(0);
      for (const src of srcs) {
        expect(existsSync(resolveAssetPath(src)), `referenced script "${src}" is missing`).toBe(
          true,
        );
      }
    });

    it('all stylesheet href files exist in dist/', () => {
      const hrefs = extractStylesheetHrefs(sidebarHtml);
      for (const href of hrefs) {
        expect(
          existsSync(resolveAssetPath(href)),
          `referenced stylesheet "${href}" is missing`,
        ).toBe(true);
      }
    });
  });

  describe('MV3 CSP constraints', () => {
    it('no <link rel="modulepreload"> in output HTML', () => {
      for (const file of ['sidebar.html', 'devtools.html']) {
        const content = readFileSync(resolve(DIST, file), 'utf-8');
        expect(
          content,
          `${file} must not contain <link rel="modulepreload"> — MV3 CSP blocks it at runtime`,
        ).not.toMatch(/rel=["']modulepreload["']/);
      }
    });
  });
});
