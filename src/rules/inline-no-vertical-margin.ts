import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isZeroPx, isReplacedInlineElement, isVerticalWritingMode } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'inline-no-vertical-margin' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'vertical margin on inline',
  requiredProperties: ['display', 'writingMode', 'marginTop', 'marginBottom'],
  check(ctx) {
    const { display, writingMode, marginTop, marginBottom } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];
    // In vertical writing modes, margin-top/margin-bottom map to inline-axis
    // margins which DO apply to inline elements. Skip to avoid false positives.
    if (isVerticalWritingMode(writingMode)) return [];

    const warnings: Warning[] = [];

    if (!isZeroPx(marginTop)) {
      warnings.push(
        warn({
          property: 'margin-top',
          title: 'margin-top has no effect on this inline element',
          details: `margin-top is "${marginTop}" but display is "inline". Vertical margins do not apply to inline non-replaced elements.`,
          suggestion:
            'Consider using display: inline-block or display: block, or remove margin-top.',
        }),
      );
    }

    if (!isZeroPx(marginBottom)) {
      warnings.push(
        warn({
          property: 'margin-bottom',
          title: 'margin-bottom has no effect on this inline element',
          details: `margin-bottom is "${marginBottom}" but display is "inline". Vertical margins do not apply to inline non-replaced elements.`,
          suggestion:
            'Consider using display: inline-block or display: block, or remove margin-bottom.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineVerticalMargin = rule.check;
