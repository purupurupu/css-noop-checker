import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';
import { isDefaultMarginValue } from './context.ts';

const RULE_ID = 'table-no-padding' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

/**
 * Table internal box types where padding has no effect per CSS 2.1 / CSS Tables Level 3.
 * - table-row / table-row-group / table-header-group / table-footer-group
 * - table-column / table-column-group
 *
 * Note: table, inline-table, table-cell, and table-caption DO support padding.
 * display: contents is not checked — it generates no box at all, handled by contents-no-box-props.
 */
const PADDING_IGNORED_TABLE_DISPLAYS = new Set([
  'table-row',
  'table-row-group',
  'table-column',
  'table-column-group',
  'table-header-group',
  'table-footer-group',
]);

const COLUMN_DISPLAYS = new Set(['table-column', 'table-column-group']);

/** Physical/logical pairs — when both are non-default, skip the physical one to avoid double-warnings. */
const PADDING_PAIRS: Array<{
  physical: { key: string; cssName: string };
  logical: { key: string; cssName: string };
}> = [
  {
    physical: { key: 'paddingTop', cssName: 'padding-top' },
    logical: { key: 'paddingBlockStart', cssName: 'padding-block-start' },
  },
  {
    physical: { key: 'paddingBottom', cssName: 'padding-bottom' },
    logical: { key: 'paddingBlockEnd', cssName: 'padding-block-end' },
  },
  {
    physical: { key: 'paddingRight', cssName: 'padding-right' },
    logical: { key: 'paddingInlineEnd', cssName: 'padding-inline-end' },
  },
  {
    physical: { key: 'paddingLeft', cssName: 'padding-left' },
    logical: { key: 'paddingInlineStart', cssName: 'padding-inline-start' },
  },
];

const ALL_PADDING_KEYS = PADDING_PAIRS.flatMap((p) => [p.physical.key, p.logical.key]);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'no-op padding on table internals',
  requiredProperties: ['display', ...ALL_PADDING_KEYS],
  check(ctx) {
    const { display } = ctx.styles;

    if (!PADDING_IGNORED_TABLE_DISPLAYS.has(display)) return [];

    const warnings: Warning[] = [];
    const suggestion = COLUMN_DISPLAYS.has(display)
      ? (cssName: string) => `Padding has no effect on ${display} elements. Remove ${cssName}.`
      : (cssName: string) =>
          `Move the padding to the table-cell elements inside this ${display}, or remove ${cssName}.`;

    const makeWarning = (cssName: string, value: string) =>
      warn({
        property: cssName,
        title: `${cssName} has no effect on display: ${display}`,
        details: `${cssName} is "${value}" but display is "${display}". Padding is ignored on table-row, table-column, and their grouping elements.`,
        suggestion: suggestion(cssName),
      });

    for (const { physical, logical } of PADDING_PAIRS) {
      const physicalValue = ctx.styles[physical.key];
      const logicalValue = ctx.styles[logical.key];
      const physicalNonDefault = !isDefaultMarginValue(physicalValue);
      const logicalNonDefault = !isDefaultMarginValue(logicalValue);

      // Physical: skip when logical counterpart is also non-default (prefer logical to avoid double-warnings)
      if (physicalNonDefault && !logicalNonDefault) {
        warnings.push(makeWarning(physical.cssName, physicalValue));
      }

      // Logical: always warn when non-default
      if (logicalNonDefault) {
        warnings.push(makeWarning(logical.cssName, logicalValue));
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkTablePadding = rule.check;
