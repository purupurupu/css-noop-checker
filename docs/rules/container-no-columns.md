# container-no-columns

Detects `column-count` or `column-width` on flex/grid containers.

## Why this is a no-op

The CSS Multi-column Layout specification defines `column-count` and `column-width` for block-level containers only. When an element is a flex or grid container, the multi-column properties are ignored because the flex/grid layout algorithm takes precedence and does not support column fragmentation.

## Properties involved

- `column-count`
- `column-width`
- `display`

## Examples

### Warn

```html
<div style="display: flex; column-count: 3">Not a multi-column layout</div>
```

### OK

```html
<div style="display: block; column-count: 3">Three-column layout</div>
```

## Common scenarios

This can happen when changing an element from `display: block` to `display: flex` or `display: grid` without removing the multi-column properties, or when attempting to combine multi-column and flexbox layouts on the same element.
