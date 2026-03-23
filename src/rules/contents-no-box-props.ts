import { type RuleDescriptor, type Warning, createWarning } from './types.ts';
import { isDefaultInlineSizeValue, isZeroPx } from './context.ts';
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
    const skipMinWidth = bothNonDefault(s.minWidth, s.minInlineSize, isZeroPx);
    const skipMaxWidth = bothNonDefault(s.maxWidth, s.maxInlineSize, isDefaultNoneValue);
    const skipMinHeight = bothNonDefault(s.minHeight, s.minBlockSize, isZeroPx);
    const skipMaxHeight = bothNonDefault(s.maxHeight, s.maxBlockSize, isDefaultNoneValue);

    // Margin dedup
    const skipMarginTop = bothNonDefault(s.marginTop, s.marginBlockStart, isZeroPx);
    const skipMarginBottom = bothNonDefault(s.marginBottom, s.marginBlockEnd, isZeroPx);
    const skipMarginRight = bothNonDefault(s.marginRight, s.marginInlineEnd, isZeroPx);
    const skipMarginLeft = bothNonDefault(s.marginLeft, s.marginInlineStart, isZeroPx);

    // Padding dedup
    const skipPaddingTop = bothNonDefault(s.paddingTop, s.paddingBlockStart, isZeroPx);
    const skipPaddingBottom = bothNonDefault(s.paddingBottom, s.paddingBlockEnd, isZeroPx);
    const skipPaddingRight = bothNonDefault(s.paddingRight, s.paddingInlineEnd, isZeroPx);
    const skipPaddingLeft = bothNonDefault(s.paddingLeft, s.paddingInlineStart, isZeroPx);

    // Border-width dedup
    const skipBorderTop = bothNonDefault(s.borderTopWidth, s.borderBlockStartWidth, isZeroPx);
    const skipBorderBottom = bothNonDefault(s.borderBottomWidth, s.borderBlockEndWidth, isZeroPx);
    const skipBorderRight = bothNonDefault(s.borderRightWidth, s.borderInlineEndWidth, isZeroPx);
    const skipBorderLeft = bothNonDefault(s.borderLeftWidth, s.borderInlineStartWidth, isZeroPx);

    const boxProps: Array<[string, string, (v: string) => boolean, string, boolean?]> = [
      // Physical sizing (skip when logical counterpart is also non-default)
      ['width', s.width, isDefaultInlineSizeValue, BOX_SUGGESTION, skipWidth],
      ['height', s.height, isDefaultInlineSizeValue, BOX_SUGGESTION, skipHeight],
      ['min-width', s.minWidth, isZeroPx, BOX_SUGGESTION, skipMinWidth],
      ['max-width', s.maxWidth, isDefaultNoneValue, BOX_SUGGESTION, skipMaxWidth],
      ['min-height', s.minHeight, isZeroPx, BOX_SUGGESTION, skipMinHeight],
      ['max-height', s.maxHeight, isDefaultNoneValue, BOX_SUGGESTION, skipMaxHeight],
      // Logical sizing
      ['inline-size', s.inlineSize, isDefaultInlineSizeValue, BOX_SUGGESTION],
      ['block-size', s.blockSize, isDefaultInlineSizeValue, BOX_SUGGESTION],
      ['min-inline-size', s.minInlineSize, isZeroPx, BOX_SUGGESTION],
      ['max-inline-size', s.maxInlineSize, isDefaultNoneValue, BOX_SUGGESTION],
      ['min-block-size', s.minBlockSize, isZeroPx, BOX_SUGGESTION],
      ['max-block-size', s.maxBlockSize, isDefaultNoneValue, BOX_SUGGESTION],
      // Physical margin (skip when logical counterpart is also non-default)
      ['margin-top', s.marginTop, isZeroPx, BOX_SUGGESTION, skipMarginTop],
      ['margin-right', s.marginRight, isZeroPx, BOX_SUGGESTION, skipMarginRight],
      ['margin-bottom', s.marginBottom, isZeroPx, BOX_SUGGESTION, skipMarginBottom],
      ['margin-left', s.marginLeft, isZeroPx, BOX_SUGGESTION, skipMarginLeft],
      // Logical margin
      ['margin-block-start', s.marginBlockStart, isZeroPx, BOX_SUGGESTION],
      ['margin-block-end', s.marginBlockEnd, isZeroPx, BOX_SUGGESTION],
      ['margin-inline-start', s.marginInlineStart, isZeroPx, BOX_SUGGESTION],
      ['margin-inline-end', s.marginInlineEnd, isZeroPx, BOX_SUGGESTION],
      // Physical padding (skip when logical counterpart is also non-default)
      ['padding-top', s.paddingTop, isZeroPx, BOX_SUGGESTION, skipPaddingTop],
      ['padding-right', s.paddingRight, isZeroPx, BOX_SUGGESTION, skipPaddingRight],
      ['padding-bottom', s.paddingBottom, isZeroPx, BOX_SUGGESTION, skipPaddingBottom],
      ['padding-left', s.paddingLeft, isZeroPx, BOX_SUGGESTION, skipPaddingLeft],
      // Logical padding
      ['padding-block-start', s.paddingBlockStart, isZeroPx, BOX_SUGGESTION],
      ['padding-block-end', s.paddingBlockEnd, isZeroPx, BOX_SUGGESTION],
      ['padding-inline-start', s.paddingInlineStart, isZeroPx, BOX_SUGGESTION],
      ['padding-inline-end', s.paddingInlineEnd, isZeroPx, BOX_SUGGESTION],
      // Physical border-width (skip when logical counterpart is also non-default)
      ['border-top-width', s.borderTopWidth, isZeroPx, BOX_SUGGESTION, skipBorderTop],
      ['border-right-width', s.borderRightWidth, isZeroPx, BOX_SUGGESTION, skipBorderRight],
      ['border-bottom-width', s.borderBottomWidth, isZeroPx, BOX_SUGGESTION, skipBorderBottom],
      ['border-left-width', s.borderLeftWidth, isZeroPx, BOX_SUGGESTION, skipBorderLeft],
      // Logical border-width
      ['border-block-start-width', s.borderBlockStartWidth, isZeroPx, BOX_SUGGESTION],
      ['border-block-end-width', s.borderBlockEndWidth, isZeroPx, BOX_SUGGESTION],
      ['border-inline-start-width', s.borderInlineStartWidth, isZeroPx, BOX_SUGGESTION],
      ['border-inline-end-width', s.borderInlineEndWidth, isZeroPx, BOX_SUGGESTION],
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
