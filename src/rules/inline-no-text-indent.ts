import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultTextIndentValue, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'inline-no-text-indent' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'text-indent on inline',
  requiredProperties: ['display', 'textIndent'],
  requiredInlineProperties: ['textIndent'],
  // text-indent is inherited, so computedStyles always reflects the parent's value.
  // Only warn when the property is authored on the element itself (inline style).
  check(ctx) {
    const { display, textIndent } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];
    if (isDefaultTextIndentValue(textIndent)) return [];

    const inlineTextIndent = ctx.inlineStyles.textIndent ?? '';
    if (inlineTextIndent === '') return [];

    return [
      warn({
        property: 'text-indent',
        title: 'text-indent has no effect on inline elements',
        details: `text-indent is "${textIndent}" but display is "inline". text-indent does not apply to inline non-replaced elements.`,
        suggestion:
          'Consider using display: inline-block or display: block, or remove text-indent.',
      }),
    ];
  },
};

registerRule(rule);

export const checkInlineTextIndent = rule.check;
