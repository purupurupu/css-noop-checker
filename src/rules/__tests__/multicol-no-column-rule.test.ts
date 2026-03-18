import { describe, it, expect } from 'vitest';
import { checkMulticolColumnRule } from '../multicol-no-column-rule.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('multicol-no-column-rule: column-rule/column-fill on non-multicol container', () => {
  it('warns when column-rule-style is set on non-multicol element', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(makeElement({ columnRuleStyle: 'solid' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-rule-style');
    expect(warnings[0].ruleId).toBe('multicol-no-column-rule');
  });

  it('warns when column-rule-width is set on non-multicol element', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(makeElement({ columnRuleWidth: '2px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-rule-width');
  });

  it('warns when column-fill is set on non-multicol element', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(makeElement({ columnFill: 'auto' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-fill');
  });

  it('warns for column-rule-style and column-rule-width together', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({
          columnRuleStyle: 'solid',
          columnRuleWidth: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(2);
  });

  it('warns for all properties including column-fill', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({
          columnRuleStyle: 'solid',
          columnRuleWidth: '2px',
          columnFill: 'auto',
        }),
      ),
    );
    expect(warnings).toHaveLength(3);
  });

  it('warns on flex container even with column-count set (column-count is ignored on flex)', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({
          display: 'flex',
          columnCount: '3',
          columnRuleStyle: 'solid',
          columnFill: 'auto',
        }),
      ),
    );
    expect(warnings).toHaveLength(2);
  });

  it('warns on grid container even with column-width set (column-width is ignored on grid)', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({
          display: 'grid',
          columnWidth: '200px',
          columnRuleStyle: 'solid',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on inline-flex container with column-count', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({
          display: 'inline-flex',
          columnCount: '2',
          columnRuleStyle: 'dashed',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on inline-grid container with column-count', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({
          display: 'inline-grid',
          columnCount: '2',
          columnRuleStyle: 'solid',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips when block element has column-count (is multicol)', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({ columnCount: '3', columnRuleStyle: 'solid', columnFill: 'auto' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when block element has column-width (is multicol)', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(
        makeElement({ columnWidth: '200px', columnRuleStyle: 'solid', columnFill: 'auto' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when column-count is 1 (still multicol)', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(makeElement({ columnCount: '1', columnRuleStyle: 'solid' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all column-rule properties are defaults', () => {
    const warnings = checkMulticolColumnRule(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips column-rule-width 0px (default when style is none)', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(makeElement({ columnRuleWidth: '0px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips column-rule-width medium (initial value)', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(makeElement({ columnRuleWidth: 'medium' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns on flex container without column-count/width', () => {
    const warnings = checkMulticolColumnRule(
      createRuleContext(makeElement({ display: 'flex', columnRuleStyle: 'solid' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-rule-style');
  });
});
