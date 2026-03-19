import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'inline-no-box-sizing' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'box-sizing on inline',
  requiredProperties: ['display', 'boxSizing'],
  requiredInlineProperties: ['boxSizing'],
  // box-sizing controls how width/height are calculated, but non-replaced inline
  // elements ignore width/height entirely, so box-sizing has no effect.
  // Universal resets (e.g. *, *::before, *::after { box-sizing: border-box }) are
  // ubiquitous, so we only warn when box-sizing is authored on the element itself.
  check(ctx) {
    const { display } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    const inlineBoxSizing = ctx.inlineStyles.boxSizing ?? '';
    if (inlineBoxSizing === '') return [];
    // content-box is the initial value — writing it inline is typically an
    // intentional reset of a global * { box-sizing: border-box } override.
    if (inlineBoxSizing === 'content-box') return [];

    const { boxSizing } = ctx.styles;

    return [
      warn({
        property: 'box-sizing',
        title: 'box-sizing has no effect on inline elements',
        details: `box-sizing is "${boxSizing}" but display is "inline". Non-replaced inline elements ignore width/height, so box-sizing has no effect.`,
        suggestion: 'Set display: inline-block or display: block, or remove box-sizing.',
      }),
    ];
  },
};

registerRule(rule);

export const checkInlineBoxSizing = rule.check;
