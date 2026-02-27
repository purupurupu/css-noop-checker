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
  }, []);

  return (
    <div className="scan-detail">
      <button ref={backRef} className="scan-detail__back" onClick={onBack} type="button">
        {'\u2190'} Back to results
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
        {violation.warnings.map((w) => (
          <WarningCard key={`${w.ruleId}-${w.property}`} warning={w} />
        ))}
      </div>
    </div>
  );
}
