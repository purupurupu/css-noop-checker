/** Data extracted from the inspected element via chrome.devtools.inspectedWindow.eval() */
export interface ElementData {
  tagName: string;
  id: string;
  classList: string[];
  computedStyles: {
    display: string;
    width: string;
    height: string;
    gap: string;
    rowGap: string;
    columnGap: string;
    alignItems: string;
    justifyContent: string;
    placeItems: string;
    placeContent: string;
    columnCount: string;
  };
}

export type RuleId = 'D-1' | 'C-1' | 'C-2' | 'C-3';

export interface Warning {
  ruleId: RuleId;
  property: string;
  severity: 'warning';
  title: string;
  details: string;
  suggestion: string;
}

export interface RuleContext {
  element: ElementData;
  styles: ElementData['computedStyles'];
}

/** A rule is a pure function: RuleContext → Warning[] */
export type Rule = (ctx: RuleContext) => Warning[];
