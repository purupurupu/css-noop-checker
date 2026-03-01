import { describe, it, expect } from 'vitest';
import { checkJustifyItems } from '../container-no-justify-items.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('container-no-justify-items', () => {
  it('warns when justify-items is set on block element', () => {
    const warnings = checkJustifyItems(createRuleContext(makeElement({ justifyItems: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-justify-items');
    expect(warnings[0].property).toBe('justify-items');
    expect(warnings[0].title).toContain('justify-items');
  });

  it('warns when justify-items is set on flex container', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ display: 'flex', justifyItems: 'center' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-justify-items');
  });

  it('warns when justify-items is set on inline-flex container', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ display: 'inline-flex', justifyItems: 'start' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips grid containers', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ display: 'grid', justifyItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid containers', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ display: 'inline-grid', justifyItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when value is normal (default)', () => {
    const warnings = checkJustifyItems(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips when value is legacy center', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ justifyItems: 'legacy center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when value is legacy right', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ justifyItems: 'legacy right' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when value is legacy alone', () => {
    const warnings = checkJustifyItems(createRuleContext(makeElement({ justifyItems: 'legacy' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ display: 'contents', justifyItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('includes display value in details message', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ display: 'inline', justifyItems: 'end' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('inline');
    expect(warnings[0].details).toContain('end');
  });

  it('suggests removal for flex containers', () => {
    const warnings = checkJustifyItems(
      createRuleContext(makeElement({ display: 'flex', justifyItems: 'center' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].suggestion).toContain('Remove justify-items');
    expect(warnings[0].suggestion).toContain('justify-content');
  });

  it('suggests grid for non-flex containers', () => {
    const warnings = checkJustifyItems(createRuleContext(makeElement({ justifyItems: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].suggestion).toContain('display: grid');
  });
});
