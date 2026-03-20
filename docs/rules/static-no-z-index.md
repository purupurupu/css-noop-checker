# static-no-z-index

Detects `z-index` on static elements that are not flex/grid items and do not create a stacking context.

## Why this is a no-op

`z-index` requires the element to participate in stacking context ordering. It works on positioned elements (`relative`, `absolute`, `fixed`, `sticky`), flex/grid items, or elements that create a stacking context through other means (e.g., `opacity` less than 1, `transform`, `filter`). On a plain statically positioned element, `z-index` is ignored.

## Properties involved

- `z-index`
- `position`
- `opacity`, `transform`, `filter`, `isolation`, and other stacking-context triggers

## Examples

### Warn

```html
<div style="position: static; z-index: 10">...</div>
```

### OK

```html
<div style="position: relative; z-index: 10">...</div>
```

## Common scenarios

Developers frequently set `z-index` expecting it to control stacking order without setting a non-static position. This also happens when an element is taken out of a flex/grid container where `z-index` previously worked.
