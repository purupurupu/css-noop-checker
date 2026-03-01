import { getAllRequiredParentProperties, getAllRequiredProperties } from './registry.ts';
import type { ElementData } from './types.ts';

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

export function isValidStyles(obj: unknown, requiredKeys: string[]): boolean {
  if (!isRecord(obj)) return false;
  return requiredKeys.every((key) => typeof obj[key] === 'string');
}

export function isElementData(v: unknown): v is ElementData {
  if (!isRecord(v)) return false;
  if (typeof v['tagName'] !== 'string') return false;
  if (!Array.isArray(v['classList'])) return false;
  if (!isValidStyles(v['computedStyles'], getAllRequiredProperties())) return false;

  // parent: null (no parent element) or { computedStyles: { ... } }
  const parent = v['parent'];
  if (parent !== null) {
    if (!isRecord(parent)) return false;
    if (!isValidStyles(parent['computedStyles'], getAllRequiredParentProperties())) return false;
  }

  return true;
}
