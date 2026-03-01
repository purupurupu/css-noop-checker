import type { RuleDescriptor, Warning } from './types.ts';
import { registerRule } from './registry.ts';

const SHAPE_PROPERTIES = [
  { key: 'shapeOutside', css: 'shape-outside', defaultValue: 'none' },
  { key: 'shapeMargin', css: 'shape-margin', defaultValue: '0px' },
  { key: 'shapeImageThreshold', css: 'shape-image-threshold', defaultValue: '0' },
] as const;

const rule: RuleDescriptor = {
  id: 'nonfloat-no-shape-outside',
  label: 'shape-outside on non-floated element',
  requiredProperties: ['cssFloat', 'shapeOutside', 'shapeMargin', 'shapeImageThreshold'],
  requiredParentProperties: ['display'],
  check(ctx) {
    const { cssFloat } = ctx.styles;

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if float is effectively active, so bail out to avoid false positives.
    if (ctx.parentStyles?.display === 'contents') return [];

    // Float is ignored on flex/grid items per spec, so shape properties are also no-ops.
    const floatIsActive = cssFloat !== 'none' && !ctx.isFlexItem && !ctx.isGridItem;
    if (floatIsActive) return [];

    const warnings: Warning[] = [];
    const inFlexOrGrid = ctx.isFlexItem || ctx.isGridItem;

    for (const { key, css, defaultValue } of SHAPE_PROPERTIES) {
      const value = ctx.styles[key];
      if (value !== defaultValue) {
        const details = inFlexOrGrid
          ? `${css} is "${value}" but float has no effect on flex/grid items. CSS Shapes properties only apply to floated elements.`
          : `${css} is "${value}" but element is not floated. CSS Shapes properties only apply to floated elements.`;
        const suggestion = inFlexOrGrid
          ? `Remove ${css} — float is ignored on flex/grid items so this property has no effect.`
          : `Add float: left or float: right, or remove ${css}.`;
        warnings.push({
          ruleId: 'nonfloat-no-shape-outside',
          property: css,
          severity: 'warning',
          title: `${css} has no effect`,
          details,
          suggestion,
        });
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkNonfloatNoShapeOutside = rule.check;
