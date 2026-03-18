import { describe, it, expect } from 'vitest';
import { checkInlineMinMaxLogicalDimensions } from '../inline-no-min-max-logical-dimensions.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides });
}

describe('inline-no-min-max-logical-dimensions', () => {
  it('warns when min-inline-size is set on inline element', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ minInlineSize: '100px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-min-max-logical-dimensions');
    expect(warnings[0].property).toBe('min-inline-size');
    expect(warnings[0].title).toContain('min-inline-size');
  });

  it('warns when max-inline-size is set on inline element', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ maxInlineSize: '500px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('max-inline-size');
    expect(warnings[0].title).toContain('max-inline-size');
  });

  it('warns when min-block-size is set on inline element', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ minBlockSize: '50px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('min-block-size');
    expect(warnings[0].title).toContain('min-block-size');
  });

  it('warns when max-block-size is set on inline element', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ maxBlockSize: '300px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('max-block-size');
    expect(warnings[0].title).toContain('max-block-size');
  });

  it('warns for all four properties at once', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(
        makeElement({
          minInlineSize: '10px',
          maxInlineSize: '200px',
          minBlockSize: '5px',
          maxBlockSize: '100px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ tagName: 'img', minInlineSize: '100px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ tagName: 'input', maxInlineSize: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (button)', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ tagName: 'button', minBlockSize: '30px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(
      createRuleContext(makeElement({ display: 'inline-block', minInlineSize: '100px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all properties are at initial values', () => {
    const warnings = checkInlineMinMaxLogicalDimensions(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
