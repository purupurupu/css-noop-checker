import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import {
  isBlockLayoutDisplay,
  isDefaultAlignmentValue,
  isFlexContainer,
  isGridContainer,
} from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-place' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'place-items outside grid/flex/block layout',
  requiredProperties: ['display', 'placeItems'],
  // Note: place-content is intentionally NOT checked here.
  // place-content is a shorthand for align-content + justify-content.
  // Since align-content works in block layout (Chrome 123+), place-content
  // is at least partially effective on block containers and should not be
  // flagged as a complete no-op.
  check(ctx) {
    const { display, placeItems } = ctx.styles;
    // place-items is a shorthand for align-items + justify-items. In Chromium,
    // grid supports both halves, flex supports the align-items half, and block
    // layout supports the justify-items half. Only warn when both halves are
    // ineffective for the current layout mode.
    if (isGridContainer(display) || isFlexContainer(display) || isBlockLayoutDisplay(display))
      return [];
    if (ctx.isContents) return [];

    if (!isDefaultAlignmentValue(placeItems)) {
      return [
        warn({
          property: 'place-items',
          title: 'place-items has no effect',
          details: `place-items is "${placeItems}" but display is "${display}". In Chromium, place-items has a visible effect in grid, flex, or block layout containers, but not in inline or table layout.`,
          suggestion:
            'Use display: grid, flex, or a block-layout container such as block/inline-block/flow-root, or remove place-items.',
        }),
      ];
    }

    return [];
  },
};

registerRule(rule);

export const checkPlace = rule.check;
