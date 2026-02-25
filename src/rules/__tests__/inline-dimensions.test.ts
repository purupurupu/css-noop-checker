import { describe, it, expect } from 'vitest';
import { checkInlineDimensions } from '../inline-dimensions.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string },
): ElementData {
  const { tagName = 'span', ...styles } = overrides;
  return {
    tagName,
    id: '',
    classList: [],
    computedStyles: {
      display: 'inline',
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
      ...styles,
    },
    parent: null,
  };
}

describe('inline-no-dimensions: inline dimensions', () => {
  it('warns when width is set on inline element', () => {
    const warnings = checkInlineDimensions(createRuleContext(makeElement({ width: '200px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-dimensions');
    expect(warnings[0].title).toContain('width');
  });

  it('warns when height is set on inline element', () => {
    const warnings = checkInlineDimensions(createRuleContext(makeElement({ height: '50px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('height');
  });

  it('warns for both width and height', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ width: '100px', height: '30px' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ tagName: 'img', width: '60px', height: '40px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ tagName: 'input', width: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (button)', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ tagName: 'button', width: '120px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ display: 'inline-block', width: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when width and height are auto', () => {
    const warnings = checkInlineDimensions(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
