import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultInlineSizeValue, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'inline-no-dimensions' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'width/height on inline',
  requiredProperties: ['display', 'width', 'height'],
  check(ctx) {
    const { display, width, height } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const warnings: Warning[] = [];

    if (!isDefaultInlineSizeValue(width)) {
      warnings.push(
        warn({
          property: 'width',
          title: 'width has no effect on inline elements',
          details: `width is "${width}" but display is "inline". Inline elements ignore width.`,
          suggestion: 'Set display: inline-block or display: block, or remove width.',
        }),
      );
    }

    if (!isDefaultInlineSizeValue(height)) {
      warnings.push(
        warn({
          property: 'height',
          title: 'height has no effect on inline elements',
          details: `height is "${height}" but display is "inline". Inline elements ignore height.`,
          suggestion: 'Set display: inline-block or display: block, or remove height.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineDimensions = rule.check;
