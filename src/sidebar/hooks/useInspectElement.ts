import { useState, useCallback, useRef, useEffect } from 'react';

function makeInspectScript(index: number): string {
  return `(function() {
  var els = document.body.querySelectorAll('*');
  var el = els[${index}];
  if (el) { inspect(el); return true; }
  return false;
})()`;
}

export function useInspectElement() {
  const [inspectError, setInspectError] = useState<string | null>(null);
  const inspectTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const inspectElement = useCallback((index: number) => {
    clearTimeout(inspectTimerRef.current);
    setInspectError(null);
    chrome.devtools.inspectedWindow.eval(makeInspectScript(index), (result: unknown) => {
      if (result === false) {
        setInspectError('Element not found — the page may have changed since the scan.');
        inspectTimerRef.current = setTimeout(() => setInspectError(null), 3000);
      }
    });
  }, []);

  useEffect(() => {
    return () => clearTimeout(inspectTimerRef.current);
  }, []);

  return { inspectElement, inspectError };
}
