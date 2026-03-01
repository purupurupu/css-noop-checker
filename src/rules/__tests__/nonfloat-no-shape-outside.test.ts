import { describe, it, expect } from 'vitest';
import { checkNonfloatNoShapeOutside } from '../nonfloat-no-shape-outside.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  styles: Partial<ElementData['computedStyles']>,
  parent: ElementData['parent'] = null,
): ElementData {
  return _makeElement(styles, parent);
}

describe('nonfloat-no-shape-outside', () => {
  it('warns when shapeOutside is non-default and element is not floated', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(makeElement({ shapeOutside: 'circle()' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nonfloat-no-shape-outside');
    expect(warnings[0].property).toBe('shape-outside');
  });

  it('warns when shapeMargin is non-default and element is not floated', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(makeElement({ shapeMargin: '10px' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nonfloat-no-shape-outside');
    expect(warnings[0].property).toBe('shape-margin');
  });

  it('warns when shapeImageThreshold is non-default and element is not floated', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(makeElement({ shapeImageThreshold: '0.5' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('nonfloat-no-shape-outside');
    expect(warnings[0].property).toBe('shape-image-threshold');
  });

  it('warns for multiple non-default shape properties', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(
        makeElement({ shapeOutside: 'circle()', shapeMargin: '10px', shapeImageThreshold: '0.5' }),
      ),
    );
    expect(warnings).toHaveLength(3);
    const properties = warnings.map((w) => w.property);
    expect(properties).toContain('shape-outside');
    expect(properties).toContain('shape-margin');
    expect(properties).toContain('shape-image-threshold');
  });

  it('skips when cssFloat is left (element is floated)', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(makeElement({ cssFloat: 'left', shapeOutside: 'circle()' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when cssFloat is right (element is floated)', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(makeElement({ cssFloat: 'right', shapeOutside: 'circle()' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all shape properties are at defaults', () => {
    const warnings = checkNonfloatNoShapeOutside(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('warns for flex item with float + shape-outside (float is ignored on flex items)', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(
        makeElement(
          { cssFloat: 'left', shapeOutside: 'circle()' },
          { computedStyles: { display: 'flex' } },
        ),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('shape-outside');
    expect(warnings[0].details).toContain('float has no effect on flex/grid items');
    expect(warnings[0].suggestion).toContain('float is ignored on flex/grid items');
  });

  it('warns for grid item with float + shape-outside (float is ignored on grid items)', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(
        makeElement(
          { cssFloat: 'left', shapeOutside: 'circle()' },
          { computedStyles: { display: 'grid' } },
        ),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('shape-outside');
    expect(warnings[0].details).toContain('float has no effect on flex/grid items');
    expect(warnings[0].suggestion).toContain('float is ignored on flex/grid items');
  });

  it('skips when parent is display:contents (unknown grandparent context)', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(
        makeElement({ shapeOutside: 'circle()' }, { computedStyles: { display: 'contents' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('uses non-floated message for regular elements (not flex/grid items)', () => {
    const warnings = checkNonfloatNoShapeOutside(
      createRuleContext(makeElement({ shapeOutside: 'circle()' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('element is not floated');
    expect(warnings[0].suggestion).toContain('Add float: left or float: right');
  });
});
