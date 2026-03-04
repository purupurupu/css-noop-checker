import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultZIndexValue } from './context.ts';
import { isStackingContext } from './stacking-context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'static-no-z-index' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

/**
 * Properties that may create a stacking context (checked by isStackingContext).
 * Included in requiredProperties so they are collected from the inspected element.
 */
const STACKING_CONTEXT_PROPERTIES = [
  'opacity',
  'transform',
  'filter',
  'backdropFilter',
  'perspective',
  'clipPath',
  'isolation',
  'mixBlendMode',
  'mask',
  'containerType',
  'contain',
  'willChange',
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'z-index on non-stacking context',
  requiredProperties: ['position', 'zIndex', ...STACKING_CONTEXT_PROPERTIES],
  requiredParentProperties: ['display'],
  check(ctx) {
    const { zIndex, position } = ctx.styles;

    if (isDefaultZIndexValue(zIndex)) return [];

    // z-index works on positioned elements
    if (position !== 'static') return [];

    // z-index works on flex/grid items
    if (ctx.isFlexItem || ctx.isGridItem) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex/grid item.
    if (ctx.isParentContents) return [];

    // z-index works on any element that creates a stacking context
    if (isStackingContext(ctx.styles)) return [];

    return [
      warn({
        property: 'z-index',
        title: 'z-index has no effect',
        details: `z-index is "${zIndex}" but position is "static" and this element does not create a stacking context. z-index requires a positioned element, flex/grid item, or stacking context.`,
        suggestion: 'Set position to relative, absolute, fixed, or sticky, or remove z-index.',
      }),
    ];
  },
};

registerRule(rule);

export const checkStaticZIndex = rule.check;
