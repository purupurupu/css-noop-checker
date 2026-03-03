import { describe, it, expect } from 'vitest';
import { checkInlineLogicalDimensions } from '../inline-no-logical-dimensions.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides });
}

describe('inline-no-logical-dimensions', () => {
  it('warns when inline-size is set on inline element', () => {
    const warnings = checkInlineLogicalDimensions(
      createRuleContext(makeElement({ inlineSize: '200px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-logical-dimensions');
    expect(warnings[0].property).toBe('inline-size');
    expect(warnings[0].title).toContain('inline-size');
  });

  it('warns when block-size is set on inline element', () => {
    const warnings = checkInlineLogicalDimensions(
      createRuleContext(makeElement({ blockSize: '50px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('block-size');
    expect(warnings[0].title).toContain('block-size');
  });

  it('warns for both inline-size and block-size', () => {
    const warnings = checkInlineLogicalDimensions(
      createRuleContext(makeElement({ inlineSize: '100px', blockSize: '30px' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineLogicalDimensions(
      createRuleContext(makeElement({ tagName: 'img', inlineSize: '60px', blockSize: '40px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineLogicalDimensions(
      createRuleContext(makeElement({ tagName: 'input', inlineSize: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (button)', () => {
    const warnings = checkInlineLogicalDimensions(
      createRuleContext(makeElement({ tagName: 'button', inlineSize: '120px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display', () => {
    const warnings = checkInlineLogicalDimensions(
      createRuleContext(makeElement({ display: 'inline-block', inlineSize: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when inline-size and block-size are auto', () => {
    const warnings = checkInlineLogicalDimensions(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
