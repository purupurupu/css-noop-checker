import type { RuleDescriptor } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'container-no-place',
  label: 'place-* on non-flex/grid',
  requiredProperties: ['display', 'placeContent'],
  check(ctx) {
    const { display, placeContent } = ctx.styles;
    if (isFlexOrGridContainer(display)) return [];
    if (display === 'contents') return [];

    if (isDefaultAlignmentValue(placeContent)) return [];

    return [
      {
        ruleId: 'container-no-place',
        property: 'place-content',
        severity: 'warning',
        title: 'place-content has no effect',
        details: `place-content is "${placeContent}" but display is "${display}". place-content works on flex/grid containers only.`,
        suggestion: 'Set display: flex or display: grid on this element, or remove place-content.',
      },
    ];
  },
};

registerRule(rule);

export const checkPlace = rule.check;
