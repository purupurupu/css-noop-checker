import { getAllRequiredProperties } from './registry.ts';
import type { ElementData } from './types.ts';

export function isElementData(v: unknown): v is ElementData {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (typeof o['tagName'] !== 'string') return false;
  if (!Array.isArray(o['classList'])) return false;
  const cs = o['computedStyles'];
  if (typeof cs !== 'object' || cs === null) return false;
  const styles = cs as Record<string, unknown>;
  return getAllRequiredProperties().every((key) => typeof styles[key] === 'string');
}
