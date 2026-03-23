import { describe, it, expect } from 'vitest';
import { isElementData } from '../validation.ts';
import { DEFAULT_COMPUTED_STYLES } from './helpers/make-element.ts';

// Side-effect import to populate the registry (registers all rules)
import '../engine.ts';

const VALID_STYLES = DEFAULT_COMPUTED_STYLES;

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
        parent: {
          computedStyles: {
            display: 'flex',
            scrollSnapType: 'none',
            columnCount: 'auto',
            columnWidth: 'auto',
            overflowX: 'visible',
            overflowY: 'visible',
          },
        },
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

describe('isElementData — inlineStyles field validation', () => {
  it('accepts element data without inlineStyles (backward compatibility)', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        parent: null,
      }),
    ).toBe(true);
  });

  it('accepts element data with valid inlineStyles', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        inlineStyles: {
          borderCollapse: '',
          borderSpacing: '',
          boxSizing: '',
          emptyCells: '',
          cssFloat: 'left',
          textIndent: '0px',
          transformOrigin: 'top left',
          perspectiveOrigin: '',
          outlineWidth: '',
          outlineColor: '',
          outlineOffset: '',
        },
        parent: null,
      }),
    ).toBe(true);
  });

  it('rejects element data with non-object inlineStyles', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        inlineStyles: 'not-an-object',
        parent: null,
      }),
    ).toBe(false);
  });

  it('rejects element data with inlineStyles missing required properties', () => {
    expect(
      isElementData({
        tagName: 'div',
        id: '',
        classList: [],
        computedStyles: { ...VALID_STYLES },
        inlineStyles: {},
        parent: null,
      }),
    ).toBe(false);
  });
});
