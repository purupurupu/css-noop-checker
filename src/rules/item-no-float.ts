import type { RuleDescriptor } from './types.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'item-no-float',
  label: 'float on flex/grid item',
  requiredProperties: ['cssFloat'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (!ctx.parentStyles) return [];

    // Only applies when parent is a flex or grid container.
    // Note: display:contents parents produce isFlexItem=false / isGridItem=false
    // (since 'contents' is not a flex/grid container type), so this guard
    // implicitly skips them. Without grandparent data we cannot determine
    // if the element effectively participates in a flex/grid context.
    if (!ctx.isFlexItem && !ctx.isGridItem) return [];

    const { cssFloat } = ctx.styles;
    if (cssFloat === 'none') return [];

    const parentDisplay = ctx.parentStyles.display ?? 'block';

    return [
      {
        ruleId: 'item-no-float',
        property: 'float',
        severity: 'warning',
        title: 'float has no effect',
        details: `float is "${cssFloat}" but parent display is "${parentDisplay}". Float is ignored on flex and grid items per the CSS specification.`,
        suggestion:
          'Remove the float property — flex and grid layouts handle alignment and positioning directly.',
      },
    ];
  },
};

registerRule(rule);

export const checkItemNoFloat = rule.check;
