import type { Warning } from '../../rules/types.ts';
import type { AnalysisStatus } from '../hooks/useSelectedElement.ts';
import { WarningCard } from './WarningCard.tsx';

interface WarningListProps {
  warnings: Warning[];
  status: AnalysisStatus;
}

export function WarningList({ warnings, status }: WarningListProps) {
  if (status === 'no-selection' || status === 'error') {
    return null;
  }

  if (status === 'analyzing') {
    return <div className="warning-list__message">Analyzing...</div>;
  }

  if (warnings.length === 0) {
    return (
      <div className="warning-list__message">
        No issues detected (MVP rules).
      </div>
    );
  }

  return (
    <div className="warning-list">
      {warnings.map((w) => (
        <WarningCard key={`${w.ruleId}-${w.property}`} warning={w} />
      ))}
    </div>
  );
}
