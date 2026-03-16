import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'scroll-snap-no-align-without-type' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

// Limitation: only the direct parent is checked for scroll-snap-type.
// A grandparent scroll snap container will not suppress the warning.
// This matches the single-parent-layer approach used by other item-no-* rules.
const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'scroll-snap child properties without parent scroll-snap-type',
  requiredProperties: ['scrollSnapAlign', 'scrollSnapStop'],
  requiredParentProperties: ['scrollSnapType'],
  check(ctx) {
    if (!ctx.parentStyles) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively inside a scroll snap container.
    if (ctx.isParentContents) return [];

    const parentType = ctx.parentStyles['scrollSnapType'] ?? 'none';
    if (parentType !== 'none') return [];

    const align = ctx.styles['scrollSnapAlign'] ?? 'none';
    const stop = ctx.styles['scrollSnapStop'] ?? 'normal';

    // Chrome may serialize the two-value default as "none none"
    const hasNonDefaultAlign = align !== 'none' && align !== 'none none';
    const hasNonDefaultStop = stop !== 'normal';

    if (!hasNonDefaultAlign && !hasNonDefaultStop) return [];

    const warnings: Warning[] = [];

    if (hasNonDefaultAlign) {
      warnings.push(
        warn({
          property: 'scroll-snap-align',
          title: 'scroll-snap-align has no effect without scroll-snap-type on parent',
          details: `scroll-snap-align is "${align}" but the parent has no scroll-snap-type. scroll-snap-align only works on children of a scroll snap container.`,
          suggestion:
            'Add scroll-snap-type to the parent element (e.g. scroll-snap-type: y mandatory), or remove scroll-snap-align.',
        }),
      );
    }

    if (hasNonDefaultStop) {
      warnings.push(
        warn({
          property: 'scroll-snap-stop',
          title: 'scroll-snap-stop has no effect without scroll-snap-type on parent',
          details: `scroll-snap-stop is "${stop}" but the parent has no scroll-snap-type. scroll-snap-stop only works on children of a scroll snap container.`,
          suggestion:
            'Add scroll-snap-type to the parent element (e.g. scroll-snap-type: y mandatory), or remove scroll-snap-stop.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkScrollSnapNoAlignWithoutType = rule.check;
