import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const rule: RuleDescriptor = {
  id: 'C-2',
  label: 'align/justify on non-flex/grid',
  requiredProperties: ['display', 'alignItems', 'justifyContent'],
  check(ctx) {
    const { display, alignItems, justifyContent } = ctx.styles;
    if (isFlexOrGridContainer(display)) return [];
    if (display === 'contents') return [];

    const warnings: Warning[] = [];

    if (!isDefaultAlignmentValue(alignItems)) {
      warnings.push({
        ruleId: 'C-2',
        property: 'align-items',
        severity: 'warning',
        title: 'align-items has no effect',
        details: `align-items is "${alignItems}" but display is "${display}". align-items works on flex/grid containers only.`,
        suggestion: 'Set display: flex or display: grid on this element, or remove align-items.',
      });
    }

    if (!isDefaultAlignmentValue(justifyContent)) {
      warnings.push({
        ruleId: 'C-2',
        property: 'justify-content',
        severity: 'warning',
        title: 'justify-content has no effect',
        details: `justify-content is "${justifyContent}" but display is "${display}". justify-content works on flex/grid containers only.`,
        suggestion:
          'Set display: flex or display: grid on this element, or remove justify-content.',
      });
    }

    return warnings;
  },
};

registerRule(rule);

export const checkAlignment = rule.check;
