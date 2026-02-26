import { describe, it, expect } from 'vitest';
import { analyzeElement } from '../engine.ts';
import { makeElement } from './helpers/make-element.ts';

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

  it('combines inline-no-dimensions with other rules on inline element', () => {
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
