import { describe, it, expect } from 'vitest';
import { checkVisibleOverflowResize } from '../visible-overflow-no-resize.ts';
import { createRuleContext } from '../context.ts';
import { makeElement } from './helpers/make-element.ts';

describe('visible-overflow-no-resize', () => {
  describe('resize: both', () => {
    it('warns when both axes are visible', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'both', overflowX: 'visible', overflowY: 'visible' }),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].ruleId).toBe('visible-overflow-no-resize');
      expect(warnings[0].property).toBe('resize');
      expect(warnings[0].details).toContain('both');
    });

    it('warns when both axes are clip', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(makeElement({ resize: 'both', overflowX: 'clip', overflowY: 'clip' })),
      );
      expect(warnings).toHaveLength(1);
    });

    it('warns when one axis is visible and other is clip', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(makeElement({ resize: 'both', overflowX: 'visible', overflowY: 'clip' })),
      );
      expect(warnings).toHaveLength(1);
    });

    it('does not warn when overflow-x is auto', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(makeElement({ resize: 'both', overflowX: 'auto', overflowY: 'visible' })),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when overflow-y is hidden', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'both', overflowX: 'visible', overflowY: 'hidden' }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when both axes are auto', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(makeElement({ resize: 'both', overflowX: 'auto', overflowY: 'auto' })),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when both axes are scroll', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'both', overflowX: 'scroll', overflowY: 'scroll' }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });
  });

  describe('resize: horizontal', () => {
    it('warns when overflow-x is visible (even if overflow-y is hidden)', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'horizontal', overflowX: 'visible', overflowY: 'hidden' }),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].details).toContain('overflow-x');
    });

    it('warns when overflow-x is clip', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'horizontal', overflowX: 'clip', overflowY: 'hidden' }),
        ),
      );
      expect(warnings).toHaveLength(1);
    });

    it('does not warn when overflow-x is auto', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'horizontal', overflowX: 'auto', overflowY: 'visible' }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });
  });

  describe('resize: inline', () => {
    it('warns when overflow-x is visible (logical equivalent of horizontal)', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'inline', overflowX: 'visible', overflowY: 'hidden' }),
        ),
      );
      expect(warnings).toHaveLength(1);
    });
  });

  describe('resize: vertical', () => {
    it('warns when overflow-y is visible (even if overflow-x is hidden)', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'vertical', overflowX: 'hidden', overflowY: 'visible' }),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].details).toContain('overflow-y');
    });

    it('warns when overflow-y is clip', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'vertical', overflowX: 'hidden', overflowY: 'clip' }),
        ),
      );
      expect(warnings).toHaveLength(1);
    });

    it('does not warn when overflow-y is scroll', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'vertical', overflowX: 'visible', overflowY: 'scroll' }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });
  });

  describe('resize: block', () => {
    it('warns when overflow-y is visible (logical equivalent of vertical)', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'block', overflowX: 'hidden', overflowY: 'visible' }),
        ),
      );
      expect(warnings).toHaveLength(1);
    });
  });

  describe('edge cases', () => {
    it('does not warn when resize is none', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({ resize: 'none', overflowX: 'visible', overflowY: 'visible' }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn for textarea elements', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({
            tagName: 'textarea',
            resize: 'both',
            overflowX: 'visible',
            overflowY: 'visible',
          }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn for TEXTAREA (uppercase tagName)', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({
            tagName: 'TEXTAREA',
            resize: 'both',
            overflowX: 'visible',
            overflowY: 'visible',
          }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when display is contents', () => {
      const warnings = checkVisibleOverflowResize(
        createRuleContext(
          makeElement({
            display: 'contents',
            resize: 'both',
            overflowX: 'visible',
            overflowY: 'visible',
          }),
        ),
      );
      expect(warnings).toHaveLength(0);
    });
  });
});
