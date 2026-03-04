import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'visible-overflow-no-text-overflow' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'text-overflow on visible overflow',
  requiredProperties: ['display', 'textOverflow', 'overflowX'],
  check(ctx) {
    const { textOverflow, overflowX } = ctx.styles;

    // display:contents elements have no box, so overflow is irrelevant
    if (ctx.isContents) return [];

    // Only flag when text-overflow is explicitly set to a non-default value
    if (textOverflow === 'clip') return [];

    // text-overflow requires overflow to be non-visible to take effect
    if (overflowX !== 'visible') return [];

    return [
      warn({
        property: 'text-overflow',
        title: 'text-overflow has no effect',
        details: `text-overflow is "${textOverflow}" but overflow-x is "visible". Set overflow: hidden (or clip/scroll/auto) for text-overflow to work.`,
        suggestion:
          'Add overflow: hidden to make text-overflow take effect. Also add white-space: nowrap if you want single-line ellipsis truncation.',
      }),
    ];
  },
};

registerRule(rule);

export const checkVisibleOverflowTextOverflow = rule.check;
