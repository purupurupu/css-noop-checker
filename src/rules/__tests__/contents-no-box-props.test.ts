import { describe, it, expect } from 'vitest';
import { checkContentsBoxProps } from '../contents-no-box-props.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ElementData {
  return _makeElement({ display: 'contents', ...overrides });
}

describe('contents-no-box-props: box properties on display:contents', () => {
  it('warns when width is set and includes correct details/suggestion', () => {
    const warnings = checkContentsBoxProps(createRuleContext(makeElement({ width: '200px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('contents-no-box-props');
    expect(warnings[0].property).toBe('width');
    expect(warnings[0].details).toContain('"200px"');
    expect(warnings[0].details).toContain('"contents"');
    expect(warnings[0].details).toContain('box properties');
    expect(warnings[0].suggestion).toContain('Remove');
  });

  it('warns when height is set', () => {
    const warnings = checkContentsBoxProps(createRuleContext(makeElement({ height: '100px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('height');
  });

  it('warns when min/max width/height are set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          minWidth: '100px',
          maxWidth: '500px',
          minHeight: '50px',
          maxHeight: '300px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
    const props = warnings.map((w) => w.property);
    expect(props).toContain('min-width');
    expect(props).toContain('max-width');
    expect(props).toContain('min-height');
    expect(props).toContain('max-height');
  });

  it('warns when margin is set on all four physical sides', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          marginTop: '10px',
          marginRight: '10px',
          marginBottom: '10px',
          marginLeft: '10px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
    const props = warnings.map((w) => w.property);
    expect(props).toContain('margin-top');
    expect(props).toContain('margin-right');
    expect(props).toContain('margin-bottom');
    expect(props).toContain('margin-left');
  });

  it('warns when logical margin properties are set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ marginBlockStart: '10px', marginInlineEnd: '20px' })),
    );
    expect(warnings).toHaveLength(2);
    const props = warnings.map((w) => w.property);
    expect(props).toContain('margin-block-start');
    expect(props).toContain('margin-inline-end');
  });

  it('warns when padding is set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ paddingTop: '10px', paddingBottom: '15px' })),
    );
    expect(warnings).toHaveLength(2);
    expect(warnings.map((w) => w.property)).toContain('padding-top');
    expect(warnings.map((w) => w.property)).toContain('padding-bottom');
  });

  it('warns when logical padding properties are set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ paddingBlockStart: '10px', paddingInlineEnd: '20px' })),
    );
    expect(warnings).toHaveLength(2);
    const props = warnings.map((w) => w.property);
    expect(props).toContain('padding-block-start');
    expect(props).toContain('padding-inline-end');
  });

  it('warns when border-width is set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ borderTopWidth: '1px', borderRightWidth: '2px' })),
    );
    expect(warnings).toHaveLength(2);
    expect(warnings.map((w) => w.property)).toContain('border-top-width');
    expect(warnings.map((w) => w.property)).toContain('border-right-width');
  });

  it('warns when logical border-width properties are set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ borderBlockStartWidth: '1px', borderInlineEndWidth: '2px' })),
    );
    expect(warnings).toHaveLength(2);
    const props = warnings.map((w) => w.property);
    expect(props).toContain('border-block-start-width');
    expect(props).toContain('border-inline-end-width');
  });

  it('warns when logical sizing properties are set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ inlineSize: '200px', blockSize: '100px' })),
    );
    expect(warnings).toHaveLength(2);
    const props = warnings.map((w) => w.property);
    expect(props).toContain('inline-size');
    expect(props).toContain('block-size');
  });

  it('warns when min/max logical sizing properties are set', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          minInlineSize: '100px',
          maxInlineSize: '500px',
          minBlockSize: '50px',
          maxBlockSize: '300px',
        }),
      ),
    );
    expect(warnings).toHaveLength(4);
    const props = warnings.map((w) => w.property);
    expect(props).toContain('min-inline-size');
    expect(props).toContain('max-inline-size');
    expect(props).toContain('min-block-size');
    expect(props).toContain('max-block-size');
  });

  it('warns when background-color is set with inheritance suggestion', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ backgroundColor: 'rgb(255, 0, 0)' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('background-color');
    expect(warnings[0].suggestion).toContain('inheritance');
  });

  it('warns when background-image is set with inheritance suggestion', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ backgroundImage: 'url("bg.png")' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('background-image');
    expect(warnings[0].suggestion).toContain('inheritance');
  });

  it('does not warn for default backgroundColor', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ backgroundColor: 'rgba(0, 0, 0, 0)' })),
    );
    const bgWarnings = warnings.filter((w) => w.property === 'background-color');
    expect(bgWarnings).toHaveLength(0);
  });

  it('deduplicates physical width when logical inline-size is also non-default', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ width: '200px', inlineSize: '200px' })),
    );
    const sizingWarnings = warnings.filter(
      (w) => w.property === 'width' || w.property === 'inline-size',
    );
    expect(sizingWarnings).toHaveLength(1);
    expect(sizingWarnings[0].property).toBe('inline-size');
  });

  it('deduplicates physical height when logical block-size is also non-default', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ height: '100px', blockSize: '100px' })),
    );
    const sizingWarnings = warnings.filter(
      (w) => w.property === 'height' || w.property === 'block-size',
    );
    expect(sizingWarnings).toHaveLength(1);
    expect(sizingWarnings[0].property).toBe('block-size');
  });

  it('deduplicates physical min/max when logical counterparts are also non-default', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          minWidth: '100px',
          minInlineSize: '100px',
          maxHeight: '500px',
          maxBlockSize: '500px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('min-width');
    expect(props).toContain('min-inline-size');
    expect(props).not.toContain('max-height');
    expect(props).toContain('max-block-size');
  });

  it('warns for physical width when logical inline-size is at default', () => {
    const warnings = checkContentsBoxProps(createRuleContext(makeElement({ width: '200px' })));
    expect(warnings.map((w) => w.property)).toContain('width');
  });

  it('deduplicates physical margin when logical counterpart is also non-default', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          marginTop: '10px',
          marginBlockStart: '10px',
          marginLeft: '20px',
          marginInlineStart: '20px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('margin-top');
    expect(props).toContain('margin-block-start');
    expect(props).not.toContain('margin-left');
    expect(props).toContain('margin-inline-start');
  });

  it('deduplicates physical padding when logical counterpart is also non-default', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          paddingTop: '10px',
          paddingBlockStart: '10px',
          paddingRight: '15px',
          paddingInlineEnd: '15px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('padding-top');
    expect(props).toContain('padding-block-start');
    expect(props).not.toContain('padding-right');
    expect(props).toContain('padding-inline-end');
  });

  it('deduplicates physical border-width when logical counterpart is also non-default', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          borderTopWidth: '1px',
          borderBlockStartWidth: '1px',
          borderLeftWidth: '2px',
          borderInlineStartWidth: '2px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('border-top-width');
    expect(props).toContain('border-block-start-width');
    expect(props).not.toContain('border-left-width');
    expect(props).toContain('border-inline-start-width');
  });

  it('warns for physical margin when logical counterpart is at default', () => {
    const warnings = checkContentsBoxProps(createRuleContext(makeElement({ marginTop: '10px' })));
    expect(warnings.map((w) => w.property)).toContain('margin-top');
  });

  it('skips non-contents display values', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ display: 'block', width: '200px', marginTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display:flex', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(makeElement({ display: 'flex', paddingTop: '10px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all box properties are at default values', () => {
    const warnings = checkContentsBoxProps(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  // Writing-mode aware dedup tests
  it('deduplicates width→blockSize in vertical-rl writing mode', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-rl',
          width: '200px',
          blockSize: '200px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('width');
    expect(props).toContain('block-size');
  });

  it('deduplicates height→inlineSize in vertical-rl writing mode', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-rl',
          height: '100px',
          inlineSize: '100px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('height');
    expect(props).toContain('inline-size');
  });

  it('does not skip width when inlineSize is set in vertical-rl (different axes)', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-rl',
          width: '200px',
          inlineSize: '200px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    // In vertical-rl, width maps to blockSize, not inlineSize
    // So width should NOT be skipped (its counterpart blockSize is at default)
    expect(props).toContain('width');
    expect(props).toContain('inline-size');
  });

  it('deduplicates margin-right→marginBlockStart in vertical-rl writing mode', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-rl',
          marginRight: '10px',
          marginBlockStart: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('margin-right');
    expect(props).toContain('margin-block-start');
  });

  it('deduplicates margin-left→marginBlockStart in vertical-lr writing mode', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-lr',
          marginLeft: '10px',
          marginBlockStart: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('margin-left');
    expect(props).toContain('margin-block-start');
  });

  it('deduplicates padding-top→paddingInlineStart in vertical-rl writing mode', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-rl',
          paddingTop: '10px',
          paddingInlineStart: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('padding-top');
    expect(props).toContain('padding-inline-start');
  });

  it('deduplicates border-right-width→borderBlockStartWidth in vertical-rl writing mode', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-rl',
          borderRightWidth: '1px',
          borderBlockStartWidth: '1px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('border-right-width');
    expect(props).toContain('border-block-start-width');
  });

  it('deduplicates correctly in sideways-lr writing mode', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'sideways-lr',
          marginBottom: '10px',
          marginInlineStart: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    // In sideways-lr, bottom maps to inlineStart
    expect(props).not.toContain('margin-bottom');
    expect(props).toContain('margin-inline-start');
  });

  // RTL direction tests
  it('deduplicates margin-left→marginInlineEnd in horizontal-tb + rtl', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          direction: 'rtl',
          marginLeft: '10px',
          marginInlineEnd: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    // In RTL, left maps to inline-end (not inline-start)
    expect(props).not.toContain('margin-left');
    expect(props).toContain('margin-inline-end');
  });

  it('deduplicates margin-right→marginInlineStart in horizontal-tb + rtl', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          direction: 'rtl',
          marginRight: '10px',
          marginInlineStart: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    // In RTL, right maps to inline-start (not inline-end)
    expect(props).not.toContain('margin-right');
    expect(props).toContain('margin-inline-start');
  });

  it('does not skip margin-left when marginInlineStart is set in rtl (different axes)', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          direction: 'rtl',
          marginLeft: '10px',
          marginInlineStart: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    // In RTL, left maps to inline-end, not inline-start
    // So margin-left should NOT be skipped due to marginInlineStart
    expect(props).toContain('margin-left');
    expect(props).toContain('margin-inline-start');
  });

  it('deduplicates padding-left→paddingInlineEnd in rtl', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          direction: 'rtl',
          paddingLeft: '10px',
          paddingInlineEnd: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('padding-left');
    expect(props).toContain('padding-inline-end');
  });

  it('deduplicates border-left-width→borderInlineEndWidth in rtl', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          direction: 'rtl',
          borderLeftWidth: '1px',
          borderInlineEndWidth: '1px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    expect(props).not.toContain('border-left-width');
    expect(props).toContain('border-inline-end-width');
  });

  it('deduplicates top→marginInlineEnd in vertical-rl + rtl', () => {
    const warnings = checkContentsBoxProps(
      createRuleContext(
        makeElement({
          writingMode: 'vertical-rl',
          direction: 'rtl',
          marginTop: '10px',
          marginInlineEnd: '10px',
        }),
      ),
    );
    const props = warnings.map((w) => w.property);
    // In vertical-rl + rtl, top maps to inline-end (not inline-start)
    expect(props).not.toContain('margin-top');
    expect(props).toContain('margin-inline-end');
  });
});
