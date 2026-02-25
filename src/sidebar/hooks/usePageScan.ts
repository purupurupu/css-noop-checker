import { useState, useCallback, useRef } from 'react';
import { analyzeElement } from '../../rules/engine.ts';
import { getAllRequiredProperties } from '../../rules/registry.ts';
import { generateStyleExtractFragment } from '../../rules/css-properties.ts';
import type { ElementData, RuleId, Warning } from '../../rules/types.ts';
import type {
  ScanStatus,
  ScanElementData,
  ScanGroup,
  ScanProgress,
  ScanViolation,
} from '../types.ts';

const CHUNK_SIZE = 200;
const MAX_ELEMENTS = 10_000;

function makeScanScript(offset: number, limit: number): string {
  return `(function(offset, limit) {
  var SKIP = {SCRIPT:1,STYLE:1,NOSCRIPT:1,TEMPLATE:1,BASE:1,LINK:1,META:1};
  if (!document.body) return { results: [], total: 0 };
  var els = document.body.querySelectorAll('*');
  var total = els.length;
  var end = Math.min(offset + limit, total);
  var results = [];
  for (var i = offset; i < end; i++) {
    var el = els[i];
    if (SKIP[el.tagName]) continue;
    var cs = getComputedStyle(el);
    if (cs.display === 'none') continue;
    var sel = el.tagName.toLowerCase();
    if (el.id) sel += '#' + CSS.escape(el.id);
    var cl = el.classList;
    for (var j = 0; j < cl.length && j < 3; j++) sel += '.' + CSS.escape(cl[j]);
    results.push({
      index: i,
      selector: sel,
      tagName: el.tagName.toLowerCase(),
      id: el.id || '',
      classList: Array.from(el.classList),
      computedStyles: {
        ${generateStyleExtractFragment()}
      }
    });
  }
  return { results: results, total: total };
})(${offset}, ${limit})`;
}

function makeInspectScript(index: number): string {
  return `(function() {
  var els = document.body.querySelectorAll('*');
  var el = els[${index}];
  if (el) { inspect(el); return true; }
  return false;
})()`;
}

function isScanElementData(v: unknown): v is ScanElementData {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (typeof o['index'] !== 'number') return false;
  if (typeof o['selector'] !== 'string') return false;
  if (typeof o['tagName'] !== 'string') return false;
  if (!Array.isArray(o['classList'])) return false;
  const cs = o['computedStyles'];
  if (typeof cs !== 'object' || cs === null) return false;
  const styles = cs as Record<string, unknown>;
  return getAllRequiredProperties().every((key) => typeof styles[key] === 'string');
}

interface ChunkResult {
  results: ScanElementData[];
  total: number;
}

function isChunkResult(v: unknown): v is ChunkResult {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (!Array.isArray(o['results']) || typeof o['total'] !== 'number') return false;
  return (o['results'] as unknown[]).every(isScanElementData);
}

export function groupByRule(elements: ScanElementData[]): ScanGroup[] {
  const map = new Map<RuleId, ScanViolation[]>();

  for (const el of elements) {
    const elementData: ElementData = {
      tagName: el.tagName,
      id: el.id,
      classList: el.classList,
      computedStyles: el.computedStyles,
    };
    const warnings = analyzeElement(elementData);
    if (warnings.length === 0) continue;

    const byRule = new Map<RuleId, Warning[]>();
    for (const w of warnings) {
      const existing = byRule.get(w.ruleId) ?? [];
      existing.push(w);
      byRule.set(w.ruleId, existing);
    }

    for (const [ruleId, ruleWarnings] of byRule) {
      const violations = map.get(ruleId) ?? [];
      violations.push({
        index: el.index,
        selector: el.selector,
        warnings: ruleWarnings,
      });
      map.set(ruleId, violations);
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ruleId, violations]) => ({ ruleId, violations }));
}

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

      const limit = Math.min(CHUNK_SIZE, MAX_ELEMENTS - offset);
      if (limit <= 0) {
        setGroups(groupByRule(allElements));
        setStatus('done');
        return;
      }

      chrome.devtools.inspectedWindow.eval(
        makeScanScript(offset, limit),
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
          const nextOffset = offset + CHUNK_SIZE;
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

  const [inspectError, setInspectError] = useState<string | null>(null);

  const inspectElement = useCallback((index: number) => {
    setInspectError(null);
    chrome.devtools.inspectedWindow.eval(makeInspectScript(index), (result: unknown) => {
      if (result === false) {
        setInspectError('Element not found — the page may have changed since the scan.');
        setTimeout(() => setInspectError(null), 3000);
      }
    });
  }, []);

  const clear = useCallback(() => {
    scanIdRef.current += 1;
    setGroups([]);
    setStatus('idle');
    setError(null);
    setProgress({ scanned: 0, total: 0 });
  }, []);

  return { groups, status, error, inspectError, progress, scan, inspectElement, clear };
}
