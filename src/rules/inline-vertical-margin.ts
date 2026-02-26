import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultMarginValue, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const VERTICAL_MARGIN_PROPERTIES = ['marginTop', 'marginBottom'] as const;

const PROPERTY_CSS_NAMES: Record<string, string> = {
  marginTop: 'margin-top',
  marginBottom: 'margin-bottom',
};

const rule: RuleDescriptor = {
  id: 'inline-no-vertical-margin',
  label: 'vertical margin on inline',
  requiredProperties: ['display', 'marginTop', 'marginBottom'],
  check(ctx) {
    const { display } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const warnings: Warning[] = [];

    for (const prop of VERTICAL_MARGIN_PROPERTIES) {
      const value = ctx.styles[prop];
      if (!isDefaultMarginValue(value)) {
        const cssName = PROPERTY_CSS_NAMES[prop];
        warnings.push({
          ruleId: 'inline-no-vertical-margin',
          property: cssName,
          severity: 'warning',
          title: `${cssName} has no effect on this inline element`,
          details: `${cssName} is "${value}" but display is "inline". Vertical margins do not apply to inline non-replaced elements.`,
          suggestion: `Consider using display: inline-block or display: block, or remove ${cssName}.`,
        });
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineVerticalMargin = rule.check;
