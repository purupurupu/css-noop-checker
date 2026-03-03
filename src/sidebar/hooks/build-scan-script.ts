import {
  generateInlineStyleExtractFragment,
  generateParentStyleExtractFragment,
  generateStyleExtractFragment,
} from '../../rules/css-properties.ts';

/** Builds the eval script that scans a chunk of page elements for CSS noop analysis. */
export function buildScanScript(offset: number, limit: number): string {
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

  const inlineFragment = generateInlineStyleExtractFragment();
  const inlineBlock = inlineFragment
    ? `,
      inlineStyles: {
        ${inlineFragment}
      }`
    : '';

  return `(function(offset, limit) {
  var SKIP = {SCRIPT:1,STYLE:1,NOSCRIPT:1,TEMPLATE:1,BASE:1,LINK:1,META:1};
  if (!document.body) return { results: [], total: 0 };
  var els = document.body.querySelectorAll('*');
  var total = els.length;
  var end = Math.min(offset + limit, total);
  var results = [];
  for (var i = offset; i < end; i++) {
    var el = els[i];
    if (SKIP[el.tagName]) continue;
    var cs = getComputedStyle(el);
    if (cs.display === 'none') continue;
    var sel = el.tagName.toLowerCase();
    if (el.id) sel += '#' + CSS.escape(el.id);
    var cl = el.classList;
    for (var j = 0; j < cl.length && j < 3; j++) sel += '.' + CSS.escape(cl[j]);${parentBlock}
    results.push({
      index: i,
      selector: sel,
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      classList: Array.from(el.classList),
      computedStyles: {
        ${generateStyleExtractFragment()}
      },
      parent: ${parentFragment ? 'parent' : 'null'}${inlineBlock}
    });
  }
  return { results: results, total: total };
})(${offset}, ${limit})`;
}
