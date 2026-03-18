import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'inline-no-min-max-dimensions' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const PROPERTIES = [
  { computed: 'minWidth', css: 'min-width', initial: '0px' },
  { computed: 'maxWidth', css: 'max-width', initial: 'none' },
  { computed: 'minHeight', css: 'min-height', initial: '0px' },
  { computed: 'maxHeight', css: 'max-height', initial: 'none' },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'min/max width/height on inline',
  requiredProperties: ['display', ...PROPERTIES.map((p) => p.computed)],
  check(ctx) {
    const { display } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const warnings: Warning[] = [];

    for (const { computed, css, initial } of PROPERTIES) {
      const value = ctx.styles[computed];
      if (value !== initial) {
        warnings.push(
          warn({
            property: css,
            title: `${css} has no effect on inline elements`,
            details: `${css} is "${value}" but display is "inline". Inline elements ignore ${css}.`,
            suggestion: `Set display: inline-block or display: block, or remove ${css}.`,
          }),
        );
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkInlineMinMaxDimensions = rule.check;
