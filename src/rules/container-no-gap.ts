import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultGapLikeValue, isFlexOrGridContainer, isMulticolContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-gap' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'gap on non-flex/grid',
  requiredProperties: ['display', 'gap', 'rowGap', 'columnGap', 'columnCount', 'columnWidth'],
  check(ctx) {
    const { display, gap, rowGap, columnGap, columnCount, columnWidth } = ctx.styles;

    if (isFlexOrGridContainer(display)) return [];
    if (ctx.isContents) return [];

    const warnings: Warning[] = [];

    const hasGap = !isDefaultGapLikeValue(gap);
    const hasRowGap = !isDefaultGapLikeValue(rowGap);
    const hasColumnGap = !isDefaultGapLikeValue(columnGap);
    const columnGapHasNoEffect =
      hasColumnGap && !isMulticolContainer(display, columnCount, columnWidth);

    if (hasGap && hasRowGap && columnGapHasNoEffect && rowGap === columnGap) {
      warnings.push(
        warn({
          property: 'gap',
          title: 'gap has no effect',
          details: `gap is "${gap}" but display is "${display}". gap works on flex/grid containers only.`,
          suggestion: 'Set display: flex or display: grid on this element, or remove gap.',
        }),
      );
      return warnings;
    }

    if (hasRowGap) {
      warnings.push(
        warn({
          property: 'row-gap',
          title: 'row-gap has no effect',
          details: `row-gap is "${rowGap}" but display is "${display}". row-gap works on flex/grid containers only.`,
          suggestion: 'Set display: flex or display: grid on this element, or remove row-gap.',
        }),
      );
    }

    // column-gap is valid on multi-column containers (column-count !== "auto")
    if (columnGapHasNoEffect) {
      warnings.push(
        warn({
          property: 'column-gap',
          title: 'column-gap has no effect',
          details: `column-gap is "${columnGap}" but display is "${display}". column-gap works on flex/grid/multi-column containers only.`,
          suggestion: 'Set display: flex or display: grid on this element, or remove column-gap.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkGap = rule.check;
