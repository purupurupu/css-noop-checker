import { describe, it, expect } from 'vitest';
import { checkColumns } from '../container-no-columns.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('container-no-columns: multi-column props on flex/grid', () => {
  it('warns when column-count is set on flex container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'flex', columnCount: '3' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-count');
    expect(warnings[0].ruleId).toBe('container-no-columns');
  });

  it('warns when column-width is set on flex container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'flex', columnWidth: '200px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-width');
  });

  it('warns when both column-count and column-width are set on flex container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'flex', columnCount: '2', columnWidth: '150px' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('warns when column-count is set on grid container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'grid', columnCount: '3' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-count');
  });

  it('warns when column-width is set on grid container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'grid', columnWidth: '200px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-width');
  });

  it('warns on inline-flex container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'inline-flex', columnCount: '2' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns when column-width is set on inline-grid container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'inline-grid', columnWidth: '100px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns when column-count is set on inline-grid container', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'inline-grid', columnCount: '2' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('column-count');
  });

  it('skips block elements (multi-column is valid)', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'block', columnCount: '3' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline elements', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'inline', columnCount: '2' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when column-count and column-width are defaults', () => {
    const warnings = checkColumns(createRuleContext(makeElement({ display: 'flex' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents (not a flex/grid container)', () => {
    const warnings = checkColumns(
      createRuleContext(makeElement({ display: 'contents', columnCount: '3' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
