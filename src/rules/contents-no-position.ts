import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { getPhysicalLogicalMap, isDefaultOffsetValue, isDefaultZIndexValue } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'contents-no-position' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

const SUGGESTION =
  'Remove this property, or change display to a value that generates a box (e.g. block, flex).';

const OFFSET_PROPERTIES = ['top', 'right', 'bottom', 'left'] as const;

const LOGICAL_OFFSET_PROPERTIES = [
  { key: 'insetBlockStart', cssName: 'inset-block-start' },
  { key: 'insetBlockEnd', cssName: 'inset-block-end' },
  { key: 'insetInlineStart', cssName: 'inset-inline-start' },
  { key: 'insetInlineEnd', cssName: 'inset-inline-end' },
] as const;

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'positioning on display:contents',
  requiredProperties: [
    'display',
    'writingMode',
    'direction',
    'position',
    ...OFFSET_PROPERTIES,
    ...LOGICAL_OFFSET_PROPERTIES.map((p) => p.key),
    'zIndex',
  ],
  check(ctx) {
    if (!ctx.isContents) return [];

    const warnings: Warning[] = [];
    const s = ctx.styles;

    // position itself
    if (s.position !== 'static') {
      warnings.push(
        warn({
          property: 'position',
          title: 'position has no effect on display:contents elements',
          details: `position is "${s.position}" but display is "contents". Elements with display:contents do not generate a box, so positioning is ignored.`,
          suggestion: SUGGESTION,
        }),
      );
    }

    // Skip physical property when its writing-mode-aware logical
    // counterpart is also non-default, to avoid duplicate warnings.
    const map = getPhysicalLogicalMap(s.writingMode, s.direction);
    const shouldSkipPhysical = (physicalKey: keyof typeof map) => {
      const logicalKey = map[physicalKey];
      return !isDefaultOffsetValue(s[physicalKey]) && !isDefaultOffsetValue(s[logicalKey]);
    };

    const physicalOffsets: Array<[string, string, boolean]> = [
      ['top', s.top, shouldSkipPhysical('top')],
      ['right', s.right, shouldSkipPhysical('right')],
      ['bottom', s.bottom, shouldSkipPhysical('bottom')],
      ['left', s.left, shouldSkipPhysical('left')],
    ];

    for (const [prop, value, skip] of physicalOffsets) {
      if (skip || isDefaultOffsetValue(value)) continue;
      warnings.push(
        warn({
          property: prop,
          title: `${prop} has no effect on display:contents elements`,
          details: `${prop} is "${value}" but display is "contents". Elements with display:contents do not generate a box, so offsets are ignored.`,
          suggestion: SUGGESTION,
        }),
      );
    }

    // Logical offsets
    for (const { key, cssName } of LOGICAL_OFFSET_PROPERTIES) {
      const value = s[key];
      if (isDefaultOffsetValue(value)) continue;
      warnings.push(
        warn({
          property: cssName,
          title: `${cssName} has no effect on display:contents elements`,
          details: `${cssName} is "${value}" but display is "contents". Elements with display:contents do not generate a box, so offsets are ignored.`,
          suggestion: SUGGESTION,
        }),
      );
    }

    // z-index
    if (!isDefaultZIndexValue(s.zIndex)) {
      warnings.push(
        warn({
          property: 'z-index',
          title: 'z-index has no effect on display:contents elements',
          details: `z-index is "${s.zIndex}" but display is "contents". Elements with display:contents do not generate a box, so z-index is ignored.`,
          suggestion: SUGGESTION,
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkContentsPosition = rule.check;
