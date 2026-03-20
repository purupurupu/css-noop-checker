# inline-no-logical-vertical-margin

Detects `margin-block-start` or `margin-block-end` on non-replaced inline elements.

## Why this is a no-op

Block-axis margins (`margin-block-start`, `margin-block-end`) do not apply to non-replaced inline elements. These logical properties always target the block axis regardless of writing mode, and non-replaced inline boxes never accept block-axis margins.

## Properties involved

- `margin-block-start`
- `margin-block-end`
- `display`
- `writing-mode`

## Examples

### Warn

```html
<span style="margin-block-start: 20px">...</span>
```

### OK

```html
<span style="display: inline-block; margin-block-start: 20px">...</span>
```

## Common scenarios

This happens when developers use logical margin properties on inline elements like `<span>` or `<a>`, expecting block-axis spacing that never renders.

## Known limitation

The current rule implementation only warns in `horizontal-tb` writing mode and skips vertical/sideways modes. Per the CSS spec, `margin-block-*` is a no-op on non-replaced inline elements in all writing modes. See [#156](https://github.com/purupurupu/css-noop-checker/issues/156).
