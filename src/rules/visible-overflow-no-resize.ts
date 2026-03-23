import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isVerticalWritingMode } from './context.ts';
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
 * - `horizontal` / `inline` → only overflowX matters
 * - `vertical` / `block` → only overflowY matters
 * - `both` (or anything else) → only warn when BOTH axes are unsafe
 *   (one safe axis is sufficient for resize to work)
 */
function isOverflowBlockingResize(
  resize: string,
  overflowX: string,
  overflowY: string,
  writingMode: string,
): boolean {
  const vertical = isVerticalWritingMode(writingMode);
  switch (resize) {
    case 'horizontal':
      return !isResizeSafeOverflow(overflowX);
    case 'vertical':
      return !isResizeSafeOverflow(overflowY);
    case 'inline':
      return !isResizeSafeOverflow(vertical ? overflowY : overflowX);
    case 'block':
      return !isResizeSafeOverflow(vertical ? overflowX : overflowY);
    default:
      return !isResizeSafeOverflow(overflowX) && !isResizeSafeOverflow(overflowY);
  }
}

function describeAffectedAxes(
  resize: string,
  overflowX: string,
  overflowY: string,
  writingMode: string,
): string {
  const vertical = isVerticalWritingMode(writingMode);
  switch (resize) {
    case 'horizontal':
      return `overflow-x is "${overflowX}" (needs auto, scroll, or hidden)`;
    case 'vertical':
      return `overflow-y is "${overflowY}" (needs auto, scroll, or hidden)`;
    case 'inline':
      return vertical
        ? `overflow-y is "${overflowY}" (needs auto, scroll, or hidden in vertical writing mode)`
        : `overflow-x is "${overflowX}" (needs auto, scroll, or hidden)`;
    case 'block':
      return vertical
        ? `overflow-x is "${overflowX}" (needs auto, scroll, or hidden in vertical writing mode)`
        : `overflow-y is "${overflowY}" (needs auto, scroll, or hidden)`;
    default:
      return overflowX === overflowY
        ? `overflow is "${overflowX}" (needs auto, scroll, or hidden)`
        : `overflow-x is "${overflowX}" and overflow-y is "${overflowY}" (need auto, scroll, or hidden)`;
  }
}

function describeSuggestion(resize: string, writingMode: string): string {
  const vertical = isVerticalWritingMode(writingMode);
  switch (resize) {
    case 'horizontal':
      return 'Set overflow-x to auto, scroll, or hidden to make the element resizable.';
    case 'vertical':
      return 'Set overflow-y to auto, scroll, or hidden to make the element resizable.';
    case 'inline':
      return vertical
        ? 'Set overflow-y to auto, scroll, or hidden to make the element resizable in the inline axis.'
        : 'Set overflow-x to auto, scroll, or hidden to make the element resizable.';
    case 'block':
      return vertical
        ? 'Set overflow-x to auto, scroll, or hidden to make the element resizable in the block axis.'
        : 'Set overflow-y to auto, scroll, or hidden to make the element resizable.';
    default:
      return 'Set overflow-x or overflow-y to auto, scroll, or hidden to make the element resizable.';
  }
}

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'resize on visible overflow',
  requiredProperties: ['display', 'resize', 'overflowX', 'overflowY', 'writingMode'],
  check(ctx) {
    const { resize, overflowX, overflowY, writingMode } = ctx.styles;

    // resize: none is the default — nothing to flag
    if (resize === 'none') return [];

    // display:contents elements have no box, so resize can't apply
    if (ctx.isContents) return [];

    // Browsers special-case <textarea>: resize works even when overflow is visible.
    // A page may explicitly set overflow: visible on a textarea, but browsers still
    // allow resize in that case, so we skip the warning entirely.
    if (ctx.element.tagName === 'textarea') return [];

    if (!isOverflowBlockingResize(resize, overflowX, overflowY, writingMode)) return [];

    return [
      warn({
        property: 'resize',
        title: 'resize has no effect',
        details: `resize: ${resize} has no effect because ${describeAffectedAxes(resize, overflowX, overflowY, writingMode)}.`,
        suggestion: describeSuggestion(resize, writingMode),
      }),
    ];
  },
};

registerRule(rule);

export const checkVisibleOverflowResize = rule.check;
