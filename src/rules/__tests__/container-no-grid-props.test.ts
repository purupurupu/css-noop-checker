import { describe, it, expect } from 'vitest';
import { checkGridContainerProps } from '../grid-container-props.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('grid-no-container-props: grid container props on non-grid', () => {
  it('warns when grid-template-columns is set on block element', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ gridTemplateColumns: '1fr 1fr' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('grid-no-container-props');
    expect(warnings[0].property).toBe('grid-template-columns');
    expect(warnings[0].title).toContain('grid-template-columns');
  });

  it('warns when grid-template-rows is set on block element', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ gridTemplateRows: '100px 200px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-template-rows');
  });

  it('warns when grid-template-areas is set on block element', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ gridTemplateAreas: '"header" "main"' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-template-areas');
  });

  it('warns when grid-auto-columns is set on block element', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ gridAutoColumns: '100px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-auto-columns');
  });

  it('warns when grid-auto-rows is set on block element', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ gridAutoRows: 'minmax(100px, auto)' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-auto-rows');
  });

  it('warns when grid-auto-flow is set on block element', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ gridAutoFlow: 'column' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-auto-flow');
  });

  it('warns on block element with grid-auto-flow: row dense', () => {
    const ctx = createRuleContext(makeElement({ gridAutoFlow: 'row dense' }));
    const warnings = checkGridContainerProps(ctx);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('grid-no-container-props');
    expect(warnings[0].property).toBe('grid-auto-flow');
  });

  it('warns for multiple grid properties at once', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(
        makeElement({
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '100px auto',
          gridAutoFlow: 'dense',
        }),
      ),
    );
    expect(warnings).toHaveLength(3);
    expect(warnings[0].property).toBe('grid-template-columns');
    expect(warnings[1].property).toBe('grid-template-rows');
    expect(warnings[2].property).toBe('grid-auto-flow');
  });

  it('skips grid containers', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ display: 'grid', gridTemplateColumns: '1fr 1fr' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips inline-grid containers', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ display: 'inline-grid', gridTemplateColumns: '1fr 1fr' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when values are defaults', () => {
    const warnings = checkGridContainerProps(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('skips display: contents elements', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ display: 'contents', gridTemplateColumns: '1fr 1fr' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns on flex elements with grid properties', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ display: 'flex', gridTemplateColumns: '1fr 1fr' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-template-columns');
  });

  it('warns on inline elements with grid properties', () => {
    const warnings = checkGridContainerProps(
      createRuleContext(makeElement({ display: 'inline', gridAutoFlow: 'column' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('grid-auto-flow');
  });
});
