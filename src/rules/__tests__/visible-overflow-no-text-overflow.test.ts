import { describe, it, expect } from 'vitest';
import { checkVisibleOverflowTextOverflow } from '../visible-overflow-no-text-overflow.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('visible-overflow-no-text-overflow', () => {
  it('warns when textOverflow is ellipsis and overflowX is visible', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(makeElement({ textOverflow: 'ellipsis', overflowX: 'visible' })),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].ruleId).toBe('visible-overflow-no-text-overflow');
    expect(warnings[0].property).toBe('text-overflow');
    expect(warnings[0].details).toContain('ellipsis');
    expect(warnings[0].details).toContain('overflow-x');
  });

  it('does not warn when textOverflow is clip (default)', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(makeElement({ textOverflow: 'clip', overflowX: 'visible' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when textOverflow is "clip clip" (two-value default)', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(makeElement({ textOverflow: 'clip clip', overflowX: 'visible' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when overflowX is hidden', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(makeElement({ textOverflow: 'ellipsis', overflowX: 'hidden' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when overflowX is scroll', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(makeElement({ textOverflow: 'ellipsis', overflowX: 'scroll' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when overflowX is auto', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(makeElement({ textOverflow: 'ellipsis', overflowX: 'auto' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when overflowX is clip', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(makeElement({ textOverflow: 'ellipsis', overflowX: 'clip' })),
    );
    expect(warnings).toHaveLength(0);
  });

  it('does not warn when display is contents', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(
        makeElement({ display: 'contents', textOverflow: 'ellipsis', overflowX: 'visible' }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns based on overflowY in vertical writing mode', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(
        makeElement({
          textOverflow: 'ellipsis',
          writingMode: 'vertical-rl',
          overflowX: 'hidden',
          overflowY: 'visible',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('overflow-y');
  });

  it('does not warn in vertical mode when overflowY is hidden', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(
        makeElement({
          textOverflow: 'ellipsis',
          writingMode: 'vertical-rl',
          overflowX: 'visible',
          overflowY: 'hidden',
        }),
      ),
    );
    expect(warnings).toHaveLength(0);
  });

  it('warns based on overflowX in horizontal writing mode (default)', () => {
    const warnings = checkVisibleOverflowTextOverflow(
      createRuleContext(
        makeElement({
          textOverflow: 'ellipsis',
          writingMode: 'horizontal-tb',
          overflowX: 'visible',
          overflowY: 'hidden',
        }),
      ),
    );
    expect(warnings).toHaveLength(1);
    expect(warnings[0].details).toContain('overflow-x');
  });
});
