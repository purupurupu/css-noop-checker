import { describe, it, expect } from 'vitest';
import { checkInlineTextIndent } from '../inline-no-text-indent.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
  inlineStyles?: Record<string, string>,
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides }, null, inlineStyles);
}

describe('inline-no-text-indent', () => {
  it('warns when text-indent is set via inline style on inline element', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(makeElement({ textIndent: '2em' }, { textIndent: '2em' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-text-indent');
    expect(warnings[0].property).toBe('text-indent');
    expect(warnings[0].details).toContain('2em');
  });

  it('warns when text-indent is a pixel value on inline element', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(makeElement({ textIndent: '40px' }, { textIndent: '40px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('40px');
  });

  it('warns when text-indent is a percentage on inline element', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(makeElement({ textIndent: '10%' }, { textIndent: '10%' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('10%');
  });

  it('warns when text-indent is negative on inline element', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(makeElement({ textIndent: '-9999px' }, { textIndent: '-9999px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('-9999px');
  });

  it('skips inherited text-indent (not authored on the element)', () => {
    // Parent block sets text-indent: 2em, child span inherits it via computedStyles
    // but does NOT have it as an inline style — should not warn
    const warnings = checkInlineTextIndent(createRuleContext(makeElement({ textIndent: '2em' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(makeElement({ tagName: 'img', textIndent: '2em' }, { textIndent: '2em' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(
        makeElement({ tagName: 'input', textIndent: '2em' }, { textIndent: '2em' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display (block)', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(
        makeElement({ display: 'block', textIndent: '2em' }, { textIndent: '2em' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips non-inline display (inline-block)', () => {
    const warnings = checkInlineTextIndent(
      createRuleContext(
        makeElement({ display: 'inline-block', textIndent: '2em' }, { textIndent: '2em' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when text-indent is default (0px)', () => {
    const warnings = checkInlineTextIndent(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
