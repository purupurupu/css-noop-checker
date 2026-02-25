import type { ScanViolation } from '../types.ts';

interface ScanViolationRowProps {
  violation: ScanViolation;
  onInspect: () => void;
}

export function ScanViolationRow({ violation, onInspect }: ScanViolationRowProps) {
  const props = violation.warnings.map((w) => w.property).join(', ');

  return (
    <div className="scan-violation-row">
      <code className="scan-violation-row__selector" title={violation.selector}>
        {violation.selector}
      </code>
      <span className="scan-violation-row__props">{props}</span>
      <button
        className="scan-violation-row__inspect"
        onClick={onInspect}
        type="button"
        title="Inspect element"
      >
        &rarr;
      </button>
    </div>
  );
}
