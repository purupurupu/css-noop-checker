// Trigger rule registration side effects so the registry is populated.
import '../../src/rules/engine.ts';

import type { Locator } from '@playwright/test';
import type { ElementData } from '../../src/rules/types.ts';
import {
  getAllRequiredParentProperties,
  getAllRequiredProperties,
} from '../../src/rules/registry.ts';
import { isElementData } from '../../src/rules/validation.ts';

/**
 * Build an ElementData object from real browser getComputedStyle() —
 * analogous to what the extension does via chrome.devtools eval,
 * but using Playwright's evaluate API instead.
 */
export async function extractElementData(locator: Locator): Promise<ElementData> {
  const properties = getAllRequiredProperties();
  const parentProperties = getAllRequiredParentProperties();

  const result = await locator.evaluate(
    (el, { properties, parentProperties }) => {
      const cs = getComputedStyle(el);
      const computedStyles: Record<string, string> = {};
      for (const prop of properties) {
        const value = (cs as unknown as Record<string, string>)[prop];
        if (value === undefined || value === null) {
          throw new Error(
            `getComputedStyle returned no value for property "${prop}" on <${el.tagName.toLowerCase()}>. ` +
              `Check that the property name is correct in the rule's requiredProperties.`,
          );
        }
        computedStyles[prop] = value;
      }

      let parent: { computedStyles: Record<string, string> } | null = null;
      if (parentProperties.length > 0 && el.parentElement) {
        const pcs = getComputedStyle(el.parentElement);
        const parentStyles: Record<string, string> = {};
        for (const prop of parentProperties) {
          const value = (pcs as unknown as Record<string, string>)[prop];
          if (value === undefined || value === null) {
            throw new Error(
              `getComputedStyle returned no value for parent property "${prop}" on <${el.parentElement.tagName.toLowerCase()}>. ` +
                `Check that the property name is correct in the rule's requiredParentProperties.`,
            );
          }
          parentStyles[prop] = value;
        }
        parent = { computedStyles: parentStyles };
      }

      return {
        tagName: el.tagName.toLowerCase(),
        id: el.id || '',
        classList: Array.from(el.classList),
        computedStyles,
        parent,
      };
    },
    { properties, parentProperties },
  );

  if (!isElementData(result)) {
    throw new Error(`Extracted data failed ElementData validation: ${JSON.stringify(result)}`);
  }

  return result;
}
