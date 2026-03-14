import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'outline-no-style' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const OUTLINE_PROPERTIES = [
  { key: 'outlineWidth', css: 'outline-width' },
  { key: 'outlineColor', css: 'outline-color' },
  { key: 'outlineOffset', css: 'outline-offset' },
] as const;

/**
 * Browsers resolve computed outline-width to '0px' when outline-style is 'none'.
 * Since we read computed styles, we cannot distinguish "author set outline-width: 3px"
 * from the default when outline-style is none. We use inline styles to detect authored values.
 */
const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'outline properties without outline-style',
  requiredProperties: ['outlineStyle'],
  requiredInlineProperties: ['outlineWidth', 'outlineColor', 'outlineOffset'],
  check(ctx) {
    const outlineStyle = ctx.styles['outlineStyle'] ?? 'none';

    // If outline-style is set to something other than 'none', the outline is visible
    if (outlineStyle !== 'none') return [];

    const warnings: Warning[] = [];

    for (const { key, css } of OUTLINE_PROPERTIES) {
      const inlineValue = ctx.inlineStyles[key] ?? '';
      if (inlineValue === '') continue;

      warnings.push(
        warn({
          property: css,
          title: `${css} has no effect without outline-style`,
          details: `${css} is "${inlineValue}" but outline-style is "none". Without outline-style, no outline is rendered and this property has no visible effect.`,
          suggestion:
            'Add outline-style (e.g. outline-style: solid), or remove the outline property.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkOutlineNoStyle = rule.check;
