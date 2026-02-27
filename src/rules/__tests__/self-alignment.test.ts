import { describe, it, expect } from 'vitest';
import { checkSelfAlignment } from '../self-alignment.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  styles: Partial<ElementData['computedStyles']>,
  parent: ElementData['parent'] = { computedStyles: { display: 'block' } },
): ElementData {
  return _makeElement(styles, parent);
}

describe('item-no-self-align', () => {
  it('warns when align-self is set on child of block container', () => {
    const warnings = checkSelfAlignment(createRuleContext(makeElement({ alignSelf: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('item-no-self-align');
    expect(warnings[0].property).toBe('align-self');
    expect(warnings[0].details).toContain('block');
  });

  it('warns when align-self is flex-end on child of inline container', () => {
    const warnings = checkSelfAlignment(
      createRuleContext(
        makeElement({ alignSelf: 'flex-end' }, { computedStyles: { display: 'inline' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips flex items (parent is flex)', () => {
    const warnings = checkSelfAlignment(
      createRuleContext(
        makeElement({ alignSelf: 'center' }, { computedStyles: { display: 'flex' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips flex items (parent is inline-flex)', () => {
    const warnings = checkSelfAlignment(
      createRuleContext(
        makeElement({ alignSelf: 'center' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is grid)', () => {
    const warnings = checkSelfAlignment(
      createRuleContext(
        makeElement({ alignSelf: 'center' }, { computedStyles: { display: 'grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is inline-grid)', () => {
    const warnings = checkSelfAlignment(
      createRuleContext(
        makeElement({ alignSelf: 'center' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when align-self is auto (default)', () => {
    const warnings = checkSelfAlignment(createRuleContext(makeElement({ alignSelf: 'auto' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips when align-self is normal', () => {
    const warnings = checkSelfAlignment(createRuleContext(makeElement({ alignSelf: 'normal' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is null (unknown parent context)', () => {
    const warnings = checkSelfAlignment(
      createRuleContext(makeElement({ alignSelf: 'center' }, null)),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is display:contents (unknown grandparent context)', () => {
    const warnings = checkSelfAlignment(
      createRuleContext(
        makeElement({ alignSelf: 'center' }, { computedStyles: { display: 'contents' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
