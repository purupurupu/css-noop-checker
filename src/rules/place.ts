import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'C-3',
  label: 'place-* on non-flex/grid',
  requiredProperties: ['display', 'placeItems', 'placeContent'],
  check(ctx) {
    const { display, placeItems, placeContent } = ctx.styles;
    if (isFlexOrGridContainer(display)) return [];
    if (display === 'contents') return [];

    const warnings: Warning[] = [];

    if (!isDefaultAlignmentValue(placeItems)) {
      warnings.push({
        ruleId: 'C-3',
        property: 'place-items',
        severity: 'warning',
        title: 'place-items has no effect',
        details: `place-items is "${placeItems}" but display is "${display}". place-items works on flex/grid containers only.`,
        suggestion: 'Set display: flex or display: grid on this element, or remove place-items.',
      });
    }

    if (!isDefaultAlignmentValue(placeContent)) {
      warnings.push({
        ruleId: 'C-3',
        property: 'place-content',
        severity: 'warning',
        title: 'place-content has no effect',
        details: `place-content is "${placeContent}" but display is "${display}". place-content works on flex/grid containers only.`,
        suggestion: 'Set display: flex or display: grid on this element, or remove place-content.',
      });
    }

    return warnings;
  },
};

registerRule(rule);

export const checkPlace = rule.check;
