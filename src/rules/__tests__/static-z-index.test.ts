import { describe, it, expect } from 'vitest';
import { checkStaticZIndex } from '../static-z-index.ts';
import { createRuleContext } from '../context.ts';
import type { ElementData } from '../types.ts';

function makeElement(
  styles: Partial<ElementData['computedStyles']>,
  parent: ElementData['parent'] = { computedStyles: { display: 'block' } },
): ElementData {
  return {
    tagName: 'div',
    id: '',
    classList: [],
    computedStyles: {
      display: 'block',
      position: 'static',
      zIndex: 'auto',
      opacity: '1',
      transform: 'none',
      filter: 'none',
      backdropFilter: 'none',
      perspective: 'none',
      clipPath: 'none',
      isolation: 'auto',
      mixBlendMode: 'normal',
      contain: 'none',
      willChange: 'auto',
      ...styles,
    },
    parent,
  };
}

describe('static-no-z-index', () => {
  it('warns when z-index is set on static element', () => {
    const warnings = checkStaticZIndex(createRuleContext(makeElement({ zIndex: '10' })));
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('static-no-z-index');
    expect(warnings[0].property).toBe('z-index');
    expect(warnings[0].title).toContain('z-index');
  });

  it('warns for negative z-index', () => {
    const warnings = checkStaticZIndex(createRuleContext(makeElement({ zIndex: '-1' })));
    expect(warnings).toHaveLength(1);
  });

  it('warns for z-index: 0 (non-auto, still no effect)', () => {
    const warnings = checkStaticZIndex(createRuleContext(makeElement({ zIndex: '0' })));
    expect(warnings).toHaveLength(1);
  });

  it('warns when parent is null (e.g. <html>)', () => {
    const warnings = checkStaticZIndex(createRuleContext(makeElement({ zIndex: '5' }, null)));
    expect(warnings).toHaveLength(1);
  });

  it('does not warn when z-index is auto', () => {
    const warnings = checkStaticZIndex(createRuleContext(makeElement({})));
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when position is relative', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ position: 'relative', zIndex: '10' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when position is absolute', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ position: 'absolute', zIndex: '10' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when position is fixed', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ position: 'fixed', zIndex: '10' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when position is sticky', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ position: 'sticky', zIndex: '10' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on flex item (static position)', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '2' }, { computedStyles: { display: 'flex' } })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline-flex item', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(
        makeElement({ zIndex: '2' }, { computedStyles: { display: 'inline-flex' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on grid item', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '2' }, { computedStyles: { display: 'grid' } })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn on inline-grid item', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(
        makeElement({ zIndex: '2' }, { computedStyles: { display: 'inline-grid' } }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  // display: contents parent guard
  it('does not warn when parent is display:contents (unknown context)', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '5' }, { computedStyles: { display: 'contents' } })),
    );
    expect(warnings).toHaveLength(0);
  });

  // Stacking context exemptions
  it('does not warn when opacity < 1 (creates stacking context)', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', opacity: '0.5' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when transform is set', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', transform: 'translatez(0)' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when backdrop-filter is set', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', backdropFilter: 'blur(4px)' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when filter is set', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', filter: 'blur(4px)' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when perspective is set', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', perspective: '500px' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when clip-path is set', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', clipPath: 'circle(50%)' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when isolation is isolate', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', isolation: 'isolate' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when mix-blend-mode is set', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', mixBlendMode: 'multiply' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when contain includes layout', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', contain: 'layout' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when contain is strict', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', contain: 'strict' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when will-change names a stacking trigger', () => {
    const warnings = checkStaticZIndex(
      createRuleContext(makeElement({ zIndex: '10', willChange: 'transform' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('includes suggestion with positioning alternatives', () => {
    const warnings = checkStaticZIndex(createRuleContext(makeElement({ zIndex: '5' })));
    expect(warnings[0].suggestion).toContain('relative');
    expect(warnings[0].suggestion).toContain('absolute');
    expect(warnings[0].suggestion).toContain('fixed');
    expect(warnings[0].suggestion).toContain('sticky');
  });
});
