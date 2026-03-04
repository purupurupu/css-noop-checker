// Trigger rule registration side effects so the registry is populated.
import '../../src/rules/engine.ts';

import type { Locator, Page } from '@playwright/test';
import type { ElementData } from '../../src/rules/types.ts';
import {
  getAllRequiredInlineProperties,
  getAllRequiredParentProperties,
  getAllRequiredProperties,
} from '../../src/rules/registry.ts';
import { isElementData } from '../../src/rules/validation.ts';
import { MAX_SCAN_ELEMENTS, SKIP_TAGS } from '../../src/rules/scan-constants.ts';

/**
 * Browser-side function serialized into page.evaluate() calls.
 * Extracts computed styles for an element and optionally its parent.
 */
function buildExtractFn() {
  return (
    el: Element,
    {
      properties,
      parentProperties,
      inlineProperties,
    }: { properties: string[]; parentProperties: string[]; inlineProperties: string[] },
  ) => {
    // CSSStyleDeclaration supports camelCase bracket access at runtime,
    // but TypeScript's type definition lacks a string index signature.
    function readStyleProp(cs: CSSStyleDeclaration, prop: string): string | undefined {
      const val: unknown = Reflect.get(cs, prop);
      return typeof val === 'string' ? val : undefined;
    }

    const cs = getComputedStyle(el);
    const computedStyles: Record<string, string> = {};
    for (const prop of properties) {
      const value = readStyleProp(cs, prop);
      if (value === undefined) {
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
        const value = readStyleProp(pcs, prop);
        if (value === undefined) {
          throw new Error(
            `getComputedStyle returned no value for parent property "${prop}" on <${el.parentElement.tagName.toLowerCase()}>. ` +
              `Check that the property name is correct in the rule's requiredParentProperties.`,
          );
        }
        parentStyles[prop] = value;
      }
      parent = { computedStyles: parentStyles };
    }

    let inlineStyles: Record<string, string> | undefined;
    if (inlineProperties.length > 0) {
      const htmlEl = el as HTMLElement | SVGElement;
      inlineStyles = {};
      for (const prop of inlineProperties) {
        const value = readStyleProp(htmlEl.style, prop);
        inlineStyles[prop] = value ?? '';
      }
    }

    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      classList: Array.from(el.classList),
      computedStyles,
      ...(inlineStyles !== undefined ? { inlineStyles } : {}),
      parent,
    };
  };
}

/**
 * Build an ElementData object from real browser getComputedStyle() —
 * analogous to what the extension does via chrome.devtools eval,
 * but using Playwright's evaluate API instead.
 */
export async function extractElementData(locator: Locator): Promise<ElementData> {
  const properties = getAllRequiredProperties();
  const parentProperties = getAllRequiredParentProperties();
  const inlineProperties = getAllRequiredInlineProperties();

  const result = await locator.evaluate(buildExtractFn(), {
    properties,
    parentProperties,
    inlineProperties,
  });

  if (!isElementData(result)) {
    throw new Error(`Extracted data failed ElementData validation: ${JSON.stringify(result)}`);
  }

  return result;
}

/**
 * Extract ElementData for a single element matched by a CSS selector.
 * Returns null if the selector matches no elements.
 */
export async function extractElementBySelector(
  page: Page,
  selector: string,
): Promise<ElementData | null> {
  const properties = getAllRequiredProperties();
  const parentProperties = getAllRequiredParentProperties();
  const inlineProperties = getAllRequiredInlineProperties();

  const locator = page.locator(selector).first();
  const count = await locator.count();
  if (count === 0) return null;

  const result = await locator.evaluate(buildExtractFn(), {
    properties,
    parentProperties,
    inlineProperties,
  });

  if (!isElementData(result)) {
    throw new Error(`Extracted data failed ElementData validation: ${JSON.stringify(result)}`);
  }

  return result;
}

export interface ScannedElement extends ElementData {
  /** Position in document.querySelectorAll('*') — stable programmatic reference. */
  index: number;
  /** Human-readable CSS selector (display hint; may not be globally unique). */
  selector: string;
}

export interface ScanResult {
  elements: ScannedElement[];
  totalOnPage: number;
  truncated: boolean;
}

/**
 * Scan all elements on a page, extracting computed styles for each.
 * Caps at MAX_SCAN_ELEMENTS to avoid hanging on large pages.
 *
 * Intentional divergences from src/sidebar/hooks/build-scan-script.ts:
 * - Does NOT filter `display: none` elements (e2e tests need to verify all states)
 * - Scopes to `document.querySelectorAll('*')` (includes <head> descendants)
 * - Uses `nth-of-type` + all classes for selector (more precise for debugging)
 * - Single-pass scan (no chunking needed in Playwright's evaluate context)
 */
export async function scanAllElements(page: Page): Promise<ScanResult> {
  const properties = getAllRequiredProperties();
  const parentProperties = getAllRequiredParentProperties();
  const inlineProperties = getAllRequiredInlineProperties();

  // Extraction logic mirrors buildExtractFn() but runs inline within the
  // page.evaluate() loop to avoid per-element serialization overhead.
  const results = await page.evaluate(
    ({ properties, parentProperties, inlineProperties, maxElements, skipTags }) => {
      // CSSStyleDeclaration supports camelCase bracket access at runtime,
      // but TypeScript's type definition lacks a string index signature.
      function readStyleProp(cs: CSSStyleDeclaration, prop: string): string | undefined {
        const val: unknown = Reflect.get(cs, prop);
        return typeof val === 'string' ? val : undefined;
      }

      const SKIP_TAGS = new Set(skipTags);

      const allElements = document.querySelectorAll('*');
      const total = allElements.length;
      const scanned: {
        index: number;
        selector: string;
        tagName: string;
        id: string;
        classList: string[];
        computedStyles: Record<string, string>;
        inlineStyles?: Record<string, string>;
        parent: { computedStyles: Record<string, string> } | null;
      }[] = [];

      for (let i = 0; i < total && scanned.length < maxElements; i++) {
        const el = allElements[i];
        if (SKIP_TAGS.has(el.tagName)) continue;

        const cs = getComputedStyle(el);
        const computedStyles: Record<string, string> = {};
        for (const prop of properties) {
          const value = readStyleProp(cs, prop);
          if (value === undefined) {
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
            const value = readStyleProp(pcs, prop);
            if (value === undefined) {
              throw new Error(
                `getComputedStyle returned no value for parent property "${prop}" on <${el.parentElement.tagName.toLowerCase()}>. ` +
                  `Check that the property name is correct in the rule's requiredParentProperties.`,
              );
            }
            parentStyles[prop] = value;
          }
          parent = { computedStyles: parentStyles };
        }

        let inlineStyles: Record<string, string> | undefined;
        if (inlineProperties.length > 0) {
          const htmlEl = el as HTMLElement | SVGElement;
          inlineStyles = {};
          for (const prop of inlineProperties) {
            const value = readStyleProp(htmlEl.style, prop);
            inlineStyles[prop] = value ?? '';
          }
        }

        // Build a best-effort human-readable selector (may not be globally unique)
        let selector = el.tagName.toLowerCase();
        if (el.id) {
          selector += `#${el.id}`;
        } else if (el.parentElement) {
          const siblings = el.parentElement.children;
          const sameTag = Array.from(siblings).filter((s) => s.tagName === el.tagName);
          if (sameTag.length > 1) {
            const nth = sameTag.indexOf(el) + 1;
            selector += `:nth-of-type(${nth})`;
          }
          for (const cls of el.classList) selector += `.${cls}`;
        }

        scanned.push({
          index: i,
          selector,
          tagName: el.tagName.toLowerCase(),
          id: el.id || '',
          classList: Array.from(el.classList),
          computedStyles,
          ...(inlineStyles !== undefined ? { inlineStyles } : {}),
          parent,
        });
      }

      return { elements: scanned, totalOnPage: total, truncated: scanned.length >= maxElements };
    },
    {
      properties,
      parentProperties,
      inlineProperties,
      maxElements: MAX_SCAN_ELEMENTS,
      skipTags: [...SKIP_TAGS] as string[],
    },
  );

  return results;
}
