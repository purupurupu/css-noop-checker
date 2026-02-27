import { describe, it, expect } from 'vitest';
import { checkItemNoGridProps } from '../item-no-grid-props.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  styles: Partial<ElementData['computedStyles']>,
  parent: ElementData['parent'] = { computedStyles: { display: 'block' } },
): ElementData {
  return _makeElement(styles, parent);
}

describe('item-no-grid-props', () => {
  it('warns when grid-column-start is set on child of block container', () => {
    const warnings = checkItemNoGridProps(createRuleContext(makeElement({ gridColumnStart: '1' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('item-no-grid-props');
    expect(warnings[0].property).toBe('grid-column-start');
    expect(warnings[0].details).toContain('block');
  });

  it('warns when grid-column-end is set on child of block container', () => {
    const warnings = checkItemNoGridProps(createRuleContext(makeElement({ gridColumnEnd: '3' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-column-end');
  });

  it('warns when grid-row-start is set on child of block container', () => {
    const warnings = checkItemNoGridProps(createRuleContext(makeElement({ gridRowStart: '2' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-row-start');
  });

  it('warns when grid-row-end is set on child of block container', () => {
    const warnings = checkItemNoGridProps(createRuleContext(makeElement({ gridRowEnd: 'span 2' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-row-end');
  });

  it('warns when grid-column-start has a named area value', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(makeElement({ gridColumnStart: 'header' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-column-start');
  });

  it('warns for multiple non-default grid properties at once', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(
        makeElement({
          gridColumnStart: '1',
          gridColumnEnd: '3',
          gridRowStart: '2',
          gridRowEnd: '4',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
  });

  it('warns on flex items (grid placement properties are grid-specific)', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(
        makeElement({ gridColumnStart: '1' }, { computedStyles: { display: 'flex' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-column-start');
  });

  it('warns on inline-flex items', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(
        makeElement({ gridColumnStart: '1' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips grid items (parent is grid)', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(
        makeElement({ gridColumnStart: '1' }, { computedStyles: { display: 'grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is inline-grid)', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(
        makeElement({ gridColumnStart: '1' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all values are defaults', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(
        makeElement({
          gridColumnStart: 'auto',
          gridColumnEnd: 'auto',
          gridRowStart: 'auto',
          gridRowEnd: 'auto',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent display is contents (grandparent context unknown)', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(
        makeElement({ gridColumnStart: '1' }, { computedStyles: { display: 'contents' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is null (unknown parent context)', () => {
    const warnings = checkItemNoGridProps(
      createRuleContext(makeElement({ gridColumnStart: '1' }, null)),
    );
    expect(warnings).toHaveLength(0);
  });
});
