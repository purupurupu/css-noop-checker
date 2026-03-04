import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultSelfAlignmentValue } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'item-no-self-align' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'align-self on non-flex/grid item',
  requiredProperties: ['alignSelf'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (ctx.isFlexItem || ctx.isGridItem) return [];
    if (!ctx.parentStyles) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex/grid item.
    if (ctx.isParentContents) return [];

    const { alignSelf } = ctx.styles;
    if (isDefaultSelfAlignmentValue(alignSelf)) return [];

    return [
      warn({
        property: 'align-self',
        title: 'align-self has no effect',
        details: `align-self is "${alignSelf}" but parent display is "${ctx.parentDisplay}". align-self works on flex/grid items only.`,
        suggestion:
          'Set display: flex or display: grid on the parent element, or remove align-self.',
      }),
    ];
  },
};

registerRule(rule);

export const checkSelfAlignment = rule.check;
