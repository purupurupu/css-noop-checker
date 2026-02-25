import { getAllRequiredProperties } from './registry.ts';

/** Generate the computedStyles object literal for eval scripts */
export function generateStyleExtractFragment(csVar = 'cs'): string {
  return getAllRequiredProperties()
    .map((prop) => `${prop}: ${csVar}.${prop}`)
    .join(',\n        ');
}
