import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultAlignmentValue, isFlexContainer, isGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-justify-items' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'justify-items on non-grid',
  requiredProperties: ['display', 'justifyItems'],
  check(ctx) {
    const { display, justifyItems } = ctx.styles;
    if (isGridContainer(display)) return [];
    if (ctx.isContents) return [];
    if (isDefaultAlignmentValue(justifyItems)) return [];
    // "legacy" keyword propagates justify-items to descendants for justify-self: auto
    // resolution — this IS meaningful on non-grid containers.
    if (justifyItems.startsWith('legacy')) return [];

    const suggestion = isFlexContainer(display)
      ? 'Remove justify-items. On flex containers, use justify-content to distribute space along the main axis.'
      : 'Set display: grid or display: inline-grid on this element, or remove justify-items.';

    return [
      warn({
        property: 'justify-items',
        title: 'justify-items has no effect',
        details: `justify-items is "${justifyItems}" but display is "${display}". justify-items has no visible effect outside of grid layout.`,
        suggestion,
      }),
    ];
  },
};

registerRule(rule);

export const checkJustifyItems = rule.check;
