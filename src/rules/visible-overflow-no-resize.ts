import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'visible-overflow-no-resize' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

/**
 * Overflow values that enable resize to work.
 * Note: 'clip' is excluded because it does not establish a scroll container
 * and is treated like 'visible' for the purposes of the resize property.
 */
const RESIZE_SAFE_OVERFLOW = new Set(['auto', 'scroll', 'hidden']);

function isResizeSafeOverflow(value: string): boolean {
  return RESIZE_SAFE_OVERFLOW.has(value);
}

/**
 * Check whether the relevant overflow axis blocks resize.
 *
 * Note: inline/block mapping assumes horizontal writing mode (the default).
 * In vertical writing modes (`writing-mode: vertical-rl` / `vertical-lr`),
 * the inline and block axes are swapped. This is a known limitation — vertical
 * writing mode + `resize: inline`/`block` is extremely rare in practice.
 *
 * - `horizontal` / `inline` → only overflowX matters
 * - `vertical` / `block` → only overflowY matters
 * - `both` (or anything else) → only warn when BOTH axes are unsafe
 *   (one safe axis is sufficient for resize to work)
 */
function isOverflowBlockingResize(resize: string, overflowX: string, overflowY: string): boolean {
  switch (resize) {
    case 'horizontal':
    case 'inline':
      return !isResizeSafeOverflow(overflowX);
    case 'vertical':
    case 'block':
      return !isResizeSafeOverflow(overflowY);
    default:
      return !isResizeSafeOverflow(overflowX) && !isResizeSafeOverflow(overflowY);
  }
}

function describeAffectedAxes(resize: string, overflowX: string, overflowY: string): string {
  switch (resize) {
    case 'horizontal':
    case 'inline':
      return `overflow-x is "${overflowX}" (needs auto, scroll, or hidden)`;
    case 'vertical':
    case 'block':
      return `overflow-y is "${overflowY}" (needs auto, scroll, or hidden)`;
    default:
      return overflowX === overflowY
        ? `overflow is "${overflowX}" (needs auto, scroll, or hidden)`
        : `overflow-x is "${overflowX}" and overflow-y is "${overflowY}" (need auto, scroll, or hidden)`;
  }
}

function describeSuggestion(resize: string): string {
  switch (resize) {
    case 'horizontal':
    case 'inline':
      return 'Set overflow-x to auto, scroll, or hidden to make the element resizable.';
    case 'vertical':
    case 'block':
      return 'Set overflow-y to auto, scroll, or hidden to make the element resizable.';
    default:
      return 'Set overflow-x or overflow-y to auto, scroll, or hidden to make the element resizable.';
  }
}

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'resize on visible overflow',
  requiredProperties: ['display', 'resize', 'overflowX', 'overflowY'],
  check(ctx) {
    const { resize, overflowX, overflowY } = ctx.styles;

    // resize: none is the default — nothing to flag
    if (resize === 'none') return [];

    // display:contents elements have no box, so resize can't apply
    if (ctx.isContents) return [];

    // Browsers special-case <textarea>: resize works even when overflow is visible.
    // A page may explicitly set overflow: visible on a textarea, but browsers still
    // allow resize in that case, so we skip the warning entirely.
    if (ctx.element.tagName === 'textarea') return [];

    if (!isOverflowBlockingResize(resize, overflowX, overflowY)) return [];

    return [
      warn({
        property: 'resize',
        title: 'resize has no effect',
        details: `resize: ${resize} has no effect because ${describeAffectedAxes(resize, overflowX, overflowY)}.`,
        suggestion: describeSuggestion(resize),
      }),
    ];
  },
};

registerRule(rule);

export const checkVisibleOverflowResize = rule.check;
