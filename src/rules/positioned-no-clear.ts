import type { RuleDescriptor } from './types.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'positioned-no-clear',
  label: 'clear on absolute/fixed positioned element',
  requiredProperties: ['position', 'clear'],
  check(ctx) {
    const { position, clear } = ctx.styles;

    // clear has no effect on absolute/fixed positioned elements (they are out of normal flow)
    if (position !== 'absolute' && position !== 'fixed') return [];

    if (clear === 'none') return [];

    return [
      {
        ruleId: 'positioned-no-clear',
        property: 'clear',
        severity: 'warning',
        title: 'clear has no effect',
        details: `clear is "${clear}" but position is "${position}". Absolute and fixed positioned elements are removed from normal flow, so clear has no effect.`,
        suggestion: 'Remove the clear property, or change position to static, relative, or sticky.',
      },
    ];
  },
};

registerRule(rule);

export const checkPositionedNoClear = rule.check;
