import { describe, it, expect } from 'vitest';
import { checkScrollSnapNoAlignWithoutType } from '../scroll-snap-no-align-without-type.ts';
import { createRuleContext } from '../context.ts';
import { makeElement, makeChildElement } from './helpers/make-element.ts';

describe('scroll-snap-no-align-without-type', () => {
  describe('scroll-snap-align', () => {
    it('warns when scroll-snap-align is set but parent has no scroll-snap-type', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'start' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].ruleId).toBe('scroll-snap-no-align-without-type');
      expect(warnings[0].property).toBe('scroll-snap-align');
      expect(warnings[0].details).toContain('start');
    });

    it('warns for scroll-snap-align: center', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'center' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].property).toBe('scroll-snap-align');
    });

    it('warns for scroll-snap-align: end', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'end' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].property).toBe('scroll-snap-align');
    });

    it('does not warn when parent has scroll-snap-type set', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'start' },
            { computedStyles: { display: 'block', scrollSnapType: 'y mandatory' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when parent has scroll-snap-type: x proximity', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'start' },
            { computedStyles: { display: 'block', scrollSnapType: 'x proximity' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when scroll-snap-align is "none none" (two-value default)', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'none none' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when scroll-snap-align is none (default)', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'none' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(0);
    });
  });

  describe('scroll-snap-stop', () => {
    it('warns when scroll-snap-stop is set but parent has no scroll-snap-type', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapStop: 'always' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].ruleId).toBe('scroll-snap-no-align-without-type');
      expect(warnings[0].property).toBe('scroll-snap-stop');
      expect(warnings[0].details).toContain('always');
    });

    it('does not warn when parent has scroll-snap-type set', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapStop: 'always' },
            { computedStyles: { display: 'block', scrollSnapType: 'y mandatory' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when scroll-snap-stop is normal (default)', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapStop: 'normal' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(0);
    });

    it('warns for scroll-snap-stop alone when scroll-snap-align is none', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'none', scrollSnapStop: 'always' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(1);
      expect(warnings[0].property).toBe('scroll-snap-stop');
    });
  });

  describe('both properties', () => {
    it('warns for both when both are set without parent scroll-snap-type', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'start', scrollSnapStop: 'always' },
            { computedStyles: { display: 'block', scrollSnapType: 'none' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(2);
      expect(warnings[0].property).toBe('scroll-snap-align');
      expect(warnings[1].property).toBe('scroll-snap-stop');
    });

    it('does not warn for either when parent has scroll-snap-type', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(
          makeChildElement(
            { scrollSnapAlign: 'start', scrollSnapStop: 'always' },
            { computedStyles: { display: 'block', scrollSnapType: 'y mandatory' } },
          ),
        ),
      );
      expect(warnings).toHaveLength(0);
    });
  });

  describe('edge cases', () => {
    it('does not warn when both properties are at defaults', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(createRuleContext(makeElement()));
      expect(warnings).toHaveLength(0);
    });

    it('does not warn when parent is null', () => {
      const warnings = checkScrollSnapNoAlignWithoutType(
        createRuleContext(makeElement({ scrollSnapAlign: 'start' }, null)),
      );
      expect(warnings).toHaveLength(0);
    });
  });
});
