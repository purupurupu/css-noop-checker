// Rule registration (side-effect imports)
import './inline-dimensions.ts';
import './inline-vertical-margin.ts';
import './gap.ts';
import './alignment.ts';
import './place.ts';
import './static-position-offset.ts';
import './self-alignment.ts';
import './order.ts';
import './block-vertical-align.ts';
import './static-z-index.ts';

import type { ElementData, Warning } from './types.ts';
import { createRuleContext } from './context.ts';
import { getRules } from './registry.ts';

export function analyzeElement(data: ElementData): Warning[] {
  const ctx = createRuleContext(data);
  return getRules().flatMap((rule) => rule.check(ctx));
}
