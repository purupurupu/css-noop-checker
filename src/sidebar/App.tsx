import { useSelectedElement } from './hooks/useSelectedElement.ts';
import { analyzeElement } from '../rules/engine.ts';
import { PanelHeader } from './components/PanelHeader.tsx';
import { WarningList } from './components/WarningList.tsx';
import { PanelFooter } from './components/PanelFooter.tsx';

function App() {
  const { data, status } = useSelectedElement();
  const warnings = data ? analyzeElement(data) : [];

  return (
    <div className="panel">
      <PanelHeader elementData={data} status={status} />
      <WarningList warnings={warnings} status={status} />
      <PanelFooter />
    </div>
  );
}

export default App;
