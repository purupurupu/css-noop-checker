# contents-no-position

Detects positioning properties on `display: contents` elements.

## Why this is a no-op

Elements with `display: contents` do not generate a box in the layout tree. Since positioning (`position`, offset properties, and `z-index`) operates on the element's box, these properties are ignored when there is no box to position. The element's children participate in layout as if the `display: contents` wrapper did not exist.

## Properties involved

- `position`
- `top`, `right`, `bottom`, `left`
- `inset-block-start`, `inset-block-end`, `inset-inline-start`, `inset-inline-end`
- `z-index`

## Examples

### Warn

```html
<div style="display: contents; position: absolute; top: 10px; z-index: 5">Positioning ignored</div>
```

### OK

```html
<div style="display: block; position: absolute; top: 10px; z-index: 5">Positioned correctly</div>
```

## Common scenarios

This happens when adding `display: contents` to a previously positioned element (e.g. to flatten it for grid layout) without moving the positioning styles to another element that still generates a box.
