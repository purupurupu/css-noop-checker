/** Data extracted from the inspected element via chrome.devtools.inspectedWindow.eval() */
export interface ElementData {
  tagName: string;
  id: string;
  classList: string[];
  computedStyles: {
    display: string;
    width: string;
    height: string;
    rowGap: string;
    columnGap: string;
    alignItems: string;
    justifyContent: string;
    placeItems: string;
    placeContent: string;
    columnCount: string;
  };
}

export interface Warning {
  ruleId: string;
  severity: 'warning';
  title: string;
  details: string;
  suggestion: string;
}

/** A rule is a pure function: ElementData → Warning[] */
export type Rule = (data: ElementData) => Warning[];
