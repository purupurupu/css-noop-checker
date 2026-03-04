import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'positioned-no-clear' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'clear on absolute/fixed positioned element',
  requiredProperties: ['position', 'clear'],
  check(ctx) {
    const { position, clear } = ctx.styles;

    // clear has no effect on absolute/fixed positioned elements (they are out of normal flow)
    if (position !== 'absolute' && position !== 'fixed') return [];

    if (clear === 'none') return [];

    return [
      warn({
        property: 'clear',
        title: 'clear has no effect',
        details: `clear is "${clear}" but position is "${position}". Absolute and fixed positioned elements are removed from normal flow, so clear has no effect.`,
        suggestion: 'Remove the clear property, or change position to static, relative, or sticky.',
      }),
    ];
  },
};

registerRule(rule);

export const checkPositionedNoClear = rule.check;
