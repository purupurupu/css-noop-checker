import { describe, expect, test } from 'vitest';
import { createWarning } from '../types.ts';

describe('createWarning', () => {
  test('sets ruleId from the first argument', () => {
    const w = createWarning('inline-no-dimensions', {
      property: 'width',
      title: 'title',
      details: 'details',
      suggestion: 'suggestion',
    });
    expect(w.ruleId).toBe('inline-no-dimensions');
  });

  test('always sets severity to warning', () => {
    const w = createWarning('container-no-gap', {
      property: 'gap',
      title: 'title',
      details: 'details',
      suggestion: 'suggestion',
    });
    expect(w.severity).toBe('warning');
  });

  test('passes through property, title, details, suggestion', () => {
    const w = createWarning('static-no-z-index', {
      property: 'z-index',
      title: 'z-index has no effect',
      details: 'Element is statically positioned.',
      suggestion: 'Add position: relative.',
    });
    expect(w.property).toBe('z-index');
    expect(w.title).toBe('z-index has no effect');
    expect(w.details).toBe('Element is statically positioned.');
    expect(w.suggestion).toBe('Add position: relative.');
  });
});
