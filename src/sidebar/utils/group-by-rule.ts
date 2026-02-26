import { analyzeElement } from '../../rules/engine.ts';
import type { ElementData, RuleId, Warning } from '../../rules/types.ts';
import type { ScanElementData, ScanGroup, ScanViolation } from '../types.ts';

export function groupByRule(elements: ScanElementData[]): ScanGroup[] {
  const map = new Map<RuleId, ScanViolation[]>();

  for (const el of elements) {
    // TODO: Page scan does not collect parent context. Rules using
    // isFlexItem/isGridItem will not fire here. When a parent-dependent
    // rule is added, extend makeScanScript to collect parentElement styles.
    const elementData: ElementData = {
      tagName: el.tagName,
      id: el.id,
      classList: el.classList,
      computedStyles: el.computedStyles,
      parent: null,
    };
    const warnings = analyzeElement(elementData);
    if (warnings.length === 0) continue;

    const byRule = new Map<RuleId, Warning[]>();
    for (const w of warnings) {
      const existing = byRule.get(w.ruleId) ?? [];
      existing.push(w);
      byRule.set(w.ruleId, existing);
    }

    for (const [ruleId, ruleWarnings] of byRule) {
      const violations = map.get(ruleId) ?? [];
      violations.push({
        index: el.index,
        selector: el.selector,
        warnings: ruleWarnings,
      });
      map.set(ruleId, violations);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ruleId, violations]) => ({ ruleId, violations }));
}
