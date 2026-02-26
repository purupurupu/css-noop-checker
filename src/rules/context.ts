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

export function isDefaultZIndexValue(value: string): boolean {
  return value === 'auto';
}

/**
 * Returns true when computed styles indicate the element creates a stacking context
 * via properties other than `position` (which callers check separately).
 *
 * Covers: opacity, transform, filter, perspective, clip-path, isolation,
 *         mix-blend-mode, contain, and will-change.
 */
export function isStackingContext(styles: Record<string, string>): boolean {
  if (styles['opacity'] !== '1') return true;
  if (styles['transform'] !== 'none') return true;
  if (styles['filter'] !== 'none') return true;
  if (styles['perspective'] !== 'none') return true;
  if (styles['clipPath'] !== 'none') return true;
  if (styles['isolation'] === 'isolate') return true;
  if (styles['mixBlendMode'] !== 'normal') return true;

  const contain = styles['contain'] ?? '';
  if (/\b(layout|paint|strict|content)\b/.test(contain)) return true;

  const willChange = styles['willChange'] ?? 'auto';
  if (/\b(transform|opacity|filter|perspective|clip-path)\b/.test(willChange)) return true;

  return false;
}
