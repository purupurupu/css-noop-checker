// Rule registration (side-effect imports)
import './animation-no-sub-props.ts';
import './block-no-vertical-align.ts';
import './container-no-align.ts';
import './container-no-columns.ts';
import './container-no-flex-props.ts';
import './container-no-gap.ts';
import './container-no-grid-props.ts';
import './container-no-justify-items.ts';
import './container-no-place.ts';
import './contents-no-box-props.ts';
import './element-no-table-props.ts';
import './inline-no-dimensions.ts';
import './inline-no-logical-dimensions.ts';
import './inline-no-logical-vertical-margin.ts';
import './inline-no-min-max-dimensions.ts';
import './inline-no-min-max-logical-dimensions.ts';
import './inline-no-overflow.ts';
import './inline-no-text-indent.ts';
import './inline-no-vertical-margin.ts';
import './item-no-flex-props.ts';
import './item-no-float.ts';
import './item-no-grid-props.ts';
import './item-no-justify-self.ts';
import './item-no-order.ts';
import './item-no-self-align.ts';
import './nonfloat-no-shape-outside.ts';
import './nonreplaced-no-object-fit.ts';
import './outline-no-style.ts';
import './perspective-no-origin.ts';
import './positioned-no-clear.ts';
import './positioned-no-float.ts';
import './scroll-no-scroll-padding.ts';
import './scroll-snap-no-align-without-type.ts';
import './static-no-logical-offset.ts';
import './static-no-offset.ts';
import './static-no-z-index.ts';
import './transform-no-origin.ts';
import './visible-overflow-no-resize.ts';
import './visible-overflow-no-text-overflow.ts';

import type { ElementData, Warning } from './types.ts';
import { createRuleContext } from './context.ts';
import { getRules } from './registry.ts';

export function analyzeElement(data: ElementData): Warning[] {
  const ctx = createRuleContext(data);
  return getRules().flatMap((rule) => rule.check(ctx));
}
