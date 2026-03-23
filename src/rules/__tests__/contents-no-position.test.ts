import { describe, it, expect } from 'vitest';
import { checkContentsPosition } from '../contents-no-position.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('contents-no-position', () => {
  it('warns when position is non-static on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', position: 'relative' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('contents-no-position');
    expect(warnings[0].property).toBe('position');
  });

  it('warns when top is set on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', top: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('top');
  });

  it('warns when bottom and left are set on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', bottom: '5px', left: '10px' })),
    );
    expect(warnings).toHaveLength(2);
    expect(warnings.map((w) => w.property)).toEqual(['bottom', 'left']);
  });

  it('warns when z-index is set on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', zIndex: '1' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('z-index');
  });

  it('warns when logical offsets are set on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', insetBlockStart: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('inset-block-start');
  });

  it('warns for all logical offsets on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          insetBlockStart: '10px',
          insetBlockEnd: '20px',
          insetInlineStart: '5px',
          insetInlineEnd: '15px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
    expect(warnings.map((w) => w.property)).toEqual([
      'inset-block-start',
      'inset-block-end',
      'inset-inline-start',
      'inset-inline-end',
    ]);
  });

  it('deduplicates physical offset when logical counterpart is also non-default', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', top: '10px', insetBlockStart: '10px' })),
    );
    // Should only report inset-block-start, not top (to avoid duplicate)
    expect(warnings.map((w) => w.property)).toEqual(['inset-block-start']);
  });

  it('warns for multiple properties on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({ display: 'contents', position: 'absolute', top: '0px', zIndex: '10' }),
      ),
    );
    expect(warnings).toHaveLength(3);
    expect(warnings.map((w) => w.property)).toEqual(['position', 'top', 'z-index']);
  });

  it('does not warn on display:contents with all defaults', () => {
    const warnings = checkContentsPosition(createRuleContext(makeElement({ display: 'contents' })));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on display:block with positioning', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'block', position: 'relative', top: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on display:flex with positioning', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'flex', position: 'absolute', zIndex: '5' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns when position is sticky on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', position: 'sticky' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('position');
  });

  it('warns when position is fixed on display:contents', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', position: 'fixed' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('position');
  });

  it('includes suggestion with box generation alternative', () => {
    const warnings = checkContentsPosition(
      createRuleContext(makeElement({ display: 'contents', position: 'relative' })),
    );
    expect(warnings[0].suggestion).toContain('block');
    expect(warnings[0].suggestion).toContain('flex');
  });

  // Writing-mode aware dedup tests
  it('deduplicates right→insetBlockStart in vertical-rl writing mode', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          writingMode: 'vertical-rl',
          right: '10px',
          insetBlockStart: '10px',
        }),
      ),
    );
    // In vertical-rl, right maps to insetBlockStart
    expect(warnings.map((w) => w.property)).toEqual(['inset-block-start']);
  });

  it('deduplicates top→insetInlineStart in vertical-rl writing mode', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          writingMode: 'vertical-rl',
          top: '10px',
          insetInlineStart: '10px',
        }),
      ),
    );
    // In vertical-rl, top maps to insetInlineStart
    expect(warnings.map((w) => w.property)).toEqual(['inset-inline-start']);
  });

  it('does not skip top when insetBlockStart is set in vertical-rl (different axes)', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          writingMode: 'vertical-rl',
          top: '10px',
          insetBlockStart: '10px',
        }),
      ),
    );
    // In vertical-rl, top maps to insetInlineStart, not insetBlockStart
    // So top should NOT be skipped due to insetBlockStart
    const props = warnings.map((w) => w.property);
    expect(props).toContain('top');
    expect(props).toContain('inset-block-start');
  });

  it('deduplicates left→insetBlockStart in vertical-lr writing mode', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          writingMode: 'vertical-lr',
          left: '10px',
          insetBlockStart: '10px',
        }),
      ),
    );
    // In vertical-lr, left maps to insetBlockStart
    expect(warnings.map((w) => w.property)).toEqual(['inset-block-start']);
  });

  it('deduplicates bottom→insetInlineStart in sideways-lr writing mode', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          writingMode: 'sideways-lr',
          bottom: '10px',
          insetInlineStart: '10px',
        }),
      ),
    );
    // In sideways-lr, bottom maps to insetInlineStart
    expect(warnings.map((w) => w.property)).toEqual(['inset-inline-start']);
  });

  // RTL direction tests
  it('deduplicates left→insetInlineEnd in horizontal-tb + rtl', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          direction: 'rtl',
          left: '10px',
          insetInlineEnd: '10px',
        }),
      ),
    );
    // In RTL, left maps to insetInlineEnd (not insetInlineStart)
    expect(warnings.map((w) => w.property)).toEqual(['inset-inline-end']);
  });

  it('deduplicates right→insetInlineStart in horizontal-tb + rtl', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          direction: 'rtl',
          right: '10px',
          insetInlineStart: '10px',
        }),
      ),
    );
    // In RTL, right maps to insetInlineStart (not insetInlineEnd)
    expect(warnings.map((w) => w.property)).toEqual(['inset-inline-start']);
  });

  it('does not skip left when insetInlineStart is set in rtl (different mapping)', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          direction: 'rtl',
          left: '10px',
          insetInlineStart: '10px',
        }),
      ),
    );
    // In RTL, left maps to insetInlineEnd, not insetInlineStart
    // So left should NOT be skipped due to insetInlineStart
    const props = warnings.map((w) => w.property);
    expect(props).toContain('left');
    expect(props).toContain('inset-inline-start');
  });

  it('deduplicates top→insetInlineEnd in vertical-rl + rtl', () => {
    const warnings = checkContentsPosition(
      createRuleContext(
        makeElement({
          display: 'contents',
          writingMode: 'vertical-rl',
          direction: 'rtl',
          top: '10px',
          insetInlineEnd: '10px',
        }),
      ),
    );
    // In vertical-rl + rtl, top maps to insetInlineEnd (not insetInlineStart)
    expect(warnings.map((w) => w.property)).toEqual(['inset-inline-end']);
  });
});
