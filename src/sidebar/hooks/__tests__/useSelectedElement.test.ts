import { describe, it, expect } from 'vitest';
import { isElementData } from '../../../rules/validation.ts';
import { DEFAULT_COMPUTED_STYLES } from '../../../rules/__tests__/helpers/make-element.ts';
// Ensure rules are registered (engine.ts has side-effect imports)
import '../../../rules/engine.ts';

const validData = {
  tagName: 'div',
  id: 'app',
  classList: ['container'],
  computedStyles: { ...DEFAULT_COMPUTED_STYLES, width: '100px' },
  parent: null,
};

describe('isElementData', () => {
  it('returns true for valid element data', () => {
    expect(isElementData(validData)).toBe(true);
  });

  it('returns true with empty id and classList', () => {
    expect(isElementData({ ...validData, id: '', classList: [] })).toBe(true);
  });

  it('returns false for null', () => {
    expect(isElementData(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isElementData(undefined)).toBe(false);
  });

  it('returns false for primitives', () => {
    expect(isElementData(42)).toBe(false);
    expect(isElementData('string')).toBe(false);
    expect(isElementData(true)).toBe(false);
  });

  it('returns false for arrays', () => {
    expect(isElementData([1, 2, 3])).toBe(false);
  });

  it('returns false when tagName is missing', () => {
    const { tagName: _, ...rest } = validData;
    expect(isElementData(rest)).toBe(false);
  });

  it('returns false when tagName is not a string', () => {
    expect(isElementData({ ...validData, tagName: 123 })).toBe(false);
  });

  it('returns false when classList is not an array', () => {
    expect(isElementData({ ...validData, classList: 'not-array' })).toBe(false);
  });

  it('returns false when computedStyles is missing', () => {
    const { computedStyles: _, ...rest } = validData;
    expect(isElementData(rest)).toBe(false);
  });

  it('returns false when computedStyles is null', () => {
    expect(isElementData({ ...validData, computedStyles: null })).toBe(false);
  });

  it('returns false when computedStyles is a primitive', () => {
    expect(isElementData({ ...validData, computedStyles: 'block' })).toBe(false);
  });

  it('returns false when a computed style key is missing', () => {
    const { display: _, ...partialStyles } = { ...DEFAULT_COMPUTED_STYLES };
    expect(isElementData({ ...validData, computedStyles: partialStyles })).toBe(false);
  });

  it('returns false when a computed style value is not a string', () => {
    expect(
      isElementData({
        ...validData,
        computedStyles: { ...validData.computedStyles, width: 100 },
      }),
    ).toBe(false);
  });

  it('returns false when a computed style value is null', () => {
    expect(
      isElementData({
        ...validData,
        computedStyles: { ...validData.computedStyles, gap: null },
      }),
    ).toBe(false);
  });

  it('accepts extra properties on the top-level object', () => {
    expect(isElementData({ ...validData, extraProp: 'ignored' })).toBe(true);
  });

  it('accepts extra properties on computedStyles', () => {
    expect(
      isElementData({
        ...validData,
        computedStyles: { ...validData.computedStyles, color: 'red' },
      }),
    ).toBe(true);
  });

  it('checks every required computed style key', () => {
    const requiredKeys = [
      'display',
      'width',
      'height',
      'gap',
      'rowGap',
      'columnGap',
      'alignItems',
      'justifyContent',
      'justifyItems',
      'placeItems',
      'columnCount',
      'columnWidth',
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'alignSelf',
      'order',
      'marginTop',
      'marginBottom',
      'verticalAlign',
      'zIndex',
      'opacity',
      'transform',
      'filter',
      'backdropFilter',
      'perspective',
      'clipPath',
      'isolation',
      'mixBlendMode',
      'mask',
      'containerType',
      'contain',
      'willChange',
      'flexDirection',
      'flexWrap',
      'flexGrow',
      'flexShrink',
      'flexBasis',
      'cssFloat',
      'gridTemplateColumns',
      'gridTemplateRows',
      'gridTemplateAreas',
      'gridAutoColumns',
      'gridAutoRows',
      'gridAutoFlow',
      'gridColumnStart',
      'gridColumnEnd',
      'gridRowStart',
      'gridRowEnd',
      'textOverflow',
      'overflowX',
      'overflowY',
      'resize',
      'objectFit',
      'objectPosition',
      'shapeOutside',
      'shapeMargin',
      'shapeImageThreshold',
    ];
    for (const key of requiredKeys) {
      const styles = { ...validData.computedStyles };
      Reflect.deleteProperty(styles, key);
      expect(isElementData({ ...validData, computedStyles: styles })).toBe(false);
    }
  });
});
