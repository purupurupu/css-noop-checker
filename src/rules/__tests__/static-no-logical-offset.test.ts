import { describe, it, expect } from 'vitest';
import { checkStaticLogicalOffset } from '../static-no-logical-offset.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('static-no-logical-offset', () => {
  it('warns when inset-block-start is set on static element', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ insetBlockStart: '20px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('static-no-logical-offset');
    expect(warnings[0].property).toBe('inset-block-start');
    expect(warnings[0].title).toContain('inset-block-start');
  });

  it('warns when inset-inline-start is set on static element', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ insetInlineStart: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('inset-inline-start');
  });

  it('warns for multiple logical offsets on static element', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(
        makeElement({
          insetBlockStart: '10px',
          insetBlockEnd: '5px',
          insetInlineStart: '10px',
          insetInlineEnd: '5px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
    expect(warnings.map((w) => w.property)).toEqual([
      'inset-block-start',
      'inset-block-end',
      'inset-inline-start',
      'inset-inline-end',
    ]);
  });

  it('does not warn when logical offsets are auto on static element', () => {
    const warnings = checkStaticLogicalOffset(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on relative element with logical offsets', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ position: 'relative', insetBlockStart: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on absolute element with logical offsets', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(
        makeElement({ position: 'absolute', insetBlockStart: '0px', insetInlineStart: '0px' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on fixed element with logical offsets', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(
        makeElement({ position: 'fixed', insetBlockEnd: '10px', insetInlineEnd: '10px' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on sticky element with logical offsets', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ position: 'sticky', insetBlockStart: '0px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('only warns for non-auto logical offsets', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ insetBlockStart: '20px', insetBlockEnd: 'auto' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('inset-block-start');
  });

  it('warns when inset-block-start is 0px on static element', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ insetBlockStart: '0px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('inset-block-start');
  });

  it('does not warn on display:contents element', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ display: 'contents', insetBlockStart: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('includes suggestion with positioning alternatives', () => {
    const warnings = checkStaticLogicalOffset(
      createRuleContext(makeElement({ insetBlockStart: '10px' })),
    );
    expect(warnings[0].suggestion).toContain('relative');
    expect(warnings[0].suggestion).toContain('absolute');
    expect(warnings[0].suggestion).toContain('fixed');
    expect(warnings[0].suggestion).toContain('sticky');
  });
});
