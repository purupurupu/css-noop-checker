import type { RuleDescriptor } from './types.ts';
import { isDefaultOverflowValue, isReplacedInlineElement } from './context.ts';
import { registerRule } from './registry.ts';

function describeOverflow(overflowX: string, overflowY: string): string {
  if (overflowX === overflowY) return `overflow is "${overflowX}"`;
  if (overflowX === 'visible') return `overflow-y is "${overflowY}"`;
  if (overflowY === 'visible') return `overflow-x is "${overflowX}"`;
  return `overflow-x is "${overflowX}" and overflow-y is "${overflowY}"`;
}

const rule: RuleDescriptor = {
  id: 'inline-no-overflow',
  label: 'overflow on inline',
  requiredProperties: ['display', 'overflowX', 'overflowY'],
  check(ctx) {
    const { display, overflowX, overflowY } = ctx.styles;
    const { tagName } = ctx.element;

    if (display !== 'inline') return [];
    if (isReplacedInlineElement(tagName)) return [];

    // Only flag when at least one axis is non-visible.
    // Note: `overflow: clip` is intentionally treated as non-default here —
    // like hidden/scroll/auto, it has no effect on non-replaced inline elements.
    if (isDefaultOverflowValue(overflowX) && isDefaultOverflowValue(overflowY)) return [];

    // Always report as a single "overflow" warning regardless of which axis is
    // non-default. Browsers auto-promote the other axis (e.g. setting overflow-x: scroll
    // causes overflow-y to compute to auto), so axis-level warnings would produce
    // confusing double warnings for a single user-authored declaration.
    return [
      {
        ruleId: 'inline-no-overflow',
        property: 'overflow',
        severity: 'warning',
        title: 'overflow has no effect on inline elements',
        details: `${describeOverflow(overflowX, overflowY)} but display is "inline". Non-replaced inline elements ignore overflow.`,
        suggestion: 'Set display: inline-block or display: block, or remove overflow.',
      },
    ];
  },
};

registerRule(rule);

export const checkInlineOverflow = rule.check;
