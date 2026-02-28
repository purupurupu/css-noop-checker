#!/usr/bin/env tsx
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { chromium } from 'playwright';
import type { Browser } from 'playwright';
import { analyzeElement } from '../../src/rules/engine.ts';
import { getRules } from '../../src/rules/registry.ts';
import {
  extractElementBySelector,
  scanAllElements,
} from '../../e2e/helpers/extract-element-data.ts';
import type { ElementData } from '../../src/rules/types.ts';

const MAX_SELECTOR_LENGTH = 500;

// Check whether a dotted-quad IPv4 address falls in a private/reserved range.
function isPrivateIPv4(dottedQuad: string): boolean {
  const parts = dottedQuad.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!parts) return false;
  const [, a, b] = parts.map(Number);
  if (a === 127) return true; // 127.0.0.0/8   loopback
  if (a === 10) return true; //  10.0.0.0/8    RFC-1918
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12 RFC-1918
  if (a === 192 && b === 168) return true; // 192.168.0.0/16 RFC-1918
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 link-local / cloud metadata
  if (a === 0) return true; //   0.0.0.0/8     "this" network
  return false;
}

// Reject hostnames that resolve to private/loopback/link-local addresses (SSRF mitigation).
function isPrivateHost(hostname: string): boolean {
  // Strip IPv6 brackets
  const host = hostname.startsWith('[') ? hostname.slice(1, -1) : hostname;
  const lower = host.toLowerCase();

  // Well-known loopback / unspecified names
  if (lower === 'localhost' || lower === '0.0.0.0') return true;

  // IPv6 loopback / unspecified
  if (lower === '::1' || lower === '::') return true;

  // IPv6-mapped IPv4 — e.g. ::ffff:127.0.0.1 or ::ffff:0:127.0.0.1
  const v4Mapped = lower.match(/^::ffff:(?:0:)?(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (v4Mapped && isPrivateIPv4(v4Mapped[1])) return true;

  // Decimal-notation IPv4 — browsers resolve all-numeric hostnames as 32-bit IPs
  if (/^\d+$/.test(host)) return true;

  // Dotted-quad IPv4
  if (isPrivateIPv4(host)) return true;

  return false;
}

function validateUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(
      `Unsupported URL scheme "${parsed.protocol}". Only http: and https: are allowed.`,
    );
  }
  if (isPrivateHost(parsed.hostname)) {
    throw new Error(`Access to private/internal address "${parsed.hostname}" is not allowed.`);
  }
  return parsed.href;
}

// Persistent browser instance with lazy init and launch-race guard
let browserInstance: Browser | null = null;
let launchPromise: Promise<Browser> | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance?.isConnected()) return browserInstance;
  if (launchPromise) return launchPromise;
  launchPromise = chromium.launch().then(
    (b) => {
      browserInstance = b;
      launchPromise = null;
      return b;
    },
    (err) => {
      launchPromise = null;
      throw err;
    },
  );
  return launchPromise;
}

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  // Brief grace period lets in-flight page.evaluate() calls settle
  // before we pull the browser out from under them.
  await new Promise((r) => setTimeout(r, 500));
  try {
    if (browserInstance?.isConnected()) {
      await browserInstance.close();
    }
  } catch {
    // Suppress errors during shutdown — browser may already be gone
  }
  browserInstance = null;
}

process.on('SIGINT', async () => {
  await shutdown();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await shutdown();
  process.exit(0);
});

const server = new McpServer({
  name: 'css-noop-checker',
  version: '0.0.1',
});

server.tool('list_rules', 'List all available CSS no-op detection rules', async () => {
  const rules = getRules().map((r) => ({
    id: r.id,
    label: r.label,
    requiredProperties: [...r.requiredProperties],
  }));

  return {
    content: [{ type: 'text', text: JSON.stringify(rules, null, 2) }],
  };
});

server.tool(
  'analyze_element',
  'Analyze a specific element on a page for CSS no-op violations',
  {
    url: z.string().describe('URL of the page to analyze (http/https only)'),
    selector: z
      .string()
      .max(MAX_SELECTOR_LENGTH, `Selector must be at most ${MAX_SELECTOR_LENGTH} characters`)
      .describe('CSS selector for the target element'),
  },
  async ({ url, selector }) => {
    const validatedUrl = validateUrl(url);
    const browser = await getBrowser();
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      // H1: Use 'load' instead of 'networkidle' which hangs on SPAs
      await page.goto(validatedUrl, { waitUntil: 'load' });

      // M4: Check element exists before evaluating
      const elementData = await extractElementBySelector(page, selector);
      if (!elementData) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                { error: `No element found matching selector: ${selector}` },
                null,
                2,
              ),
            },
          ],
          isError: true,
        };
      }

      const warnings = analyzeElement(elementData);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                element: {
                  tagName: elementData.tagName,
                  id: elementData.id,
                  classList: elementData.classList,
                },
                warnings,
              },
              null,
              2,
            ),
          },
        ],
      };
    } finally {
      await context.close();
    }
  },
);

server.tool(
  'scan_page',
  'Scan all elements on a page for CSS no-op violations',
  {
    url: z.string().describe('URL of the page to scan (http/https only)'),
  },
  async ({ url }) => {
    const validatedUrl = validateUrl(url);
    const browser = await getBrowser();
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      // H1: Use 'load' instead of 'networkidle'
      await page.goto(validatedUrl, { waitUntil: 'load' });

      // H3: scanAllElements caps at 5000 elements and reports truncation
      const { elements, totalOnPage, truncated } = await scanAllElements(page);
      const violations: {
        index: number;
        selector: string;
        warnings: ReturnType<typeof analyzeElement>;
      }[] = [];

      for (const el of elements) {
        const elementData: ElementData = {
          tagName: el.tagName,
          id: el.id,
          classList: el.classList,
          computedStyles: el.computedStyles,
          parent: el.parent,
        };
        const warnings = analyzeElement(elementData);
        if (warnings.length > 0) {
          violations.push({
            index: el.index,
            selector: el.selector,
            warnings,
          });
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                totalElements: totalOnPage,
                scannedElements: elements.length,
                truncated,
                totalViolations: violations.length,
                violations,
              },
              null,
              2,
            ),
          },
        ],
      };
    } finally {
      await context.close();
    }
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('MCP server error:', error);
  process.exit(1);
});
