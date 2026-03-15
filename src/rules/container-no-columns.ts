import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-columns' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'column properties on flex/grid container',
  requiredProperties: ['display', 'columnCount', 'columnWidth'],
  check(ctx) {
    const { display, columnCount, columnWidth } = ctx.styles;

    if (!isFlexOrGridContainer(display)) return [];

    const warnings: Warning[] = [];

    if (columnCount !== 'auto') {
      warnings.push(
        warn({
          property: 'column-count',
          title: 'column-count has no effect',
          details: `column-count is "${columnCount}" but display is "${display}". column-count works on block-level containers only.`,
          suggestion:
            'Remove column-count, or change display to block if you want multi-column layout.',
        }),
      );
    }

    if (columnWidth !== 'auto') {
      warnings.push(
        warn({
          property: 'column-width',
          title: 'column-width has no effect',
          details: `column-width is "${columnWidth}" but display is "${display}". column-width works on block-level containers only.`,
          suggestion:
            'Remove column-width, or change display to block if you want multi-column layout.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkColumns = rule.check;
