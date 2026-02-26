import { describe, it, expect } from 'vitest';
import { createRuleContext, isDefaultAlignmentValue, isStackingContext } from '../context.ts';
import type { ElementData } from '../types.ts';

const BASE_STYLES: ElementData['computedStyles'] = {
  display: 'block',
  width: 'auto',
  height: 'auto',
  gap: 'normal',
  rowGap: 'normal',
  columnGap: 'normal',
  alignItems: 'normal',
  justifyContent: 'normal',
  placeItems: 'normal',
  placeContent: 'normal',
  columnCount: 'auto',
};

function makeElement(parent: ElementData['parent'] = null): ElementData {
  return {
    tagName: 'div',
    id: '',
    classList: [],
    computedStyles: { ...BASE_STYLES },
    parent,
  };
}

describe('createRuleContext — parent-aware predicates', () => {
  it('sets isFlexItem and isGridItem to false when parent is null', () => {
    const ctx = createRuleContext(makeElement(null));
    expect(ctx.parentStyles).toBeNull();
    expect(ctx.isFlexItem).toBe(false);
    expect(ctx.isGridItem).toBe(false);
  });

  it('sets isFlexItem to true when parent display is flex', () => {
    const ctx = createRuleContext(makeElement({ computedStyles: { display: 'flex' } }));
    expect(ctx.isFlexItem).toBe(true);
    expect(ctx.isGridItem).toBe(false);
  });

  it('sets isFlexItem to true when parent display is inline-flex', () => {
    const ctx = createRuleContext(makeElement({ computedStyles: { display: 'inline-flex' } }));
    expect(ctx.isFlexItem).toBe(true);
    expect(ctx.isGridItem).toBe(false);
  });

  it('sets isGridItem to true when parent display is grid', () => {
    const ctx = createRuleContext(makeElement({ computedStyles: { display: 'grid' } }));
    expect(ctx.isFlexItem).toBe(false);
    expect(ctx.isGridItem).toBe(true);
  });

  it('sets isGridItem to true when parent display is inline-grid', () => {
    const ctx = createRuleContext(makeElement({ computedStyles: { display: 'inline-grid' } }));
    expect(ctx.isFlexItem).toBe(false);
    expect(ctx.isGridItem).toBe(true);
  });

  it('sets both to false when parent display is block', () => {
    const ctx = createRuleContext(makeElement({ computedStyles: { display: 'block' } }));
    expect(ctx.isFlexItem).toBe(false);
    expect(ctx.isGridItem).toBe(false);
  });

  it('normalizes parent styles to lowercase', () => {
    const ctx = createRuleContext(makeElement({ computedStyles: { display: 'FLEX' } }));
    expect(ctx.parentStyles?.display).toBe('flex');
    expect(ctx.isFlexItem).toBe(true);
  });

  it('sets both to false when parent has empty computedStyles', () => {
    const ctx = createRuleContext(makeElement({ computedStyles: {} }));
    expect(ctx.parentStyles).not.toBeNull();
    expect(ctx.isFlexItem).toBe(false);
    expect(ctx.isGridItem).toBe(false);
  });
});

const DEFAULT_STYLES: Record<string, string> = {
  opacity: '1',
  transform: 'none',
  filter: 'none',
  backdropFilter: 'none',
  perspective: 'none',
  clipPath: 'none',
  isolation: 'auto',
  mixBlendMode: 'normal',
  contain: 'none',
  willChange: 'auto',
};

describe('isStackingContext', () => {
  it('returns false when all properties are at defaults', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES })).toBe(false);
  });

  it('returns true for opacity !== "1"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, opacity: '0.99' })).toBe(true);
  });

  it('returns true for transform !== "none"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, transform: 'translatez(0)' })).toBe(true);
  });

  it('returns true for filter !== "none"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, filter: 'blur(4px)' })).toBe(true);
  });

  it('returns true for backdrop-filter !== "none"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, backdropFilter: 'blur(10px)' })).toBe(true);
  });

  it('returns true for isolation === "isolate"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, isolation: 'isolate' })).toBe(true);
  });

  it('returns true for contain: "paint"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, contain: 'paint' })).toBe(true);
  });

  it('returns true for contain: "content"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, contain: 'content' })).toBe(true);
  });

  it('returns true for compound contain: "layout paint"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, contain: 'layout paint' })).toBe(true);
  });

  it('returns false for contain: "size"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, contain: 'size' })).toBe(false);
  });

  it('returns false for contain: "style"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, contain: 'style' })).toBe(false);
  });

  it('returns true for willChange: "opacity"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, willChange: 'opacity' })).toBe(true);
  });

  it('returns true for willChange: "opacity, transform"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, willChange: 'opacity, transform' })).toBe(true);
  });

  it('returns true for willChange: "z-index"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, willChange: 'z-index' })).toBe(true);
  });

  it('returns false for willChange: "scroll-position"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, willChange: 'scroll-position' })).toBe(false);
  });

  it('returns false for willChange: "contents"', () => {
    expect(isStackingContext({ ...DEFAULT_STYLES, willChange: 'contents' })).toBe(false);
  });

  it('treats missing properties as default (no stacking context)', () => {
    expect(isStackingContext({})).toBe(false);
  });
});

describe('isDefaultAlignmentValue', () => {
  it('returns true for "normal"', () => {
    expect(isDefaultAlignmentValue('normal')).toBe(true);
  });

  it('returns true for "normal normal" (browser two-value form)', () => {
    expect(isDefaultAlignmentValue('normal normal')).toBe(true);
  });

  it('returns false for non-default values', () => {
    expect(isDefaultAlignmentValue('center')).toBe(false);
    expect(isDefaultAlignmentValue('flex-start')).toBe(false);
    expect(isDefaultAlignmentValue('space-between')).toBe(false);
  });

  it('returns false for mixed values like "normal center"', () => {
    expect(isDefaultAlignmentValue('normal center')).toBe(false);
  });
});
