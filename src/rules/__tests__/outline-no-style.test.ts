import { describe, it, expect } from 'vitest';
import { checkOutlineNoStyle } from '../outline-no-style.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('outline-no-style', () => {
  it('warns when outline-width is set inline but outline-style is none', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '2px', outlineStyle: 'none' }, null, {
          outlineWidth: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('outline-no-style');
    expect(warnings[0].property).toBe('outline-width');
    expect(warnings[0].details).toContain('"2px"');
  });

  it('warns when outline-color is set inline but outline-style is none', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineColor: 'red', outlineStyle: 'none' }, null, {
          outlineColor: 'red',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('outline-no-style');
    expect(warnings[0].property).toBe('outline-color');
    expect(warnings[0].details).toContain('"red"');
  });

  it('warns when outline-offset is set inline but outline-style is none', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineOffset: '4px', outlineStyle: 'none' }, null, {
          outlineOffset: '4px',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('outline-no-style');
    expect(warnings[0].property).toBe('outline-offset');
    expect(warnings[0].details).toContain('"4px"');
  });

  it('warns for all three outline properties when set inline and outline-style is none', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement(
          { outlineWidth: '3px', outlineColor: 'blue', outlineOffset: '2px', outlineStyle: 'none' },
          null,
          { outlineWidth: '3px', outlineColor: 'blue', outlineOffset: '2px' },
        ),
      ),
    );
    expect(warnings).toHaveLength(3);
    const properties = warnings.map((w) => w.property);
    expect(properties).toContain('outline-width');
    expect(properties).toContain('outline-color');
    expect(properties).toContain('outline-offset');
  });

  it('does not warn when outline-width is 0px inline (zero-width is already invisible)', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '0px', outlineStyle: 'none' }, null, {
          outlineWidth: '0px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline-width is 0 inline (zero-width is already invisible)', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '0px', outlineStyle: 'none' }, null, {
          outlineWidth: '0',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline-style is solid', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '2px', outlineColor: 'red', outlineStyle: 'solid' }, null, {
          outlineWidth: '2px',
          outlineColor: 'red',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline-style is dashed', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '2px', outlineStyle: 'dashed' }, null, {
          outlineWidth: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline-style is dotted', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '2px', outlineStyle: 'dotted' }, null, {
          outlineWidth: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline-style is auto', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '2px', outlineStyle: 'auto' }, null, {
          outlineWidth: '2px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline properties are not set inline', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '2px', outlineColor: 'red', outlineStyle: 'none' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when all outline properties are at defaults', () => {
    const warnings = checkOutlineNoStyle(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when inline outline-width is empty string', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '2px', outlineStyle: 'none' }, null, { outlineWidth: '' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns with computed value in details even when inline value differs', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineWidth: '16px', outlineStyle: 'none' }, null, {
          outlineWidth: '1em',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('"16px"');
  });
});
