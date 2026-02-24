import type { ElementData, RuleContext } from './types.ts';

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeComputedStyles(
  styles: ElementData['computedStyles'],
): ElementData['computedStyles'] {
  return {
    display: normalize(styles.display),
    width: normalize(styles.width),
    height: normalize(styles.height),
    gap: normalize(styles.gap),
    rowGap: normalize(styles.rowGap),
    columnGap: normalize(styles.columnGap),
    alignItems: normalize(styles.alignItems),
    justifyContent: normalize(styles.justifyContent),
    placeItems: normalize(styles.placeItems),
    placeContent: normalize(styles.placeContent),
    columnCount: normalize(styles.columnCount),
  };
}

export function createRuleContext(element: ElementData): RuleContext {
  return {
    element,
    styles: normalizeComputedStyles(element.computedStyles),
  };
}

export function isFlexOrGridContainer(display: string): boolean {
  return (
    display === 'flex'
    || display === 'inline-flex'
    || display === 'grid'
    || display === 'inline-grid'
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

