import { describe, it, expect } from 'vitest';
import { analyzeElement } from '../engine.ts';
import type { ElementData } from '../types.ts';

function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string },
): ElementData {
  const { tagName = 'div', ...styles } = overrides;
  return {
    tagName,
    id: '',
    classList: [],
    computedStyles: {
      display: 'block',
      width: 'auto',
      height: 'auto',
      gap: 'normal',
      rowGap: 'normal',
      columnGap: 'normal',
      alignItems: 'normal',
      justifyContent: 'normal',
      placeItems: 'normal',
      placeContent: 'normal',
      columnCount: 'auto',
      position: 'static',
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      alignSelf: 'auto',
      order: '0',
      marginTop: '0px',
      marginBottom: '0px',
      verticalAlign: 'baseline',
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
      flexDirection: 'row',
      flexWrap: 'nowrap',
      ...styles,
    },
    parent: null,
  };
}

describe('analyzeElement (integration)', () => {
  it('returns no warnings for a clean element', () => {
    const warnings = analyzeElement(makeElement({}));
    expect(warnings).toHaveLength(0);
  });

  it('returns no warnings for a valid flex layout', () => {
    const warnings = analyzeElement(
      makeElement({
        display: 'flex',
        rowGap: '8px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }),
    );
    expect(warnings).toHaveLength(0);
  });

  it('detects multiple issues on a single element', () => {
    const warnings = analyzeElement(
      makeElement({
        rowGap: '10px',
        alignItems: 'center',
        placeContent: 'center',
      }),
    );
    expect(warnings.length).toBeGreaterThanOrEqual(3);
  });

  it('detects vertical-align on block element', () => {
    const warnings = analyzeElement(makeElement({ verticalAlign: 'middle' }));
    const ruleIds = warnings.map((w) => w.ruleId);
    expect(ruleIds).toContain('block-no-vertical-align');
  });

  it('detects flex-direction on non-flex container', () => {
    const warnings = analyzeElement(makeElement({ flexDirection: 'column' }));
    const ruleIds = warnings.map((w) => w.ruleId);
    expect(ruleIds).toContain('flex-no-container-props');
  });

  it('combines D-1 with other rules on inline element', () => {
    const warnings = analyzeElement(
      makeElement({
        tagName: 'span',
        display: 'inline',
        width: '100px',
        alignItems: 'center',
      }),
    );
    const ruleIds = warnings.map((w) => w.ruleId);
    expect(ruleIds).toContain('inline-no-dimensions');
    expect(ruleIds).toContain('container-no-align');
  });
});
