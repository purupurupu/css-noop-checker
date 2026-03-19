import { describe, it, expect } from 'vitest';
import { checkCollapsedTableBorderSpacing } from '../collapsed-table-no-border-spacing.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ display: 'table', borderCollapse: 'collapse', ...overrides });
}

describe('collapsed-table-no-border-spacing: border-spacing on collapsed table', () => {
  // --- Should warn ---
  it('warns when border-spacing is set on a collapsed table', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(makeElement({ borderSpacing: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('collapsed-table-no-border-spacing');
    expect(warnings[0].property).toBe('border-spacing');
  });

  it('warns when border-spacing has two values on a collapsed table', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(makeElement({ borderSpacing: '5px 10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('border-spacing');
  });

  it('warns on inline-table with collapse and border-spacing', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(makeElement({ display: 'inline-table', borderSpacing: '8px' })),
    );
    expect(warnings).toHaveLength(1);
  });

  // --- Should NOT warn ---
  it('skips when border-collapse is separate', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(makeElement({ borderCollapse: 'separate', borderSpacing: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when border-spacing is default (0px)', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(makeElement({ borderSpacing: '0px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when border-spacing is default (0px 0px)', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(makeElement({ borderSpacing: '0px 0px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-table display types', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'block', borderCollapse: 'collapse', borderSpacing: '10px' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips table-cell (not a table box)', () => {
    const warnings = checkCollapsedTableBorderSpacing(
      createRuleContext(
        makeElement({ display: 'table-cell', borderCollapse: 'collapse', borderSpacing: '10px' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
