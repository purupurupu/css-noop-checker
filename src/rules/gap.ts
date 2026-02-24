import type { ElementData, Warning } from './types.ts';

const FLEX_GRID_DISPLAYS = new Set([
  'flex', 'inline-flex', 'grid', 'inline-grid',
]);

function isNonDefaultGap(value: string): boolean {
  return value !== '0px' && value !== 'normal';
}

export function checkGap(data: ElementData): Warning[] {
  const { display, rowGap, columnGap, columnCount } = data.computedStyles;

  if (FLEX_GRID_DISPLAYS.has(display)) return [];

  const warnings: Warning[] = [];

  if (isNonDefaultGap(rowGap)) {
    warnings.push({
      ruleId: 'C-1',
      severity: 'warning',
      title: 'row-gap has no effect',
      details: `row-gap is "${rowGap}" but display is "${display}". row-gap works on flex/grid containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove row-gap.',
    });
  }

  // column-gap is valid on multi-column containers (column-count !== "auto")
  if (isNonDefaultGap(columnGap) && columnCount === 'auto') {
    warnings.push({
      ruleId: 'C-1',
      severity: 'warning',
      title: 'column-gap has no effect',
      details: `column-gap is "${columnGap}" but display is "${display}". column-gap works on flex/grid/multi-column containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove column-gap.',
    });
  }

  return warnings;
}
