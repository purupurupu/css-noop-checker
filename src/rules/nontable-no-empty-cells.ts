import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'nontable-no-empty-cells' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'empty-cells on non-table-cell',
  requiredProperties: ['display', 'emptyCells'],
  requiredInlineProperties: ['emptyCells'],
  check(ctx) {
    const { display, emptyCells } = ctx.styles;

    if (display === 'table-cell') return [];
    if (ctx.isContents) return [];
    if (emptyCells === 'show') return [];
    // Only warn when empty-cells is explicitly set (inline style) to avoid
    // false positives from CSS inheritance (e.g. a <div> inside a <table>).
    if ((ctx.inlineStyles.emptyCells ?? '') === '') return [];

    return [
      warn({
        property: 'empty-cells',
        title: 'empty-cells has no effect on non-table-cell elements',
        details: `empty-cells is "${emptyCells}" but display is "${display}". This property only applies to elements with display: table-cell.`,
        suggestion:
          'Remove the empty-cells declaration from this element. This property only takes effect on table-cell elements.',
      }),
    ];
  },
};

registerRule(rule);

export const checkNontableEmptyCells = rule.check;
