import { isRecord, isElementData } from '../../rules/validation.ts';
import type { ScanElementData } from '../types.ts';

export function isScanElementData(v: unknown): v is ScanElementData {
  if (!isRecord(v)) return false;
  if (typeof v['index'] !== 'number') return false;
  if (typeof v['selector'] !== 'string') return false;
  return isElementData(v);
}

export interface ChunkResult {
  results: ScanElementData[];
  total: number;
}

export function isChunkResult(v: unknown): v is ChunkResult {
  if (!isRecord(v)) return false;
  const results = v['results'];
  if (!Array.isArray(results) || typeof v['total'] !== 'number') return false;
  return results.every(isScanElementData);
}
