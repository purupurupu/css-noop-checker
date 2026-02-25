import type { Rule, Warning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';

export const checkAlignment: Rule = (ctx) => {
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
      suggestion: 'Set display: flex or display: grid on this element, or remove justify-content.',
    });
  }

  return warnings;
};
