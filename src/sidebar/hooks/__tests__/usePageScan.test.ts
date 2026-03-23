import { describe, it, expect } from 'vitest';
import { groupByRule } from '../../utils/group-by-rule.ts';
import { DEFAULT_COMPUTED_STYLES } from '../../../rules/__tests__/helpers/make-element.ts';
import type { ScanElementData } from '../../types.ts';
import type { ElementData } from '../../../rules/types.ts';

function makeScanElement(
  index: number,
  selector: string,
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
): ScanElementData {
  const { tagName = 'div', ...styles } = overrides;
  const computedStyles: Record<string, string> = { ...DEFAULT_COMPUTED_STYLES };
  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined) computedStyles[key] = value;
  }
  return {
    index,
    selector,
    tagName,
    id: '',
    classList: [],
    computedStyles,
    parent: null,
  };
}

describe('groupByRule', () => {
  it('returns empty array when no elements have warnings', () => {
    const elements = [makeScanElement(0, 'div')];
    expect(groupByRule(elements)).toEqual([]);
  });

  it('groups violations by rule ID', () => {
    const elements = [
      makeScanElement(0, 'div.a', { alignItems: 'center' }),
      makeScanElement(1, 'div.b', { alignItems: 'flex-start' }),
    ];
    const groups = groupByRule(elements);
    expect(groups).toHaveLength(1);
    expect(groups[0].ruleId).toBe('container-no-align');
    expect(groups[0].violations).toHaveLength(2);
  });

  it('creates separate groups for different rules', () => {
    const elements = [
      makeScanElement(0, 'span.x', { tagName: 'span', display: 'inline', width: '100px' }),
      makeScanElement(1, 'div.y', { rowGap: '10px' }),
    ];
    const groups = groupByRule(elements);
    const ruleIds = groups.map((g) => g.ruleId);
    expect(ruleIds).toContain('inline-no-dimensions');
    expect(ruleIds).toContain('container-no-gap');
  });

  it('sorts groups by rule ID', () => {
    const elements = [
      makeScanElement(0, 'div.z', { placeItems: 'center' }),
      makeScanElement(1, 'div.a', { rowGap: '10px' }),
      makeScanElement(2, 'span.b', { tagName: 'span', display: 'inline', width: '50px' }),
    ];
    const groups = groupByRule(elements);
    const ruleIds = groups.map((g) => g.ruleId);
    expect(ruleIds).toEqual([...ruleIds].sort());
  });

  it('places element in multiple groups when it triggers multiple rules', () => {
    const elements = [
      makeScanElement(0, 'div.multi', {
        display: 'inline',
        alignItems: 'center',
        placeItems: 'center',
      }),
    ];
    const groups = groupByRule(elements);
    expect(groups).toHaveLength(2);
    const ruleIds = groups.map((g) => g.ruleId);
    expect(ruleIds).toContain('container-no-align');
    expect(ruleIds).toContain('container-no-place');
    expect(groups[0].violations[0].index).toBe(0);
    expect(groups[1].violations[0].index).toBe(0);
  });

  it('preserves selector and index in violations', () => {
    const elements = [makeScanElement(42, 'main#app.container', { alignItems: 'center' })];
    const groups = groupByRule(elements);
    expect(groups[0].violations[0].selector).toBe('main#app.container');
    expect(groups[0].violations[0].index).toBe(42);
  });

  it('skips elements with no warnings', () => {
    const elements = [
      makeScanElement(0, 'div.clean', {}),
      makeScanElement(1, 'div.dirty', { alignItems: 'center' }),
      makeScanElement(2, 'div.also-clean', { display: 'flex', alignItems: 'center' }),
    ];
    const groups = groupByRule(elements);
    expect(groups).toHaveLength(1);
    expect(groups[0].violations).toHaveLength(1);
    expect(groups[0].violations[0].index).toBe(1);
  });

  it('skips display: contents elements', () => {
    const elements = [
      makeScanElement(0, 'div.contents', { display: 'contents', alignItems: 'center' }),
    ];
    const groups = groupByRule(elements);
    expect(groups).toEqual([]);
  });
});
