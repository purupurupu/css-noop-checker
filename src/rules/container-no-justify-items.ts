import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultAlignmentValue, isFlexOrGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-justify-items' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'justify-items on non-flex/grid container',
  requiredProperties: ['display', 'justifyItems'],
  check(ctx) {
    const { display, justifyItems } = ctx.styles;
    // justify-items works on both grid and flex containers (flex support since Chrome 129)
    if (isFlexOrGridContainer(display)) return [];
    if (ctx.isContents) return [];
    if (isDefaultAlignmentValue(justifyItems)) return [];
    // "legacy" keyword propagates justify-items to descendants for justify-self: auto
    // resolution — this IS meaningful on non-grid containers.
    if (justifyItems.startsWith('legacy')) return [];

    return [
      warn({
        property: 'justify-items',
        title: 'justify-items has no effect',
        details: `justify-items is "${justifyItems}" but display is "${display}". justify-items only has a visible effect on flex/grid containers.`,
        suggestion: 'Set display: flex or display: grid on this element, or remove justify-items.',
      }),
    ];
  },
};

registerRule(rule);

export const checkJustifyItems = rule.check;
