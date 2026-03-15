import { describe, it, expect } from 'vitest';
import { checkAnimationNoSubProps } from '../animation-no-sub-props.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('animation-no-sub-props', () => {
  it('warns when animation-duration is non-default without animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationDuration: '2s' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('animation-no-sub-props');
    expect(warnings[0].property).toBe('animation-duration');
    expect(warnings[0].details).toContain('2s');
  });

  it('warns when animation-timing-function is non-default without animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationTimingFunction: 'linear' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('animation-timing-function');
  });

  it('warns when animation-delay is non-default without animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationDelay: '1s' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('animation-delay');
  });

  it('warns when animation-iteration-count is non-default without animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationIterationCount: 'infinite' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('animation-iteration-count');
  });

  it('warns when animation-direction is non-default without animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationDirection: 'reverse' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('animation-direction');
  });

  it('warns when animation-fill-mode is non-default without animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationFillMode: 'forwards' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('animation-fill-mode');
  });

  it('warns when animation-play-state is non-default without animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationPlayState: 'paused' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('animation-play-state');
  });

  it('warns for multiple non-default animation properties', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(
        makeElement({
          animationDuration: '2s',
          animationDelay: '500ms',
          animationIterationCount: 'infinite',
        }),
      ),
    );
    expect(warnings).toHaveLength(3);
    expect(warnings.map((w) => w.property)).toEqual([
      'animation-duration',
      'animation-delay',
      'animation-iteration-count',
    ]);
  });

  it('does not warn when animation-name is set', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(
        makeElement({
          animationName: 'fadeIn',
          animationDuration: '2s',
          animationTimingFunction: 'linear',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when all properties are at default values with name=none', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(makeElement({ animationName: 'none' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when all properties are at default values (implicit none)', () => {
    const warnings = checkAnimationNoSubProps(createRuleContext(makeElement()));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when animation-name is a custom name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(
        makeElement({
          animationName: 'slideIn',
          animationDuration: '1s',
          animationFillMode: 'forwards',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn for multi-animation (name includes none)', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(
        makeElement({
          animationName: 'slide, none',
          animationDuration: '2s',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when will-change includes animation-name', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(
        makeElement({
          willChange: 'animation-name',
          animationDuration: '2s',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when will-change includes animation', () => {
    const warnings = checkAnimationNoSubProps(
      createRuleContext(
        makeElement({
          willChange: 'opacity, animation',
          animationDuration: '2s',
          animationFillMode: 'forwards',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
