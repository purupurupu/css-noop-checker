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
  placeItems: 'normal',
  placeContent: 'normal',
  columnCount: 'auto',
  position: 'static',
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  alignSelf: 'auto',
  order: '0',
  marginTop: '0px',
  marginBottom: '0px',
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
  contain: 'none',
  willChange: 'auto',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  flexGrow: '0',
  flexShrink: '1',
  flexBasis: 'auto',
};

/** Create a test ElementData with overrides and optional tagName / parent. */
export function makeElement(
  overrides: Partial<ElementData['computedStyles']> & { tagName?: string } = {},
  parent: ElementData['parent'] = null,
): ElementData {
  const { tagName = 'div', ...styles } = overrides;
  return {
    tagName,
    id: '',
    classList: [],
    computedStyles: { ...DEFAULT_COMPUTED_STYLES, ...styles } as Record<string, string>,
    parent,
  };
}
