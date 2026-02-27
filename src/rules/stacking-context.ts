/**
 * Returns true when computed styles indicate the element likely creates a stacking
 * context via CSS properties (callers handle position and flex/grid item status
 * separately).
 *
 * Covers the most common triggers: opacity, transform, filter, backdrop-filter,
 * perspective, clip-path, isolation, mix-blend-mode, contain, mask,
 * container-type, and will-change.
 */
export function isStackingContext(styles: Record<string, string>): boolean {
  const opacity = styles['opacity'];
  if (opacity !== undefined && opacity !== '1') return true;

  const transform = styles['transform'];
  if (transform !== undefined && transform !== 'none') return true;

  const filter = styles['filter'];
  if (filter !== undefined && filter !== 'none') return true;

  const backdropFilter = styles['backdropFilter'];
  if (backdropFilter !== undefined && backdropFilter !== 'none') return true;

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

  // contain: layout | paint | strict | content create a stacking context;
  // size and style alone do not.
  const contain = styles['contain'] ?? '';
  if (/\b(layout|paint|strict|content)\b/.test(contain)) return true;

  // will-change values use CSS kebab-case property names (e.g. "clip-path", not "clipPath")
  const willChange = styles['willChange'] ?? 'auto';
  if (
    /\b(transform|opacity|filter|backdrop-filter|perspective|clip-path|z-index|isolation|mix-blend-mode|mask|contain)\b/.test(
      willChange,
    )
  )
    return true;

  return false;
}
