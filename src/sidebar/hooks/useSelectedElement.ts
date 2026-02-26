import { useState, useEffect, useCallback, useRef } from 'react';
import type { ElementData } from '../../rules/types.ts';
import { isElementData } from '../../rules/validation.ts';
import { buildEvalScript } from './build-eval-script.ts';

export type AnalysisStatus = 'no-selection' | 'analyzing' | 'ready' | 'error';

export { isElementData };

let cachedEvalScript: string | undefined;
function getEvalScript(): string {
  return (cachedEvalScript ??= buildEvalScript());
}

const DEBOUNCE_MS = 150;

export function useSelectedElement() {
  const [data, setData] = useState<ElementData | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('no-selection');
  const requestIdRef = useRef(0);

  const evaluate = useCallback(() => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setStatus('analyzing');
    chrome.devtools.inspectedWindow.eval(getEvalScript(), (result: unknown, exceptionInfo) => {
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
