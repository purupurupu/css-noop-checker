import { describe, expect, test } from 'vitest';
import { MAX_SCAN_ELEMENTS, SCAN_CHUNK_SIZE, SKIP_TAGS } from '../scan-constants.ts';

describe('SKIP_TAGS', () => {
  test('contains exactly the expected tags', () => {
    expect([...SKIP_TAGS]).toEqual([
      'SCRIPT',
      'STYLE',
      'NOSCRIPT',
      'TEMPLATE',
      'BASE',
      'LINK',
      'META',
      'HEAD',
      'BR',
      'TITLE',
    ]);
  });

  test('does not include HR (block element with real box model)', () => {
    expect(SKIP_TAGS).not.toContain('HR');
  });
});

describe('scan limits', () => {
  test('MAX_SCAN_ELEMENTS is 5000', () => {
    expect(MAX_SCAN_ELEMENTS).toBe(5_000);
  });

  test('SCAN_CHUNK_SIZE is 200', () => {
    expect(SCAN_CHUNK_SIZE).toBe(200);
  });
});
