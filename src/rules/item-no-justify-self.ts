import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import {
  isBlockLayoutDisplay,
  isDefaultSelfAlignmentValue,
  isMulticolContainer,
} from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'item-no-justify-self' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

/**
 * Child display values that do NOT generate a block-level box.
 * justify-self in block layout only applies to block-level boxes (Chrome 119+).
 * This covers inline-level types, table-internal types, and inline outer display types
 * (inline-block, inline-flex, inline-grid) — all empirically confirmed in Chromium.
 */
function isNonBlockLevelBox(display: string): boolean {
  return (
    display === 'inline' ||
    display === 'inline-block' ||
    display === 'inline-flex' ||
    display === 'inline-grid' ||
    display === 'inline-table' ||
    display === 'ruby' ||
    display === 'table-row' ||
    display === 'table-cell' ||
    display === 'table-row-group' ||
    display === 'table-header-group' ||
    display === 'table-footer-group' ||
    display === 'table-column' ||
    display === 'table-column-group' ||
    display === 'table-caption'
  );
}

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'justify-self outside flex/grid/block/positioned context',
  requiredProperties: ['justifySelf', 'position', 'display'],
  requiredParentProperties: ['display', 'columnCount', 'columnWidth'],
  check(ctx) {
    if (ctx.isGridItem) return [];
    if (!ctx.parentStyles) return [];

    const { justifySelf } = ctx.styles;
    if (isDefaultSelfAlignmentValue(justifySelf)) return [];

    // justify-self works on absolutely/fixed-positioned elements (Chrome 105+)
    const { position } = ctx.styles;
    if (position === 'absolute' || position === 'fixed') return [];

    // display:contents removes the parent's box, so the child participates in the
    // grandparent's formatting context. Without grandparent data we cannot determine
    // if this element is effectively a flex/grid item.
    if (ctx.isParentContents) return [];

    // justify-self works in block layout (Chrome 119+), but only on block-level boxes.
    // Non-block-level children and multi-column containers are excluded.
    if (isBlockLayoutDisplay(ctx.parentDisplay)) {
      if (
        !isNonBlockLevelBox(ctx.styles.display) &&
        !isMulticolContainer(
          ctx.parentDisplay,
          ctx.parentStyles.columnCount ?? 'auto',
          ctx.parentStyles.columnWidth ?? 'auto',
        )
      ) {
        return [];
      }
    }

    return [
      warn({
        property: 'justify-self',
        title: 'justify-self has no effect',
        details: `justify-self is "${justifySelf}" but parent display is "${ctx.parentDisplay}". In Chromium, justify-self takes effect on grid items, block-level elements in block layout, or absolutely/fixed-positioned elements. It does not affect flex items.`,
        suggestion:
          'Use a grid parent, a block-layout parent with a block-level child, or absolute/fixed positioning. Otherwise, remove justify-self.',
      }),
    ];
  },
};

registerRule(rule);

export const checkJustifySelf = rule.check;
