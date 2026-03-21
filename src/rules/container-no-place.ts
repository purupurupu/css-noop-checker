import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-place' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'place-items on non-flex/grid',
  requiredProperties: ['display', 'placeItems'],
  // Note: place-content is intentionally NOT checked here.
  // place-content is a shorthand for align-content + justify-content.
  // Since align-content works in block layout (Chrome 123+), place-content
  // is at least partially effective on block containers and should not be
  // flagged as a complete no-op.
  check(ctx) {
    const { display, placeItems } = ctx.styles;
    if (isFlexOrGridContainer(display)) return [];
    if (ctx.isContents) return [];

    if (!isDefaultAlignmentValue(placeItems)) {
      return [
        warn({
          property: 'place-items',
          title: 'place-items has no effect',
          details: `place-items is "${placeItems}" but display is "${display}". place-items works on flex/grid containers only.`,
          suggestion: 'Set display: flex or display: grid on this element, or remove place-items.',
        }),
      ];
    }

    return [];
  },
};

registerRule(rule);

export const checkPlace = rule.check;
