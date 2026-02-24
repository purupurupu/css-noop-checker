import { describe, it, expect } from 'vitest';
import { checkPlace } from '../place.ts';
import { createRuleContext } from '../context.ts';
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
      gap: 'normal',
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
    const warnings = checkPlace(createRuleContext(makeElement({ placeItems: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('C-3');
    expect(warnings[0].title).toContain('place-items');
  });

  it('warns when place-content is set on block element', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ placeContent: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('place-content');
  });

  it('skips grid containers', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ display: 'grid', placeItems: 'center' })));
    expect(warnings).toHaveLength(0);
  });

  it('warns on flex containers', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ display: 'flex', placeContent: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('place-content');
  });

  it('warns on inline-flex containers', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ display: 'inline-flex', placeItems: 'start' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('place-items');
  });

  it('skips inline-grid containers', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ display: 'inline-grid', placeContent: 'end' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are normal', () => {
    const warnings = checkPlace(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
