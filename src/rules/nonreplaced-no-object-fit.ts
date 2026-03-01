import type { RuleDescriptor, Warning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'nonreplaced-no-object-fit';

/**
 * Elements that actually support object-fit/object-position.
 * Narrower than REPLACED_INLINE_ELEMENTS — excludes form controls (button,
 * select, textarea, input, meter, progress) and audio (UA widget with
 * controls, display:none without).
 *
 * Trade-off: embed, object, and iframe do NOT support object-fit (MDN
 * explicitly notes this for embed/iframe), but object-position may still
 * apply to them as generic replaced elements. Including them here avoids
 * false positives for object-position, at the cost of missing a valid
 * object-fit warning on these elements (a deliberate false negative).
 */
const OBJECT_FIT_ELEMENTS = new Set(['img', 'video', 'canvas', 'embed', 'object', 'iframe']);

function isDefaultObjectFit(value: string): boolean {
  return value === 'fill';
}

function isDefaultObjectPosition(value: string): boolean {
  return value === '50% 50%';
}

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'object-fit/object-position on non-replaced element',
  requiredProperties: ['display', 'objectFit', 'objectPosition'],
  check(ctx) {
    const { display, objectFit, objectPosition } = ctx.styles;
    const { tagName } = ctx.element;

    // display: contents elements generate no box — skip
    if (display === 'contents') return [];

    if (OBJECT_FIT_ELEMENTS.has(tagName)) return [];

    const warnings: Warning[] = [];

    if (!isDefaultObjectFit(objectFit)) {
      warnings.push({
        ruleId: RULE_ID,
        property: 'object-fit',
        severity: 'warning',
        title: 'object-fit has no effect on non-replaced elements',
        details: `object-fit is "${objectFit}" but <${tagName}> is not a replaced element. Only replaced elements (img, video, etc.) support object-fit.`,
        suggestion: 'Remove object-fit, or use it on a replaced element like <img> or <video>.',
      });
    }

    if (!isDefaultObjectPosition(objectPosition)) {
      warnings.push({
        ruleId: RULE_ID,
        property: 'object-position',
        severity: 'warning',
        title: 'object-position has no effect on non-replaced elements',
        details: `object-position is "${objectPosition}" but <${tagName}> is not a replaced element. Only replaced elements (img, video, etc.) support object-position.`,
        suggestion:
          'Remove object-position, or use it on a replaced element like <img> or <video>.',
      });
    }

    return warnings;
  },
};

registerRule(rule);

export const checkNonreplacedObjectFit = rule.check;
