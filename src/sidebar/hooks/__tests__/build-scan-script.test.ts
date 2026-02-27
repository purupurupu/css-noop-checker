import { describe, it, expect } from 'vitest';
import { buildScanScript } from '../build-scan-script.ts';

// Side-effect import to populate the registry (registers all rules)
import '../../../rules/engine.ts';

describe('buildScanScript', () => {
  it('returns a valid JavaScript IIFE string', () => {
    const script = buildScanScript(0, 200);
    expect(script).toMatch(/^\(function\(offset, limit\)/);
    expect(script).toMatch(/\)\(0, 200\)$/);
  });

  it('embeds offset and limit into the IIFE call', () => {
    const script = buildScanScript(400, 100);
    expect(script).toMatch(/\)\(400, 100\)$/);
  });

  it('includes element scanning logic', () => {
    const script = buildScanScript(0, 200);
    expect(script).toContain('querySelectorAll');
    expect(script).toContain('getComputedStyle');
    expect(script).toContain('results');
    expect(script).toContain('total');
  });

  it('skips non-visual elements', () => {
    const script = buildScanScript(0, 200);
    expect(script).toContain('SCRIPT');
    expect(script).toContain('STYLE');
    expect(script).toContain('NOSCRIPT');
  });
});
