import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';
import { willChangeIncludes } from './context.ts';

const RULE_ID = 'perspective-no-origin' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'perspective-origin without perspective',
  // getComputedStyle() resolves perspective-origin to absolute pixel values
  // (e.g. "150px 75px"), so we cannot distinguish "not set" from "set to 50% 50%".
  // Use requiredInlineProperties to read el.style.perspectiveOrigin instead.
  requiredProperties: ['perspective', 'willChange'],
  requiredInlineProperties: ['perspectiveOrigin'],
  check(ctx) {
    const inlineOrigin = ctx.inlineStyles.perspectiveOrigin ?? '';

    // No warning if no inline perspective-origin is authored
    if (inlineOrigin === '') return [];

    const perspective = ctx.styles['perspective'] ?? 'none';
    if (perspective !== 'none') return [];

    // will-change: perspective means perspective may be applied dynamically
    if (willChangeIncludes(ctx.styles['willChange'] ?? 'auto', 'perspective')) return [];

    return [
      warn({
        property: 'perspective-origin',
        title: 'perspective-origin has no effect without perspective',
        details: `perspective-origin is "${inlineOrigin}" but no perspective is set. perspective-origin only affects elements with an active perspective.`,
        suggestion:
          'Add a perspective property (e.g. perspective: 500px), or remove perspective-origin.',
      }),
    ];
  },
};

registerRule(rule);

export const checkPerspectiveNoOrigin = rule.check;
