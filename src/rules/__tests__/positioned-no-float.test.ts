import { describe, it, expect } from 'vitest';
import { checkPositionedNoFloat } from '../positioned-no-float.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('positioned-no-float', () => {
  it('warns when inline float is set on absolute positioned element', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'absolute' }, null, { cssFloat: 'left' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('positioned-no-float');
    expect(warnings[0].property).toBe('float');
    expect(warnings[0].details).toContain('absolute');
    expect(warnings[0].details).toContain('left');
  });

  it('warns when inline float is right on absolute positioned element', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'absolute' }, null, { cssFloat: 'right' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('right');
  });

  it('warns when inline float is set on fixed positioned element', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'fixed' }, null, { cssFloat: 'left' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('fixed');
  });

  it('skips when inline float is none on absolute positioned element', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'absolute' }, null, { cssFloat: 'none' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when no inline float is set (empty string)', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'absolute' }, null, { cssFloat: '' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when inlineStyles is absent (no inline extraction)', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'absolute' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when position is static', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'static' }, null, { cssFloat: 'left' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when position is relative', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'relative' }, null, { cssFloat: 'left' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when position is sticky', () => {
    const warnings = checkPositionedNoFloat(
      createRuleContext(makeElement({ position: 'sticky' }, null, { cssFloat: 'left' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
