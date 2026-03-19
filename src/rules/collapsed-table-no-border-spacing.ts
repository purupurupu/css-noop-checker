import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'collapsed-table-no-border-spacing' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'border-spacing on collapsed table',
  requiredProperties: ['display', 'borderCollapse', 'borderSpacing'],
  requiredInlineProperties: ['borderSpacing'],
  check(ctx) {
    const { display, borderCollapse, borderSpacing } = ctx.styles;

    // Only applies to table/inline-table elements
    if (display !== 'table' && display !== 'inline-table') return [];

    // Only flags when border-collapse is collapse
    if (borderCollapse !== 'collapse') return [];

    // Chrome serializes the default as '0px 0px'; check both forms defensively
    if (borderSpacing === '0px 0px' || borderSpacing === '0px') return [];

    // border-spacing is inherited and has a UA default of 2px on tables.
    // Only warn when the author explicitly set it (inline style).
    const inlineBorderSpacing = ctx.inlineStyles.borderSpacing ?? '';
    if (inlineBorderSpacing === '') return [];

    return [
      warn({
        property: 'border-spacing',
        title: 'border-spacing has no effect when border-collapse is collapse',
        details: `border-spacing is "${borderSpacing}" but border-collapse is "collapse". When borders are collapsed, the spacing between cells is always zero (CSS 2.1 §17.6.1).`,
        suggestion: 'Remove border-spacing, or set border-collapse: separate to use cell spacing.',
      }),
    ];
  },
};

registerRule(rule);

export const checkCollapsedTableBorderSpacing = rule.check;
