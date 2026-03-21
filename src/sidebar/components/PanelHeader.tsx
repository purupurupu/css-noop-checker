import type { ElementData, Warning } from '../../rules/types.ts';
import type { AnalysisStatus } from '../hooks/useSelectedElement.ts';
import type { ScanStatus, ViewMode } from '../types.ts';
import { CopyJsonButton } from './CopyJsonButton.tsx';

interface PanelHeaderProps {
  elementData: ElementData | null;
  status: AnalysisStatus;
  scanStatus: ScanStatus;
  warnings: Warning[];
  viewMode: ViewMode;
  onScan: () => void;
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

export function PanelHeader({
  elementData,
  status,
  scanStatus,
  warnings,
  viewMode,
  onScan,
}: PanelHeaderProps) {
  const isScanning = scanStatus === 'scanning';
  // Allowlist: only show in element view. New ViewModes hide the button by default.
  const showScanButton = viewMode === 'element';
  const showCopyJson = viewMode === 'element' && status === 'ready' && warnings.length > 0;

  return (
    <header className="panel-header">
      <code className="panel-header__selector">
        {elementData ? formatSelector(elementData) : 'No element selected'}
      </code>
      <div className="panel-header__actions">
        <span className={`panel-header__status panel-header__status--${status}`}>
          {STATUS_LABELS[status]}
        </span>
        {showCopyJson && <CopyJsonButton data={warnings} />}
        {showScanButton && (
          <button
            className={`panel-action-button${isScanning ? ' panel-action-button--scanning' : ''}`}
            onClick={onScan}
            disabled={isScanning}
            type="button"
          >
            {isScanning ? 'Scanning\u2026' : 'Scan Page'}
          </button>
        )}
      </div>
    </header>
  );
}
