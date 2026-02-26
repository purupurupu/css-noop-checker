// Trigger rule registration side effects so the registry is populated.
import '../../src/rules/engine.ts';

import type { Locator, Page } from '@playwright/test';
import type { ElementData } from '../../src/rules/types.ts';
import {
  getAllRequiredParentProperties,
  getAllRequiredProperties,
} from '../../src/rules/registry.ts';
import { isElementData } from '../../src/rules/validation.ts';

/**
 * Extract ElementData from a Playwright Locator by running getComputedStyle()
 * in the browser — mirrors what the real extension does via chrome.devtools eval.
 */
export async function extractElementData(page: Page, locator: Locator): Promise<ElementData> {
  const properties = getAllRequiredProperties();
  const parentProperties = getAllRequiredParentProperties();

  const result = await locator.evaluate(
    (el, { properties, parentProperties }) => {
      const cs = getComputedStyle(el);
      const computedStyles: Record<string, string> = {};
      for (const prop of properties) {
        computedStyles[prop] =
          cs.getPropertyValue(prop) || (cs as unknown as Record<string, string>)[prop] || '';
      }

      let parent: { computedStyles: Record<string, string> } | null = null;
      if (parentProperties.length > 0 && el.parentElement) {
        const pcs = getComputedStyle(el.parentElement);
        const parentStyles: Record<string, string> = {};
        for (const prop of parentProperties) {
          parentStyles[prop] =
            pcs.getPropertyValue(prop) || (pcs as unknown as Record<string, string>)[prop] || '';
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
