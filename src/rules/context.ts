import type { ElementData, RuleContext } from './types.ts';

function normalizeStyles(styles: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(styles)) {
    result[key] = value.trim().toLowerCase();
  }
  return result;
}

export function createRuleContext(element: ElementData): RuleContext {
  const styles = normalizeStyles(element.computedStyles);
  const parentStyles = element.parent ? normalizeStyles(element.parent.computedStyles) : null;
  const parentDisplay = parentStyles?.display ?? '';
  return {
    element,
    styles,
    inlineStyles: normalizeStyles(element.inlineStyles ?? {}),
    parentStyles,
    parentDisplay,
    isFlexItem: isFlexContainer(parentDisplay),
    isGridItem: isGridContainer(parentDisplay),
    isContents: styles.display === 'contents',
    isParentContents: parentDisplay === 'contents',
  };
}

export function isFlexContainer(display: string): boolean {
  return display === 'flex' || display === 'inline-flex';
}

export function isGridContainer(display: string): boolean {
  return display === 'grid' || display === 'inline-grid';
}

export function isFlexOrGridContainer(display: string): boolean {
  return isFlexContainer(display) || isGridContainer(display);
}

/**
 * Block-layout containers where Chromium applies justify-items/place-items and
 * where block-level children can use justify-self.
 */
export function isBlockLayoutDisplay(display: string): boolean {
  return (
    display === 'block' ||
    display === 'inline-block' ||
    display === 'flow-root' ||
    display === 'list-item'
  );
}

export function isDefaultGapLikeValue(value: string): boolean {
  return value === '0px' || value === 'normal';
}

export function isDefaultAlignmentValue(value: string): boolean {
  return value
    .trim()
    .split(/\s+/)
    .every((v) => v === 'normal');
}

export function isDefaultInlineSizeValue(value: string): boolean {
  return value === 'auto';
}

export function isDefaultOffsetValue(value: string): boolean {
  return value === 'auto';
}

const REPLACED_INLINE_ELEMENTS = new Set([
  'img',
  'input',
  'video',
  'audio',
  'canvas',
  'embed',
  'object',
  'iframe',
  'select',
  'textarea',
  'button',
  'meter',
  'progress',
  'svg',
]);

export function isReplacedInlineElement(tagName: string): boolean {
  return REPLACED_INLINE_ELEMENTS.has(tagName);
}

export function isZeroPx(value: string): boolean {
  return value === '0px';
}

export function isVerticalAlignApplicable(display: string): boolean {
  return (
    display === 'inline' ||
    display === 'inline-block' ||
    display === 'inline-flex' ||
    display === 'inline-grid' ||
    display === 'table-cell' ||
    display === 'inline-table' ||
    display === 'table-row' ||
    display === 'table-row-group' ||
    display === 'table-header-group' ||
    display === 'table-footer-group'
  );
}

export function isDefaultVerticalAlignValue(value: string): boolean {
  return value === 'baseline';
}

export function isDefaultZIndexValue(value: string): boolean {
  return value === 'auto';
}

export function isDefaultTextIndentValue(value: string): boolean {
  return value === '0px';
}

export function isDefaultFlexDirectionValue(value: string): boolean {
  return value === 'row';
}

export function isDefaultFlexWrapValue(value: string): boolean {
  return value === 'nowrap';
}

export function isDefaultOverflowValue(value: string): boolean {
  return value === 'visible';
}

export function isDefaultSelfAlignmentValue(value: string): boolean {
  return value === 'auto' || value === 'normal';
}

/** True when writing-mode is vertical or sideways (block axis is horizontal). */
export function isVerticalWritingMode(writingMode: string): boolean {
  return (
    writingMode === 'vertical-rl' ||
    writingMode === 'vertical-lr' ||
    writingMode === 'sideways-rl' ||
    writingMode === 'sideways-lr'
  );
}

/**
 * Maps each physical property to its logical counterpart based on writing-mode.
 *
 * horizontal-tb: block=vertical, inline=horizontal
 *   top↔block-start, bottom↔block-end, left↔inline-start, right↔inline-end
 *   width↔inline-size, height↔block-size
 *
 * vertical-rl / sideways-rl: block=horizontal(R→L), inline=vertical
 *   right↔block-start, left↔block-end, top↔inline-start, bottom↔inline-end
 *   width↔block-size, height↔inline-size
 *
 * vertical-lr: block=horizontal(L→R), inline=vertical
 *   left↔block-start, right↔block-end, top↔inline-start, bottom↔inline-end
 *   width↔block-size, height↔inline-size
 *
 * sideways-lr: block=horizontal(L→R), inline=vertical(B→T)
 *   left↔block-start, right↔block-end, bottom↔inline-start, top↔inline-end
 *   width↔block-size, height↔inline-size
 */
export interface PhysicalLogicalMap {
  /** physical sizing → logical sizing counterpart (camelCase keys) */
  width: string;
  height: string;
  minWidth: string;
  maxWidth: string;
  minHeight: string;
  maxHeight: string;
  /** physical offset → logical offset counterpart (camelCase keys) */
  top: string;
  right: string;
  bottom: string;
  left: string;
  /** physical margin → logical margin counterpart (camelCase keys) */
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
  /** physical padding → logical padding counterpart (camelCase keys) */
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  /** physical border-width → logical border-width counterpart (camelCase keys) */
  borderTopWidth: string;
  borderRightWidth: string;
  borderBottomWidth: string;
  borderLeftWidth: string;
}

const HORIZONTAL_TB_MAP: PhysicalLogicalMap = {
  width: 'inlineSize',
  height: 'blockSize',
  minWidth: 'minInlineSize',
  maxWidth: 'maxInlineSize',
  minHeight: 'minBlockSize',
  maxHeight: 'maxBlockSize',
  top: 'insetBlockStart',
  right: 'insetInlineEnd',
  bottom: 'insetBlockEnd',
  left: 'insetInlineStart',
  marginTop: 'marginBlockStart',
  marginRight: 'marginInlineEnd',
  marginBottom: 'marginBlockEnd',
  marginLeft: 'marginInlineStart',
  paddingTop: 'paddingBlockStart',
  paddingRight: 'paddingInlineEnd',
  paddingBottom: 'paddingBlockEnd',
  paddingLeft: 'paddingInlineStart',
  borderTopWidth: 'borderBlockStartWidth',
  borderRightWidth: 'borderInlineEndWidth',
  borderBottomWidth: 'borderBlockEndWidth',
  borderLeftWidth: 'borderInlineStartWidth',
};

const VERTICAL_RL_MAP: PhysicalLogicalMap = {
  width: 'blockSize',
  height: 'inlineSize',
  minWidth: 'minBlockSize',
  maxWidth: 'maxBlockSize',
  minHeight: 'minInlineSize',
  maxHeight: 'maxInlineSize',
  top: 'insetInlineStart',
  right: 'insetBlockStart',
  bottom: 'insetInlineEnd',
  left: 'insetBlockEnd',
  marginTop: 'marginInlineStart',
  marginRight: 'marginBlockStart',
  marginBottom: 'marginInlineEnd',
  marginLeft: 'marginBlockEnd',
  paddingTop: 'paddingInlineStart',
  paddingRight: 'paddingBlockStart',
  paddingBottom: 'paddingInlineEnd',
  paddingLeft: 'paddingBlockEnd',
  borderTopWidth: 'borderInlineStartWidth',
  borderRightWidth: 'borderBlockStartWidth',
  borderBottomWidth: 'borderInlineEndWidth',
  borderLeftWidth: 'borderBlockEndWidth',
};

const VERTICAL_LR_MAP: PhysicalLogicalMap = {
  width: 'blockSize',
  height: 'inlineSize',
  minWidth: 'minBlockSize',
  maxWidth: 'maxBlockSize',
  minHeight: 'minInlineSize',
  maxHeight: 'maxInlineSize',
  top: 'insetInlineStart',
  right: 'insetBlockEnd',
  bottom: 'insetInlineEnd',
  left: 'insetBlockStart',
  marginTop: 'marginInlineStart',
  marginRight: 'marginBlockEnd',
  marginBottom: 'marginInlineEnd',
  marginLeft: 'marginBlockStart',
  paddingTop: 'paddingInlineStart',
  paddingRight: 'paddingBlockEnd',
  paddingBottom: 'paddingInlineEnd',
  paddingLeft: 'paddingBlockStart',
  borderTopWidth: 'borderInlineStartWidth',
  borderRightWidth: 'borderBlockEndWidth',
  borderBottomWidth: 'borderInlineEndWidth',
  borderLeftWidth: 'borderBlockStartWidth',
};

const SIDEWAYS_LR_MAP: PhysicalLogicalMap = {
  width: 'blockSize',
  height: 'inlineSize',
  minWidth: 'minBlockSize',
  maxWidth: 'maxBlockSize',
  minHeight: 'minInlineSize',
  maxHeight: 'maxInlineSize',
  top: 'insetInlineEnd',
  right: 'insetBlockEnd',
  bottom: 'insetInlineStart',
  left: 'insetBlockStart',
  marginTop: 'marginInlineEnd',
  marginRight: 'marginBlockEnd',
  marginBottom: 'marginInlineStart',
  marginLeft: 'marginBlockStart',
  paddingTop: 'paddingInlineEnd',
  paddingRight: 'paddingBlockEnd',
  paddingBottom: 'paddingInlineStart',
  paddingLeft: 'paddingBlockStart',
  borderTopWidth: 'borderInlineEndWidth',
  borderRightWidth: 'borderBlockEndWidth',
  borderBottomWidth: 'borderInlineStartWidth',
  borderLeftWidth: 'borderBlockStartWidth',
};

/**
 * Swaps inline-start↔inline-end in every mapped value for RTL direction.
 * This applies to whichever physical properties map to the inline axis
 * (left/right in horizontal-tb, top/bottom in vertical modes).
 * Block-axis mappings contain "Block" not "Inline", so they pass through unchanged.
 */
function swapInlineMappings(map: PhysicalLogicalMap): PhysicalLogicalMap {
  const result = { ...map };
  for (const key of Object.keys(result) as Array<keyof PhysicalLogicalMap>) {
    result[key] = swapInlineValue(result[key]);
  }
  return result;
}

function swapInlineValue(value: string): string {
  if (value.includes('InlineStart')) return value.replace('InlineStart', 'InlineEnd');
  if (value.includes('InlineEnd')) return value.replace('InlineEnd', 'InlineStart');
  return value;
}

/** Returns the physical→logical property mapping for the given writing-mode and direction. */
export function getPhysicalLogicalMap(
  writingMode: string,
  direction: string = 'ltr',
): PhysicalLogicalMap {
  let map: PhysicalLogicalMap;
  switch (writingMode) {
    case 'vertical-rl':
    case 'sideways-rl':
      map = VERTICAL_RL_MAP;
      break;
    case 'vertical-lr':
      map = VERTICAL_LR_MAP;
      break;
    case 'sideways-lr':
      map = SIDEWAYS_LR_MAP;
      break;
    default:
      map = HORIZONTAL_TB_MAP;
      break;
  }
  return direction === 'rtl' ? swapInlineMappings(map) : map;
}

export function willChangeIncludes(willChange: string, ...tokens: string[]): boolean {
  return willChange.split(',').some((v) => tokens.includes(v.trim()));
}

/** True when column-count/column-width actually establish a multi-column layout.
 *  Flex/grid containers ignore column-count/column-width, so they are never multicol. */
export function isMulticolContainer(
  display: string,
  columnCount: string,
  columnWidth: string,
): boolean {
  if (isFlexOrGridContainer(display)) return false;
  return columnCount !== 'auto' || columnWidth !== 'auto';
}
