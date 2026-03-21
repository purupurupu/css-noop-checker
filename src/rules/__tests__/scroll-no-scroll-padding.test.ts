import { describe, it, expect } from 'vitest';
import { checkScrollNoScrollPadding } from '../scroll-no-scroll-padding.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

const LONGHANDS = [
  { key: 'scrollPaddingTop', cssName: 'scroll-padding-top' },
  { key: 'scrollPaddingRight', cssName: 'scroll-padding-right' },
  { key: 'scrollPaddingBottom', cssName: 'scroll-padding-bottom' },
  { key: 'scrollPaddingLeft', cssName: 'scroll-padding-left' },
  { key: 'scrollPaddingBlockStart', cssName: 'scroll-padding-block-start' },
  { key: 'scrollPaddingBlockEnd', cssName: 'scroll-padding-block-end' },
  { key: 'scrollPaddingInlineStart', cssName: 'scroll-padding-inline-start' },
  { key: 'scrollPaddingInlineEnd', cssName: 'scroll-padding-inline-end' },
] as const;

describe('scroll-no-scroll-padding', () => {
  describe('should warn', () => {
    it.each(LONGHANDS)('warns when $cssName is set on non-scroll container', ({ key, cssName }) => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(makeElement({ [key]: '10px' })),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].ruleId).toBe('scroll-no-scroll-padding');
      expect(warnings[0].property).toBe(cssName);
    });

    it('warns for multiple scroll-padding properties at once', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(makeElement({ scrollPaddingTop: '10px', scrollPaddingBottom: '20px' })),
      );
      expect(warnings).toHaveLength(2);
      expect(warnings[0].property).toBe('scroll-padding-top');
      expect(warnings[1].property).toBe('scroll-padding-bottom');
    });

    it('warns when overflow is clip (not a scroll container)', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(
          makeElement({ overflowX: 'clip', overflowY: 'clip', scrollPaddingTop: '10px' }),
        ),
      );
      expect(warnings).toHaveLength(1);
    });
  });

  describe('should not warn', () => {
    it('does not warn when overflow-y is auto', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(makeElement({ overflowY: 'auto', scrollPaddingTop: '10px' })),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when overflow-x is scroll', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(makeElement({ overflowX: 'scroll', scrollPaddingLeft: '10px' })),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when overflow is hidden', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(
          makeElement({ overflowX: 'hidden', overflowY: 'hidden', scrollPaddingTop: '10px' }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when all scroll-padding values are auto (default)', () => {
      const warnings = checkScrollNoScrollPadding(createRuleContext(makeElement()));
      expect(warnings).toHaveLength(0);
    });

    it('does not warn for display: contents', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(makeElement({ display: 'contents', scrollPaddingTop: '10px' })),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn on <html> element (viewport is scroll container)', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(makeElement({ tagName: 'html', scrollPaddingTop: '10px' })),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn on <body> element (overflow propagates to viewport)', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(makeElement({ tagName: 'body', scrollPaddingTop: '10px' })),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when only one overflow axis is a scroll container', () => {
      const warnings = checkScrollNoScrollPadding(
        createRuleContext(
          makeElement({ overflowX: 'visible', overflowY: 'auto', scrollPaddingTop: '10px' }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });
  });
});
