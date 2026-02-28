import type { ScanGroup } from '../types.ts';
import { CopyJsonButton } from './CopyJsonButton.tsx';

interface ScanSummaryBarProps {
  totalViolations: number;
  totalElements: number;
  ruleCount: number;
  groups: ScanGroup[];
  onClear: () => void;
}

export function ScanSummaryBar({
  totalViolations,
  totalElements,
  ruleCount,
  groups,
  onClear,
}: ScanSummaryBarProps) {
  return (
    <div className="scan-summary">
      <span>
        <strong className="scan-summary__count">{totalViolations}</strong>
        {' violations \u00b7 '}
        {totalElements} elements{' \u00b7 '}
        {ruleCount} rules
      </span>
      <div className="scan-summary__actions">
        <CopyJsonButton data={groups} />
        <button
          className="scan-summary__clear"
          onClick={onClear}
          type="button"
          aria-label="Clear results"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
