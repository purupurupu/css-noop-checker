import { describe, it, expect } from 'vitest';
import { checkNontableBorderSpacing } from '../nontable-no-border-spacing.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('nontable-no-border-spacing', () => {
  it('warns when border-spacing is set inline on a block element', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(makeElement({ borderSpacing: '2px 2px' }, null, { borderSpacing: '2px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nontable-no-border-spacing');
    expect(warnings[0].property).toBe('border-spacing');
    expect(warnings[0].title).toContain('non-table elements');
    expect(warnings[0].details).toContain('"2px 2px"');
    expect(warnings[0].details).toContain('"block"');
  });

  it('warns on inline element', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'inline', borderSpacing: '5px 5px' }, null, {
          borderSpacing: '5px',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on flex container', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'flex', borderSpacing: '2px 2px' }, null, {
          borderSpacing: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on grid container', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'grid', borderSpacing: '2px 2px' }, null, {
          borderSpacing: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on inline-block element', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'inline-block', borderSpacing: '3px 3px' }, null, {
          borderSpacing: '3px',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on table-cell with inline border-spacing', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'table-cell', borderSpacing: '4px 4px' }, null, {
          borderSpacing: '4px',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('does not warn when border-spacing is inherited (not inline)', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(makeElement({ borderSpacing: '10px 10px' }, null, { borderSpacing: '' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: table', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'table', borderSpacing: '2px 2px' }, null, {
          borderSpacing: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: inline-table', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'inline-table', borderSpacing: '2px 2px' }, null, {
          borderSpacing: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents (no box generated)', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'contents', borderSpacing: '2px 2px' }, null, {
          borderSpacing: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when border-spacing is default (0px 0px)', () => {
    const warnings = checkNontableBorderSpacing(
      createRuleContext(makeElement({ borderSpacing: '0px 0px' }, null, { borderSpacing: '0px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when border-spacing is not set (uses default from makeElement)', () => {
    const warnings = checkNontableBorderSpacing(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
