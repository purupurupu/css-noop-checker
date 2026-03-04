import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'item-no-float' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'float on flex/grid item',
  requiredProperties: ['cssFloat'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (!ctx.parentStyles) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex/grid item.
    if (ctx.isParentContents) return [];

    if (!ctx.isFlexItem && !ctx.isGridItem) return [];

    const { cssFloat } = ctx.styles;
    if (cssFloat === 'none') return [];

    return [
      warn({
        property: 'float',
        title: 'float has no effect',
        details: `float is "${cssFloat}" but parent display is "${ctx.parentDisplay}". Float is ignored on flex and grid items per the CSS specification.`,
        suggestion:
          'Remove the float property — flex and grid layouts handle alignment and positioning directly.',
      }),
    ];
  },
};

registerRule(rule);

export const checkItemNoFloat = rule.check;
