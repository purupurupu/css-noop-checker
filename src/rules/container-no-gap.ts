import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultGapLikeValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'container-no-gap',
  label: 'gap on non-flex/grid',
  requiredProperties: ['display', 'gap', 'rowGap', 'columnGap', 'columnCount', 'columnWidth'],
  check(ctx) {
    const { display, gap, rowGap, columnGap, columnCount, columnWidth } = ctx.styles;

    if (isFlexOrGridContainer(display)) return [];
    if (display === 'contents') return [];

    const warnings: Warning[] = [];

    const hasGap = !isDefaultGapLikeValue(gap);
    const hasRowGap = !isDefaultGapLikeValue(rowGap);
    const hasColumnGap = !isDefaultGapLikeValue(columnGap);
    const isMultiColumnContainer = columnCount !== 'auto' || (columnWidth ?? 'auto') !== 'auto';
    const columnGapHasNoEffect = hasColumnGap && !isMultiColumnContainer;

    if (hasGap && hasRowGap && columnGapHasNoEffect && rowGap === columnGap) {
      warnings.push({
        ruleId: 'container-no-gap',
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
        ruleId: 'container-no-gap',
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
        ruleId: 'container-no-gap',
        property: 'column-gap',
        severity: 'warning',
        title: 'column-gap has no effect',
        details: `column-gap is "${columnGap}" but display is "${display}". column-gap works on flex/grid/multi-column containers only.`,
        suggestion: 'Set display: flex or display: grid on this element, or remove column-gap.',
      });
    }

    return warnings;
  },
};

registerRule(rule);

export const checkGap = rule.check;
