import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultInlineSizeValue, isDefaultMarginValue } from './context.ts';
import { registerRule } from './registry.ts';

const RULE_ID = 'contents-no-box-props' as const;

const warn = (fields: Omit<Warning, 'ruleId' | 'severity'>) => createWarning(RULE_ID, fields);

function isDefaultBackgroundColor(value: string): boolean {
  return value === 'rgba(0, 0, 0, 0)';
}

function isDefaultNoneValue(value: string): boolean {
  return value === 'none';
}

const BOX_SUGGESTION =
  'Remove this property, or change display to a value that generates a box (e.g. block, flex).';

const BG_SUGGESTION =
  'Remove this property (unless set for inheritance), or change display to a value that generates a box (e.g. block, flex).';

const rule: RuleDescriptor = {
  id: RULE_ID,
  label: 'box properties on display:contents',
  requiredProperties: [
    'display',
    // Physical sizing
    'width',
    'height',
    'minWidth',
    'maxWidth',
    'minHeight',
    'maxHeight',
    // Logical sizing
    'inlineSize',
    'blockSize',
    'minInlineSize',
    'maxInlineSize',
    'minBlockSize',
    'maxBlockSize',
    // Physical margin
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    // Logical margin
    'marginBlockStart',
    'marginBlockEnd',
    'marginInlineStart',
    'marginInlineEnd',
    // Physical padding
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    // Logical padding
    'paddingBlockStart',
    'paddingBlockEnd',
    'paddingInlineStart',
    'paddingInlineEnd',
    // Physical border-width
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    // Logical border-width
    'borderBlockStartWidth',
    'borderBlockEndWidth',
    'borderInlineStartWidth',
    'borderInlineEndWidth',
    // Background
    'backgroundColor',
    'backgroundImage',
  ],
  check(ctx) {
    if (!ctx.isContents) return [];

    const warnings: Warning[] = [];
    const s = ctx.styles;

    // Skip physical property when its logical counterpart is also non-default,
    // since browsers resolve both to the same computed value in horizontal writing mode.
    const bothNonDefault = (physical: string, logical: string, isDefault: (v: string) => boolean) =>
      !isDefault(physical) && !isDefault(logical);

    // Sizing dedup
    const skipWidth = bothNonDefault(s.width, s.inlineSize, isDefaultInlineSizeValue);
    const skipHeight = bothNonDefault(s.height, s.blockSize, isDefaultInlineSizeValue);
    const skipMinWidth = bothNonDefault(s.minWidth, s.minInlineSize, isDefaultMarginValue);
    const skipMaxWidth = bothNonDefault(s.maxWidth, s.maxInlineSize, isDefaultNoneValue);
    const skipMinHeight = bothNonDefault(s.minHeight, s.minBlockSize, isDefaultMarginValue);
    const skipMaxHeight = bothNonDefault(s.maxHeight, s.maxBlockSize, isDefaultNoneValue);

    // Margin dedup
    const skipMarginTop = bothNonDefault(s.marginTop, s.marginBlockStart, isDefaultMarginValue);
    const skipMarginBottom = bothNonDefault(s.marginBottom, s.marginBlockEnd, isDefaultMarginValue);
    const skipMarginRight = bothNonDefault(s.marginRight, s.marginInlineEnd, isDefaultMarginValue);
    const skipMarginLeft = bothNonDefault(s.marginLeft, s.marginInlineStart, isDefaultMarginValue);

    // Padding dedup
    const skipPaddingTop = bothNonDefault(s.paddingTop, s.paddingBlockStart, isDefaultMarginValue);
    const skipPaddingBottom = bothNonDefault(
      s.paddingBottom,
      s.paddingBlockEnd,
      isDefaultMarginValue,
    );
    const skipPaddingRight = bothNonDefault(
      s.paddingRight,
      s.paddingInlineEnd,
      isDefaultMarginValue,
    );
    const skipPaddingLeft = bothNonDefault(
      s.paddingLeft,
      s.paddingInlineStart,
      isDefaultMarginValue,
    );

    // Border-width dedup
    const skipBorderTop = bothNonDefault(
      s.borderTopWidth,
      s.borderBlockStartWidth,
      isDefaultMarginValue,
    );
    const skipBorderBottom = bothNonDefault(
      s.borderBottomWidth,
      s.borderBlockEndWidth,
      isDefaultMarginValue,
    );
    const skipBorderRight = bothNonDefault(
      s.borderRightWidth,
      s.borderInlineEndWidth,
      isDefaultMarginValue,
    );
    const skipBorderLeft = bothNonDefault(
      s.borderLeftWidth,
      s.borderInlineStartWidth,
      isDefaultMarginValue,
    );

    const boxProps: Array<[string, string, (v: string) => boolean, string, boolean?]> = [
      // Physical sizing (skip when logical counterpart is also non-default)
      ['width', s.width, isDefaultInlineSizeValue, BOX_SUGGESTION, skipWidth],
      ['height', s.height, isDefaultInlineSizeValue, BOX_SUGGESTION, skipHeight],
      ['min-width', s.minWidth, isDefaultMarginValue, BOX_SUGGESTION, skipMinWidth],
      ['max-width', s.maxWidth, isDefaultNoneValue, BOX_SUGGESTION, skipMaxWidth],
      ['min-height', s.minHeight, isDefaultMarginValue, BOX_SUGGESTION, skipMinHeight],
      ['max-height', s.maxHeight, isDefaultNoneValue, BOX_SUGGESTION, skipMaxHeight],
      // Logical sizing
      ['inline-size', s.inlineSize, isDefaultInlineSizeValue, BOX_SUGGESTION],
      ['block-size', s.blockSize, isDefaultInlineSizeValue, BOX_SUGGESTION],
      ['min-inline-size', s.minInlineSize, isDefaultMarginValue, BOX_SUGGESTION],
      ['max-inline-size', s.maxInlineSize, isDefaultNoneValue, BOX_SUGGESTION],
      ['min-block-size', s.minBlockSize, isDefaultMarginValue, BOX_SUGGESTION],
      ['max-block-size', s.maxBlockSize, isDefaultNoneValue, BOX_SUGGESTION],
      // Physical margin (skip when logical counterpart is also non-default)
      ['margin-top', s.marginTop, isDefaultMarginValue, BOX_SUGGESTION, skipMarginTop],
      ['margin-right', s.marginRight, isDefaultMarginValue, BOX_SUGGESTION, skipMarginRight],
      ['margin-bottom', s.marginBottom, isDefaultMarginValue, BOX_SUGGESTION, skipMarginBottom],
      ['margin-left', s.marginLeft, isDefaultMarginValue, BOX_SUGGESTION, skipMarginLeft],
      // Logical margin
      ['margin-block-start', s.marginBlockStart, isDefaultMarginValue, BOX_SUGGESTION],
      ['margin-block-end', s.marginBlockEnd, isDefaultMarginValue, BOX_SUGGESTION],
      ['margin-inline-start', s.marginInlineStart, isDefaultMarginValue, BOX_SUGGESTION],
      ['margin-inline-end', s.marginInlineEnd, isDefaultMarginValue, BOX_SUGGESTION],
      // Physical padding (skip when logical counterpart is also non-default)
      ['padding-top', s.paddingTop, isDefaultMarginValue, BOX_SUGGESTION, skipPaddingTop],
      ['padding-right', s.paddingRight, isDefaultMarginValue, BOX_SUGGESTION, skipPaddingRight],
      ['padding-bottom', s.paddingBottom, isDefaultMarginValue, BOX_SUGGESTION, skipPaddingBottom],
      ['padding-left', s.paddingLeft, isDefaultMarginValue, BOX_SUGGESTION, skipPaddingLeft],
      // Logical padding
      ['padding-block-start', s.paddingBlockStart, isDefaultMarginValue, BOX_SUGGESTION],
      ['padding-block-end', s.paddingBlockEnd, isDefaultMarginValue, BOX_SUGGESTION],
      ['padding-inline-start', s.paddingInlineStart, isDefaultMarginValue, BOX_SUGGESTION],
      ['padding-inline-end', s.paddingInlineEnd, isDefaultMarginValue, BOX_SUGGESTION],
      // Physical border-width (skip when logical counterpart is also non-default)
      ['border-top-width', s.borderTopWidth, isDefaultMarginValue, BOX_SUGGESTION, skipBorderTop],
      [
        'border-right-width',
        s.borderRightWidth,
        isDefaultMarginValue,
        BOX_SUGGESTION,
        skipBorderRight,
      ],
      [
        'border-bottom-width',
        s.borderBottomWidth,
        isDefaultMarginValue,
        BOX_SUGGESTION,
        skipBorderBottom,
      ],
      [
        'border-left-width',
        s.borderLeftWidth,
        isDefaultMarginValue,
        BOX_SUGGESTION,
        skipBorderLeft,
      ],
      // Logical border-width
      ['border-block-start-width', s.borderBlockStartWidth, isDefaultMarginValue, BOX_SUGGESTION],
      ['border-block-end-width', s.borderBlockEndWidth, isDefaultMarginValue, BOX_SUGGESTION],
      ['border-inline-start-width', s.borderInlineStartWidth, isDefaultMarginValue, BOX_SUGGESTION],
      ['border-inline-end-width', s.borderInlineEndWidth, isDefaultMarginValue, BOX_SUGGESTION],
      // Background
      ['background-color', s.backgroundColor, isDefaultBackgroundColor, BG_SUGGESTION],
      ['background-image', s.backgroundImage, isDefaultNoneValue, BG_SUGGESTION],
    ];

    for (const [cssProp, value, isDefault, suggestion, skip] of boxProps) {
      if (skip || isDefault(value)) continue;
      warnings.push(
        warn({
          property: cssProp,
          title: `${cssProp} has no effect on display:contents elements`,
          details: `${cssProp} is "${value}" but display is "contents". Elements with display:contents do not generate a box, so box properties are ignored.`,
          suggestion,
        }),
      );
    }

    return warnings;
  },
};

registerRule(rule);

export const checkContentsBoxProps = rule.check;
