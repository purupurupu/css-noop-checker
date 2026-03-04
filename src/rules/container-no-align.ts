import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-align' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'align/justify on non-flex/grid',
  requiredProperties: ['display', 'alignItems', 'justifyContent'],
  check(ctx) {
    const { display, alignItems, justifyContent } = ctx.styles;
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

    if (!isDefaultAlignmentValue(justifyContent)) {
      warnings.push(
        warn({
          property: 'justify-content',
          title: 'justify-content has no effect',
          details: `justify-content is "${justifyContent}" but display is "${display}". justify-content works on flex/grid containers only.`,
          suggestion:
            'Set display: flex or display: grid on this element, or remove justify-content.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkAlignment = rule.check;
