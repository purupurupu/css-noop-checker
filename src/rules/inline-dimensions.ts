import type { ElementData, Warning } from './types.ts';

/**
 * Replaced inline elements (img, input, etc.) accept width/height
 * even when display is "inline", so we must exclude them from D-1.
 */
const REPLACED_INLINE_ELEMENTS = new Set([
  'img', 'input', 'video', 'audio', 'canvas', 'embed',
  'object', 'iframe', 'select', 'textarea', 'button',
  'meter', 'progress',
]);

export function checkInlineDimensions(data: ElementData): Warning[] {
  const { display, width, height } = data.computedStyles;

  if (display !== 'inline') return [];
  if (REPLACED_INLINE_ELEMENTS.has(data.tagName)) return [];

  const warnings: Warning[] = [];

  if (width !== 'auto') {
    warnings.push({
      ruleId: 'D-1',
      severity: 'warning',
      title: 'width has no effect on inline elements',
      details: `width is "${width}" but display is "inline". Inline elements ignore width.`,
      suggestion: 'Set display: inline-block or display: block, or remove width.',
    });
  }

  if (height !== 'auto') {
    warnings.push({
      ruleId: 'D-1',
      severity: 'warning',
      title: 'height has no effect on inline elements',
      details: `height is "${height}" but display is "inline". Inline elements ignore height.`,
      suggestion: 'Set display: inline-block or display: block, or remove height.',
    });
  }

  return warnings;
}
