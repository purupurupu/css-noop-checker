import { describe, it, expect } from 'vitest';
import { checkNontableEmptyCells } from '../nontable-no-empty-cells.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('nontable-no-empty-cells', () => {
  it('warns when empty-cells: hide is set inline on a block element', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(makeElement({ emptyCells: 'hide' }, null, { emptyCells: 'hide' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nontable-no-empty-cells');
    expect(warnings[0].property).toBe('empty-cells');
    expect(warnings[0].title).toContain('non-table-cell');
    expect(warnings[0].details).toContain('"hide"');
    expect(warnings[0].details).toContain('"block"');
  });

  it('warns on inline element', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(
        makeElement({ display: 'inline', emptyCells: 'hide' }, null, { emptyCells: 'hide' }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on flex container', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(
        makeElement({ display: 'flex', emptyCells: 'hide' }, null, { emptyCells: 'hide' }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on grid container', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(
        makeElement({ display: 'grid', emptyCells: 'hide' }, null, { emptyCells: 'hide' }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table element (not table-cell)', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(
        makeElement({ display: 'table', emptyCells: 'hide' }, null, { emptyCells: 'hide' }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-row element', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(
        makeElement({ display: 'table-row', emptyCells: 'hide' }, null, { emptyCells: 'hide' }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('does not warn when empty-cells is inherited (not inline)', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(makeElement({ emptyCells: 'hide' }, null, { emptyCells: '' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on table-cell', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(
        makeElement({ display: 'table-cell', emptyCells: 'hide' }, null, { emptyCells: 'hide' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when empty-cells is default (show)', () => {
    const warnings = checkNontableEmptyCells(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on display: contents', () => {
    const warnings = checkNontableEmptyCells(
      createRuleContext(
        makeElement({ display: 'contents', emptyCells: 'hide' }, null, { emptyCells: 'hide' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
