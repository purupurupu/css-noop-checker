import { describe, it, expect } from 'vitest';
import { isScanElementData, isChunkResult } from '../scan-validation.ts';

// Side-effect import to populate the registry (registers all rules)
import '../../../rules/engine.ts';

import { getAllRequiredProperties } from '../../../rules/registry.ts';

function makeValidStyles(overrides: Record<string, string> = {}): Record<string, string> {
  const styles: Record<string, string> = {};
  for (const key of getAllRequiredProperties()) {
    styles[key] = 'normal';
  }
  return { ...styles, ...overrides };
}

function makeValidScanElement(overrides: Record<string, unknown> = {}) {
  return {
    index: 0,
    selector: 'div.test',
    tagName: 'div',
    id: '',
    classList: [],
    computedStyles: makeValidStyles(),
    parent: null,
    ...overrides,
  };
}

describe('isScanElementData', () => {
  it('accepts valid scan element data', () => {
    expect(isScanElementData(makeValidScanElement())).toBe(true);
  });

  it('rejects null', () => {
    expect(isScanElementData(null)).toBe(false);
  });

  it('rejects non-object', () => {
    expect(isScanElementData('string')).toBe(false);
  });

  it('rejects missing index', () => {
    expect(isScanElementData(makeValidScanElement({ index: undefined }))).toBe(false);
  });

  it('rejects non-number index', () => {
    expect(isScanElementData(makeValidScanElement({ index: 'not-a-number' }))).toBe(false);
  });

  it('rejects missing selector', () => {
    expect(isScanElementData(makeValidScanElement({ selector: undefined }))).toBe(false);
  });

  it('rejects missing tagName', () => {
    expect(isScanElementData(makeValidScanElement({ tagName: undefined }))).toBe(false);
  });

  it('rejects missing classList', () => {
    expect(isScanElementData(makeValidScanElement({ classList: undefined }))).toBe(false);
  });

  it('rejects non-array classList', () => {
    expect(isScanElementData(makeValidScanElement({ classList: 'not-array' }))).toBe(false);
  });

  it('rejects missing computedStyles', () => {
    expect(isScanElementData(makeValidScanElement({ computedStyles: undefined }))).toBe(false);
  });

  it('rejects null computedStyles', () => {
    expect(isScanElementData(makeValidScanElement({ computedStyles: null }))).toBe(false);
  });

  it('rejects computedStyles missing required properties', () => {
    expect(isScanElementData(makeValidScanElement({ computedStyles: {} }))).toBe(false);
  });

  describe('parent field validation', () => {
    it('accepts parent: null', () => {
      expect(isScanElementData(makeValidScanElement({ parent: null }))).toBe(true);
    });

    it('accepts valid parent with computedStyles', () => {
      expect(
        isScanElementData(
          makeValidScanElement({
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
        ),
      ).toBe(true);
    });

    it('rejects non-object parent', () => {
      expect(isScanElementData(makeValidScanElement({ parent: 'invalid' }))).toBe(false);
    });

    it('rejects parent with missing computedStyles', () => {
      expect(isScanElementData(makeValidScanElement({ parent: {} }))).toBe(false);
    });

    it('rejects parent with null computedStyles', () => {
      expect(isScanElementData(makeValidScanElement({ parent: { computedStyles: null } }))).toBe(
        false,
      );
    });

    it('rejects parent with non-object computedStyles', () => {
      expect(
        isScanElementData(makeValidScanElement({ parent: { computedStyles: 'not-object' } })),
      ).toBe(false);
    });
  });
});

describe('isChunkResult', () => {
  it('accepts valid chunk result', () => {
    expect(isChunkResult({ results: [makeValidScanElement()], total: 1 })).toBe(true);
  });

  it('accepts empty results', () => {
    expect(isChunkResult({ results: [], total: 0 })).toBe(true);
  });

  it('rejects null', () => {
    expect(isChunkResult(null)).toBe(false);
  });

  it('rejects non-object', () => {
    expect(isChunkResult('string')).toBe(false);
  });

  it('rejects missing results', () => {
    expect(isChunkResult({ total: 5 })).toBe(false);
  });

  it('rejects non-array results', () => {
    expect(isChunkResult({ results: 'not-array', total: 5 })).toBe(false);
  });

  it('rejects missing total', () => {
    expect(isChunkResult({ results: [] })).toBe(false);
  });

  it('rejects non-number total', () => {
    expect(isChunkResult({ results: [], total: 'five' })).toBe(false);
  });

  it('rejects results containing invalid elements', () => {
    expect(isChunkResult({ results: [{ invalid: true }], total: 1 })).toBe(false);
  });
});
