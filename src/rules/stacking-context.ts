const CONTAIN_RE = /\b(layout|paint|strict|content)\b/;
const WILL_CHANGE_RE =
  /\b(transform|rotate|scale|translate|transform-style|opacity|filter|backdrop-filter|perspective|clip-path|z-index|isolation|mix-blend-mode|mask|contain|offset-path|content-visibility)\b/;

/**
 * Returns true when computed styles indicate the element likely creates a stacking
 * context via CSS properties (callers handle position and flex/grid item status
 * separately).
 *
 * Covers the most common triggers: opacity, transform, rotate, scale, translate,
 * filter, backdrop-filter, perspective, clip-path, isolation, mix-blend-mode,
 * contain, mask, container-type, offset-path, content-visibility, transform-style,
 * and will-change.
 */
export function isStackingContext(styles: Record<string, string>): boolean {
  const opacity = styles['opacity'];
  if (opacity !== undefined && opacity !== '1') return true;

  const transform = styles['transform'];
  if (transform !== undefined && transform !== 'none') return true;

  // CSS Transforms Level 2 individual properties also create stacking contexts
  const rotate = styles['rotate'];
  if (rotate !== undefined && rotate !== 'none') return true;

  const scale = styles['scale'];
  if (scale !== undefined && scale !== 'none') return true;

  const translate = styles['translate'];
  if (translate !== undefined && translate !== 'none') return true;

  const filter = styles['filter'];
  if (filter !== undefined && filter !== 'none') return true;

  const backdropFilter = styles['backdropFilter'];
  if (backdropFilter !== undefined && backdropFilter !== 'none' && backdropFilter !== '')
    return true;

  const perspective = styles['perspective'];
  if (perspective !== undefined && perspective !== 'none') return true;

  const clipPath = styles['clipPath'];
  if (clipPath !== undefined && clipPath !== 'none') return true;

  if (styles['isolation'] === 'isolate') return true;

  const mixBlendMode = styles['mixBlendMode'];
  if (mixBlendMode !== undefined && mixBlendMode !== 'normal') return true;

  const mask = styles['mask'];
  if (mask !== undefined && mask !== 'none' && mask !== '') return true;

  const containerType = styles['containerType'];
  if (containerType !== undefined && containerType !== 'normal') return true;

  // offset-path (CSS Motion Path) creates a stacking context
  const offsetPath = styles['offsetPath'];
  if (offsetPath !== undefined && offsetPath !== 'none') return true;

  // content-visibility: auto or hidden creates a stacking context (CSS Containment Level 2)
  const contentVisibility = styles['contentVisibility'];
  if (contentVisibility === 'auto' || contentVisibility === 'hidden') return true;

  // transform-style: preserve-3d creates a stacking context
  if (styles['transformStyle'] === 'preserve-3d') return true;

  // contain: layout | paint | strict | content create a stacking context;
  // size and style alone do not.
  const contain = styles['contain'] ?? '';
  if (CONTAIN_RE.test(contain)) return true;

  // will-change values use CSS kebab-case property names (e.g. "clip-path", not "clipPath")
  const willChange = styles['willChange'] ?? 'auto';
  if (WILL_CHANGE_RE.test(willChange)) return true;

  return false;
}
