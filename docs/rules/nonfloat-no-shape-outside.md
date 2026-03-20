# nonfloat-no-shape-outside

Detects `shape-outside`, `shape-margin`, and `shape-image-threshold` on non-floated elements.

## Why this is a no-op

CSS Shapes properties (`shape-outside`, `shape-margin`, `shape-image-threshold`) only apply to floated elements. The CSS Shapes specification requires an active float for inline content to wrap around a shape. On non-floated elements, or on flex/grid items where float is ignored, these properties have no effect.

## Properties involved

- `shape-outside`
- `shape-margin`
- `shape-image-threshold`
- `float`

## Examples

### Warn

```html
<div style="shape-outside: circle(50%); shape-margin: 10px">Not floated, shapes ignored</div>
```

### OK

```html
<div style="float: left; shape-outside: circle(50%); shape-margin: 10px">
  Content wraps around the circle
</div>
```

## Common scenarios

Developers may forget to add `float` when setting up CSS Shapes, or the float may be suppressed because the element is a flex or grid item.
