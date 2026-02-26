import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { extractElementData } from '../helpers/extract-element-data.ts';
import { analyzeElement } from '../../src/rules/engine.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_HTML = `file://${path.resolve(__dirname, '../../examples/test.html')}`;

const EXPECTED_CASE_COUNT = 60;

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
      const classList = await caseEl.evaluate((el) => Array.from(el.classList));
      const expectWarn = classList.includes('expect-warn');
      const expectOk = classList.includes('expect-ok');
      const label = await caseEl.locator('.label').textContent();

      // Skip "none" rule cases — these just verify zero warnings overall
      if (rule === 'none') {
        const target = caseEl.locator('[data-target]');
        const data = await extractElementData(page, target);
        const warnings = analyzeElement(data);
        expect(warnings, `"${label}" should produce no warnings`).toHaveLength(0);
        continue;
      }

      expect(expectWarn || expectOk, `case "${label}" must have expect-warn or expect-ok`).toBe(
        true,
      );

      const target = caseEl.locator('[data-target]');
      await expect(target, `case "${label}" must have a [data-target] element`).toHaveCount(1);

      const data = await extractElementData(page, target);
      const warnings = analyzeElement(data);
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
