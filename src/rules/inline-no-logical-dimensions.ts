import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultInlineSizeValue, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'inline-no-logical-dimensions',
  label: 'inline-size/block-size on inline',
  requiredProperties: ['display', 'inlineSize', 'blockSize'],
  check(ctx) {
    const { display, inlineSize, blockSize } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const warnings: Warning[] = [];

    if (!isDefaultInlineSizeValue(inlineSize)) {
      warnings.push({
        ruleId: 'inline-no-logical-dimensions',
        property: 'inline-size',
        severity: 'warning',
        title: 'inline-size has no effect on inline elements',
        details: `inline-size is "${inlineSize}" but display is "inline". Inline elements ignore inline-size.`,
        suggestion: 'Set display: inline-block or display: block, or remove inline-size.',
      });
    }

    if (!isDefaultInlineSizeValue(blockSize)) {
      warnings.push({
        ruleId: 'inline-no-logical-dimensions',
        property: 'block-size',
        severity: 'warning',
        title: 'block-size has no effect on inline elements',
        details: `block-size is "${blockSize}" but display is "inline". Inline elements ignore block-size.`,
        suggestion: 'Set display: inline-block or display: block, or remove block-size.',
      });
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineLogicalDimensions = rule.check;
