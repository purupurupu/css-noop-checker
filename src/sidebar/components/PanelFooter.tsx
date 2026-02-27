import { getRules } from '../../rules/registry.ts';

export function PanelFooter() {
  const ruleCount = getRules().length;
  return <footer className="panel-footer">{ruleCount} rules active</footer>;
}
