import type { ElementData, RuleContext } from './types.ts';

function normalizeComputedStyles(styles: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    result[key] = value.trim().toLowerCase();
  }
  return result;
}

export function createRuleContext(element: ElementData): RuleContext {
  const parentStyles = element.parent
    ? normalizeComputedStyles(element.parent.computedStyles)
    : null;
  const parentDisplay = parentStyles?.display ?? '';
  return {
    element,
    styles: normalizeComputedStyles(element.computedStyles),
    parentStyles,
    isFlexItem: isFlexContainer(parentDisplay),
    isGridItem: isGridContainer(parentDisplay),
  };
}

export function isFlexContainer(display: string): boolean {
  return display === 'flex' || display === 'inline-flex';
}

export function isGridContainer(display: string): boolean {
  return display === 'grid' || display === 'inline-grid';
}

export function isFlexOrGridContainer(display: string): boolean {
  return isFlexContainer(display) || isGridContainer(display);
}

export function isDefaultGapLikeValue(value: string): boolean {
  return value === '0px' || value === 'normal';
}

export function isDefaultAlignmentValue(value: string): boolean {
  return value === 'normal';
}

export function isDefaultInlineSizeValue(value: string): boolean {
  return value === 'auto';
}

export function isDefaultOffsetValue(value: string): boolean {
  return value === 'auto';
}

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

export function isReplacedInlineElement(tagName: string): boolean {
  return REPLACED_INLINE_ELEMENTS.has(tagName);
}

export function isDefaultMarginValue(value: string): boolean {
  return value === '0px';
}
