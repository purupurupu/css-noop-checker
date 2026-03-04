import type { ElementData, RuleContext } from './types.ts';

function normalizeStyles(styles: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    result[key] = value.trim().toLowerCase();
  }
  return result;
}

export function createRuleContext(element: ElementData): RuleContext {
  const styles = normalizeStyles(element.computedStyles);
  const parentStyles = element.parent ? normalizeStyles(element.parent.computedStyles) : null;
  const parentDisplay = parentStyles?.display ?? '';
  return {
    element,
    styles,
    inlineStyles: normalizeStyles(element.inlineStyles ?? {}),
    parentStyles,
    parentDisplay,
    isFlexItem: isFlexContainer(parentDisplay),
    isGridItem: isGridContainer(parentDisplay),
    isContents: styles.display === 'contents',
    isParentContents: parentDisplay === 'contents',
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
  return value
    .trim()
    .split(/\s+/)
    .every((v) => v === 'normal');
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

export function isVerticalAlignApplicable(display: string): boolean {
  return (
    display === 'inline' ||
    display === 'inline-block' ||
    display === 'inline-flex' ||
    display === 'inline-grid' ||
    display === 'table-cell' ||
    display === 'inline-table' ||
    display === 'table-row' ||
    display === 'table-row-group' ||
    display === 'table-header-group' ||
    display === 'table-footer-group'
  );
}

export function isDefaultVerticalAlignValue(value: string): boolean {
  return value === 'baseline';
}

export function isDefaultZIndexValue(value: string): boolean {
  return value === 'auto';
}

export function isDefaultFlexDirectionValue(value: string): boolean {
  return value === 'row';
}

export function isDefaultFlexWrapValue(value: string): boolean {
  return value === 'nowrap';
}

export function isDefaultOverflowValue(value: string): boolean {
  return value === 'visible';
}

export function isDefaultSelfAlignmentValue(value: string): boolean {
  return value === 'auto' || value === 'normal';
}
