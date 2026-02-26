import { describe, it, expect } from 'vitest';
import { checkInlineVerticalMargin } from '../inline-vertical-margin.ts';
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
      marginTop: '0px',
      marginBottom: '0px',
      ...styles,
    },
    parent: null,
  };
}

describe('inline-no-vertical-margin: vertical margin on inline elements', () => {
  it('warns when margin-top is set on inline element', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ marginTop: '20px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-vertical-margin');
    expect(warnings[0].property).toBe('margin-top');
  });

  it('warns when margin-bottom is set on inline element', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ marginBottom: '15px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-bottom');
  });

  it('warns for both margin-top and margin-bottom', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ marginTop: '10px', marginBottom: '10px' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ tagName: 'img', marginTop: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ tagName: 'input', marginTop: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (button)', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ tagName: 'button', marginBottom: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display (inline-block)', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ display: 'inline-block', marginTop: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display (block)', () => {
    const warnings = checkInlineVerticalMargin(
      createRuleContext(makeElement({ display: 'block', marginTop: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when margin-top and margin-bottom are 0px', () => {
    const warnings = checkInlineVerticalMargin(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
