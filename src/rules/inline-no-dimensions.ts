import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultInlineSizeValue, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'inline-no-dimensions',
  label: 'width/height on inline',
  requiredProperties: ['display', 'width', 'height', 'inlineSize', 'blockSize'],
  check(ctx) {
    const { display, width, height, inlineSize, blockSize } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const warnings: Warning[] = [];

    // Skip width warning when inlineSize is non-auto — inline-no-logical-dimensions
    // will cover it. In horizontal writing mode, setting inline-size also computes
    // width to the same value, so both rules would fire without this guard.
    //
    // Known limitation: in vertical writing modes (e.g. writing-mode: vertical-rl),
    // the logical-to-physical mapping is rotated — inline-size maps to height and
    // block-size maps to width. The dedup guards here pair width↔inlineSize and
    // height↔blockSize, which only holds in horizontal writing mode. In vertical
    // mode, the guard fails to suppress the physical-property warning, so the user
    // may see both a physical warning (e.g. "height") from this rule AND a logical
    // warning (e.g. "inline-size") from inline-no-logical-dimensions for a single
    // authored declaration. This is acceptable because vertical writing mode +
    // inline non-replaced elements is extremely rare.
    if (!isDefaultInlineSizeValue(width) && isDefaultInlineSizeValue(inlineSize)) {
      warnings.push({
        ruleId: 'inline-no-dimensions',
        property: 'width',
        severity: 'warning',
        title: 'width has no effect on inline elements',
        details: `width is "${width}" but display is "inline". Inline elements ignore width.`,
        suggestion: 'Set display: inline-block or display: block, or remove width.',
      });
    }

    // Skip height warning when blockSize is non-auto — same dedup logic.
    if (!isDefaultInlineSizeValue(height) && isDefaultInlineSizeValue(blockSize)) {
      warnings.push({
        ruleId: 'inline-no-dimensions',
        property: 'height',
        severity: 'warning',
        title: 'height has no effect on inline elements',
        details: `height is "${height}" but display is "inline". Inline elements ignore height.`,
        suggestion: 'Set display: inline-block or display: block, or remove height.',
      });
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineDimensions = rule.check;
