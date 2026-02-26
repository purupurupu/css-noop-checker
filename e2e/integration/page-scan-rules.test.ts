import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { extractElementData } from '../helpers/extract-element-data.ts';
import { analyzeElement } from '../../src/rules/engine.ts';
import { groupByRule } from '../../src/sidebar/utils/group-by-rule.ts';
import type { ScanElementData } from '../../src/sidebar/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_HTML = `file://${path.resolve(__dirname, '../../examples/test.html')}`;

test.describe('page scan with parent context', () => {
  test('groupByRule with parent context matches per-element analysis', async ({ page }) => {
    await page.goto(TEST_HTML);

    const cases = page.locator('.case[data-rule]');
    const caseCount = await cases.count();
    expect(caseCount).toBeGreaterThan(0);

    // Build ScanElementData[] from all [data-target] elements (with parent styles)
    const scanElements: ScanElementData[] = [];
    for (let i = 0; i < caseCount; i++) {
      const caseEl = cases.nth(i);
      const target = caseEl.locator('[data-target]');
      const targetCount = await target.count();
      if (targetCount !== 1) continue;

      const data = await extractElementData(target);
      scanElements.push({
        index: i,
        selector: `case-${i}`,
        tagName: data.tagName,
        id: data.id,
        classList: data.classList,
        computedStyles: data.computedStyles,
        parent: data.parent,
      });
    }

    // Run groupByRule (which internally calls analyzeElement with parent context)
    const groups = groupByRule(scanElements);

    // Collect per-element warnings independently for comparison (unique rule IDs per element)
    const perElementRules = new Map<number, Set<string>>();
    for (const el of scanElements) {
      const warnings = analyzeElement({
        tagName: el.tagName,
        id: el.id,
        classList: el.classList,
        computedStyles: el.computedStyles,
        parent: el.parent,
      });
      if (warnings.length > 0) {
        perElementRules.set(el.index, new Set(warnings.map((w) => w.ruleId)));
      }
    }

    // Verify groupByRule results match per-element analysis
    const groupedRules = new Map<number, Set<string>>();
    for (const group of groups) {
      for (const violation of group.violations) {
        const existing = groupedRules.get(violation.index) ?? new Set();
        existing.add(group.ruleId);
        groupedRules.set(violation.index, existing);
      }
    }

    // Both maps should contain the same elements with the same rule IDs
    expect(groupedRules.size).toBe(perElementRules.size);
    for (const [index, ruleIds] of perElementRules) {
      const grouped = groupedRules.get(index);
      expect(grouped, `element at index ${index} missing from groupByRule results`).toBeDefined();
      expect([...ruleIds].sort()).toEqual([...grouped!].sort());
    }
  });

  test('expect-warn cases produce warnings via groupByRule', async ({ page }) => {
    await page.goto(TEST_HTML);

    const warnCases = page.locator('.case.expect-warn[data-rule]');
    const warnCount = await warnCases.count();
    expect(warnCount).toBeGreaterThan(0);

    // Build ScanElementData[] from expect-warn cases
    const scanElements: ScanElementData[] = [];
    const caseRules: { index: number; rule: string; label: string }[] = [];

    for (let i = 0; i < warnCount; i++) {
      const caseEl = warnCases.nth(i);
      const rule = await caseEl.getAttribute('data-rule');
      if (!rule || rule === 'none') continue;

      const target = caseEl.locator('[data-target]');
      const label = (await caseEl.locator('.label').textContent()) ?? `(index ${i})`;
      const data = await extractElementData(target);

      scanElements.push({
        index: i,
        selector: `warn-case-${i}`,
        tagName: data.tagName,
        id: data.id,
        classList: data.classList,
        computedStyles: data.computedStyles,
        parent: data.parent,
      });
      caseRules.push({ index: i, rule, label });
    }

    const groups = groupByRule(scanElements);

    // Every expect-warn case should appear in the group for its data-rule
    for (const { index, rule, label } of caseRules) {
      const group = groups.find((g) => g.ruleId === rule);
      expect(group, `"${label}": rule "${rule}" should have a group in scan results`).toBeDefined();
      const violation = group!.violations.find((v) => v.index === index);
      expect(
        violation,
        `"${label}": should appear as violation for rule "${rule}" in scan results`,
      ).toBeDefined();
    }
  });

  test('expect-ok cases do not produce warnings for their rule via groupByRule', async ({
    page,
  }) => {
    await page.goto(TEST_HTML);

    const okCases = page.locator('.case.expect-ok[data-rule]');
    const okCount = await okCases.count();
    expect(okCount).toBeGreaterThan(0);

    const scanElements: ScanElementData[] = [];
    const caseRules: { index: number; rule: string; label: string }[] = [];

    for (let i = 0; i < okCount; i++) {
      const caseEl = okCases.nth(i);
      const rule = await caseEl.getAttribute('data-rule');
      if (!rule || rule === 'none') continue;

      const target = caseEl.locator('[data-target]');
      const label = (await caseEl.locator('.label').textContent()) ?? `(index ${i})`;
      const data = await extractElementData(target);

      scanElements.push({
        index: i,
        selector: `ok-case-${i}`,
        tagName: data.tagName,
        id: data.id,
        classList: data.classList,
        computedStyles: data.computedStyles,
        parent: data.parent,
      });
      caseRules.push({ index: i, rule, label });
    }

    const groups = groupByRule(scanElements);

    // No expect-ok case should appear in the group for its data-rule
    for (const { index, rule, label } of caseRules) {
      const group = groups.find((g) => g.ruleId === rule);
      if (!group) continue; // No group for this rule at all — OK
      const violation = group.violations.find((v) => v.index === index);
      expect(
        violation,
        `"${label}": should NOT appear as violation for rule "${rule}" in scan results`,
      ).toBeUndefined();
    }
  });
});
