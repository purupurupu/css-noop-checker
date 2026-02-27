import { describe, it, expect } from 'vitest';
import { checkItemNoFlexProps } from '../non-flex-child-props.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';
import { makeElement as _makeElement } from './helpers/make-element.ts';

function makeElement(
  styles: Partial<ElementData['computedStyles']>,
  parent: ElementData['parent'] = { computedStyles: { display: 'block' } },
): ElementData {
  return _makeElement(styles, parent);
}

describe('item-no-flex-props', () => {
  it('warns when flex-grow is set on child of block container', () => {
    const warnings = checkItemNoFlexProps(createRuleContext(makeElement({ flexGrow: '1' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('item-no-flex-props');
    expect(warnings[0].property).toBe('flex-grow');
    expect(warnings[0].details).toContain('block');
  });

  it('warns when flex-shrink is set to non-default on child of block container', () => {
    const warnings = checkItemNoFlexProps(createRuleContext(makeElement({ flexShrink: '0' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('flex-shrink');
  });

  it('warns when flex-basis is set on child of block container', () => {
    const warnings = checkItemNoFlexProps(createRuleContext(makeElement({ flexBasis: '100px' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('flex-basis');
  });

  it('warns for multiple non-default flex properties at once', () => {
    const warnings = checkItemNoFlexProps(
      createRuleContext(makeElement({ flexGrow: '1', flexShrink: '0', flexBasis: '100px' })),
    );
    expect(warnings).toHaveLength(3);
  });

  it('warns on grid items (flex properties are flex-specific, not grid)', () => {
    const warnings = checkItemNoFlexProps(
      createRuleContext(makeElement({ flexGrow: '1' }, { computedStyles: { display: 'grid' } })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].property).toBe('flex-grow');
  });

  it('warns on inline-grid items', () => {
    const warnings = checkItemNoFlexProps(
      createRuleContext(
        makeElement({ flexGrow: '1' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips flex items (parent is flex)', () => {
    const warnings = checkItemNoFlexProps(
      createRuleContext(makeElement({ flexGrow: '1' }, { computedStyles: { display: 'flex' } })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips flex items (parent is inline-flex)', () => {
    const warnings = checkItemNoFlexProps(
      createRuleContext(
        makeElement({ flexGrow: '1' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when all values are defaults', () => {
    const warnings = checkItemNoFlexProps(
      createRuleContext(makeElement({ flexGrow: '0', flexShrink: '1', flexBasis: 'auto' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent display is contents (grandparent context unknown)', () => {
    const warnings = checkItemNoFlexProps(
      createRuleContext(
        makeElement({ flexGrow: '1' }, { computedStyles: { display: 'contents' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is null (unknown parent context)', () => {
    const warnings = checkItemNoFlexProps(createRuleContext(makeElement({ flexGrow: '1' }, null)));
    expect(warnings).toHaveLength(0);
  });
});
