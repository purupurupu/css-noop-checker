import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultMarginValue, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'inline-no-vertical-margin',
  label: 'vertical margin on inline',
  requiredProperties: ['display', 'marginTop', 'marginBottom'],
  check(ctx) {
    const { display, marginTop, marginBottom } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const warnings: Warning[] = [];

    if (!isDefaultMarginValue(marginTop)) {
      warnings.push({
        ruleId: 'inline-no-vertical-margin',
        property: 'margin-top',
        severity: 'warning',
        title: 'margin-top has no effect on this inline element',
        details: `margin-top is "${marginTop}" but display is "inline". Vertical margins do not apply to inline non-replaced elements.`,
        suggestion: 'Consider using display: inline-block or display: block, or remove margin-top.',
      });
    }

    if (!isDefaultMarginValue(marginBottom)) {
      warnings.push({
        ruleId: 'inline-no-vertical-margin',
        property: 'margin-bottom',
        severity: 'warning',
        title: 'margin-bottom has no effect on this inline element',
        details: `margin-bottom is "${marginBottom}" but display is "inline". Vertical margins do not apply to inline non-replaced elements.`,
        suggestion:
          'Consider using display: inline-block or display: block, or remove margin-bottom.',
      });
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineVerticalMargin = rule.check;
