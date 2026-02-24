import { describe, it, expect } from 'vitest';
import { checkPlace } from '../place.ts';
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

describe('C-3: place-items / place-content', () => {
  it('warns when place-items is set on block element', () => {
    const warnings = checkPlace(makeElement({ placeItems: 'center' }));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('C-3');
    expect(warnings[0].title).toContain('place-items');
  });

  it('warns when place-content is set on block element', () => {
    const warnings = checkPlace(makeElement({ placeContent: 'center' }));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('place-content');
  });

  it('skips grid containers', () => {
    const warnings = checkPlace(makeElement({ display: 'grid', placeItems: 'center' }));
    expect(warnings).toHaveLength(0);
  });

  it('skips flex containers', () => {
    const warnings = checkPlace(makeElement({ display: 'flex', placeContent: 'center' }));
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-flex containers', () => {
    const warnings = checkPlace(makeElement({ display: 'inline-flex', placeItems: 'start' }));
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid containers', () => {
    const warnings = checkPlace(makeElement({ display: 'inline-grid', placeContent: 'end' }));
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are normal', () => {
    const warnings = checkPlace(makeElement({}));
    expect(warnings).toHaveLength(0);
  });
});
