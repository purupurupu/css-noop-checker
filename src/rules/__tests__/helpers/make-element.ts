import type { ElementData } from '../../types.ts';

/** Default computed styles that satisfy all rule requirements with no-op-free values. */
export const DEFAULT_COMPUTED_STYLES: ElementData['computedStyles'] = {
  display: 'block',
  width: 'auto',
  height: 'auto',
  gap: 'normal',
  rowGap: 'normal',
  columnGap: 'normal',
  alignItems: 'normal',
  justifyContent: 'normal',
  justifyItems: 'normal',
  placeItems: 'normal',
  placeContent: 'normal',
  columnCount: 'auto',
  columnWidth: 'auto',
  position: 'static',
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  insetBlockStart: 'auto',
  insetBlockEnd: 'auto',
  insetInlineStart: 'auto',
  insetInlineEnd: 'auto',
  alignSelf: 'auto',
  justifySelf: 'auto',
  order: '0',
  marginTop: '0px',
  marginBottom: '0px',
  marginBlockStart: '0px',
  marginBlockEnd: '0px',
  verticalAlign: 'baseline',
  zIndex: 'auto',
  opacity: '1',
  transform: 'none',
  filter: 'none',
  backdropFilter: 'none',
  perspective: 'none',
  clipPath: 'none',
  isolation: 'auto',
  mixBlendMode: 'normal',
  mask: 'none',
  containerType: 'normal',
  contain: 'none',
  willChange: 'auto',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexGrow: '0',
  flexShrink: '1',
  flexBasis: 'auto',
  cssFloat: 'none',
  gridTemplateColumns: 'none',
  gridTemplateRows: 'none',
  gridTemplateAreas: 'none',
  gridAutoColumns: 'auto',
  gridAutoRows: 'auto',
  gridAutoFlow: 'row',
  gridColumnStart: 'auto',
  gridColumnEnd: 'auto',
  gridRowStart: 'auto',
  gridRowEnd: 'auto',
  textOverflow: 'clip',
  overflowX: 'visible',
  overflowY: 'visible',
  resize: 'none',
  inlineSize: 'auto',
  blockSize: 'auto',
  objectFit: 'fill',
  objectPosition: '50% 50%',
  shapeOutside: 'none',
  shapeMargin: '0px',
  shapeImageThreshold: '0',
  clear: 'none',
  textIndent: '0px',
  rotate: 'none',
  scale: 'none',
  offsetPath: 'none',
  outlineStyle: 'none',
  outlineWidth: '0px',
  outlineColor: 'rgb(0, 0, 0)',
  outlineOffset: '0px',
  writingMode: 'horizontal-tb',
  borderCollapse: 'separate',
  tableLayout: 'auto',
};

/** Create a test ElementData with overrides and optional tagName / parent. */
export function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
  parent: ElementData['parent'] = null,
  inlineStyles?: Record<string, string>,
): ElementData {
  const { tagName = 'div', ...styles } = overrides;
  const computedStyles: Record<string, string> = { ...DEFAULT_COMPUTED_STYLES };
  for (const [key, value] of Object.entries(styles)) {
    if (value !== undefined) computedStyles[key] = value;
  }
  const el: ElementData = { tagName, id: '', classList: [], computedStyles, parent };
  if (inlineStyles) el.inlineStyles = inlineStyles;
  return el;
}

const DEFAULT_BLOCK_PARENT: ElementData['parent'] = { computedStyles: { display: 'block' } };

/** Like makeElement, but defaults parent to a block container instead of null. */
export function makeChildElement(
  styles: Partial<ElementData['computedStyles']>,
  parent: ElementData['parent'] = DEFAULT_BLOCK_PARENT,
): ElementData {
  return makeElement(styles, parent);
}
