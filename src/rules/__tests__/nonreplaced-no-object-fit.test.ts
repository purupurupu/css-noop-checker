import { describe, it, expect } from 'vitest';
import { checkNonreplacedObjectFit } from '../nonreplaced-no-object-fit.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('nonreplaced-no-object-fit', () => {
  it('warns when object-fit is non-default on a div', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nonreplaced-no-object-fit');
    expect(warnings[0].property).toBe('object-fit');
    expect(warnings[0].details).toContain('cover');
  });

  it('warns when object-position is non-default on a div', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ objectPosition: 'top left' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nonreplaced-no-object-fit');
    expect(warnings[0].property).toBe('object-position');
    expect(warnings[0].details).toContain('top left');
  });

  it('warns for both when both are non-default', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ objectFit: 'contain', objectPosition: 'center top' })),
    );
    expect(warnings).toHaveLength(2);
    expect(warnings.map((w) => w.property)).toEqual(['object-fit', 'object-position']);
  });

  it('warns on a span (inline non-replaced)', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'span', display: 'inline', objectFit: 'contain' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('<span>');
  });

  it('warns on a button (form control, not an object-fit target)', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'button', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('does not warn on img', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'img', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on video', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'video', objectFit: 'contain' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on canvas', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'canvas', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns on audio (UA widget, object-fit has no effect)', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'audio', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('does not warn on iframe', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'iframe', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on embed', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'embed', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on object (HTML element)', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ tagName: 'object', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when object-fit is default (fill)', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ objectFit: 'fill' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when object-position is default (50% 50%)', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ objectPosition: '50% 50%' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when both are at defaults', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ objectFit: 'fill', objectPosition: '50% 50%' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when display is contents', () => {
    const warnings = checkNonreplacedObjectFit(
      createRuleContext(makeElement({ display: 'contents', objectFit: 'cover' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
