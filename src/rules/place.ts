import type { Rule, Warning } from './types.ts';
import { isDefaultAlignmentValue, isGridContainer } from './context.ts';

export const checkPlace: Rule = (ctx) => {
  const { display, placeItems, placeContent } = ctx.styles;
  if (isGridContainer(display)) return [];

  const warnings: Warning[] = [];

  if (!isDefaultAlignmentValue(placeItems)) {
    warnings.push({
      ruleId: 'C-3',
      property: 'place-items',
      severity: 'warning',
      title: 'place-items has no effect',
      details: `place-items is "${placeItems}" but display is "${display}". place-items works on grid containers only.`,
      suggestion: 'Set display: grid on this element, or remove place-items.',
    });
  }

  if (!isDefaultAlignmentValue(placeContent)) {
    warnings.push({
      ruleId: 'C-3',
      property: 'place-content',
      severity: 'warning',
      title: 'place-content has no effect',
      details: `place-content is "${placeContent}" but display is "${display}". place-content works on grid containers only.`,
      suggestion: 'Set display: grid on this element, or remove place-content.',
    });
  }

  return warnings;
};
