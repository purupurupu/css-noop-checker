import { describe, it, expect } from 'vitest';
import { checkInlineDimensions } from '../inline-no-dimensions.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides });
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

  it('skips width warning when inlineSize is non-auto (dedup with inline-no-logical-dimensions)', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ width: '200px', inlineSize: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips height warning when blockSize is non-auto (dedup with inline-no-logical-dimensions)', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ height: '50px', blockSize: '50px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns for width when only physical property is set (inlineSize stays auto)', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(makeElement({ width: '200px', inlineSize: 'auto' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('width');
  });

  it('dedup: skips both when both logical sizes are non-auto', () => {
    const warnings = checkInlineDimensions(
      createRuleContext(
        makeElement({ width: '100px', height: '30px', inlineSize: '100px', blockSize: '30px' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
