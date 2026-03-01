// Rule registration (side-effect imports)
import './block-no-vertical-align.ts';
import './container-no-align.ts';
import './container-no-flex-props.ts';
import './container-no-gap.ts';
import './container-no-grid-props.ts';
import './container-no-justify-items.ts';
import './container-no-place.ts';
import './element-no-table-props.ts';
import './inline-no-dimensions.ts';
import './inline-no-overflow.ts';
import './inline-no-vertical-margin.ts';
import './item-no-flex-props.ts';
import './item-no-float.ts';
import './item-no-grid-props.ts';
import './item-no-order.ts';
import './item-no-self-align.ts';
import './nonfloat-no-shape-outside.ts';
import './nonreplaced-no-object-fit.ts';
import './static-no-offset.ts';
import './static-no-z-index.ts';
import './visible-overflow-no-resize.ts';
import './visible-overflow-no-text-overflow.ts';

import type { ElementData, Warning } from './types.ts';
import { createRuleContext } from './context.ts';
import { getRules } from './registry.ts';

export function analyzeElement(data: ElementData): Warning[] {
  const ctx = createRuleContext(data);
  return getRules().flatMap((rule) => rule.check(ctx));
}
