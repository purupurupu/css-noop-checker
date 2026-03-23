import { describe, it, expect } from 'vitest';
import { checkJustifySelf } from '../item-no-justify-self.ts';
import { createRuleContext } from '../context.ts';
import { makeChildElement as makeElement } from './helpers/make-element.ts';

describe('item-no-justify-self', () => {
  it('does not warn when justify-self is set on child of table container', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'table' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when justify-self is set on child of inline-table container', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'inline-table' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns when justify-self is set on child of table-cell container', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'table-cell' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('table-cell');
  });

  it.each(['inline', 'inline-table', 'inline-block', 'inline-flex', 'inline-grid'])(
    'warns when %s child has justify-self in block parent',
    (display) => {
      const warnings = checkJustifySelf(
        createRuleContext(makeElement({ justifySelf: 'center', display })),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].property).toBe('justify-self');
    },
  );

  it('warns when child is in a multi-column block parent', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement(
          { justifySelf: 'center' },
          { computedStyles: { display: 'block', columnCount: '2' } },
        ),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns when child is in a multi-column parent (column-width)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement(
          { justifySelf: 'center' },
          { computedStyles: { display: 'block', columnWidth: '200px' } },
        ),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on flex items', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'flex' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('warns on inline-flex items', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'end' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(1);
  });

  it('skips grid items (parent is grid)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips grid items (parent is inline-grid)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips absolutely positioned elements', () => {
    const warnings = checkJustifySelf(
      createRuleContext(makeElement({ justifySelf: 'center', position: 'absolute' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips fixed positioned elements', () => {
    const warnings = checkJustifySelf(
      createRuleContext(makeElement({ justifySelf: 'center', position: 'fixed' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when justify-self is auto (default)', () => {
    const warnings = checkJustifySelf(createRuleContext(makeElement({ justifySelf: 'auto' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips when justify-self is normal', () => {
    const warnings = checkJustifySelf(createRuleContext(makeElement({ justifySelf: 'normal' })));
    expect(warnings).toHaveLength(0);
  });

  // Block layout skip cases (Chrome 119+) — parent display determines block formatting context
  it('skips block-level child in block parent (Chrome 119+)', () => {
    const warnings = checkJustifySelf(createRuleContext(makeElement({ justifySelf: 'center' })));
    expect(warnings).toHaveLength(0);
  });

  it('skips child in inline-block parent', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'inline-block' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips child in flow-root parent', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'flow-root' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips child in list-item parent', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'list-item' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is null (unknown parent context)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(makeElement({ justifySelf: 'center' }, null)),
    );
    expect(warnings).toHaveLength(0);
  });

  it('skips when parent is display:contents (unknown grandparent context)', () => {
    const warnings = checkJustifySelf(
      createRuleContext(
        makeElement({ justifySelf: 'center' }, { computedStyles: { display: 'contents' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });
});
