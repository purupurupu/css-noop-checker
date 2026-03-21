import { useCallback, useMemo, useRef, useState } from 'react';
import { useSelectedElement } from './hooks/useSelectedElement.ts';
import { usePageScan } from './hooks/usePageScan.ts';
import { useInspectElement } from './hooks/useInspectElement.ts';
import { analyzeElement } from '../rules/engine.ts';
import { PanelHeader } from './components/PanelHeader.tsx';
import { WarningList } from './components/WarningList.tsx';
import { ScanResultsPanel } from './components/ScanResultsPanel.tsx';
import { ScanViolationDetailView } from './components/ScanViolationDetailView.tsx';
import { PanelFooter } from './components/PanelFooter.tsx';
import type { ScanViolation, ViewMode } from './types.ts';

function App() {
  const { data, status } = useSelectedElement();
  const { groups, status: scanStatus, error, progress, scan, clear } = usePageScan();
  const { inspectElement, inspectError, clearInspectError } = useInspectElement();
  const [viewMode, setViewMode] = useState<ViewMode>('element');
  const [selectedViolation, setSelectedViolation] = useState<ScanViolation | null>(null);
  const [inspectCount, setInspectCount] = useState(0);
  const scrollPositionRef = useRef(0);
  const warnings = useMemo(() => (data ? analyzeElement(data) : []), [data]);

  const handleScan = () => {
    clearInspectError();
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
      scrollPositionRef.current = document.documentElement.scrollTop;
      inspectElement(violation.index);
      setSelectedViolation(violation);
      setInspectCount((c) => c + 1);
      setViewMode('scan-detail');
    },
    [inspectElement],
  );

  const handleBackToResults = () => {
    clearInspectError();
    setSelectedViolation(null);
    setViewMode('scan');
    requestAnimationFrame(() => {
      document.documentElement.scrollTop = scrollPositionRef.current;
    });
  };

  const renderContent = () => {
    if (viewMode === 'element') {
      return <WarningList warnings={warnings} status={status} />;
    }

    return (
      <>
        <div hidden={viewMode === 'scan-detail'}>
          <ScanResultsPanel
            groups={groups}
            status={scanStatus}
            error={error}
            inspectError={inspectError}
            progress={progress}
            onInspect={handleInspect}
            onClear={handleClear}
          />
        </div>
        {viewMode === 'scan-detail' && selectedViolation && (
          <ScanViolationDetailView
            key={inspectCount}
            violation={selectedViolation}
            inspectError={inspectError}
            onBack={handleBackToResults}
          />
        )}
      </>
    );
  };

  return (
    <div className="panel">
      <PanelHeader
        elementData={data}
        status={status}
        scanStatus={scanStatus}
        warnings={warnings}
        viewMode={viewMode}
        onScan={handleScan}
      />
      {renderContent()}
      <PanelFooter />
    </div>
  );
}

export default App;
