import { describe, it, expect } from 'vitest';
import { checkTransformNoOrigin } from '../transform-no-origin.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('transform-no-origin', () => {
  it('warns when transform-origin is set inline without a transform', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(makeElement({}, null, { transformOrigin: 'top left' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('transform-no-origin');
    expect(warnings[0].property).toBe('transform-origin');
    expect(warnings[0].details).toContain('top left');
  });

  it('warns when transform-origin is "0px 0px" inline', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(makeElement({}, null, { transformOrigin: '0px 0px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns with a 3D transform-origin value', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(makeElement({}, null, { transformOrigin: 'top left 20px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('top left 20px');
  });

  it('does not warn when transform is active', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(
        makeElement({ transform: 'rotate(45deg)' }, null, { transformOrigin: 'top left' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when rotate is set', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(makeElement({ rotate: '45deg' }, null, { transformOrigin: 'top left' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when scale is set', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(makeElement({ scale: '2' }, null, { transformOrigin: 'top left' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when offset-path is set', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(
        makeElement({ offsetPath: 'path("M 0 0 L 100 100")' }, null, {
          transformOrigin: 'top left',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when will-change includes transform', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(
        makeElement({ willChange: 'transform' }, null, { transformOrigin: 'top left' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when will-change includes transform in a list', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(
        makeElement({ willChange: 'opacity, transform' }, null, { transformOrigin: 'top left' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns when only translate is set (transform-origin has no visual effect on translate)', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(
        makeElement({ translate: '10px 20px' }, null, { transformOrigin: 'top left' }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns when will-change is transform-origin (not transform)', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(
        makeElement({ willChange: 'transform-origin' }, null, { transformOrigin: 'top left' }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('does not warn when no inline transform-origin is set', () => {
    const warnings = checkTransformNoOrigin(createRuleContext(makeElement()));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when inline transform-origin is empty string', () => {
    const warnings = checkTransformNoOrigin(
      createRuleContext(makeElement({}, null, { transformOrigin: '' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
