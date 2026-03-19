import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'nontable-no-border-spacing' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

/** display values where border-spacing has an effect (table formatting context roots only) */
const TABLE_CONTAINER_DISPLAYS = new Set(['table', 'inline-table']);

/** Chrome may serialize border-spacing as "0px 0px" or "0px" depending on context. */
function isDefaultBorderSpacing(value: string): boolean {
  return value === '0px 0px' || value === '0px';
}

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'border-spacing on non-table',
  requiredProperties: ['display', 'borderSpacing'],
  requiredInlineProperties: ['borderSpacing'],
  check(ctx) {
    const { display, borderSpacing } = ctx.styles;

    if (TABLE_CONTAINER_DISPLAYS.has(display)) return [];
    if (ctx.isContents) return [];
    if (isDefaultBorderSpacing(borderSpacing)) return [];
    // Only warn when border-spacing is explicitly set (inline style) to avoid
    // false positives from CSS inheritance (e.g. a <div> inside a <table>).
    if ((ctx.inlineStyles.borderSpacing ?? '') === '') return [];

    return [
      warn({
        property: 'border-spacing',
        title: 'border-spacing has no effect on non-table elements',
        details: `border-spacing is "${borderSpacing}" but display is "${display}". This property only applies to elements with display: table or display: inline-table.`,
        suggestion:
          'Set display: table or display: inline-table on this element, or remove border-spacing.',
      }),
    ];
  },
};

registerRule(rule);

export const checkNontableBorderSpacing = rule.check;
