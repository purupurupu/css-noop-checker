import { describe, it, expect } from 'vitest';
import { checkInlineMinMaxDimensions } from '../inline-no-min-max-dimensions.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides });
}

describe('inline-no-min-max-dimensions', () => {
  it('warns when min-width is set on inline element', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ minWidth: '100px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-min-max-dimensions');
    expect(warnings[0].property).toBe('min-width');
    expect(warnings[0].title).toContain('min-width');
  });

  it('warns when max-width is set on inline element', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ maxWidth: '500px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('max-width');
    expect(warnings[0].title).toContain('max-width');
  });

  it('warns when min-height is set on inline element', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ minHeight: '50px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('min-height');
    expect(warnings[0].title).toContain('min-height');
  });

  it('warns when max-height is set on inline element', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ maxHeight: '300px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('max-height');
    expect(warnings[0].title).toContain('max-height');
  });

  it('warns for all four properties at once', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(
        makeElement({
          minWidth: '10px',
          maxWidth: '200px',
          minHeight: '5px',
          maxHeight: '100px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ tagName: 'img', minWidth: '100px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ tagName: 'input', maxWidth: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (button)', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ tagName: 'button', minHeight: '30px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-block display', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ display: 'inline-block', minWidth: '100px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips block display', () => {
    const warnings = checkInlineMinMaxDimensions(
      createRuleContext(makeElement({ display: 'block', minWidth: '100px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all properties are at initial values', () => {
    const warnings = checkInlineMinMaxDimensions(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
