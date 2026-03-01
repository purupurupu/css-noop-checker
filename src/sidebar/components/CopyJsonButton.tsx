import { useCallback, useEffect, useRef, useState } from 'react';

import type { Warning } from '../../rules/types.ts';
import type { ScanGroup } from '../types.ts';

type CopyStatus = 'idle' | 'copied' | 'failed';

interface CopyJsonButtonProps {
  data: Warning[] | ScanGroup[];
}

export function CopyJsonButton({ data }: CopyJsonButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    let json: string;
    try {
      json = JSON.stringify(data, null, 2);
    } catch (err) {
      console.warn('Failed to serialize data as JSON:', err);
      setStatus('failed');
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus('idle'), 1500);
      return;
    }

    // Clipboard API is unavailable in DevTools sidebar panels (no document focus),
    // so fall back to execCommand('copy') via a temporary textarea.
    let success = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(json);
        success = true;
      } catch {
        // Expected to fail in DevTools sidebar — fall through to execCommand
      }
    }
    if (!success) {
      const textarea = document.createElement('textarea');
      textarea.value = json;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      success = document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    if (success) {
      setStatus('copied');
    } else {
      setStatus('failed');
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('idle'), 1500);
  }, [data]);

  const label = status === 'copied' ? 'Copied!' : status === 'failed' ? 'Failed' : 'Copy JSON';
  const ariaLabel =
    status === 'copied'
      ? 'JSON copied to clipboard'
      : status === 'failed'
        ? 'Failed to copy JSON'
        : 'Copy JSON to clipboard';

  return (
    <button
      className="panel-action-button"
      onClick={handleCopy}
      type="button"
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}
