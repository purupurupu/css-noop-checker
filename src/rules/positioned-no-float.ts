import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'positioned-no-float' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'float on out-of-flow positioned element',
  requiredProperties: ['position'],
  requiredInlineProperties: ['cssFloat'],
  // CSS 2.1 §9.7: the browser computes float to 'none' for absolute/fixed elements,
  // so getComputedStyle().cssFloat is always 'none'. We must read el.style.cssFloat instead.
  check(ctx) {
    const { position } = ctx.styles;

    // Only applies to absolute or fixed positioning
    if (position !== 'absolute' && position !== 'fixed') return [];

    const inlineFloat = ctx.inlineStyles.cssFloat ?? '';

    // No warning if no inline float is authored (empty string means not set inline)
    if (inlineFloat === '' || inlineFloat === 'none') return [];

    return [
      warn({
        property: 'float',
        title: 'float has no effect',
        details: `float is "${inlineFloat}" but position is "${position}". Float is ignored on out-of-flow (absolute/fixed) positioned elements per the CSS specification (the browser computes float to "none"). Note: only inline styles are detected; float from stylesheets cannot be checked.`,
        suggestion:
          'Remove the float property — out-of-flow elements (position: absolute or fixed) are removed from normal flow and do not float.',
      }),
    ];
  },
};

registerRule(rule);

export const checkPositionedNoFloat = rule.check;
