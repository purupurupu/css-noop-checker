import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isGridContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-grid-props' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const GRID_CONTAINER_PROPERTIES = [
  { key: 'gridTemplateColumns', cssName: 'grid-template-columns', defaultValue: 'none' },
  { key: 'gridTemplateRows', cssName: 'grid-template-rows', defaultValue: 'none' },
  { key: 'gridTemplateAreas', cssName: 'grid-template-areas', defaultValue: 'none' },
  { key: 'gridAutoColumns', cssName: 'grid-auto-columns', defaultValue: 'auto' },
  { key: 'gridAutoRows', cssName: 'grid-auto-rows', defaultValue: 'auto' },
  { key: 'gridAutoFlow', cssName: 'grid-auto-flow', defaultValue: 'row' },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'grid container props on non-grid',
  requiredProperties: ['display', ...GRID_CONTAINER_PROPERTIES.map((p) => p.key)],
  check(ctx) {
    const { display } = ctx.styles;
    // We use isGridContainer() — not isFlexOrGridContainer() — because
    // grid-specific properties (grid-template-*, grid-auto-*) never have any
    // effect on flex containers, so warning on a flex container is always correct.
    // This contrasts with container-no-flex-props (issue #40), where flex props
    // on a grid container are silenced to avoid false positives in responsive
    // breakpoint patterns (e.g. switching between display:flex and display:grid
    // via media queries). That trade-off doesn't apply here since no responsive
    // pattern uses grid-template-* on a flex container.
    if (isGridContainer(display)) return [];
    // display:contents removes the element's box; grid properties are inapplicable.
    if (ctx.isContents) return [];

    const warnings: Warning[] = [];

    for (const { key, cssName, defaultValue } of GRID_CONTAINER_PROPERTIES) {
      const value = ctx.styles[key];
      if (value !== defaultValue) {
        warnings.push(
          warn({
            property: cssName,
            title: `${cssName} has no effect`,
            details: `${cssName} is "${value}" but display is "${display}". ${cssName} works on grid containers only.`,
            suggestion:
              'Set display: grid or display: inline-grid on this element, or remove this property.',
          }),
        );
      }
    }

    return warnings;
  },
};

registerRule(rule);

export const checkGridContainerProps = rule.check;
