import type { RuleDescriptor } from './types.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'visible-overflow-no-text-overflow',
  label: 'text-overflow on visible overflow',
  requiredProperties: ['display', 'textOverflow', 'overflowX'],
  check(ctx) {
    const { display, textOverflow, overflowX } = ctx.styles;

    // display:contents elements have no box, so overflow is irrelevant
    if (display === 'contents') return [];

    // Only flag when text-overflow is explicitly set to a non-default value
    if (textOverflow === 'clip') return [];

    // text-overflow requires overflow to be non-visible to take effect
    if (overflowX !== 'visible') return [];

    return [
      {
        ruleId: 'visible-overflow-no-text-overflow',
        property: 'text-overflow',
        severity: 'warning',
        title: 'text-overflow has no effect',
        details: `text-overflow is "${textOverflow}" but overflow-x is "visible". Set overflow: hidden (or clip/scroll/auto) for text-overflow to work.`,
        suggestion:
          'Add overflow: hidden to make text-overflow take effect. Also add white-space: nowrap if you want single-line ellipsis truncation.',
      },
    ];
  },
};

registerRule(rule);

export const checkVisibleOverflowTextOverflow = rule.check;
