import { useMemo } from 'react';
import type { ScanGroup, ScanProgress, ScanStatus, ScanViolation } from '../types.ts';
import { ScanSummaryBar } from './ScanSummaryBar.tsx';
import { ScanRuleGroup } from './ScanRuleGroup.tsx';

interface ScanResultsPanelProps {
  groups: ScanGroup[];
  status: ScanStatus;
  error: string | null;
  inspectError: string | null;
  progress: ScanProgress;
  onInspect: (violation: ScanViolation) => void;
  onClear: () => void;
}

export function ScanResultsPanel({
  groups,
  status,
  error,
  inspectError,
  progress,
  onInspect,
  onClear,
}: ScanResultsPanelProps) {
  const { totalViolations, uniqueElements } = useMemo(() => {
    const total = groups.reduce((sum, g) => sum + g.violations.length, 0);
    const unique = new Set(groups.flatMap((g) => g.violations.map((v) => v.index))).size;
    return { totalViolations: total, uniqueElements: unique };
  }, [groups]);

  if (status === 'scanning') {
    const text =
      progress.total > 0
        ? `Scanning\u2026 (${progress.scanned}/${progress.total} elements)`
        : 'Scanning\u2026';
    return (
      <div className="scan-message" role="status" aria-live="polite">
        <p>{text}</p>
        <button className="scan-message__back" onClick={onClear} type="button">
          Cancel
        </button>
      </div>
    );
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

  return (
    <div className="scan-results">
      <ScanSummaryBar
        totalViolations={totalViolations}
        totalElements={uniqueElements}
        ruleCount={groups.length}
        onClear={onClear}
      />
      {inspectError && (
        <div className="scan-inspect-error" role="alert">
          {inspectError}
        </div>
      )}
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
