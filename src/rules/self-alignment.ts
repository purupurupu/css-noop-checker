import type { RuleDescriptor } from './types.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'item-no-self-align',
  label: 'align-self on non-flex/grid item',
  requiredProperties: ['alignSelf'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (ctx.isFlexItem || ctx.isGridItem) return [];
    if (!ctx.parentStyles) return [];

    const { alignSelf } = ctx.styles;
    // align-self initial value is "auto" (inherits parent's align-items),
    // but some browsers may compute it as "normal"
    if (alignSelf === 'auto' || alignSelf === 'normal') return [];

    const parentDisplay = ctx.parentStyles?.display ?? 'block';

    return [
      {
        ruleId: 'item-no-self-align',
        property: 'align-self',
        severity: 'warning',
        title: 'align-self has no effect',
        details: `align-self is "${alignSelf}" but parent display is "${parentDisplay}". align-self works on flex/grid items only.`,
        suggestion:
          'Set display: flex or display: grid on the parent element, or remove align-self.',
      },
    ];
  },
};

registerRule(rule);

export const checkSelfAlignment = rule.check;
