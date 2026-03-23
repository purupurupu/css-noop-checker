# contents-no-box-props

Detects box properties on `display: contents` elements.

## Why this is a no-op

Elements with `display: contents` do not generate a principal box. They behave as if replaced by their children in the document tree. Because there is no box, properties that affect the box model -- sizing (`width`, `height`), margin, padding, border-width, and background -- are ignored by the browser.

## Properties involved

- `width`, `height`, `min-width`, `max-width`, `min-height`, `max-height`
- `inline-size`, `block-size` and their min/max variants
- `margin-top`, `margin-right`, `margin-bottom`, `margin-left` (and logical equivalents)
- `padding-top`, `padding-right`, `padding-bottom`, `padding-left` (and logical equivalents)
- `border-top-width`, `border-right-width`, `border-bottom-width`, `border-left-width` (and logical equivalents)
- `background-color`, `background-image`

## Examples

### Warn

```html
<div style="display: contents; width: 200px; padding: 16px; background-color: red">
  Box properties ignored
</div>
```

### OK

```html
<div style="display: block; width: 200px; padding: 16px; background-color: red">
  Box properties applied
</div>
```

## Writing-mode and direction aware dedup

When both a physical property (e.g. `width`) and its logical counterpart are set, the rule suppresses the physical warning to avoid duplicates. The physical↔logical mapping depends on both `writing-mode` and `direction`:

- In `horizontal-tb` (default): `width`↔`inline-size`, `height`↔`block-size`, `margin-top`↔`margin-block-start`, etc.
- In vertical writing modes (`vertical-rl`, `vertical-lr`, `sideways-rl`, `sideways-lr`): the axes swap — `width`↔`block-size`, `height`↔`inline-size`, `margin-top`↔`margin-inline-start`, etc.
- When `direction: rtl`, inline-start and inline-end swap. For example, `margin-left` maps to `margin-inline-end` (not `margin-inline-start`) and `margin-right` maps to `margin-inline-start` (not `margin-inline-end`). Block-axis and sizing mappings are unaffected.

This ensures correct dedup regardless of writing direction and text direction.

## Common scenarios

This arises when using `display: contents` to flatten a wrapper for flex/grid layout while forgetting to move box-model styles to a child or parent element that still generates a box.
