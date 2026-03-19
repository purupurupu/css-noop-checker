import { describe, it, expect } from 'vitest';
import { checkTablePadding } from '../table-no-padding.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('table-no-padding', () => {
  it('warns when padding-top is set on table-row with row-specific suggestion', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-row', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('table-no-padding');
    expect(warnings[0].property).toBe('padding-top');
    expect(warnings[0].title).toContain('table-row');
    expect(warnings[0].details).toContain('"10px"');
    expect(warnings[0].suggestion).toContain('Move the padding to the table-cell');
  });

  it('warns when padding is set on table-row-group', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-row-group', paddingBottom: '5px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-bottom');
  });

  it('warns when padding is set on table-column with column-specific suggestion', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-column', paddingLeft: '8px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-left');
    expect(warnings[0].suggestion).toContain('has no effect on table-column');
    expect(warnings[0].suggestion).not.toContain('Move');
  });

  it('warns when padding is set on table-column-group with column-specific suggestion', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-column-group', paddingRight: '12px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-right');
    expect(warnings[0].suggestion).toContain('has no effect on table-column-group');
    expect(warnings[0].suggestion).not.toContain('Move');
  });

  it('warns when padding is set on table-header-group', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-header-group', paddingTop: '4px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-top');
  });

  it('warns when padding is set on table-footer-group', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-footer-group', paddingBottom: '4px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-bottom');
  });

  it('warns when padding-block-start is set on table-row', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-row', paddingBlockStart: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-block-start');
  });

  it('warns when padding-inline-end is set on table-column', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-column', paddingInlineEnd: '8px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-inline-end');
  });

  it('deduplicates: when all 8 padding properties are non-zero, warns only for 4 logical ones', () => {
    const warnings = checkTablePadding(
      createRuleContext(
        makeElement({
          display: 'table-row',
          paddingTop: '10px',
          paddingRight: '10px',
          paddingBottom: '10px',
          paddingLeft: '10px',
          paddingBlockStart: '10px',
          paddingBlockEnd: '10px',
          paddingInlineStart: '10px',
          paddingInlineEnd: '10px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
    expect(warnings.map((w) => w.property)).toEqual([
      'padding-block-start',
      'padding-block-end',
      'padding-inline-end',
      'padding-inline-start',
    ]);
  });

  it('deduplicates: padding shorthand (same value for all 8) produces 4 warnings', () => {
    const warnings = checkTablePadding(
      createRuleContext(
        makeElement({
          display: 'table-row',
          paddingTop: '20px',
          paddingRight: '20px',
          paddingBottom: '20px',
          paddingLeft: '20px',
          paddingBlockStart: '20px',
          paddingBlockEnd: '20px',
          paddingInlineStart: '20px',
          paddingInlineEnd: '20px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
  });

  it('warns for physical property when only physical is set (no logical counterpart)', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-row', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('padding-top');
  });

  it('skips display: table (padding is valid)', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: inline-table (padding is valid)', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'inline-table', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-cell (padding is valid)', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-cell', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-caption (padding is valid)', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'table-caption', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: block', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'block', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: flex', () => {
    const warnings = checkTablePadding(
      createRuleContext(makeElement({ display: 'flex', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all padding is default (0px)', () => {
    const warnings = checkTablePadding(createRuleContext(makeElement({ display: 'table-row' })));
    expect(warnings).toHaveLength(0);
  });
});
