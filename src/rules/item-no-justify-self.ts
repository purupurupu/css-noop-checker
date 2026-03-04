import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultSelfAlignmentValue, isFlexContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'item-no-justify-self' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'justify-self outside grid layout',
  requiredProperties: ['justifySelf', 'position'],
  requiredParentProperties: ['display'],
  check(ctx) {
    if (ctx.isGridItem) return [];
    if (!ctx.parentStyles) return [];

    const { justifySelf } = ctx.styles;
    if (isDefaultSelfAlignmentValue(justifySelf)) return [];

    // justify-self works on absolutely/fixed-positioned elements (Chrome 105+)
    const { position } = ctx.styles;
    if (position === 'absolute' || position === 'fixed') return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a grid item.
    if (ctx.isParentContents) return [];

    const suggestion = isFlexContainer(ctx.parentDisplay)
      ? 'Remove justify-self — it has no effect on flex items.'
      : 'Set display: grid or display: inline-grid on the parent element, or remove justify-self.';

    return [
      warn({
        property: 'justify-self',
        title: 'justify-self has no effect',
        details: `justify-self is "${justifySelf}" but parent display is "${ctx.parentDisplay}". justify-self only takes effect on grid items.`,
        suggestion,
      }),
    ];
  },
};

registerRule(rule);

export const checkJustifySelf = rule.check;
