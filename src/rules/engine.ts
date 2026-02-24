import type { ElementData, Rule, Warning } from './types.ts';
import { createRuleContext } from './context.ts';
import { checkInlineDimensions } from './inline-dimensions.ts';
import { checkGap } from './gap.ts';
import { checkAlignment } from './alignment.ts';
import { checkPlace } from './place.ts';

const rules: Rule[] = [checkInlineDimensions, checkGap, checkAlignment, checkPlace];

export function analyzeElement(data: ElementData): Warning[] {
  const ctx = createRuleContext(data);
  return rules.flatMap((rule) => rule(ctx));
}
