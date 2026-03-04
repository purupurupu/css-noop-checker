import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'item-no-order' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'order on non-flex/grid item',
  requiredProperties: ['order'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (ctx.isFlexItem || ctx.isGridItem) return [];
    if (!ctx.parentStyles) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex/grid item.
    if (ctx.isParentContents) return [];

    const { order } = ctx.styles;
    if (order === '0') return [];

    return [
      warn({
        property: 'order',
        title: 'order has no effect',
        details: `order is "${order}" but parent display is "${ctx.parentDisplay}". order works on flex/grid items only.`,
        suggestion: 'Set display: flex or display: grid on the parent element, or remove order.',
      }),
    ];
  },
};

registerRule(rule);

export const checkOrder = rule.check;
