import { useCallback, useEffect, useRef, useState } from 'react';

type CopyStatus = 'idle' | 'copied' | 'failed';

interface CopyJsonButtonProps {
  data: unknown;
}

export function CopyJsonButton({ data }: CopyJsonButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // M3: Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleCopy = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json).then(
      () => {
        setStatus('copied');
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setStatus('idle'), 1500);
      },
      // M2: Handle clipboard failure
      () => {
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
