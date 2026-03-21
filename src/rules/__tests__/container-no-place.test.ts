import { describe, it, expect } from 'vitest';
import { checkPlace } from '../container-no-place.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('container-no-place: place-content not checked (align-content works in block layout)', () => {
  it('does not warn when place-content is set on block element', () => {
    const warnings = checkPlace(createRuleContext(makeElement({ placeContent: 'center' })));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when place-content is set on inline element', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'inline', placeContent: 'center' })),
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

  it('warns when place-items is set on inline-block element', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'inline-block', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('inline-block');
  });

  it('warns when place-items is set on table element', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'table', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('table');
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

  it('skips inline-flex containers', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ display: 'inline-flex', placeItems: 'center' })),
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
});

describe('container-no-place: edge cases', () => {
  it('only warns for place-items when both set on block (place-content is not checked)', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ placeContent: 'center', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('place-items');
  });

  it('still warns place-items on multi-column container', () => {
    const warnings = checkPlace(
      createRuleContext(makeElement({ columnCount: '3', placeItems: 'center' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('place-items');
  });
});
