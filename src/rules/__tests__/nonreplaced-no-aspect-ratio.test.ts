import { describe, it, expect } from 'vitest';
import { checkNonreplacedAspectRatio } from '../nonreplaced-no-aspect-ratio.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('nonreplaced-no-aspect-ratio', () => {
  it('warns when aspect-ratio is set on an inline span', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ tagName: 'span', display: 'inline', aspectRatio: '16 / 9' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nonreplaced-no-aspect-ratio');
    expect(warnings[0].property).toBe('aspect-ratio');
    expect(warnings[0].details).toContain('16 / 9');
    expect(warnings[0].details).toContain('<span>');
  });

  it('warns when aspect-ratio is set on an inline a element', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ tagName: 'a', display: 'inline', aspectRatio: '1 / 1' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('<a>');
  });

  it('does not warn on block element', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'block', aspectRatio: '16 / 9' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline-block element', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'inline-block', aspectRatio: '16 / 9' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on flex element', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'flex', aspectRatio: '4 / 3' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on grid element', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'grid', aspectRatio: '4 / 3' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline-flex element', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'inline-flex', aspectRatio: '4 / 3' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline-grid element', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'inline-grid', aspectRatio: '4 / 3' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline replaced element (img)', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ tagName: 'img', display: 'inline', aspectRatio: '16 / 9' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline replaced element (video)', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(
        makeElement({ tagName: 'video', display: 'inline', aspectRatio: '16 / 9' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline replaced element (canvas)', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(
        makeElement({ tagName: 'canvas', display: 'inline', aspectRatio: '1 / 1' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline replaced element (input)', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ tagName: 'input', display: 'inline', aspectRatio: '1 / 1' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when aspect-ratio is default (auto)', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'inline', aspectRatio: 'auto' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when display is contents', () => {
    const warnings = checkNonreplacedAspectRatio(
      createRuleContext(makeElement({ display: 'contents', aspectRatio: '16 / 9' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
