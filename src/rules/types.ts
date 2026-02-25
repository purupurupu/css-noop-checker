/** Data extracted from the inspected element via chrome.devtools.inspectedWindow.eval() */
export interface ElementData {
  tagName: string;
  id: string;
  classList: string[];
  computedStyles: Record<string, string>;
}

/** Template-literal type: category prefix + hyphen + number (e.g. 'D-1', 'C-2') */
export type RuleId = `${string}-${number}`;

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
}

/** A rule is a pure function: RuleContext → Warning[] */
export type Rule = (ctx: RuleContext) => Warning[];

export interface RuleDescriptor {
  readonly id: RuleId;
  readonly label: string;
  readonly requiredProperties: readonly string[];
  check: (ctx: RuleContext) => Warning[];
}
