import { describe, it, expect } from 'vitest';
import { checkAlignment } from '../container-no-align.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('container-no-align: alignment', () => {
  it('warns when align-items is set on block element', () => {
    const warnings = checkAlignment(createRuleContext(makeElement({ alignItems: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-align');
    expect(warnings[0].title).toContain('align-items');
  });

  it('warns when justify-content is set on block element', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ justifyContent: 'space-between' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('justify-content');
  });

  it('warns for both align-items and justify-content', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ alignItems: 'center', justifyContent: 'center' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('skips flex containers', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'flex', alignItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid containers', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'grid', justifyContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid containers', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'inline-grid', alignItems: 'stretch' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are normal', () => {
    const warnings = checkAlignment(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ display: 'contents', alignItems: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips justify-content on multi-column container (column-count)', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ columnCount: '3', justifyContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips justify-content on multi-column container (column-width)', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ columnWidth: '200px', justifyContent: 'space-between' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('still warns align-items on multi-column container', () => {
    const warnings = checkAlignment(
      createRuleContext(makeElement({ columnCount: '3', alignItems: 'center' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('align-items');
  });

  it('warns justify-content on block without multicol', () => {
    const warnings = checkAlignment(createRuleContext(makeElement({ justifyContent: 'center' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('justify-content');
  });
});
