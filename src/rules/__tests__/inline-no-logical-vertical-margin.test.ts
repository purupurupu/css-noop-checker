import { describe, it, expect } from 'vitest';
import { checkInlineLogicalVerticalMargin } from '../inline-no-logical-vertical-margin.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides });
}

// margin-block-* is always block-axis per CSS Logical Properties L1,
// so this rule fires regardless of writing mode.
describe('inline-no-logical-vertical-margin: margin-block on inline elements', () => {
  it('warns when margin-block-start is set on inline element', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ marginBlockStart: '20px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-logical-vertical-margin');
    expect(warnings[0].property).toBe('margin-block-start');
  });

  it('warns when margin-block-end is set on inline element', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ marginBlockEnd: '15px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-block-end');
  });

  it('warns for both margin-block-start and margin-block-end', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ marginBlockStart: '10px', marginBlockEnd: '10px' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ tagName: 'img', marginBlockStart: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ tagName: 'input', marginBlockStart: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (button)', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ tagName: 'button', marginBlockEnd: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display (inline-block)', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ display: 'inline-block', marginBlockStart: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display (block)', () => {
    const warnings = checkInlineLogicalVerticalMargin(
      createRuleContext(makeElement({ display: 'block', marginBlockStart: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when margin-block-start and margin-block-end are 0px', () => {
    const warnings = checkInlineLogicalVerticalMargin(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
