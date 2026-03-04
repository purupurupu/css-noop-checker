import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultVerticalAlignValue, isVerticalAlignApplicable } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'block-no-vertical-align' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'vertical-align on block-level element',
  requiredProperties: ['display', 'verticalAlign'],
  check(ctx) {
    const { display, verticalAlign } = ctx.styles;
    if (isVerticalAlignApplicable(display)) return [];
    if (ctx.isContents) return [];
    if (isDefaultVerticalAlignValue(verticalAlign)) return [];

    return [
      warn({
        property: 'vertical-align',
        title: 'vertical-align has no effect',
        details: `vertical-align is "${verticalAlign}" but display is "${display}". vertical-align works on inline-level elements and table cells only.`,
        suggestion:
          'Set display: inline-block or display: table-cell on this element, or remove vertical-align.',
      }),
    ];
  },
};

registerRule(rule);

export const checkBlockVerticalAlign = rule.check;
