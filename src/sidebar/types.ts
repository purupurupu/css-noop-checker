import type { ElementData, RuleId, Warning } from '../rules/types.ts';

export type ScanStatus = 'idle' | 'scanning' | 'done' | 'error';

/** Element data collected during a page-wide scan, extended with scan-specific fields. */
export interface ScanElementData {
  index: number;
  selector: string;
  tagName: string;
  id: string;
  classList: string[];
  computedStyles: ElementData['computedStyles'];
}

export interface ScanViolation {
  index: number;
  selector: string;
  warnings: Warning[];
}

export interface ScanGroup {
  ruleId: RuleId;
  violations: ScanViolation[];
}

export interface ScanProgress {
  scanned: number;
  total: number;
}
