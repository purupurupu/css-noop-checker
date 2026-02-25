import { getAllRequiredParentProperties, getAllRequiredProperties } from './registry.ts';

/** Generate the computedStyles object literal for eval scripts */
export function generateStyleExtractFragment(csVar = 'cs'): string {
  return getAllRequiredProperties()
    .map((prop) => `${prop}: ${csVar}.${prop}`)
    .join(',\n        ');
}

/** Generate the parent computedStyles object literal, or null if no rules need parent data */
export function generateParentStyleExtractFragment(csVar = 'pcs'): string | null {
  const props = getAllRequiredParentProperties();
  if (props.length === 0) return null;
  return props.map((prop) => `${prop}: ${csVar}.${prop}`).join(',\n            ');
}
