import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isBlockLayoutDisplay, isDefaultAlignmentValue, isGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-justify-items' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'justify-items outside grid/block layout',
  requiredProperties: ['display', 'justifyItems'],
  check(ctx) {
    const { display, justifyItems } = ctx.styles;
    // Chromium applies justify-items in grid and block layout, but not flex layout.
    if (isGridContainer(display) || isBlockLayoutDisplay(display)) return [];
    if (ctx.isContents) return [];
    if (isDefaultAlignmentValue(justifyItems)) return [];
    // "legacy" keyword propagates justify-items to descendants for justify-self: auto
    // resolution — this IS meaningful on non-grid containers.
    if (justifyItems.startsWith('legacy')) return [];

    return [
      warn({
        property: 'justify-items',
        title: 'justify-items has no effect',
        details: `justify-items is "${justifyItems}" but display is "${display}". In Chromium, justify-items has a visible effect in grid or block layout containers, but not in flex, inline, or table layout.`,
        suggestion:
          'Use display: grid or a block-layout container such as block/inline-block/flow-root, or remove justify-items.',
      }),
    ];
  },
};

registerRule(rule);

export const checkJustifyItems = rule.check;
