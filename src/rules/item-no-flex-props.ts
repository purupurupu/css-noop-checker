import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'item-no-flex-props' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const FLEX_CHILD_PROPERTIES = [
  { key: 'flexGrow', cssName: 'flex-grow', defaultValue: '0' },
  { key: 'flexShrink', cssName: 'flex-shrink', defaultValue: '1' },
  { key: 'flexBasis', cssName: 'flex-basis', defaultValue: 'auto' },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'flex item props on non-flex child',
  requiredProperties: FLEX_CHILD_PROPERTIES.map((p) => p.key),
  requiredParentProperties: ['display'],
  check(ctx): Warning[] {
    if (!ctx.parentStyles) return [];
    // flex-grow/flex-shrink/flex-basis only apply to flex items.
    // Unlike order/align-self which apply to both flex and grid items,
    // these properties are flex-specific, so grid items are NOT excluded.
    if (ctx.isFlexItem) return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex item.
    if (ctx.isParentContents) return [];

    return FLEX_CHILD_PROPERTIES.flatMap(({ key, cssName, defaultValue }) => {
      const value = ctx.styles[key];
      if (value === defaultValue) return [];

      return [
        warn({
          property: cssName,
          title: `${cssName} has no effect`,
          details: `${cssName} is "${value}" but parent display is "${ctx.parentDisplay}". Flex item properties only apply to children of flex containers.`,
          suggestion:
            'Set display: flex or display: inline-flex on the parent element, or remove this property.',
        }),
      ];
    });
  },
};

registerRule(rule);

export const checkItemNoFlexProps = rule.check;
