import type { Rule, Warning } from './types.ts';
import { isDefaultGapLikeValue, isFlexOrGridContainer } from './context.ts';

export const checkGap: Rule = (ctx) => {
  const { display, gap, rowGap, columnGap, columnCount } = ctx.styles;

  if (isFlexOrGridContainer(display)) return [];

  const warnings: Warning[] = [];

  const hasGap = !isDefaultGapLikeValue(gap);
  const hasRowGap = !isDefaultGapLikeValue(rowGap);
  const hasColumnGap = !isDefaultGapLikeValue(columnGap);
  const columnGapHasNoEffect = hasColumnGap && columnCount === 'auto';

  if (hasGap && hasRowGap && columnGapHasNoEffect && rowGap === columnGap) {
    warnings.push({
      ruleId: 'C-1',
      property: 'gap',
      severity: 'warning',
      title: 'gap has no effect',
      details: `gap is "${gap}" but display is "${display}". gap works on flex/grid containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove gap.',
    });
    return warnings;
  }

  if (hasRowGap) {
    warnings.push({
      ruleId: 'C-1',
      property: 'row-gap',
      severity: 'warning',
      title: 'row-gap has no effect',
      details: `row-gap is "${rowGap}" but display is "${display}". row-gap works on flex/grid containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove row-gap.',
    });
  }

  // column-gap is valid on multi-column containers (column-count !== "auto")
  if (columnGapHasNoEffect) {
    warnings.push({
      ruleId: 'C-1',
      property: 'column-gap',
      severity: 'warning',
      title: 'column-gap has no effect',
      details: `column-gap is "${columnGap}" but display is "${display}". column-gap works on flex/grid/multi-column containers only.`,
      suggestion: 'Set display: flex or display: grid on this element, or remove column-gap.',
    });
  }

  return warnings;
};
