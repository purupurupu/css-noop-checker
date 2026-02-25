import { describe, it, expect } from 'vitest';
import { checkAlignment } from '../alignment.ts';
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
    parent: null,
  };
}

describe('container-no-align: alignment', () => {
  it('warns when align-items is set on block element', () => {
    const warnings = checkAlignment(createRuleContext(makeElement({ alignItems: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-align');
    expect(warnings[0].title).toContain('align-items');
  });

  it('warns when justify-content is set on block element', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ justifyContent: 'space-between' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('justify-content');
  });

  it('warns for both align-items and justify-content', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ alignItems: 'center', justifyContent: 'center' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('skips flex containers', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'flex', alignItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid containers', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'grid', justifyContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid containers', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'inline-grid', alignItems: 'stretch' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are normal', () => {
    const warnings = checkAlignment(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'contents', alignItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
