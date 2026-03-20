import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'element-no-table-props' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const TABLE_DISPLAYS = new Set(['table', 'inline-table']);

const TABLE_INTERNAL_DISPLAYS = new Set([
  'table-row',
  'table-cell',
  'table-row-group',
  'table-header-group',
  'table-footer-group',
  'table-column',
  'table-column-group',
  'table-caption',
]);

const TABLE_PROPERTIES = [
  { key: 'borderCollapse', cssName: 'border-collapse', defaultValue: 'separate', inherited: true },
  { key: 'tableLayout', cssName: 'table-layout', defaultValue: 'auto', inherited: false },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'table props on non-table',
  requiredProperties: ['display', ...TABLE_PROPERTIES.map((p) => p.key)],
  requiredInlineProperties: ['borderCollapse'],
  check(ctx) {
    const { display } = ctx.styles;

    if (TABLE_DISPLAYS.has(display)) return [];
    if (ctx.isContents) return [];

    const warnings: Warning[] = [];

    for (const { key, cssName, defaultValue, inherited } of TABLE_PROPERTIES) {
      const value = ctx.styles[key];
      if (value === defaultValue) continue;
      // For inherited properties (border-collapse), only warn when explicitly set
      // via inline styles to avoid false positives from CSS inheritance.
      if (inherited && (ctx.inlineStyles[key] ?? '') === '') continue;

      const suggestion = TABLE_INTERNAL_DISPLAYS.has(display)
        ? `${cssName} only applies to the table element itself (display: table or inline-table), not to table-internal elements. Set it on the parent table instead, or remove it from this element.`
        : `Set display: table or display: inline-table on this element, or remove ${cssName}.`;

      warnings.push(
        warn({
          property: cssName,
          title: `${cssName} has no effect on non-table elements`,
          details: `${cssName} is "${value}" but display is "${display}". This property only applies to elements with display: table or display: inline-table.`,
          suggestion,
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkElementTableProps = rule.check;
