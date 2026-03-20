# inline-no-box-sizing

Detects `box-sizing` on non-replaced inline elements.

## Why this is a no-op

The `box-sizing` property controls how `width` and `height` are calculated (whether they include padding and border). Non-replaced inline elements ignore `width` and `height` entirely, so `box-sizing` has no effect. This rule only flags explicitly authored `box-sizing` to avoid false positives from universal resets like `* { box-sizing: border-box }`.

## Properties involved

- `box-sizing`
- `display`

## Examples

### Warn

```html
<span style="box-sizing: border-box">...</span>
```

### OK

```html
<span style="display: inline-block; box-sizing: border-box">...</span>
```

## Common scenarios

This typically occurs when a universal `box-sizing: border-box` reset is overridden on a specific inline element, or when an element's display is changed to `inline` without removing `box-sizing`.
