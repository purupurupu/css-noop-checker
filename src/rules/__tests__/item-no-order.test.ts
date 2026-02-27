import { describe, it, expect } from 'vitest';
import { checkOrder } from '../item-no-order.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  styles: Partial<ElementData['computedStyles']>,
  parent: ElementData['parent'] = { computedStyles: { display: 'block' } },
): ElementData {
  return _makeElement(styles, parent);
}

describe('item-no-order', () => {
  it('warns when order is set on child of block container', () => {
    const warnings = checkOrder(createRuleContext(makeElement({ order: '1' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('item-no-order');
    expect(warnings[0].property).toBe('order');
    expect(warnings[0].details).toContain('block');
  });

  it('warns for negative order values', () => {
    const warnings = checkOrder(createRuleContext(makeElement({ order: '-1' })));
    expect(warnings).toHaveLength(1);
  });

  it('skips flex items (parent is flex)', () => {
    const warnings = checkOrder(
      createRuleContext(makeElement({ order: '1' }, { computedStyles: { display: 'flex' } })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips flex items (parent is inline-flex)', () => {
    const warnings = checkOrder(
      createRuleContext(
        makeElement({ order: '1' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is grid)', () => {
    const warnings = checkOrder(
      createRuleContext(makeElement({ order: '1' }, { computedStyles: { display: 'grid' } })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is inline-grid)', () => {
    const warnings = checkOrder(
      createRuleContext(
        makeElement({ order: '1' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when order is 0 (default)', () => {
    const warnings = checkOrder(createRuleContext(makeElement({ order: '0' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is null (unknown parent context)', () => {
    const warnings = checkOrder(createRuleContext(makeElement({ order: '2' }, null)));
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is display:contents (unknown grandparent context)', () => {
    const warnings = checkOrder(
      createRuleContext(makeElement({ order: '1' }, { computedStyles: { display: 'contents' } })),
    );
    expect(warnings).toHaveLength(0);
  });
});
