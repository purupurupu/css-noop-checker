import { describe, it, expect } from 'vitest';
import { checkInlineOverflow } from '../inline-no-overflow.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides });
}

describe('inline-no-overflow', () => {
  it('warns when overflow is hidden on inline element', () => {
    const warnings = checkInlineOverflow(
      createRuleContext(makeElement({ overflowX: 'hidden', overflowY: 'hidden' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-overflow');
    expect(warnings[0].property).toBe('overflow');
    expect(warnings[0].details).toContain('hidden');
  });

  it('warns when only overflow-x is non-visible (single warning, omits visible axis)', () => {
    const warnings = checkInlineOverflow(createRuleContext(makeElement({ overflowX: 'scroll' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('overflow');
    expect(warnings[0].details).toContain('overflow-x is "scroll"');
    expect(warnings[0].details).not.toContain('visible');
  });

  it('warns when only overflow-y is non-visible (single warning, omits visible axis)', () => {
    const warnings = checkInlineOverflow(createRuleContext(makeElement({ overflowY: 'auto' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('overflow');
    expect(warnings[0].details).toContain('overflow-y is "auto"');
    expect(warnings[0].details).not.toContain('visible');
  });

  it('emits single warning even when axes differ', () => {
    const warnings = checkInlineOverflow(
      createRuleContext(makeElement({ overflowX: 'hidden', overflowY: 'scroll' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('overflow');
    expect(warnings[0].details).toContain('overflow-x is "hidden"');
    expect(warnings[0].details).toContain('overflow-y is "scroll"');
  });

  it('warns when overflow is clip on inline element', () => {
    const warnings = checkInlineOverflow(
      createRuleContext(makeElement({ overflowX: 'clip', overflowY: 'clip' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('overflow');
    expect(warnings[0].details).toContain('clip');
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineOverflow(
      createRuleContext(makeElement({ tagName: 'img', overflowX: 'hidden', overflowY: 'hidden' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (textarea)', () => {
    const warnings = checkInlineOverflow(
      createRuleContext(
        makeElement({ tagName: 'textarea', overflowX: 'hidden', overflowY: 'hidden' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display', () => {
    const warnings = checkInlineOverflow(
      createRuleContext(
        makeElement({ display: 'inline-block', overflowX: 'hidden', overflowY: 'hidden' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips block display', () => {
    const warnings = checkInlineOverflow(
      createRuleContext(
        makeElement({ display: 'block', overflowX: 'hidden', overflowY: 'hidden' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when overflow is visible (default)', () => {
    const warnings = checkInlineOverflow(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
