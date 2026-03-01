import { describe, it, expect } from 'vitest';
import { checkItemNoFloat } from '../item-no-float.ts';
import { createRuleContext } from '../context.ts';
import { makeChildElement as makeElement } from './helpers/make-element.ts';

describe('item-no-float', () => {
  it('warns when float is set on flex item', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(makeElement({ cssFloat: 'left' }, { computedStyles: { display: 'flex' } })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('item-no-float');
    expect(warnings[0].property).toBe('float');
    expect(warnings[0].details).toContain('flex');
  });

  it('warns when float is right on flex item', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(
        makeElement({ cssFloat: 'right' }, { computedStyles: { display: 'flex' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns when float is set on inline-flex item', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(
        makeElement({ cssFloat: 'left' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('inline-flex');
  });

  it('warns when float is set on grid item', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(makeElement({ cssFloat: 'left' }, { computedStyles: { display: 'grid' } })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('grid');
  });

  it('warns when float is set on inline-grid item', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(
        makeElement({ cssFloat: 'left' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('inline-grid');
  });

  it('skips when float is none on flex item', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(makeElement({ cssFloat: 'none' }, { computedStyles: { display: 'flex' } })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is not flex/grid (normal flow with float)', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(
        makeElement({ cssFloat: 'left' }, { computedStyles: { display: 'block' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is null (unknown parent context)', () => {
    const warnings = checkItemNoFloat(createRuleContext(makeElement({ cssFloat: 'left' }, null)));
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is display:contents (isFlexItem/isGridItem are false)', () => {
    const warnings = checkItemNoFloat(
      createRuleContext(
        makeElement({ cssFloat: 'left' }, { computedStyles: { display: 'contents' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
