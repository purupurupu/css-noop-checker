import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
// Trigger rule registration side effects so the registry is populated.
import '../../src/rules/engine.ts';
import { buildEvalScript } from '../../src/sidebar/hooks/build-eval-script.ts';
import { isElementData } from '../../src/rules/validation.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_HTML = `file://${path.resolve(__dirname, '../../examples/test.html')}`;

/**
 * Wrap the generated eval script so that `$0` becomes a function parameter
 * instead of a DevTools magic variable. This lets us call the script in a
 * normal browser context via `fn(element)`.
 */
function compileEvalScript(script: string): string {
  // The script is an IIFE: `(function() { var el = $0; ... })()`
  // Replace `$0` with the parameter name so we can bind it at call-time.
  return `(function($0) { return ${script}; })`;
}

test.describe('buildEvalScript() browser execution', () => {
  const script = buildEvalScript();

  test('generated script has no syntax errors', () => {
    // new Function() will throw SyntaxError if the script is malformed.
    expect(() => new Function('$0', `return ${script}`)).not.toThrow();
  });

  test('returns null when $0 is null (no element selected)', async ({ page }) => {
    await page.goto(TEST_HTML);
    const wrapper = compileEvalScript(script);
    const result = await page.evaluate(`${wrapper}(null)`);
    expect(result).toBeNull();
  });

  test('returns valid ElementData for a block element', async ({ page }) => {
    await page.goto(TEST_HTML);
    const wrapper = compileEvalScript(script);

    const result = await page.evaluate((fn) => {
      const div = document.createElement('div');
      div.id = 'eval-test-block';
      div.className = 'foo bar';
      document.body.appendChild(div);
      // biome-ignore lint: eval is intentional for testing generated script
      const data = eval(`${fn}(div)`);
      div.remove();
      return data;
    }, wrapper);

    expect(result).not.toBeNull();
    expect(isElementData(result)).toBe(true);
    expect(result.tagName).toBe('div');
    expect(result.id).toBe('eval-test-block');
    expect(result.classList).toEqual(['foo', 'bar']);
    expect(result.parent).not.toBeNull();
  });

  test('returns valid ElementData for an inline element', async ({ page }) => {
    await page.goto(TEST_HTML);
    const wrapper = compileEvalScript(script);

    const result = await page.evaluate((fn) => {
      const span = document.createElement('span');
      document.body.appendChild(span);
      // biome-ignore lint: eval is intentional for testing generated script
      const data = eval(`${fn}(span)`);
      span.remove();
      return data;
    }, wrapper);

    expect(result).not.toBeNull();
    expect(isElementData(result)).toBe(true);
    expect(result.tagName).toBe('span');
    expect(result.computedStyles).toBeDefined();
  });

  test('extracts parent styles for a flex item', async ({ page }) => {
    await page.goto(TEST_HTML);
    const wrapper = compileEvalScript(script);

    const result = await page.evaluate((fn) => {
      const container = document.createElement('div');
      container.style.display = 'flex';
      const child = document.createElement('div');
      container.appendChild(child);
      document.body.appendChild(container);
      // biome-ignore lint: eval is intentional for testing generated script
      const data = eval(`${fn}(child)`);
      container.remove();
      return data;
    }, wrapper);

    expect(result).not.toBeNull();
    expect(isElementData(result)).toBe(true);
    expect(result.parent).not.toBeNull();
    expect(result.parent!.computedStyles).toBeDefined();
  });

  test('all test.html targets produce valid ElementData', async ({ page }) => {
    await page.goto(TEST_HTML);
    const wrapper = compileEvalScript(script);

    const targets = page.locator('[data-target]');
    const count = await targets.count();
    expect(count, 'expected test.html to have [data-target] elements').toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const target = targets.nth(i);
      const tag = await target.evaluate((el) => el.tagName.toLowerCase());

      const result = await target.evaluate((_el, fn) => {
        // biome-ignore lint: eval is intentional for testing generated script
        return eval(`${fn}(_el)`);
      }, wrapper);

      expect(result, `[data-target] #${i} (<${tag}>) returned null`).not.toBeNull();
      expect(
        isElementData(result),
        `[data-target] #${i} (<${tag}>) failed isElementData validation: ${JSON.stringify(result)}`,
      ).toBe(true);
    }
  });
});
