import { describe, it, expect } from 'vitest';
import { checkStaticPositionOffset } from '../static-position-offset.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('static-no-offset', () => {
  it('warns when top is set on static element', () => {
    const warnings = checkStaticPositionOffset(createRuleContext(makeElement({ top: '20px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('static-no-offset');
    expect(warnings[0].property).toBe('top');
    expect(warnings[0].title).toContain('top');
  });

  it('warns when left is set on static element', () => {
    const warnings = checkStaticPositionOffset(createRuleContext(makeElement({ left: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('left');
  });

  it('warns for multiple offsets on static element', () => {
    const warnings = checkStaticPositionOffset(
      createRuleContext(makeElement({ top: '10px', right: '5px', bottom: '10px', left: '5px' })),
    );
    expect(warnings).toHaveLength(4);
    expect(warnings.map((w) => w.property)).toEqual(['top', 'right', 'bottom', 'left']);
  });

  it('does not warn when offsets are auto on static element', () => {
    const warnings = checkStaticPositionOffset(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on relative element with offsets', () => {
    const warnings = checkStaticPositionOffset(
      createRuleContext(makeElement({ position: 'relative', top: '20px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on absolute element with offsets', () => {
    const warnings = checkStaticPositionOffset(
      createRuleContext(makeElement({ position: 'absolute', top: '0px', left: '0px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on fixed element with offsets', () => {
    const warnings = checkStaticPositionOffset(
      createRuleContext(makeElement({ position: 'fixed', bottom: '10px', right: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on sticky element with offsets', () => {
    const warnings = checkStaticPositionOffset(
      createRuleContext(makeElement({ position: 'sticky', top: '0px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('only warns for non-auto offsets', () => {
    const warnings = checkStaticPositionOffset(
      createRuleContext(makeElement({ top: '20px', bottom: 'auto' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('top');
  });

  it('warns when top is 0px on static element', () => {
    const warnings = checkStaticPositionOffset(createRuleContext(makeElement({ top: '0px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('top');
  });

  it('includes suggestion with positioning alternatives', () => {
    const warnings = checkStaticPositionOffset(createRuleContext(makeElement({ top: '10px' })));
    expect(warnings[0].suggestion).toContain('relative');
    expect(warnings[0].suggestion).toContain('absolute');
    expect(warnings[0].suggestion).toContain('fixed');
    expect(warnings[0].suggestion).toContain('sticky');
  });
});
