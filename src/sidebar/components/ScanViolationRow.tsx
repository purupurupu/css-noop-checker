import type { ScanViolation } from '../types.ts';

interface ScanViolationRowProps {
  violation: ScanViolation;
  onInspect: () => void;
}

export function ScanViolationRow({ violation, onInspect }: ScanViolationRowProps) {
  const props = violation.warnings.map((w) => w.property).join(', ');

  return (
    <button
      className="scan-violation-row"
      onClick={onInspect}
      type="button"
      aria-label={`Inspect ${violation.selector}: ${props}`}
    >
      <code className="scan-violation-row__selector" title={violation.selector}>
        {violation.selector}
      </code>
      <span className="scan-violation-row__props">{props}</span>
      <span className="scan-violation-row__inspect" aria-hidden="true">
        &rarr;
      </span>
    </button>
  );
}
