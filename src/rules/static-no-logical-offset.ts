import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultOffsetValue } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'static-no-logical-offset' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const LOGICAL_OFFSET_PROPERTIES = [
  { key: 'insetBlockStart', cssName: 'inset-block-start' },
  { key: 'insetBlockEnd', cssName: 'inset-block-end' },
  { key: 'insetInlineStart', cssName: 'inset-inline-start' },
  { key: 'insetInlineEnd', cssName: 'inset-inline-end' },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'logical offset on static position',
  requiredProperties: ['position', ...LOGICAL_OFFSET_PROPERTIES.map((p) => p.key)],
  check(ctx) {
    const { position } = ctx.styles;
    if (position !== 'static') return [];

    const warnings: Warning[] = [];

    for (const { key, cssName } of LOGICAL_OFFSET_PROPERTIES) {
      const value = ctx.styles[key];
      if (!isDefaultOffsetValue(value)) {
        warnings.push(
          warn({
            property: cssName,
            title: `${cssName} has no effect`,
            details: `${cssName} is "${value}" but position is "static". Logical offsets only apply to positioned elements.`,
            suggestion: `Set position to relative, absolute, fixed, or sticky, or remove ${cssName}.`,
          }),
        );
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkStaticLogicalOffset = rule.check;
