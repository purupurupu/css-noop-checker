import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { chromium } from 'playwright';
import type { Browser, Page } from 'playwright';
import { analyzeElement } from '../../src/rules/engine.ts';
import { getRules } from '../../src/rules/registry.ts';
import {
  extractElementBySelector,
  scanAllElements,
} from '../../e2e/helpers/extract-element-data.ts';
import { validateUrl } from './url-validation.ts';

declare const __PKG_VERSION__: string;

const MAX_SELECTOR_LENGTH = 500;

function mcpError(message: string) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify({ error: message }, null, 2) }],
    isError: true as const,
  };
}

function mcpSuccess(data: unknown) {
  return {
    content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }],
  };
}

// Persistent browser instance with lazy init and launch-race guard
let browserInstance: Browser | null = null;
let launchPromise: Promise<Browser> | null = null;
let shuttingDown = false;

function isBrowserNotInstalledError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message;
  return msg.includes("Executable doesn't exist") || msg.includes('PLAYWRIGHT_BROWSERS_PATH');
}

async function getBrowser(): Promise<Browser> {
  if (shuttingDown) throw new Error('Server is shutting down');
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
      if (isBrowserNotInstalledError(err)) {
        const helpMsg =
          'Chromium browser is not installed for Playwright.\n' +
          'Run the following command to install it:\n\n' +
          '  npx playwright install chromium\n';
        console.error(helpMsg);
        throw new Error(helpMsg);
      }
      console.error('Failed to launch browser:', err);
      throw err;
    },
  );
  return launchPromise;
}

async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  try {
    if (browserInstance?.isConnected()) {
      // Brief grace period lets in-flight page.evaluate() calls settle
      // before we pull the browser out from under them.
      await new Promise((r) => setTimeout(r, 500));
      await browserInstance.close();
    }
  } catch (err) {
    console.error('Failed to close browser during shutdown:', err);
  }
  browserInstance = null;
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    try {
      await shutdown();
    } catch (err) {
      console.error(`Error during ${signal} shutdown:`, err);
    }
    process.exit(0);
  });
}

const server = new McpServer({
  name: 'css-noop-checker',
  version: typeof __PKG_VERSION__ !== 'undefined' ? __PKG_VERSION__ : '0.0.0-dev',
});

server.tool('list_rules', 'List all available CSS no-op detection rules', async () => {
  try {
    const rules = getRules().map((r) => ({
      id: r.id,
      label: r.label,
      requiredProperties: [...r.requiredProperties],
    }));

    return mcpSuccess(rules);
  } catch (err) {
    return mcpError(`Failed to list rules: ${err instanceof Error ? err.message : err}`);
  }
});

type McpResult = ReturnType<typeof mcpSuccess> | ReturnType<typeof mcpError>;

async function withPage(
  url: string,
  errorLabel: string,
  fn: (page: Page) => Promise<McpResult>,
): Promise<McpResult> {
  let validatedUrl: string;
  try {
    validatedUrl = validateUrl(url);
  } catch (err) {
    return mcpError(err instanceof Error ? err.message : String(err));
  }

  let browser: Browser;
  try {
    browser = await getBrowser();
  } catch (err) {
    return mcpError(`Failed to launch browser: ${err instanceof Error ? err.message : err}`);
  }

  let context: Awaited<ReturnType<Browser['newContext']>> | undefined;
  try {
    context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(validatedUrl, { waitUntil: 'load' });
    return await fn(page);
  } catch (err) {
    return mcpError(`${errorLabel}: ${err instanceof Error ? err.message : err}`);
  } finally {
    try {
      await context?.close();
    } catch (closeErr) {
      console.error('Failed to close browser context:', closeErr);
    }
  }
}

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
  async ({ url, selector }) =>
    withPage(url, 'Analysis failed', async (page) => {
      const elementData = await extractElementBySelector(page, selector);
      if (!elementData) {
        return mcpError(`No element found matching selector: ${selector}`);
      }

      const warnings = analyzeElement(elementData);

      return mcpSuccess({
        element: {
          tagName: elementData.tagName,
          id: elementData.id,
          classList: elementData.classList,
        },
        warnings,
      });
    }),
);

server.tool(
  'scan_page',
  'Scan all elements on a page for CSS no-op violations',
  {
    url: z.string().describe('URL of the page to scan (http/https only)'),
  },
  async ({ url }) =>
    withPage(url, 'Scan failed', async (page) => {
      const { elements, totalOnPage, truncated } = await scanAllElements(page);
      const violations: {
        index: number;
        selector: string;
        warnings: ReturnType<typeof analyzeElement>;
      }[] = [];

      for (const el of elements) {
        const warnings = analyzeElement(el);
        if (warnings.length > 0) {
          violations.push({
            index: el.index,
            selector: el.selector,
            warnings,
          });
        }
      }

      return mcpSuccess({
        totalElements: totalOnPage,
        scannedElements: elements.length,
        truncated,
        totalViolations: violations.length,
        violations,
      });
    }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('MCP server error:', error);
  process.exit(1);
});
