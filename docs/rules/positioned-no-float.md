# positioned-no-float

Detects `float` on absolutely or fixed positioned elements.

## Why this is a no-op

Per CSS 2.1 section 9.7, when an element has `position: absolute` or `position: fixed`, the browser computes `float` to `none`. Out-of-flow positioned elements are removed from normal flow and do not participate in float layout. Any explicit `float` value is silently overridden.

## Properties involved

- `float`
- `position`

## Examples

### Warn

```html
<div style="position: absolute; float: left">Float is computed to none</div>
```

### OK

```html
<div style="float: left">Floats normally in flow</div>
```

## Common scenarios

This typically happens when `position: absolute` is added to a previously floated element, or when both `float` and absolute positioning are applied in an attempt to combine their effects. Only inline `float` styles are detected, as the browser resolves computed `float` to `none` for these elements.
