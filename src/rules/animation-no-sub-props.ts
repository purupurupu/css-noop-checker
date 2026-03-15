import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';
import { willChangeIncludes } from './context.ts';

const RULE_ID = 'animation-no-sub-props' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const ANIMATION_PROPERTIES = [
  { key: 'animationDuration', cssName: 'animation-duration', defaultValue: '0s' },
  { key: 'animationTimingFunction', cssName: 'animation-timing-function', defaultValue: 'ease' },
  { key: 'animationDelay', cssName: 'animation-delay', defaultValue: '0s' },
  { key: 'animationIterationCount', cssName: 'animation-iteration-count', defaultValue: '1' },
  { key: 'animationDirection', cssName: 'animation-direction', defaultValue: 'normal' },
  { key: 'animationFillMode', cssName: 'animation-fill-mode', defaultValue: 'none' },
  { key: 'animationPlayState', cssName: 'animation-play-state', defaultValue: 'running' },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'animation properties without animation-name',
  requiredProperties: ['animationName', 'willChange', ...ANIMATION_PROPERTIES.map((p) => p.key)],
  check(ctx) {
    const animationName = ctx.styles['animationName'] ?? 'none';

    // Only trigger when animationName is exactly 'none' (single-value case).
    // Multi-animation scenarios (e.g. "slide, none") are out of scope — at least
    // one animation is active, so sub-properties are not entirely no-op.
    if (animationName !== 'none') return [];

    // will-change: animation-name or animation means a name may be toggled via JS
    if (willChangeIncludes(ctx.styles['willChange'] ?? 'auto', 'animation-name', 'animation'))
      return [];

    const warnings: Warning[] = [];

    for (const { key, cssName, defaultValue } of ANIMATION_PROPERTIES) {
      const value = ctx.styles[key] ?? defaultValue;
      if (value === defaultValue) continue;

      warnings.push(
        warn({
          property: cssName,
          title: `${cssName} has no effect without animation-name`,
          details: `${cssName} is "${value}" but no animation-name is set. Without an animation-name, no animation runs and this property has no visible effect.`,
          suggestion:
            'Add an animation-name (e.g. animation-name: fadeIn), or remove the animation property.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkAnimationNoSubProps = rule.check;
