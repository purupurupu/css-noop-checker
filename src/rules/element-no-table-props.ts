import type { RuleDescriptor, Warning } from './types.ts';
import { registerRule } from './registry.ts';

const TABLE_DISPLAYS = new Set([
  'table',
  'inline-table',
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
  { key: 'borderCollapse', cssName: 'border-collapse', defaultValue: 'separate' },
  { key: 'tableLayout', cssName: 'table-layout', defaultValue: 'auto' },
] as const;

const rule: RuleDescriptor = {
  id: 'element-no-table-props',
  label: 'table props on non-table',
  requiredProperties: ['display', 'borderCollapse', 'tableLayout'],
  check(ctx) {
    const { display } = ctx.styles;

    if (TABLE_DISPLAYS.has(display)) return [];
    if (display === 'contents') return [];

    const warnings: Warning[] = [];

    for (const { key, cssName, defaultValue } of TABLE_PROPERTIES) {
      const value = ctx.styles[key];
      if (value !== defaultValue) {
        warnings.push({
          ruleId: 'element-no-table-props',
          property: cssName,
          severity: 'warning',
          title: `${cssName} has no effect on non-table elements`,
          details: `${cssName} is "${value}" but display is "${display}". These properties only apply to elements with display: table or display: inline-table.`,
          suggestion: `Set display: table or display: inline-table on this element, or remove ${cssName}.`,
        });
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkElementTableProps = rule.check;
