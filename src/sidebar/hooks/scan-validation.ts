import { getAllRequiredParentProperties, getAllRequiredProperties } from '../../rules/registry.ts';
import type { ScanElementData } from '../types.ts';

export function isScanElementData(v: unknown): v is ScanElementData {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (typeof o['index'] !== 'number') return false;
  if (typeof o['selector'] !== 'string') return false;
  if (typeof o['tagName'] !== 'string') return false;
  if (!Array.isArray(o['classList'])) return false;
  const cs = o['computedStyles'];
  if (typeof cs !== 'object' || cs === null) return false;
  const styles = cs as Record<string, unknown>;
  if (!getAllRequiredProperties().every((key) => typeof styles[key] === 'string')) return false;

  const parent = o['parent'];
  if (parent !== null) {
    if (typeof parent !== 'object' || parent === undefined) return false;
    const p = parent as Record<string, unknown>;
    const pcs = p['computedStyles'];
    if (typeof pcs !== 'object' || pcs === null) return false;
    const parentStyles = pcs as Record<string, unknown>;
    if (!getAllRequiredParentProperties().every((key) => typeof parentStyles[key] === 'string'))
      return false;
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
