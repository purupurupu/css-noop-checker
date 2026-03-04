import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import {
  isDefaultFlexDirectionValue,
  isDefaultFlexWrapValue,
  isFlexOrGridContainer,
} from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-flex-props' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'flex-direction/wrap on non-flex',
  requiredProperties: ['display', 'flexDirection', 'flexWrap'],
  check(ctx) {
    const { display, flexDirection, flexWrap } = ctx.styles;
    // Grid containers also ignore flex-direction/flex-wrap, but we skip them
    // to avoid noise when both grid and flex properties coexist for responsive
    // breakpoint switching. See: https://github.com/purupurupu/css-noop-checker/issues/40
    if (isFlexOrGridContainer(display)) return [];
    // display:contents removes the element's box; flex properties are inapplicable.
    if (ctx.isContents) return [];

    const warnings: Warning[] = [];

    if (!isDefaultFlexDirectionValue(flexDirection)) {
      warnings.push(
        warn({
          property: 'flex-direction',
          title: 'flex-direction has no effect',
          details: `flex-direction is "${flexDirection}" but display is "${display}". flex-direction works on flex containers only.`,
          suggestion:
            'Set display: flex or display: inline-flex on this element, or remove flex-direction.',
        }),
      );
    }

    if (!isDefaultFlexWrapValue(flexWrap)) {
      warnings.push(
        warn({
          property: 'flex-wrap',
          title: 'flex-wrap has no effect',
          details: `flex-wrap is "${flexWrap}" but display is "${display}". flex-wrap works on flex containers only.`,
          suggestion:
            'Set display: flex or display: inline-flex on this element, or remove flex-wrap.',
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkFlexContainerProps = rule.check;
