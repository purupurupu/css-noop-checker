import { describe, it, expect } from 'vitest';
import { createRuleContext } from '../context.ts';
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
