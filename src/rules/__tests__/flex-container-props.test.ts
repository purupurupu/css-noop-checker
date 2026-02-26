import { describe, it, expect } from 'vitest';
import { checkFlexContainerProps } from '../flex-container-props.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('flex-no-container-props: flex-direction/wrap on non-flex', () => {
  it('warns when flex-direction is set on block element', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ flexDirection: 'column' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('flex-no-container-props');
    expect(warnings[0].property).toBe('flex-direction');
    expect(warnings[0].title).toContain('flex-direction');
  });

  it('warns when flex-wrap is set on block element', () => {
    const warnings = checkFlexContainerProps(createRuleContext(makeElement({ flexWrap: 'wrap' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('flex-wrap');
    expect(warnings[0].title).toContain('flex-wrap');
  });

  it('warns for both flex-direction and flex-wrap', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ flexDirection: 'column', flexWrap: 'wrap' })),
    );
    expect(warnings).toHaveLength(2);
    expect(warnings[0].property).toBe('flex-direction');
    expect(warnings[1].property).toBe('flex-wrap');
  });

  it('skips flex containers', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ display: 'flex', flexDirection: 'column' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-flex containers', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ display: 'inline-flex', flexWrap: 'wrap' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid containers', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ display: 'grid', flexDirection: 'column' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid containers', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ display: 'inline-grid', flexWrap: 'wrap' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are defaults (row + nowrap)', () => {
    const warnings = checkFlexContainerProps(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ display: 'contents', flexDirection: 'column' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns on inline elements with flex-direction', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ display: 'inline', flexDirection: 'column-reverse' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('flex-direction');
  });

  it('warns on table elements with flex-wrap', () => {
    const warnings = checkFlexContainerProps(
      createRuleContext(makeElement({ display: 'table', flexWrap: 'wrap-reverse' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('flex-wrap');
  });
});
