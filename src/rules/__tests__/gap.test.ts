import { describe, it, expect } from 'vitest';
import { checkGap } from '../gap.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('container-no-gap: gap', () => {
  it('warns when gap is set on block element', () => {
    const warnings = checkGap(
      createRuleContext(makeElement({ gap: '20px', rowGap: '20px', columnGap: '20px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('gap');
  });

  it('warns when row-gap is set on block element', () => {
    const warnings = checkGap(createRuleContext(makeElement({ rowGap: '20px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-gap');
    expect(warnings[0].title).toContain('row-gap');
  });

  it('warns when column-gap is set on block element', () => {
    const warnings = checkGap(createRuleContext(makeElement({ columnGap: '10px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('column-gap');
  });

  it('warns for both row-gap and column-gap', () => {
    const warnings = checkGap(
      createRuleContext(makeElement({ rowGap: '10px', columnGap: '5px', gap: '10px 5px' })),
    );
    expect(warnings).toHaveLength(2);
  });

  it('skips flex containers', () => {
    const warnings = checkGap(
      createRuleContext(makeElement({ display: 'flex', rowGap: '10px', columnGap: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid containers', () => {
    const warnings = checkGap(createRuleContext(makeElement({ display: 'grid', rowGap: '10px' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-flex containers', () => {
    const warnings = checkGap(
      createRuleContext(makeElement({ display: 'inline-flex', columnGap: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips column-gap on multi-column containers (column-count)', () => {
    const warnings = checkGap(
      createRuleContext(makeElement({ columnGap: '40px', columnCount: '2' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips column-gap on multi-column containers (column-width)', () => {
    const warnings = checkGap(
      createRuleContext(makeElement({ columnGap: '40px', columnWidth: '200px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('still warns row-gap on multi-column containers', () => {
    const warnings = checkGap(createRuleContext(makeElement({ rowGap: '20px', columnCount: '2' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].title).toContain('row-gap');
  });

  it('does not collapse to gap warning when column-gap is effective in multi-column', () => {
    const warnings = checkGap(
      createRuleContext(
        makeElement({
          gap: '20px',
          rowGap: '20px',
          columnGap: '20px',
          columnCount: '2',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('row-gap');
  });

  it('skips when gaps are default values', () => {
    const warnings = checkGap(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips when gaps are 0px', () => {
    const warnings = checkGap(createRuleContext(makeElement({ rowGap: '0px', columnGap: '0px' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkGap(
      createRuleContext(makeElement({ display: 'contents', rowGap: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
