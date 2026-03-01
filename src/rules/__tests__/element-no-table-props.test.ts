import { describe, it, expect } from 'vitest';
import { checkElementTableProps } from '../element-no-table-props.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('element-no-table-props', () => {
  it('warns when border-collapse is set on a block element', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ borderCollapse: 'collapse' })),
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

  it('warns for both properties when both are non-default', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ borderCollapse: 'collapse', tableLayout: 'fixed' })),
    );
    expect(warnings).toHaveLength(2);
    expect(warnings[0].property).toBe('border-collapse');
    expect(warnings[1].property).toBe('table-layout');
  });

  it('warns on inline element', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'inline', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on flex container', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'flex', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on grid container', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'grid', tableLayout: 'fixed' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips display: table', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: inline-table', () => {
    const warnings = checkElementTableProps(
      createRuleContext(
        makeElement({ display: 'inline-table', borderCollapse: 'collapse', tableLayout: 'fixed' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-cell (inherited border-collapse)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-cell', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-row (inherited border-collapse)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-row', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-row-group', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-row-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-header-group', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-header-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-footer-group', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-footer-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-column', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-column', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-column-group', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-column-group', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-caption', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'table-caption', borderCollapse: 'collapse' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents (no box generated)', () => {
    const warnings = checkElementTableProps(
      createRuleContext(makeElement({ display: 'contents', borderCollapse: 'collapse' })),
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
