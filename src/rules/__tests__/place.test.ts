import { describe, it, expect } from 'vitest';
import { checkPlace } from '../place.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('container-no-place: place-content', () => {
  it('warns when place-content is set on block element', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ placeContent: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-place');
    expect(warnings[0].title).toContain('place-content');
  });

  it('skips grid containers', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'grid', placeContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips flex containers', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'flex', placeContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-flex containers', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'inline-flex', placeContent: 'start' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid containers', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'inline-grid', placeContent: 'end' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are normal', () => {
    const warnings = checkPlace(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'contents', placeContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });
});

describe('container-no-place: place-items', () => {
  it('warns when place-items is set on block element', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ placeItems: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-place');
    expect(warnings[0].property).toBe('place-items');
    expect(warnings[0].title).toContain('place-items');
  });

  it('skips grid containers', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'grid', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips flex containers', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'flex', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are normal', () => {
    const warnings = checkPlace(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'contents', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns for both place-content and place-items on block', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ placeContent: 'center', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(2);
  });
});
