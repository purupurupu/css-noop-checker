import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-place' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'place-* on non-flex/grid',
  requiredProperties: ['display', 'placeContent', 'placeItems'],
  check(ctx) {
    const { display, placeContent, placeItems } = ctx.styles;
    if (isFlexOrGridContainer(display)) return [];
    if (ctx.isContents) return [];

    const warnings: Warning[] = [];

    if (!isDefaultAlignmentValue(placeContent)) {
      warnings.push(
        warn({
          property: 'place-content',
          title: 'place-content has no effect',
          details: `place-content is "${placeContent}" but display is "${display}". place-content works on flex/grid containers only.`,
          suggestion:
            'Set display: flex or display: grid on this element, or remove place-content.',
        }),
      );
    }

    if (!isDefaultAlignmentValue(placeItems)) {
      warnings.push(
        warn({
          property: 'place-items',
          title: 'place-items has no effect',
          details: `place-items is "${placeItems}" but display is "${display}". place-items works on flex/grid containers only.`,
          suggestion: 'Set display: flex or display: grid on this element, or remove place-items.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkPlace = rule.check;
