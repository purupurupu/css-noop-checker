import type { ScanGroup, ScanProgress, ScanStatus } from '../types.ts';
import { ScanSummaryBar } from './ScanSummaryBar.tsx';
import { ScanRuleGroup } from './ScanRuleGroup.tsx';

interface ScanResultsPanelProps {
  groups: ScanGroup[];
  status: ScanStatus;
  error: string | null;
  progress: ScanProgress;
  onInspect: (index: number) => void;
  onClear: () => void;
}

export function ScanResultsPanel({
  groups,
  status,
  error,
  progress,
  onInspect,
  onClear,
}: ScanResultsPanelProps) {
  if (status === 'scanning') {
    const text =
      progress.total > 0
        ? `Scanning\u2026 (${progress.scanned}/${progress.total} elements)`
        : 'Scanning\u2026';
    return <div className="scan-message">{text}</div>;
  }

  if (status === 'error') {
    return (
      <div className="scan-message scan-message--error">
        <p>{error ?? 'Scan failed'}</p>
        <button className="scan-message__back" onClick={onClear} type="button">
          Back
        </button>
      </div>
    );
  }

  if (status === 'done' && groups.length === 0) {
    return (
      <div className="scan-message">
        <p>No violations found.</p>
        <button className="scan-message__back" onClick={onClear} type="button">
          Back
        </button>
      </div>
    );
  }

  if (status !== 'done') return null;

  const totalViolations = groups.reduce((sum, g) => sum + g.violations.length, 0);
  const uniqueElements = new Set(groups.flatMap((g) => g.violations.map((v) => v.index))).size;

  return (
    <div className="scan-results">
      <ScanSummaryBar
        totalViolations={totalViolations}
        totalElements={uniqueElements}
        ruleCount={groups.length}
        onClear={onClear}
      />
      {groups.map((group, i) => (
        <ScanRuleGroup
          key={group.ruleId}
          group={group}
          defaultOpen={i === 0}
          onInspect={onInspect}
        />
      ))}
    </div>
  );
}
