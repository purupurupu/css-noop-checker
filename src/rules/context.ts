import type { ElementData, RuleContext } from './types.ts';

function normalizeComputedStyles(styles: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    result[key] = value.trim().toLowerCase();
  }
  return result;
}

export function createRuleContext(element: ElementData): RuleContext {
  return {
    element,
    styles: normalizeComputedStyles(element.computedStyles),
  };
}

export function isFlexOrGridContainer(display: string): boolean {
  return (
    display === 'flex' ||
    display === 'inline-flex' ||
    display === 'grid' ||
    display === 'inline-grid'
  );
}

export function isGridContainer(display: string): boolean {
  return display === 'grid' || display === 'inline-grid';
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
