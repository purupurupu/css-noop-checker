import { useCallback, useEffect, useRef, useState } from 'react';

import type { Warning } from '../../rules/types.ts';
import type { ScanGroup } from '../types.ts';

type CopyStatus = 'idle' | 'copied' | 'failed';

interface CopyJsonButtonProps {
  data: Warning[] | ScanGroup[];
}

export function CopyJsonButton({ data }: CopyJsonButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(() => {
    let json: string;
    try {
      json = JSON.stringify(data, null, 2);
    } catch {
      setStatus('failed');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setStatus('idle'), 1500);
      return;
    }

    navigator.clipboard.writeText(json).then(
      () => {
        setStatus('copied');
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setStatus('idle'), 1500);
      },
      (err) => {
        console.warn('Clipboard write failed:', err);
        setStatus('failed');
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setStatus('idle'), 1500);
      },
    );
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
