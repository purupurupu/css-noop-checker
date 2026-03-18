import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isMulticolContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'multicol-no-column-rule' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const MULTICOL_PROPERTIES = [
  {
    key: 'columnRuleStyle',
    cssName: 'column-rule-style',
    // 'medium' is the specified initial value; '0px' is the computed value
    // when column-rule-style is 'none'. Both are treated as defaults.
    defaults: ['none'],
    shorthand: 'column-rule',
  },
  {
    key: 'columnRuleWidth',
    cssName: 'column-rule-width',
    defaults: ['medium', '0px'],
    shorthand: 'column-rule',
  },
  {
    key: 'columnFill',
    cssName: 'column-fill',
    defaults: ['balance'],
  },
] as const;

const DETAIL_SUFFIX =
  'This property only applies when column-count or column-width establishes a multi-column layout.';

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'column-rule/column-fill on non-multicol container',
  requiredProperties: [
    'display',
    'columnCount',
    'columnWidth',
    ...MULTICOL_PROPERTIES.map((p) => p.key),
  ],
  check(ctx) {
    const { display, columnCount, columnWidth } = ctx.styles;

    if (isMulticolContainer(display, columnCount, columnWidth)) return [];

    const warnings: Warning[] = [];

    for (const prop of MULTICOL_PROPERTIES) {
      const value = ctx.styles[prop.key];
      if ((prop.defaults as readonly string[]).includes(value)) continue;

      const removeHint =
        'shorthand' in prop
          ? `Remove ${prop.cssName} (or the ${prop.shorthand} shorthand)`
          : `Remove ${prop.cssName}`;

      warnings.push(
        warn({
          property: prop.cssName,
          title: `${prop.cssName} has no effect`,
          details: `${prop.cssName} is "${value}" but this element is not a multi-column container. ${DETAIL_SUFFIX}`,
          suggestion: `${removeHint}, or add column-count/column-width to create a multi-column layout.`,
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkMulticolColumnRule = rule.check;
