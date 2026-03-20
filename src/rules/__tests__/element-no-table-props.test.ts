import { describe, it, expect } from 'vitest';
import { checkElementTableProps } from '../element-no-table-props.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('element-no-table-props', () => {
  it('warns when border-collapse is explicitly set on a block element', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ borderCollapse: 'collapse' }, null, { borderCollapse: 'collapse' }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('element-no-table-props');
    expect(warnings[0].property).toBe('border-collapse');
    expect(warnings[0].title).toContain('non-table elements');
    expect(warnings[0].details).toContain('"collapse"');
    expect(warnings[0].details).toContain('"block"');
  });

  it('warns when table-layout is set on a block element', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ tableLayout: 'fixed' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('element-no-table-props');
    expect(warnings[0].property).toBe('table-layout');
    expect(warnings[0].title).toContain('non-table elements');
    expect(warnings[0].details).toContain('"fixed"');
  });

  it('warns for both properties when both are non-default and border-collapse is inline', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ borderCollapse: 'collapse', tableLayout: 'fixed' }, null, {
          borderCollapse: 'collapse',
        }),
      ),
    );
    expect(warnings).toHaveLength(2);
    expect(warnings[0].property).toBe('border-collapse');
    expect(warnings[1].property).toBe('table-layout');
  });

  it('warns on inline element with explicit border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ display: 'inline', borderCollapse: 'collapse' }, null, {
          borderCollapse: 'collapse',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on flex container with explicit border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ display: 'flex', borderCollapse: 'collapse' }, null, {
          borderCollapse: 'collapse',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on grid container with table-layout', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'grid', tableLayout: 'fixed' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-cell with explicitly set border-collapse and suggests parent table', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ display: 'table-cell', borderCollapse: 'collapse' }, null, {
          borderCollapse: 'collapse',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('border-collapse');
    expect(warnings[0].suggestion).toContain('parent table');
  });

  it('warns on table-row with explicitly set border-collapse and suggests parent table', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ display: 'table-row', borderCollapse: 'collapse' }, null, {
          borderCollapse: 'collapse',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('border-collapse');
    expect(warnings[0].suggestion).toContain('parent table');
  });

  it('skips display: table', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ display: 'table', borderCollapse: 'collapse' }, null, {
          borderCollapse: 'collapse',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: inline-table', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement(
          { display: 'inline-table', borderCollapse: 'collapse', tableLayout: 'fixed' },
          null,
          { borderCollapse: 'collapse' },
        ),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-cell with inherited border-collapse (no inline style)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-cell', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-row with inherited border-collapse (no inline style)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-row', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-row-group with inherited border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-row-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-header-group with inherited border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-header-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-footer-group with inherited border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-footer-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-column with inherited border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-column', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-column-group with inherited border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-column-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-caption with inherited border-collapse', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-caption', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips block with inherited border-collapse (no inline style)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents (no box generated)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ display: 'contents', borderCollapse: 'collapse' }, null, {
          borderCollapse: 'collapse',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when border-collapse is default (separate)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ borderCollapse: 'separate' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when table-layout is default (auto)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ tableLayout: 'auto' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when both properties are default', () => {
    const warnings = checkElementTableProps(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
