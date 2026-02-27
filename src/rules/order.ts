import type { RuleDescriptor } from './types.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'item-no-order',
  label: 'order on non-flex/grid item',
  requiredProperties: ['order'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (ctx.isFlexItem || ctx.isGridItem) return [];
    if (!ctx.parentStyles) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex/grid item.
    const parentDisplay = ctx.parentStyles.display ?? 'block';
    if (parentDisplay === 'contents') return [];

    const { order } = ctx.styles;
    if (order === '0') return [];

    return [
      {
        ruleId: 'item-no-order',
        property: 'order',
        severity: 'warning',
        title: 'order has no effect',
        details: `order is "${order}" but parent display is "${parentDisplay}". order works on flex/grid items only.`,
        suggestion: 'Set display: flex or display: grid on the parent element, or remove order.',
      },
    ];
  },
};

registerRule(rule);

export const checkOrder = rule.check;
