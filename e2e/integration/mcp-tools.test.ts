import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Trigger rule registration side effects
import '../../src/rules/engine.ts';
import { getRules } from '../../src/rules/registry.ts';
import { analyzeElement } from '../../src/rules/engine.ts';
import { extractElementBySelector, scanAllElements } from '../helpers/extract-element-data.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_HTML = `file://${path.resolve(__dirname, '../../examples/test.html')}`;

test.describe('MCP server tools', () => {
  test('list_rules returns all registered rules', () => {
    const rules = getRules();
    expect(rules.length).toBeGreaterThan(0);

    for (const rule of rules) {
      expect(rule.id).toBeTruthy();
      expect(rule.label).toBeTruthy();
      expect(rule.requiredProperties.length).toBeGreaterThan(0);
    }
  });

  test('analyze_element detects violations for a specific element', async ({ page }) => {
    await page.goto(TEST_HTML);

    // Find an expect-warn case and use its data-target element
    const warnCase = page.locator('.case.expect-warn[data-rule]').first();
    const rule = await warnCase.getAttribute('data-rule');
    expect(rule).toBeTruthy();

    const elementData = await extractElementBySelector(
      page,
      `.case.expect-warn[data-rule="${rule}"] [data-target]`,
    );

    expect(elementData).not.toBeNull();
    expect(elementData!.tagName).toBeTruthy();
    expect(elementData!.computedStyles).toBeDefined();

    const warnings = analyzeElement(elementData!);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.ruleId === rule)).toBe(true);
  });

  test('analyze_element returns null for non-existent selector', async ({ page }) => {
    await page.goto(TEST_HTML);
    const result = await extractElementBySelector(page, '#does-not-exist-at-all');
    expect(result).toBeNull();
  });

  test('scan_page detects known violations across all elements', async ({ page }) => {
    await page.goto(TEST_HTML);

    const { elements, totalOnPage, truncated } = await scanAllElements(page);
    expect(elements.length).toBeGreaterThan(0);
    // totalOnPage counts ALL DOM nodes; elements excludes non-rendered tags (script, style, etc.)
    expect(totalOnPage).toBeGreaterThanOrEqual(elements.length);
    expect(truncated).toBe(false);

    // Analyze all elements and collect violations
    const violations: { selector: string; warnings: ReturnType<typeof analyzeElement> }[] = [];
    for (const el of elements) {
      const warnings = analyzeElement(el);
      if (warnings.length > 0) {
        violations.push({ selector: el.selector, warnings });
      }
    }

    // test.html has many expect-warn cases, so we should find violations
    expect(violations.length).toBeGreaterThan(0);

    // Verify violation structure
    for (const v of violations) {
      expect(v.selector).toBeTruthy();
      for (const w of v.warnings) {
        expect(w.ruleId).toBeTruthy();
        expect(w.property).toBeTruthy();
        expect(w.severity).toBe('warning');
        expect(w.title).toBeTruthy();
      }
    }
  });

  test('extractElementBySelector returns valid ElementData', async ({ page }) => {
    await page.goto(TEST_HTML);

    const data = await extractElementBySelector(page, 'body');
    expect(data).not.toBeNull();
    expect(data!.tagName).toBe('body');
    expect(data!.computedStyles).toBeDefined();
    expect(typeof data!.computedStyles['display']).toBe('string');
  });
});
