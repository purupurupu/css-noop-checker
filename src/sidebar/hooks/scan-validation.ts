import { getAllRequiredParentProperties, getAllRequiredProperties } from '../../rules/registry.ts';
import { isValidStyles } from '../../rules/validation.ts';
import type { ScanElementData } from '../types.ts';

export function isScanElementData(v: unknown): v is ScanElementData {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (typeof o['index'] !== 'number') return false;
  if (typeof o['selector'] !== 'string') return false;
  if (typeof o['tagName'] !== 'string') return false;
  if (!Array.isArray(o['classList'])) return false;
  if (!isValidStyles(o['computedStyles'], getAllRequiredProperties())) return false;

  const parent = o['parent'];
  if (parent !== null) {
    if (typeof parent !== 'object' || parent === undefined) return false;
    const p = parent as Record<string, unknown>;
    if (!isValidStyles(p['computedStyles'], getAllRequiredParentProperties())) return false;
  }

  return true;
}

export interface ChunkResult {
  results: ScanElementData[];
  total: number;
}

export function isChunkResult(v: unknown): v is ChunkResult {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (!Array.isArray(o['results']) || typeof o['total'] !== 'number') return false;
  return (o['results'] as unknown[]).every(isScanElementData);
}
