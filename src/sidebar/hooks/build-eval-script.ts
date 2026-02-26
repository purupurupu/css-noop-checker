import {
  generateParentStyleExtractFragment,
  generateStyleExtractFragment,
} from '../../rules/css-properties.ts';

/** Builds the eval script that extracts ElementData from $0 in DevTools. */
export function buildEvalScript(): string {
  const parentFragment = generateParentStyleExtractFragment();
  const parentBlock = parentFragment
    ? `
  var pe = el.parentElement;
  var parent = null;
  if (pe) {
    var pcs = getComputedStyle(pe);
    parent = {
      computedStyles: {
            ${parentFragment}
      }
    };
  }`
    : '';

  return `(function() {
  var el = $0;
  if (!el) return null;
  var cs = getComputedStyle(el);${parentBlock}
  return {
    tagName: el.tagName.toLowerCase(),
    id: el.id || '',
    classList: Array.from(el.classList),
    computedStyles: {
        ${generateStyleExtractFragment()}
    },
    parent: ${parentFragment ? 'parent' : 'null'}
  };
})()`;
}
