interface ScanSummaryBarProps {
  totalViolations: number;
  totalElements: number;
  ruleCount: number;
  onClear: () => void;
}

export function ScanSummaryBar({
  totalViolations,
  totalElements,
  ruleCount,
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
      <button
        className="scan-summary__clear"
        onClick={onClear}
        type="button"
        aria-label="Clear results"
      >
        &times;
      </button>
    </div>
  );
}
