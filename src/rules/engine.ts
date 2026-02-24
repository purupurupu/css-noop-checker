import type { ElementData, Warning } from './types.ts';
import { checkInlineDimensions } from './inline-dimensions.ts';
import { checkGap } from './gap.ts';
import { checkAlignment } from './alignment.ts';
import { checkPlace } from './place.ts';

const rules = [
  checkInlineDimensions,
  checkGap,
  checkAlignment,
  checkPlace,
];

export function analyzeElement(data: ElementData): Warning[] {
  return rules.flatMap((rule) => rule(data));
}
