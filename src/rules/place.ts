import type { ElementData, Warning } from './types.ts';

/**
 * place-items and place-content work on both flex AND grid containers.
 * (place-content = align-content + justify-content, both apply to flex/grid)
 * (place-items = align-items + justify-items, align-items applies to flex/grid)
 */
const FLEX_GRID_DISPLAYS = new Set([
  'flex', 'inline-flex', 'grid', 'inline-grid',
]);

export function checkPlace(data: ElementData): Warning[] {
  const { display, placeItems, placeContent } = data.computedStyles;

  if (FLEX_GRID_DISPLAYS.has(display)) return [];

  const warnings: Warning[] = [];

  if (placeItems !== 'normal') {
    warnings.push({
      ruleId: 'C-3',
      severity: 'warning',
      title: 'place-items has no effect',
      details: `place-items is "${placeItems}" but display is "${display}". place-items works on flex/grid containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove place-items.',
    });
  }

  if (placeContent !== 'normal') {
    warnings.push({
      ruleId: 'C-3',
      severity: 'warning',
      title: 'place-content has no effect',
      details: `place-content is "${placeContent}" but display is "${display}". place-content works on flex/grid containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove place-content.',
    });
  }

  return warnings;
}
