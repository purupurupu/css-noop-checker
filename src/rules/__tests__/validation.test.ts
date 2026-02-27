import { describe, it, expect } from 'vitest';
import { isElementData } from '../validation.ts';

// Side-effect import to populate the registry (registers all rules)
import '../engine.ts';

const VALID_STYLES = {
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
  columnWidth: 'auto',
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
  mask: 'none',
  containerType: 'normal',
  contain: 'none',
  willChange: 'auto',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexGrow: '0',
  flexShrink: '1',
  flexBasis: 'auto',
  gridTemplateColumns: 'none',
  gridTemplateRows: 'none',
  gridTemplateAreas: 'none',
  gridAutoColumns: 'auto',
  gridAutoRows: 'auto',
  gridAutoFlow: 'row',
  gridColumnStart: 'auto',
  gridColumnEnd: 'auto',
  gridRowStart: 'auto',
  gridRowEnd: 'auto',
};

describe('isElementData — parent field validation', () => {
  it('accepts parent: null (no parent element)', () => {
    expect(
      isElementData({
        tagName: 'html',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: null,
      }),
    ).toBe(true);
  });

  it('accepts parent with valid computedStyles', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: { computedStyles: { display: 'flex' } },
      }),
    ).toBe(true);
  });

  it('rejects parent that is not null or object', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: 'invalid',
      }),
    ).toBe(false);
  });

  it('rejects parent that is a number', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: 42,
      }),
    ).toBe(false);
  });

  it('rejects parent with missing computedStyles', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: {},
      }),
    ).toBe(false);
  });

  it('rejects parent with null computedStyles', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: { computedStyles: null },
      }),
    ).toBe(false);
  });

  it('rejects parent with non-object computedStyles', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: { computedStyles: 'not-an-object' },
      }),
    ).toBe(false);
  });
});
