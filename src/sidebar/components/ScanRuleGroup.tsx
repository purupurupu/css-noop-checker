import { useState } from 'react';
import type { ScanGroup } from '../types.ts';
import { ScanViolationRow } from './ScanViolationRow.tsx';

const DISPLAY_LIMIT = 50;

const RULE_LABELS: Record<string, string> = {
  'D-1': 'width/height on inline',
  'C-1': 'gap on non-flex/grid',
  'C-2': 'align/justify on non-flex/grid',
  'C-3': 'place-* on non-flex/grid',
};

interface ScanRuleGroupProps {
  group: ScanGroup;
  defaultOpen: boolean;
  onInspect: (index: number) => void;
}

export function ScanRuleGroup({ group, defaultOpen, onInspect }: ScanRuleGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const label = RULE_LABELS[group.ruleId] ?? group.ruleId;
  const displayed = group.violations.slice(0, DISPLAY_LIMIT);
  const remaining = group.violations.length - displayed.length;

  return (
    <div className="scan-rule-group">
      <button
        className="scan-rule-group__header"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <span
          className={`scan-rule-group__chevron${open ? ' scan-rule-group__chevron--open' : ''}`}
        >
          &#9654;
        </span>
        <span className="scan-rule-group__badge">{group.ruleId}</span>
        <span className="scan-rule-group__label">{label}</span>
        <span className="scan-rule-group__count">({group.violations.length})</span>
      </button>
      {open && (
        <div className="scan-rule-group__body">
          {displayed.map((v) => (
            <ScanViolationRow
              key={v.index}
              violation={v}
              onInspect={() => onInspect(v.index)}
            />
          ))}
          {remaining > 0 && (
            <div className="scan-rule-group__more">&hellip; and {remaining} more</div>
          )}
        </div>
      )}
    </div>
  );
}
