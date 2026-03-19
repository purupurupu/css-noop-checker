import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'nonreplaced-no-aspect-ratio' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

function isDefaultAspectRatio(value: string): boolean {
  return value === 'auto';
}

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'aspect-ratio on inline non-replaced element',
  requiredProperties: ['display', 'aspectRatio'],
  check(ctx) {
    const { display, aspectRatio } = ctx.styles;
    const { tagName } = ctx.element;

    // display: contents elements generate no box — skip
    if (ctx.isContents) return [];

    // aspect-ratio only has no effect on inline non-replaced elements.
    // Note: ruby/ruby-text (display: ruby, ruby-text) are also inline-level boxes
    // where aspect-ratio has no effect, but this is intentionally out of scope —
    // ruby elements with aspect-ratio is an extremely rare combination.
    if (display !== 'inline') return [];

    // Replaced inline elements (img, video, etc.) support aspect-ratio
    if (isReplacedInlineElement(tagName)) return [];

    if (isDefaultAspectRatio(aspectRatio)) return [];

    return [
      warn({
        property: 'aspect-ratio',
        title: 'aspect-ratio has no effect on inline non-replaced elements',
        details: `aspect-ratio is "${aspectRatio}" but display is "inline" on <${tagName}>. Inline non-replaced elements ignore aspect-ratio.`,
        suggestion: 'Remove aspect-ratio, or change display to block or inline-block.',
      }),
    ];
  },
};

registerRule(rule);

export const checkNonreplacedAspectRatio = rule.check;
