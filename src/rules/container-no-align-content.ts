import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultAlignmentValue, isDefaultFlexWrapValue, isFlexContainer } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'container-no-align-content' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'align-content on single-line flex',
  requiredProperties: ['display', 'flexWrap', 'alignContent'],
  check(ctx) {
    const { display, flexWrap, alignContent } = ctx.styles;

    // Only applies to flex containers with nowrap (single-line)
    if (!isFlexContainer(display)) return [];
    if (ctx.isContents) return [];
    if (!isDefaultFlexWrapValue(flexWrap)) return [];
    // 'normal' and 'stretch' are the effective defaults for single-line flex
    if (isDefaultAlignmentValue(alignContent) || alignContent === 'stretch') return [];

    return [
      warn({
        property: 'align-content',
        title: 'align-content has no effect',
        details: `align-content is "${alignContent}" but flex-wrap is "nowrap". align-content only works on multi-line flex containers.`,
        suggestion:
          'Set flex-wrap: wrap (or wrap-reverse) on this element, or remove align-content.',
      }),
    ];
  },
};

registerRule(rule);

export const checkAlignContent = rule.check;
