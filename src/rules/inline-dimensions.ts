import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultInlineSizeValue } from './context.ts';
import { registerRule } from './registry.ts';

/**
 * Replaced inline elements (img, input, etc.) accept width/height
 * even when display is "inline", so we must exclude them from D-1.
 */
const REPLACED_INLINE_ELEMENTS = new Set([
  'img',
  'input',
  'video',
  'audio',
  'canvas',
  'embed',
  'object',
  'iframe',
  'select',
  'textarea',
  'button',
  'meter',
  'progress',
]);

const rule: RuleDescriptor = {
  id: 'D-1',
  label: 'width/height on inline',
  requiredProperties: ['display', 'width', 'height'],
  check(ctx) {
    const { display, width, height } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (REPLACED_INLINE_ELEMENTS.has(tagName)) return [];

    const warnings: Warning[] = [];

    if (!isDefaultInlineSizeValue(width)) {
      warnings.push({
        ruleId: 'D-1',
        property: 'width',
        severity: 'warning',
        title: 'width has no effect on inline elements',
        details: `width is "${width}" but display is "inline". Inline elements ignore width.`,
        suggestion: 'Set display: inline-block or display: block, or remove width.',
      });
    }

    if (!isDefaultInlineSizeValue(height)) {
      warnings.push({
        ruleId: 'D-1',
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
