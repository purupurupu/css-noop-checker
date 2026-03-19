import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultMarginValue } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'table-no-margin' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

/** Internal table display types where margins have no effect per CSS 2.1 §17.5.3 */
const INTERNAL_TABLE_DISPLAYS = new Set([
  'table-row',
  'table-row-group',
  'table-cell',
  'table-column',
  'table-column-group',
  'table-header-group',
  'table-footer-group',
]);

const MARGIN_PROPERTIES: Array<
  [physical: string, logical: string, cssPhy: string, cssLog: string]
> = [
  ['marginTop', 'marginBlockStart', 'margin-top', 'margin-block-start'],
  ['marginBottom', 'marginBlockEnd', 'margin-bottom', 'margin-block-end'],
  ['marginRight', 'marginInlineEnd', 'margin-right', 'margin-inline-end'],
  ['marginLeft', 'marginInlineStart', 'margin-left', 'margin-inline-start'],
];

const DETAILS = 'Margins have no effect on internal table elements (CSS 2.1 §17.5.3).';
const SUGGESTION = 'Remove the margin, or wrap the content in a different element.';

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'margin on internal table element',
  requiredProperties: [
    'display',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'marginBlockStart',
    'marginBlockEnd',
    'marginInlineStart',
    'marginInlineEnd',
  ],
  check(ctx) {
    const { display } = ctx.styles;

    if (!INTERNAL_TABLE_DISPLAYS.has(display)) return [];

    const warnings: Warning[] = [];
    const s = ctx.styles;

    for (const [physical, logical, cssPhy, cssLog] of MARGIN_PROPERTIES) {
      const phyVal = s[physical];
      const logVal = s[logical];
      const phyNonDefault = !isDefaultMarginValue(phyVal);
      const logNonDefault = !isDefaultMarginValue(logVal);

      // Skip physical when logical is also set — both resolve to the same axis in getComputedStyle.
      if (phyNonDefault && !logNonDefault) {
        warnings.push(
          warn({
            property: cssPhy,
            title: `${cssPhy} has no effect on ${display} elements`,
            details: `${cssPhy} is "${phyVal}" but display is "${display}". ${DETAILS}`,
            suggestion: SUGGESTION,
          }),
        );
      }

      if (logNonDefault) {
        warnings.push(
          warn({
            property: cssLog,
            title: `${cssLog} has no effect on ${display} elements`,
            details: `${cssLog} is "${logVal}" but display is "${display}". ${DETAILS}`,
            suggestion: SUGGESTION,
          }),
        );
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkTableMargin = rule.check;
