# outline-no-style

Detects `outline-width`, `outline-color`, and `outline-offset` without `outline-style` being set.

## Why this is a no-op

When `outline-style` is `none` (the default), no outline is rendered regardless of other outline properties. Setting `outline-width`, `outline-color`, or `outline-offset` without an `outline-style` has no visible effect because there is no outline to style.

## Properties involved

- `outline-style`
- `outline-width`
- `outline-color`
- `outline-offset`

## Examples

### Warn

```html
<div style="outline-width: 3px; outline-color: red">No outline-style, invisible</div>
```

### OK

```html
<div style="outline: 3px solid red">Outline is visible</div>
```

## Common scenarios

Developers may set individual outline properties (width, color, offset) without realizing that `outline-style` defaults to `none`. Using the `outline` shorthand avoids this issue since it sets all sub-properties at once.
