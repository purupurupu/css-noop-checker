import { describe, it, expect } from 'vitest';
import { checkJustifySelf } from '../item-no-justify-self.ts';
import { createRuleContext } from '../context.ts';
import { makeChildElement as makeElement } from './helpers/make-element.ts';

describe('item-no-justify-self', () => {
  it('warns when justify-self is set on child of block container', () => {
    const warnings = checkJustifySelf(createRuleContext(makeElement({ justifySelf: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('item-no-justify-self');
    expect(warnings[0].property).toBe('justify-self');
    expect(warnings[0].details).toContain('block');
    expect(warnings[0].suggestion).toContain('display: grid');
    expect(warnings[0].suggestion).not.toContain('margin-inline');
  });

  it('skips flex items (justify-self works on flex items since Chrome 129)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'flex' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-flex items', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'end' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is grid)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is inline-grid)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips absolutely positioned elements', () => {
    const warnings = checkJustifySelf(
      createRuleContext(makeElement({ justifySelf: 'center', position: 'absolute' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips fixed positioned elements', () => {
    const warnings = checkJustifySelf(
      createRuleContext(makeElement({ justifySelf: 'center', position: 'fixed' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when justify-self is auto (default)', () => {
    const warnings = checkJustifySelf(createRuleContext(makeElement({ justifySelf: 'auto' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips when justify-self is normal', () => {
    const warnings = checkJustifySelf(createRuleContext(makeElement({ justifySelf: 'normal' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is null (unknown parent context)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(makeElement({ justifySelf: 'center' }, null)),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is display:contents (unknown grandparent context)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'contents' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
