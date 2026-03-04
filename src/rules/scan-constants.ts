/**
 * Tags to skip during page scanning — these elements never have meaningful
 * CSS no-op violations because they are non-rendered or have no box.
 *
 * Shared between the extension sidebar scan script and the e2e/MCP scan helpers.
 * Each consumer serializes these into its own eval context.
 */
export const SKIP_TAGS = [
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEMPLATE',
  'BASE',
  'LINK',
  'META',
  'HEAD',
  'BR',
  'TITLE',
] as const;

/** Maximum elements for single-pass scans (e2e/MCP). The sidebar uses chunked pagination with its own cap in usePageScan.ts. */
export const MAX_SCAN_ELEMENTS = 5_000;

/** Number of elements to process per eval() chunk in the sidebar scan. */
export const SCAN_CHUNK_SIZE = 200;
