import type { Warning } from '../../rules/types.ts';
import type { AnalysisStatus } from '../hooks/useSelectedElement.ts';
import { WarningCard } from './WarningCard.tsx';

interface WarningListProps {
  warnings: Warning[];
  status: AnalysisStatus;
}

const summaryTextByStatus: Record<string, string> = {
  error: 'Analysis failed. Try selecting another element.',
  analyzing: 'Analyzing...',
};

export function WarningList({ warnings, status }: WarningListProps) {
  const isNoSelection = status === 'no-selection';
  const showCards = status === 'ready' && warnings.length > 0;

  const summaryText = isNoSelection
    ? ''
    : (summaryTextByStatus[status] ??
      (warnings.length === 0
        ? 'No issues detected.'
        : `${warnings.length} issue${warnings.length === 1 ? '' : 's'} detected.`));

  const messageClassName = [
    'warning-list__message',
    status === 'error' && 'warning-list__message--error',
    (isNoSelection || showCards) && 'warning-list__message--sr-only',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <div role="status" aria-live="polite" className="warning-list__live-region">
        <div className={messageClassName}>{summaryText}</div>
      </div>
      {showCards && (
        <div className="warning-list">
          {warnings.map((w) => (
            <WarningCard key={`${w.ruleId}-${w.property}`} warning={w} />
          ))}
        </div>
      )}
    </>
  );
}
