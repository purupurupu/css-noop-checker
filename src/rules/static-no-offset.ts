import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultOffsetValue } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'static-no-offset' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const OFFSET_PROPERTIES = ['top', 'right', 'bottom', 'left'] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'offset on static position',
  requiredProperties: ['position', ...OFFSET_PROPERTIES],
  check(ctx) {
    if (ctx.isContents) return [];
    const { position } = ctx.styles;
    if (position !== 'static') return [];

    const warnings: Warning[] = [];

    for (const prop of OFFSET_PROPERTIES) {
      const value = ctx.styles[prop];
      if (!isDefaultOffsetValue(value)) {
        warnings.push(
          warn({
            property: prop,
            title: `${prop} has no effect`,
            details: `${prop} is "${value}" but position is "static". Offsets only apply to positioned elements.`,
            suggestion: `Set position to relative, absolute, fixed, or sticky, or remove ${prop}.`,
          }),
        );
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkStaticPositionOffset = rule.check;
