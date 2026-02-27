import type { RuleDescriptor, Warning } from './types.ts';
import { isDefaultOffsetValue } from './context.ts';
import { registerRule } from './registry.ts';

const OFFSET_PROPERTIES = ['top', 'right', 'bottom', 'left'] as const;

const rule: RuleDescriptor = {
  id: 'static-no-offset',
  label: 'offset on static position',
  requiredProperties: ['position', ...OFFSET_PROPERTIES],
  check(ctx) {
    const { position } = ctx.styles;
    if (position !== 'static') return [];

    const warnings: Warning[] = [];

    for (const prop of OFFSET_PROPERTIES) {
      const value = ctx.styles[prop];
      if (!isDefaultOffsetValue(value)) {
        warnings.push({
          ruleId: 'static-no-offset',
          property: prop,
          severity: 'warning',
          title: `${prop} has no effect`,
          details: `${prop} is "${value}" but position is "static". Offsets only apply to positioned elements.`,
          suggestion: `Set position to relative, absolute, fixed, or sticky, or remove ${prop}.`,
        });
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkStaticPositionOffset = rule.check;
