import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isZeroPx, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'inline-no-logical-vertical-margin' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'margin-block on inline',
  requiredProperties: ['display', 'marginBlockStart', 'marginBlockEnd'],
  check(ctx) {
    const { display, marginBlockStart, marginBlockEnd } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const warnings: Warning[] = [];

    if (!isZeroPx(marginBlockStart)) {
      warnings.push(
        warn({
          property: 'margin-block-start',
          title: 'margin-block-start has no effect on this inline element',
          details: `margin-block-start is "${marginBlockStart}" but display is "inline". Block-axis margins do not apply to inline non-replaced elements.`,
          suggestion:
            'Consider using display: inline-block or display: block, or remove margin-block-start.',
        }),
      );
    }

    if (!isZeroPx(marginBlockEnd)) {
      warnings.push(
        warn({
          property: 'margin-block-end',
          title: 'margin-block-end has no effect on this inline element',
          details: `margin-block-end is "${marginBlockEnd}" but display is "inline". Block-axis margins do not apply to inline non-replaced elements.`,
          suggestion:
            'Consider using display: inline-block or display: block, or remove margin-block-end.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineLogicalVerticalMargin = rule.check;
