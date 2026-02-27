import { useCallback, useMemo, useState } from 'react';
import { useSelectedElement } from './hooks/useSelectedElement.ts';
import { usePageScan } from './hooks/usePageScan.ts';
import { useInspectElement } from './hooks/useInspectElement.ts';
import { analyzeElement } from '../rules/engine.ts';
import { PanelHeader } from './components/PanelHeader.tsx';
import { WarningList } from './components/WarningList.tsx';
import { ScanResultsPanel } from './components/ScanResultsPanel.tsx';
import { ScanViolationDetailView } from './components/ScanViolationDetailView.tsx';
import { PanelFooter } from './components/PanelFooter.tsx';
import type { ScanViolation } from './types.ts';

type ViewMode = 'element' | 'scan' | 'scan-detail';

function App() {
  const { data, status } = useSelectedElement();
  const { groups, status: scanStatus, error, progress, scan, clear } = usePageScan();
  const { inspectElement, inspectError } = useInspectElement();
  const [viewMode, setViewMode] = useState<ViewMode>('element');
  const [selectedViolation, setSelectedViolation] = useState<ScanViolation | null>(null);
  const warnings = useMemo(() => (data ? analyzeElement(data) : []), [data]);

  const handleScan = () => {
    setSelectedViolation(null);
    setViewMode('scan');
    scan();
  };

  const handleClear = () => {
    clear();
    setSelectedViolation(null);
    setViewMode('element');
  };

  const handleInspect = useCallback(
    (violation: ScanViolation) => {
      inspectElement(violation.index);
      setSelectedViolation(violation);
      setViewMode('scan-detail');
    },
    [inspectElement],
  );

  const handleBackToResults = () => {
    setSelectedViolation(null);
    setViewMode('scan');
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'element':
        return <WarningList warnings={warnings} status={status} />;
      case 'scan-detail':
        return (
          <ScanViolationDetailView
            key={selectedViolation!.index}
            violation={selectedViolation!}
            inspectError={inspectError}
            onBack={handleBackToResults}
          />
        );
      case 'scan':
        return (
          <ScanResultsPanel
            groups={groups}
            status={scanStatus}
            error={error}
            inspectError={inspectError}
            progress={progress}
            onInspect={handleInspect}
            onClear={handleClear}
          />
        );
    }
  };

  return (
    <div className="panel">
      <PanelHeader elementData={data} status={status} scanStatus={scanStatus} onScan={handleScan} />
      {renderContent()}
      <PanelFooter />
    </div>
  );
}

export default App;
