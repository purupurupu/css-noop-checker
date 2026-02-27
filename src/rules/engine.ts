// Rule registration (side-effect imports)
import './alignment.ts';
import './block-vertical-align.ts';
import './flex-container-props.ts';
import './gap.ts';
import './grid-container-props.ts';
import './inline-dimensions.ts';
import './inline-vertical-margin.ts';
import './item-no-float.ts';
import './non-flex-child-props.ts';
import './non-grid-child-props.ts';
import './order.ts';
import './place.ts';
import './self-alignment.ts';
import './static-position-offset.ts';
import './static-z-index.ts';

import type { ElementData, Warning } from './types.ts';
import { createRuleContext } from './context.ts';
import { getRules } from './registry.ts';

export function analyzeElement(data: ElementData): Warning[] {
  const ctx = createRuleContext(data);
  return getRules().flatMap((rule) => rule.check(ctx));
}
