import type { RuleDescriptor } from './types.ts';
import { isDefaultSelfAlignmentValue } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'item-no-self-align',
  label: 'align-self on non-flex/grid item',
  requiredProperties: ['alignSelf'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (ctx.isFlexItem || ctx.isGridItem) return [];
    if (!ctx.parentStyles) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex/grid item.
    const parentDisplay = ctx.parentStyles.display ?? 'block';
    if (parentDisplay === 'contents') return [];

    const { alignSelf } = ctx.styles;
    if (isDefaultSelfAlignmentValue(alignSelf)) return [];

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
