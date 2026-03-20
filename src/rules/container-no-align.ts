import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer, isMulticolContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-align' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'align/justify on non-flex/grid/multi-column',
  requiredProperties: ['display', 'alignItems', 'justifyContent', 'columnCount', 'columnWidth'],
  check(ctx) {
    const { display, alignItems, justifyContent, columnCount, columnWidth } = ctx.styles;
    if (isFlexOrGridContainer(display)) return [];
    if (ctx.isContents) return [];

    const warnings: Warning[] = [];

    if (!isDefaultAlignmentValue(alignItems)) {
      warnings.push(
        warn({
          property: 'align-items',
          title: 'align-items has no effect',
          details: `align-items is "${alignItems}" but display is "${display}". align-items works on flex/grid containers only.`,
          suggestion: 'Set display: flex or display: grid on this element, or remove align-items.',
        }),
      );
    }

    // justify-content is valid on multi-column containers
    if (
      !isDefaultAlignmentValue(justifyContent) &&
      !isMulticolContainer(display, columnCount, columnWidth)
    ) {
      warnings.push(
        warn({
          property: 'justify-content',
          title: 'justify-content has no effect',
          details: `justify-content is "${justifyContent}" but display is "${display}". justify-content works on flex/grid/multi-column containers only.`,
          suggestion:
            'Set display: flex, display: grid, or set column-count / column-width on this element, or remove justify-content.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkAlignment = rule.check;
