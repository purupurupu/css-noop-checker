import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'item-no-grid-props' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const GRID_CHILD_PROPERTIES = [
  { key: 'gridColumnStart', cssName: 'grid-column-start', defaultValue: 'auto' },
  { key: 'gridColumnEnd', cssName: 'grid-column-end', defaultValue: 'auto' },
  { key: 'gridRowStart', cssName: 'grid-row-start', defaultValue: 'auto' },
  { key: 'gridRowEnd', cssName: 'grid-row-end', defaultValue: 'auto' },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'grid item props on non-grid child',
  requiredProperties: GRID_CHILD_PROPERTIES.map((p) => p.key),
  requiredParentProperties: ['display'],
  check(ctx): Warning[] {
    if (!ctx.parentStyles) return [];
    if (ctx.isGridItem) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a grid item.
    if (ctx.isParentContents) return [];

    return GRID_CHILD_PROPERTIES.flatMap(({ key, cssName, defaultValue }) => {
      const value = ctx.styles[key];
      if (value === defaultValue) return [];

      return [
        warn({
          property: cssName,
          title: `${cssName} has no effect`,
          details: `${cssName} is "${value}" but parent display is "${ctx.parentDisplay}". These properties only apply to grid items.`,
          suggestion:
            'Set display: grid or display: inline-grid on the parent element, or remove this property.',
        }),
      ];
    });
  },
};

registerRule(rule);

export const checkItemNoGridProps = rule.check;
