import type { ElementData } from '../../rules/types.ts';
import type { AnalysisStatus } from '../hooks/useSelectedElement.ts';

interface PanelHeaderProps {
  elementData: ElementData | null;
  status: AnalysisStatus;
}

function formatSelector(data: ElementData): string {
  let selector = data.tagName;
  if (data.id) selector += `#${data.id}`;
  for (const cls of data.classList) selector += `.${cls}`;
  return selector;
}

const STATUS_LABELS: Record<AnalysisStatus, string> = {
  'no-selection': 'No selection',
  analyzing: 'Analyzing...',
  ready: 'Ready',
  error: 'Error',
};

export function PanelHeader({ elementData, status }: PanelHeaderProps) {
  return (
    <header className="panel-header">
      <code className="panel-header__selector">
        {elementData ? formatSelector(elementData) : 'No element selected'}
      </code>
      <span className={`panel-header__status panel-header__status--${status}`}>
        {STATUS_LABELS[status]}
      </span>
    </header>
  );
}
