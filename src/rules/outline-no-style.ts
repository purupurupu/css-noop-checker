import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'outline-no-style' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const OUTLINE_PROPERTIES = [
  { key: 'outlineWidth', css: 'outline-width' },
  { key: 'outlineColor', css: 'outline-color' },
  { key: 'outlineOffset', css: 'outline-offset' },
] as const;

const outlineKeys = OUTLINE_PROPERTIES.map((p) => p.key);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'outline-width/color/offset without outline-style',
  requiredProperties: ['outlineStyle', ...outlineKeys],
  // outlineStyle is only needed as a computed value (the gate condition),
  // not as an inline-style presence check.
  requiredInlineProperties: [...outlineKeys],
  check(ctx) {
    const outlineStyle = ctx.styles['outlineStyle'];

    // If outline-style is anything other than 'none', outline is potentially visible
    if (outlineStyle !== 'none') return [];

    const warnings: Warning[] = [];

    for (const { key, css } of OUTLINE_PROPERTIES) {
      // Use inline styles to determine if the property was explicitly authored.
      // Computed styles alone cannot distinguish inherited outline-color from
      // an explicitly set value, so we rely on el.style checks.
      const inlineValue = ctx.inlineStyles[key] ?? '';
      if (inlineValue === '') continue;

      // outline-width: 0 produces no visible outline regardless of outline-style,
      // so warning about missing outline-style would be misleading.
      if (key === 'outlineWidth' && (inlineValue === '0px' || inlineValue === '0')) continue;

      warnings.push(
        warn({
          property: css,
          title: `${css} has no effect without outline-style`,
          details: `${css} is "${ctx.styles[key]}" but outline-style is "none". Without an explicit outline-style, the outline is invisible.`,
          suggestion: `Set outline-style to a visible value (e.g. solid, dashed), or remove ${css}.`,
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkOutlineNoStyle = rule.check;
