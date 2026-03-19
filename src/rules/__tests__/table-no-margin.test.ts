import { describe, it, expect } from 'vitest';
import { checkTableMargin } from '../table-no-margin.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ display: 'table-row', ...overrides });
}

describe('table-no-margin: margin on internal table elements', () => {
  // --- Physical margins ---
  it('warns when margin-top is set on table-row', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({ marginTop: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('table-no-margin');
    expect(warnings[0].property).toBe('margin-top');
  });

  it('warns when margin-bottom is set on table-row', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({ marginBottom: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-bottom');
  });

  it('warns when margin-left is set on table-row', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({ marginLeft: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-left');
  });

  it('warns when margin-right is set on table-row', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({ marginRight: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-right');
  });

  // --- Logical margins ---
  it('warns when margin-block-start is set on table-row', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({ marginBlockStart: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-block-start');
  });

  it('warns when margin-block-end is set on table-row', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({ marginBlockEnd: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-block-end');
  });

  it('warns when margin-inline-start is set on table-row', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ marginInlineStart: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-inline-start');
  });

  it('warns when margin-inline-end is set on table-row', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({ marginInlineEnd: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-inline-end');
  });

  // --- Dedup: physical skipped when logical counterpart is also non-default ---
  it('emits only logical warning when both physical and logical are non-default', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ marginTop: '10px', marginBlockStart: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-block-start');
  });

  it('emits physical warning when logical is default', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ marginTop: '10px', marginBlockStart: '0px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('margin-top');
  });

  it('deduplicates all four pairs when both physical and logical are non-default', () => {
    const warnings = checkTableMargin(
      createRuleContext(
        makeElement({
          marginTop: '10px',
          marginRight: '20px',
          marginBottom: '10px',
          marginLeft: '20px',
          marginBlockStart: '10px',
          marginBlockEnd: '10px',
          marginInlineStart: '20px',
          marginInlineEnd: '20px',
        }),
      ),
    );
    // Only 4 logical warnings, physical ones are deduped
    expect(warnings).toHaveLength(4);
    expect(warnings.map((w) => w.property)).toEqual([
      'margin-block-start',
      'margin-block-end',
      'margin-inline-end',
      'margin-inline-start',
    ]);
  });

  // --- All internal table display types ---
  it('warns on table-row-group', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table-row-group', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-cell', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table-cell', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-column', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table-column', marginLeft: '10px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-column-group', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table-column-group', marginLeft: '10px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-header-group', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table-header-group', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-footer-group', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table-footer-group', marginBottom: '10px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  // --- Should NOT warn ---
  it('skips display: table (margins apply to table boxes)', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: inline-table', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'inline-table', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table-caption', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'table-caption', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: block', () => {
    const warnings = checkTableMargin(
      createRuleContext(makeElement({ display: 'block', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all margins are default (0px)', () => {
    const warnings = checkTableMargin(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
