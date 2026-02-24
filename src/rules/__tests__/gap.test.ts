import { describe, it, expect } from 'vitest';
import { checkGap } from '../gap.ts';
import type { ElementData } from '../types.ts';

function makeElement(overrides: Partial<ElementData['computedStyles']>): ElementData {
  return {
    tagName: 'div',
    id: '',
    classList: [],
    computedStyles: {
      display: 'block',
      width: 'auto',
      height: 'auto',
      rowGap: 'normal',
      columnGap: 'normal',
      alignItems: 'normal',
      justifyContent: 'normal',
      placeItems: 'normal',
      placeContent: 'normal',
      columnCount: 'auto',
      ...overrides,
    },
  };
}

describe('C-1: gap', () => {
  it('warns when row-gap is set on block element', () => {
    const warnings = checkGap(makeElement({ rowGap: '20px' }));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('C-1');
    expect(warnings[0].title).toContain('row-gap');
  });

  it('warns when column-gap is set on block element', () => {
    const warnings = checkGap(makeElement({ columnGap: '10px' }));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('column-gap');
  });

  it('warns for both row-gap and column-gap', () => {
    const warnings = checkGap(makeElement({ rowGap: '10px', columnGap: '10px' }));
    expect(warnings).toHaveLength(2);
  });

  it('skips flex containers', () => {
    const warnings = checkGap(makeElement({ display: 'flex', rowGap: '10px', columnGap: '10px' }));
    expect(warnings).toHaveLength(0);
  });

  it('skips grid containers', () => {
    const warnings = checkGap(makeElement({ display: 'grid', rowGap: '10px' }));
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-flex containers', () => {
    const warnings = checkGap(makeElement({ display: 'inline-flex', columnGap: '10px' }));
    expect(warnings).toHaveLength(0);
  });

  it('skips column-gap on multi-column containers', () => {
    const warnings = checkGap(makeElement({ columnGap: '40px', columnCount: '2' }));
    expect(warnings).toHaveLength(0);
  });

  it('still warns row-gap on multi-column containers', () => {
    const warnings = checkGap(makeElement({ rowGap: '20px', columnCount: '2' }));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('row-gap');
  });

  it('skips when gaps are default values', () => {
    const warnings = checkGap(makeElement({}));
    expect(warnings).toHaveLength(0);
  });

  it('skips when gaps are 0px', () => {
    const warnings = checkGap(makeElement({ rowGap: '0px', columnGap: '0px' }));
    expect(warnings).toHaveLength(0);
  });
});
