import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultVerticalAlignValue, isInlineLevel } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'block-no-vertical-align',
  label: 'vertical-align on block-level element',
  requiredProperties: ['display', 'verticalAlign'],
  check(ctx) {
    const { display, verticalAlign } = ctx.styles;
    if (isInlineLevel(display)) return [];
    if (display === 'contents') return [];
    if (!verticalAlign || isDefaultVerticalAlignValue(verticalAlign)) return [];

    const warnings: Warning[] = [
      {
        ruleId: 'block-no-vertical-align',
        property: 'vertical-align',
        severity: 'warning',
        title: 'vertical-align has no effect',
        details: `vertical-align is "${verticalAlign}" but display is "${display}". vertical-align works on inline-level elements and table cells only.`,
        suggestion:
          'Set display: inline-block or display: table-cell on this element, or remove vertical-align.',
      },
    ];

    return warnings;
  },
};

registerRule(rule);

export const checkBlockVerticalAlign = rule.check;
