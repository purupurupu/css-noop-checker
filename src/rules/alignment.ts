import type { ElementData, Warning } from './types.ts';

const FLEX_GRID_DISPLAYS = new Set([
  'flex', 'inline-flex', 'grid', 'inline-grid',
]);

export function checkAlignment(data: ElementData): Warning[] {
  const { display, alignItems, justifyContent } = data.computedStyles;

  if (FLEX_GRID_DISPLAYS.has(display)) return [];

  const warnings: Warning[] = [];

  if (alignItems !== 'normal') {
    warnings.push({
      ruleId: 'C-2',
      severity: 'warning',
      title: 'align-items has no effect',
      details: `align-items is "${alignItems}" but display is "${display}". align-items works on flex/grid containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove align-items.',
    });
  }

  if (justifyContent !== 'normal') {
    warnings.push({
      ruleId: 'C-2',
      severity: 'warning',
      title: 'justify-content has no effect',
      details: `justify-content is "${justifyContent}" but display is "${display}". justify-content works on flex/grid containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove justify-content.',
    });
  }

  return warnings;
}
