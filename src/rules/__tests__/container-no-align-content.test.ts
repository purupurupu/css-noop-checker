import { describe, it, expect } from 'vitest';
import { checkAlignContent } from '../container-no-align-content.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('container-no-align-content: align-content on single-line flex', () => {
  it('warns when align-content is set on single-line flex container', () => {
    const warnings = checkAlignContent(
      createRuleContext(
        makeElement({ display: 'flex', flexWrap: 'nowrap', alignContent: 'center' }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('container-no-align-content');
    expect(warnings[0].title).toContain('align-content');
  });

  it('warns when align-content is set on inline-flex with default nowrap', () => {
    const warnings = checkAlignContent(
      createRuleContext(makeElement({ display: 'inline-flex', alignContent: 'space-between' })),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips when flex-wrap is wrap', () => {
    const warnings = checkAlignContent(
      createRuleContext(makeElement({ display: 'flex', flexWrap: 'wrap', alignContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when flex-wrap is wrap-reverse', () => {
    const warnings = checkAlignContent(
      createRuleContext(
        makeElement({ display: 'flex', flexWrap: 'wrap-reverse', alignContent: 'center' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid containers', () => {
    const warnings = checkAlignContent(
      createRuleContext(makeElement({ display: 'grid', alignContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips block containers', () => {
    const warnings = checkAlignContent(
      createRuleContext(makeElement({ display: 'block', alignContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when align-content is normal', () => {
    const warnings = checkAlignContent(
      createRuleContext(makeElement({ display: 'flex', alignContent: 'normal' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when align-content is stretch (effective default)', () => {
    const warnings = checkAlignContent(
      createRuleContext(makeElement({ display: 'flex', alignContent: 'stretch' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkAlignContent(
      createRuleContext(makeElement({ display: 'contents', alignContent: 'center' })),
    );
    expect(warnings).toHaveLength(0);
  });
});
