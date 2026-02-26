import { useMemo, useState } from 'react';
import { useSelectedElement } from './hooks/useSelectedElement.ts';
import { usePageScan } from './hooks/usePageScan.ts';
import { useInspectElement } from './hooks/useInspectElement.ts';
import { analyzeElement } from '../rules/engine.ts';
import { PanelHeader } from './components/PanelHeader.tsx';
import { WarningList } from './components/WarningList.tsx';
import { ScanResultsPanel } from './components/ScanResultsPanel.tsx';
import { PanelFooter } from './components/PanelFooter.tsx';

type ViewMode = 'element' | 'scan';

function App() {
  const { data, status } = useSelectedElement();
  const { groups, status: scanStatus, error, progress, scan, clear } = usePageScan();
  const { inspectElement, inspectError } = useInspectElement();
  const [viewMode, setViewMode] = useState<ViewMode>('element');
  const warnings = useMemo(() => (data ? analyzeElement(data) : []), [data]);

  const handleScan = () => {
    setViewMode('scan');
    scan();
  };

  const handleClear = () => {
    clear();
    setViewMode('element');
  };

  return (
    <div className="panel">
      <PanelHeader elementData={data} status={status} scanStatus={scanStatus} onScan={handleScan} />
      {viewMode === 'element' ? (
        <WarningList warnings={warnings} status={status} />
      ) : (
        <ScanResultsPanel
          groups={groups}
          status={scanStatus}
          error={error}
          inspectError={inspectError}
          progress={progress}
          onInspect={inspectElement}
          onClear={handleClear}
        />
      )}
      <PanelFooter />
    </div>
  );
}

export default App;
