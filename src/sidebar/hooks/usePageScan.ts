import { useState, useCallback, useRef } from 'react';
import type { ScanStatus, ScanElementData, ScanGroup, ScanProgress } from '../types.ts';
import { SCAN_CHUNK_SIZE } from '../../rules/scan-constants.ts';
import { groupByRule } from '../utils/group-by-rule.ts';
import { buildScanScript } from './build-scan-script.ts';
import { isChunkResult } from './scan-validation.ts';

// Sidebar uses chunked pagination with a higher cap than the e2e single-pass scan.
const MAX_ELEMENTS = 10_000;

export function usePageScan() {
  const [groups, setGroups] = useState<ScanGroup[]>([]);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<ScanProgress>({ scanned: 0, total: 0 });
  const scanIdRef = useRef(0);

  const scan = useCallback(() => {
    const scanId = scanIdRef.current + 1;
    scanIdRef.current = scanId;
    setStatus('scanning');
    setError(null);
    setGroups([]);
    setProgress({ scanned: 0, total: 0 });

    const allElements: ScanElementData[] = [];

    function processChunk(offset: number) {
      if (scanId !== scanIdRef.current) return;

      const limit = Math.min(SCAN_CHUNK_SIZE, MAX_ELEMENTS - offset);
      if (limit <= 0) {
        setGroups(groupByRule(allElements));
        setStatus('done');
        return;
      }

      chrome.devtools.inspectedWindow.eval(
        buildScanScript(offset, limit),
        (result: unknown, exceptionInfo) => {
          if (scanId !== scanIdRef.current) return;

          if (exceptionInfo) {
            setError('Scan failed');
            setStatus('error');
            return;
          }

          if (!isChunkResult(result)) {
            setError('Invalid scan result');
            setStatus('error');
            return;
          }

          allElements.push(...result.results);
          const total = Math.min(result.total, MAX_ELEMENTS);
          const nextOffset = offset + SCAN_CHUNK_SIZE;
          setProgress({ scanned: Math.min(nextOffset, total), total });

          if (nextOffset >= total) {
            setGroups(groupByRule(allElements));
            setStatus('done');
          } else {
            processChunk(nextOffset);
          }
        },
      );
    }

    processChunk(0);
  }, []);

  const clear = useCallback(() => {
    scanIdRef.current += 1;
    setGroups([]);
    setStatus('idle');
    setError(null);
    setProgress({ scanned: 0, total: 0 });
  }, []);

  return { groups, status, error, progress, scan, clear };
}
