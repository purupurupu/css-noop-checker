import { describe, it, expect } from 'vitest';
import { checkOutlineNoStyle } from '../outline-no-style.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('outline-no-style', () => {
  it('warns when outline-width is set inline without outline-style', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(makeElement({}, null, { outlineWidth: '3px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('outline-no-style');
    expect(warnings[0].property).toBe('outline-width');
    expect(warnings[0].details).toContain('3px');
  });

  it('warns when outline-color is set inline without outline-style', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(makeElement({}, null, { outlineColor: 'red' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('outline-color');
    expect(warnings[0].details).toContain('red');
  });

  it('warns when outline-offset is set inline without outline-style', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(makeElement({}, null, { outlineOffset: '5px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('outline-offset');
    expect(warnings[0].details).toContain('5px');
  });

  it('warns for all outline properties when all set', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({}, null, { outlineWidth: '2px', outlineColor: 'blue', outlineOffset: '4px' }),
      ),
    );
    expect(warnings).toHaveLength(3);
    expect(warnings.map((w) => w.property)).toEqual([
      'outline-width',
      'outline-color',
      'outline-offset',
    ]);
  });

  it('does not warn when outline-style is not none', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({ outlineStyle: 'solid' }, null, {
          outlineWidth: '3px',
          outlineColor: 'red',
          outlineOffset: '5px',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline-style is dashed', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(makeElement({ outlineStyle: 'dashed' }, null, { outlineWidth: '3px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when no inline outline properties are set', () => {
    const warnings = checkOutlineNoStyle(createRuleContext(makeElement()));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when inline outline-width is empty string', () => {
    const warnings = checkOutlineNoStyle(
      createRuleContext(makeElement({}, null, { outlineWidth: '' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when outline shorthand is none (inline values are empty)', () => {
    // When outline: none is set, browsers expand it so outline-style is none
    // and inline outline-width/color/offset are empty strings (not authored individually)
    const warnings = checkOutlineNoStyle(
      createRuleContext(
        makeElement({}, null, { outlineWidth: '', outlineColor: '', outlineOffset: '' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
