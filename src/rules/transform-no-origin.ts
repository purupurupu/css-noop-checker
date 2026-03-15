import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';
import { willChangeIncludes } from './context.ts';

const RULE_ID = 'transform-no-origin' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

function hasActiveTransform(styles: Record<string, string>): boolean {
  const t = styles['transform'];
  if (t !== undefined && t !== 'none') return true;
  // rotate and scale are visually affected by transform-origin;
  // translate is not (the origin offset cancels out), so we skip it.
  const r = styles['rotate'];
  if (r !== undefined && r !== 'none') return true;
  const s = styles['scale'];
  if (s !== undefined && s !== 'none') return true;
  return false;
}

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'transform-origin without transform',
  // getComputedStyle() returns a resolved transform-origin (e.g. "150px 75px"),
  // so we cannot distinguish "not set" from "set to the default".
  // Use requiredInlineProperties to read el.style.transformOrigin instead.
  // translate is omitted: transform-origin has no visual effect on pure translations.
  requiredProperties: ['transform', 'rotate', 'scale', 'willChange', 'offsetPath'],
  requiredInlineProperties: ['transformOrigin'],
  check(ctx) {
    const inlineOrigin = ctx.inlineStyles.transformOrigin ?? '';

    // No warning if no inline transform-origin is authored
    if (inlineOrigin === '') return [];

    if (hasActiveTransform(ctx.styles)) return [];

    // will-change: transform means a transform may be applied dynamically
    if (willChangeIncludes(ctx.styles['willChange'] ?? 'auto', 'transform')) return [];

    // offset-path (CSS Motion Path) also uses transform-origin as anchor
    if (ctx.styles['offsetPath'] !== 'none') return [];

    return [
      warn({
        property: 'transform-origin',
        title: 'transform-origin has no effect without a transform',
        details: `transform-origin is "${inlineOrigin}" but no transform, rotate, or scale property is set. transform-origin only affects elements with an active transform.`,
        suggestion:
          'Add a transform property (e.g. transform, rotate, scale), or remove transform-origin.',
      }),
    ];
  },
};

registerRule(rule);

export const checkTransformNoOrigin = rule.check;
