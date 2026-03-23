import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'scroll-no-scroll-padding' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

/**
 * Overflow values that establish a scroll container.
 * scroll-padding only applies to scroll containers (overflow: auto, scroll, or hidden).
 * 'clip' does NOT establish a scroll container.
 */
const SCROLL_CONTAINER_OVERFLOW = new Set(['auto', 'scroll', 'hidden']);

function isScrollContainer(overflowX: string, overflowY: string): boolean {
  return SCROLL_CONTAINER_OVERFLOW.has(overflowX) || SCROLL_CONTAINER_OVERFLOW.has(overflowY);
}

const SCROLL_PADDING_PROPERTIES = [
  { key: 'scrollPaddingTop', cssName: 'scroll-padding-top' },
  { key: 'scrollPaddingRight', cssName: 'scroll-padding-right' },
  { key: 'scrollPaddingBottom', cssName: 'scroll-padding-bottom' },
  { key: 'scrollPaddingLeft', cssName: 'scroll-padding-left' },
  { key: 'scrollPaddingBlockStart', cssName: 'scroll-padding-block-start' },
  { key: 'scrollPaddingBlockEnd', cssName: 'scroll-padding-block-end' },
  { key: 'scrollPaddingInlineStart', cssName: 'scroll-padding-inline-start' },
  { key: 'scrollPaddingInlineEnd', cssName: 'scroll-padding-inline-end' },
] as const;

const DEFAULT_SCROLL_PADDING = 'auto';

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'scroll-padding on non-scroll container',
  requiredProperties: [
    'display',
    'overflowX',
    'overflowY',
    ...SCROLL_PADDING_PROPERTIES.map((p) => p.key),
  ],
  requiredParentProperties: ['overflowX', 'overflowY'],
  check(ctx) {
    // display:contents generates no box — cannot be a scroll container
    if (ctx.isContents) return [];

    // The <html> element is special: when its overflow is visible, the viewport
    // itself acts as the scroll container. scroll-padding on <html> targets
    // viewport scrolling and IS effective.
    if (ctx.element.tagName === 'html') return [];

    // The <body> element's overflow is propagated to the viewport only while
    // the root element remains overflow: visible. If <html> establishes its
    // own scroll container, body scroll-padding is not automatically effective.
    if (ctx.element.tagName === 'body') {
      const rootOverflowX = ctx.parentStyles?.overflowX ?? 'visible';
      const rootOverflowY = ctx.parentStyles?.overflowY ?? 'visible';
      if (rootOverflowX === 'visible' && rootOverflowY === 'visible') return [];
    }

    const overflowX = ctx.styles['overflowX'] ?? 'visible';
    const overflowY = ctx.styles['overflowY'] ?? 'visible';

    if (isScrollContainer(overflowX, overflowY)) return [];

    const warnings: Warning[] = [];
    const overflowDesc = overflowX === overflowY ? overflowX : `${overflowX} / ${overflowY}`;

    for (const { key, cssName } of SCROLL_PADDING_PROPERTIES) {
      const value = ctx.styles[key] ?? DEFAULT_SCROLL_PADDING;
      if (value === DEFAULT_SCROLL_PADDING) continue;

      warnings.push(
        warn({
          property: cssName,
          title: `${cssName} has no effect on non-scroll containers`,
          details: `${cssName} is "${value}" but the element is not a scroll container (overflow is "${overflowDesc}"). scroll-padding only applies to scroll containers.`,
          suggestion:
            'Set overflow to auto, scroll, or hidden to make this a scroll container, or remove the scroll-padding.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkScrollNoScrollPadding = rule.check;
