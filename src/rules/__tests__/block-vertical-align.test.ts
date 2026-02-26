import { describe, it, expect } from 'vitest';
import { checkBlockVerticalAlign } from '../block-vertical-align.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('block-no-vertical-align', () => {
  it('warns when vertical-align is set on block element', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('block-no-vertical-align');
    expect(warnings[0].property).toBe('vertical-align');
    expect(warnings[0].title).toContain('vertical-align');
    expect(warnings[0].details).toContain('"middle"');
    expect(warnings[0].details).toContain('"block"');
  });

  it('warns when vertical-align is set on flex container', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'flex', verticalAlign: 'top' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('block-no-vertical-align');
  });

  it('warns when vertical-align is set on grid container', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'grid', verticalAlign: 'bottom' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('block-no-vertical-align');
  });

  it('warns when vertical-align is set on list-item', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'list-item', verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips inline elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'inline', verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-block elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'inline-block', verticalAlign: 'top' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-flex elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'inline-flex', verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'inline-grid', verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-cell elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'table-cell', verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-table elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'inline-table', verticalAlign: 'top' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-row elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'table-row', verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkBlockVerticalAlign(
      createRuleContext(makeElement({ display: 'contents', verticalAlign: 'middle' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when vertical-align is baseline (default)', () => {
    const warnings = checkBlockVerticalAlign(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
