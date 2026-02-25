import { useState, useEffect, useCallback, useRef } from 'react';
import type { ElementData } from '../../rules/types.ts';

export type AnalysisStatus = 'no-selection' | 'analyzing' | 'ready' | 'error';

const COMPUTED_STYLE_KEYS = [
  'display',
  'width',
  'height',
  'gap',
  'rowGap',
  'columnGap',
  'alignItems',
  'justifyContent',
  'placeItems',
  'placeContent',
  'columnCount',
] as const;

export function isElementData(v: unknown): v is ElementData {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  if (typeof o['tagName'] !== 'string') return false;
  if (!Array.isArray(o['classList'])) return false;
  const cs = o['computedStyles'];
  if (typeof cs !== 'object' || cs === null) return false;
  const styles = cs as Record<string, unknown>;
  return COMPUTED_STYLE_KEYS.every((key) => typeof styles[key] === 'string');
}

/** Runs in the inspected page's context via eval(). Uses var for broad compat. */
const EVAL_SCRIPT = `
(function() {
  var el = $0;
  if (!el) return null;
  var cs = getComputedStyle(el);
  return {
    tagName: el.tagName.toLowerCase(),
    id: el.id || '',
    classList: Array.from(el.classList),
    computedStyles: {
      display: cs.display,
      width: cs.width,
      height: cs.height,
      gap: cs.gap,
      rowGap: cs.rowGap,
      columnGap: cs.columnGap,
      alignItems: cs.alignItems,
      justifyContent: cs.justifyContent,
      placeItems: cs.placeItems,
      placeContent: cs.placeContent,
      columnCount: cs.columnCount
    }
  };
})()
`;

const DEBOUNCE_MS = 150;

export function useSelectedElement() {
  const [data, setData] = useState<ElementData | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('no-selection');
  const requestIdRef = useRef(0);

  const evaluate = useCallback(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setStatus('analyzing');
    chrome.devtools.inspectedWindow.eval(EVAL_SCRIPT, (result: unknown, exceptionInfo) => {
      // Ignore stale eval callbacks from older selections.
      if (requestId !== requestIdRef.current) return;

      if (exceptionInfo || result === null) {
        setData(null);
        setStatus(exceptionInfo ? 'error' : 'no-selection');
        return;
      }
      if (!isElementData(result)) {
        setData(null);
        setStatus('error');
        return;
      }
      setData(result);
      setStatus('ready');
    });
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const debouncedEvaluate = () => {
      clearTimeout(timer);
      timer = setTimeout(evaluate, DEBOUNCE_MS);
    };

    // Initial evaluation via debounce (avoids sync setState in effect)
    debouncedEvaluate();

    chrome.devtools.panels.elements.onSelectionChanged.addListener(debouncedEvaluate);
    return () => {
      clearTimeout(timer);
      requestIdRef.current += 1;
      chrome.devtools.panels.elements.onSelectionChanged.removeListener(debouncedEvaluate);
    };
  }, [evaluate]);

  return { data, status };
}
