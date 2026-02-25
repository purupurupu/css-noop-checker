import { describe, it, expect } from 'vitest';
import { isElementData } from '../validation.ts';

// Side-effect imports to populate the registry (same as engine.ts)
import '../inline-dimensions.ts';
import '../gap.ts';
import '../alignment.ts';
import '../place.ts';

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
