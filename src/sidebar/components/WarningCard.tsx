import type { Warning } from '../../rules/types.ts';

interface WarningCardProps {
  warning: Warning;
}

export function WarningCard({ warning }: WarningCardProps) {
  return (
    <div className="warning-card">
      <div className="warning-card__header">
        <span className="warning-card__icon" aria-label="warning">
          &#9888;
        </span>
        <span className="warning-card__title">{warning.title}</span>
        <span className="warning-card__rule-id">{warning.ruleId}</span>
      </div>
      <p className="warning-card__details">{warning.details}</p>
      <p className="warning-card__suggestion">{warning.suggestion}</p>
    </div>
  );
}
