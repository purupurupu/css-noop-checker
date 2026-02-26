import type { RuleDescriptor } from './types.ts';
import { isDefaultZIndexValue, isStackingContext } from './context.ts';
import { registerRule } from './registry.ts';

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
  'contain',
  'willChange',
] as const;

const rule: RuleDescriptor = {
  id: 'static-no-z-index',
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
    const parentDisplay = ctx.parentStyles?.display ?? '';
    if (parentDisplay === 'contents') return [];

    // z-index works on any element that creates a stacking context
    if (isStackingContext(ctx.styles)) return [];

    return [
      {
        ruleId: 'static-no-z-index',
        property: 'z-index',
        severity: 'warning',
        title: 'z-index has no effect',
        details: `z-index is "${zIndex}" but position is "static" and this element does not create a stacking context. z-index requires a positioned element, flex/grid item, or stacking context.`,
        suggestion: 'Set position to relative, absolute, fixed, or sticky, or remove z-index.',
      },
    ];
  },
};

registerRule(rule);

export const checkStaticZIndex = rule.check;
