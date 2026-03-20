import { describe, it, expect } from 'vitest';
import { checkInlineBoxSizing } from '../inline-no-box-sizing.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
  inlineStyles?: Record<string, string>,
): ElementData {
  return _makeElement({ tagName: 'span', display: 'inline', ...overrides }, null, inlineStyles);
}

describe('inline-no-box-sizing: box-sizing on inline', () => {
  it('warns when box-sizing is set via inline style on inline element', () => {
    const warnings = checkInlineBoxSizing(
      createRuleContext(makeElement({ boxSizing: 'border-box' }, { boxSizing: 'border-box' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('inline-no-box-sizing');
    expect(warnings[0].property).toBe('box-sizing');
    expect(warnings[0].details).toContain('border-box');
  });

  it('does not warn for content-box set via inline style (intentional reset)', () => {
    const warnings = checkInlineBoxSizing(
      createRuleContext(makeElement({ boxSizing: 'content-box' }, { boxSizing: 'content-box' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when box-sizing is not in inline styles (e.g. from reset)', () => {
    const warnings = checkInlineBoxSizing(
      createRuleContext(makeElement({ boxSizing: 'border-box' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline-block', () => {
    const warnings = checkInlineBoxSizing(
      createRuleContext(
        makeElement(
          { display: 'inline-block', boxSizing: 'border-box' },
          { boxSizing: 'border-box' },
        ),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on block', () => {
    const warnings = checkInlineBoxSizing(
      createRuleContext(
        makeElement({ display: 'block', boxSizing: 'border-box' }, { boxSizing: 'border-box' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (img)', () => {
    const warnings = checkInlineBoxSizing(
      createRuleContext(
        makeElement({ tagName: 'img', boxSizing: 'border-box' }, { boxSizing: 'border-box' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips replaced inline elements (input)', () => {
    const warnings = checkInlineBoxSizing(
      createRuleContext(
        makeElement({ tagName: 'input', boxSizing: 'border-box' }, { boxSizing: 'border-box' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when no inline style is present', () => {
    const warnings = checkInlineBoxSizing(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });
});
