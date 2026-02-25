import { getAllRequiredParentProperties, getAllRequiredProperties } from './registry.ts';
import type { ElementData } from './types.ts';

function isValidStyles(obj: unknown, requiredKeys: string[]): boolean {
  if (typeof obj !== 'object' || obj === null) return false;
  const styles = obj as Record<string, unknown>;
  return requiredKeys.every((key) => typeof styles[key] === 'string');
}

export function isElementData(v: unknown): v is ElementData {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (typeof o['tagName'] !== 'string') return false;
  if (!Array.isArray(o['classList'])) return false;
  if (!isValidStyles(o['computedStyles'], getAllRequiredProperties())) return false;

  // parent: null (no parent element) or { computedStyles: { ... } }
  const parent = o['parent'];
  if (parent !== null) {
    if (typeof parent !== 'object') return false;
    const p = parent as Record<string, unknown>;
    if (!isValidStyles(p['computedStyles'], getAllRequiredParentProperties())) return false;
  }

  return true;
}
