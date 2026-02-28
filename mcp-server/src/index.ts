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
import { validateUrl } from './url-validation.ts';

const MAX_SELECTOR_LENGTH = 500;

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
      console.error('Failed to launch browser:', err);
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
  } catch (err) {
    console.error('Failed to close browser during shutdown:', err);
  }
  browserInstance = null;
}

process.on('SIGINT', async () => {
  try {
    await shutdown();
  } catch (err) {
    console.error('Error during SIGINT shutdown:', err);
  }
  process.exit(0);
});
process.on('SIGTERM', async () => {
  try {
    await shutdown();
  } catch (err) {
    console.error('Error during SIGTERM shutdown:', err);
  }
  process.exit(0);
});

const server = new McpServer({
  name: 'css-noop-checker',
  version: '0.0.1',
});

server.tool('list_rules', 'List all available CSS no-op detection rules', async () => {
  try {
    const rules = getRules().map((r) => ({
      id: r.id,
      label: r.label,
      requiredProperties: [...r.requiredProperties],
    }));

    return {
      content: [{ type: 'text', text: JSON.stringify(rules, null, 2) }],
    };
  } catch (err) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            { error: `Failed to list rules: ${err instanceof Error ? err.message : err}` },
            null,
            2,
          ),
        },
      ],
      isError: true,
    };
  }
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
    let validatedUrl: string;
    try {
      validatedUrl = validateUrl(url);
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { error: err instanceof Error ? err.message : String(err) },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }

    let browser: Browser;
    try {
      browser = await getBrowser();
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { error: `Failed to launch browser: ${err instanceof Error ? err.message : err}` },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }

    let context: Awaited<ReturnType<Browser['newContext']>> | undefined;
    try {
      context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(validatedUrl, { waitUntil: 'load' });

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
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { error: `Analysis failed: ${err instanceof Error ? err.message : err}` },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    } finally {
      try {
        await context?.close();
      } catch (closeErr) {
        console.error('Failed to close browser context:', closeErr);
      }
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
    let validatedUrl: string;
    try {
      validatedUrl = validateUrl(url);
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { error: err instanceof Error ? err.message : String(err) },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }

    let browser: Browser;
    try {
      browser = await getBrowser();
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { error: `Failed to launch browser: ${err instanceof Error ? err.message : err}` },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    }

    let context: Awaited<ReturnType<Browser['newContext']>> | undefined;
    try {
      context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(validatedUrl, { waitUntil: 'load' });

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
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              { error: `Scan failed: ${err instanceof Error ? err.message : err}` },
              null,
              2,
            ),
          },
        ],
        isError: true,
      };
    } finally {
      try {
        await context?.close();
      } catch (closeErr) {
        console.error('Failed to close browser context:', closeErr);
      }
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
