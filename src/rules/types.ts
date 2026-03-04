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
  inlineStyles?: Record<string, string>;
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
  inlineStyles: Record<string, string>;
  parentStyles: Record<string, string> | null;
  /** Parent's display value. Defaults to '' (empty string) when parentStyles is null, signaling absent/unknown. Only meaningful when parentStyles !== null. */
  parentDisplay: string;
  isFlexItem: boolean;
  isGridItem: boolean;
  isContents: boolean;
  isParentContents: boolean;
}

/** Creates a Warning with a fixed severity of 'warning'. */
export function createWarning(
  ruleId: RuleId,
  fields: Omit<Warning, 'ruleId' | 'severity'>,
): Warning {
  return { ruleId, severity: 'warning', ...fields };
}

export interface RuleDescriptor {
  readonly id: RuleId;
  readonly label: string;
  readonly requiredProperties: readonly string[];
  readonly requiredParentProperties?: readonly string[];
  readonly requiredInlineProperties?: readonly string[];
  check: (ctx: RuleContext) => Warning[];
}
