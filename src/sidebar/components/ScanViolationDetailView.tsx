import { useEffect, useRef } from 'react';
import type { ScanViolation } from '../types.ts';
import { WarningCard } from './WarningCard.tsx';

interface ScanViolationDetailViewProps {
  violation: ScanViolation;
  inspectError: string | null;
  onBack: () => void;
}

export function ScanViolationDetailView({
  violation,
  inspectError,
  onBack,
}: ScanViolationDetailViewProps) {
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backRef.current?.focus();
  }, [violation.index]);

  return (
    <div className="scan-detail" role="region" aria-label="Violation detail">
      <button ref={backRef} className="scan-detail__back" onClick={onBack} type="button">
        &larr; Back to results
      </button>
      <code className="scan-detail__selector" title={violation.selector}>
        {violation.selector}
      </code>
      {inspectError && (
        <div className="scan-inspect-error" role="alert">
          {inspectError}
        </div>
      )}
      <div className="warning-list">
        {violation.warnings.map((w, i) => (
          <WarningCard key={`${w.ruleId}-${w.property}-${i}`} warning={w} />
        ))}
      </div>
    </div>
  );
}
