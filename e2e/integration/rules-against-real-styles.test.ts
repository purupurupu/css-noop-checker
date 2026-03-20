import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { extractElementData } from '../helpers/extract-element-data.ts';
import { analyzeElement } from '../../src/rules/engine.ts';
import { getRules } from '../../src/rules/registry.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_HTML = `file://${path.resolve(__dirname, '../../examples/test.html')}`;

// Update this when adding/removing test cases in test.html.
const EXPECTED_CASE_COUNT = 398;

const registeredRuleIds = new Set(getRules().map((r) => r.id));

test.describe('rules against real browser computed styles', () => {
  test('canary: getComputedStyle returns expected defaults', async ({ page }) => {
    await page.goto(TEST_HTML);

    const placeContent = await page.evaluate(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const value = getComputedStyle(div).placeContent;
      div.remove();
      return value;
    });

    expect(placeContent).toBe('normal');
  });

  test('canary: animationTimingFunction returns "ease" not cubic-bezier', async ({ page }) => {
    await page.goto('about:blank');

    const timingFunction = await page.evaluate(() => {
      const div = document.createElement('div');
      document.body.appendChild(div);
      const value = getComputedStyle(div).animationTimingFunction;
      div.remove();
      return value;
    });

    expect(timingFunction).toBe('ease');
  });

  test('all test cases produce expected warnings', async ({ page }) => {
    await page.goto(TEST_HTML);

    const cases = page.locator('.case[data-rule]');
    const caseCount = await cases.count();
    expect(caseCount, `expected ${EXPECTED_CASE_COUNT} test cases in test.html`).toBe(
      EXPECTED_CASE_COUNT,
    );

    for (let i = 0; i < caseCount; i++) {
      const caseEl = cases.nth(i);
      const rule = await caseEl.getAttribute('data-rule');
      if (!rule) {
        throw new Error(`Test case at index ${i} is missing the data-rule attribute`);
      }
      const classList = await caseEl.evaluate((el) => Array.from(el.classList));
      const expectWarn = classList.includes('expect-warn');
      const expectOk = classList.includes('expect-ok');
      const label = (await caseEl.locator('.label').textContent()) ?? `(no label, index ${i})`;

      // Validate data-rule references a registered rule (or "none")
      if (rule !== 'none' && !registeredRuleIds.has(rule)) {
        throw new Error(
          `case "${label}" has data-rule="${rule}" which is not a registered rule ID. ` +
            `Registered: ${[...registeredRuleIds].join(', ')}`,
        );
      }

      const target = caseEl.locator('[data-target]');
      await expect(target, `case "${label}" must have a [data-target] element`).toHaveCount(1);

      const data = await extractElementData(target);
      const warnings = analyzeElement(data);

      // Handle "none" rule cases — verify zero warnings with no rule-specific match
      if (rule === 'none') {
        expect(warnings, `"${label}" should produce no warnings`).toHaveLength(0);
        continue;
      }

      expect(expectWarn || expectOk, `case "${label}" must have expect-warn or expect-ok`).toBe(
        true,
      );

      const matchingWarnings = warnings.filter((w) => w.ruleId === rule);

      if (expectWarn) {
        expect(
          matchingWarnings.length,
          `"${label}" should trigger rule "${rule}" but got: ${JSON.stringify(warnings.map((w) => w.ruleId))}`,
        ).toBeGreaterThan(0);
      } else {
        expect(
          matchingWarnings.length,
          `"${label}" should NOT trigger rule "${rule}" but it fired`,
        ).toBe(0);
      }
    }
  });
});
