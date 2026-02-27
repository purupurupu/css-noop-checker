/** Computed styles collected from the parent element (null when parentElement is absent, e.g. <html>) */
export interface ParentData {
  computedStyles: Record<string, string>;
}

/** Data extracted from the inspected element via chrome.devtools.inspectedWindow.eval() */
export interface ElementData {
  tagName: string;
  id: string;
  classList: string[];
  computedStyles: Record<string, string>;
  parent: ParentData | null;
}

/** Stylelint-convention rule ID (e.g. 'inline-no-dimensions', 'container-no-gap') */
export type RuleId = string;

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
  styles: Record<string, string>;
  parentStyles: Record<string, string> | null;
  isFlexItem: boolean;
  isGridItem: boolean;
}

export interface RuleDescriptor {
  readonly id: RuleId;
  readonly label: string;
  readonly requiredProperties: readonly string[];
  readonly requiredParentProperties?: readonly string[];
  check: (ctx: RuleContext) => Warning[];
}
