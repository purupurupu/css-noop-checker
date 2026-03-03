import { describe, it, expect } from 'vitest';
import { checkPositionedNoClear } from '../positioned-no-clear.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('positioned-no-clear', () => {
  it('warns when clear is set on absolute element', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'absolute', clear: 'both' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('positioned-no-clear');
    expect(warnings[0].property).toBe('clear');
    expect(warnings[0].title).toContain('clear');
  });

  it('warns when clear is set on fixed element', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'fixed', clear: 'left' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('clear');
  });

  it('warns for clear: right on absolute element', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'absolute', clear: 'right' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('right');
    expect(warnings[0].details).toContain('absolute');
  });

  it('does not warn when clear is none on absolute element', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'absolute', clear: 'none' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on static element with clear', () => {
    const warnings = checkPositionedNoClear(createRuleContext(makeElement({ clear: 'both' })));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on relative element with clear', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'relative', clear: 'both' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on sticky element with clear', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'sticky', clear: 'left' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns for clear: inline-start on absolute element', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'absolute', clear: 'inline-start' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('inline-start');
  });

  it('warns for clear: inline-end on fixed element', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'fixed', clear: 'inline-end' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('inline-end');
  });

  it('includes suggestion with positioning alternatives', () => {
    const warnings = checkPositionedNoClear(
      createRuleContext(makeElement({ position: 'absolute', clear: 'both' })),
    );
    expect(warnings[0].suggestion).toContain('static');
    expect(warnings[0].suggestion).toContain('relative');
    expect(warnings[0].suggestion).toContain('sticky');
  });
});
