# item-no-flex-props

Detects flex item properties (`flex-grow`, `flex-shrink`, `flex-basis`) on elements that are not flex items.

## Why this is a no-op

The properties `flex-grow`, `flex-shrink`, and `flex-basis` only apply to direct children of a flex container (`display: flex` or `display: inline-flex`). When set on elements whose parent is not a flex container, these properties are ignored. Note that unlike `order` and `align-self`, these properties are flex-specific and do not apply to grid items.

## Properties involved

- `flex-grow`
- `flex-shrink`
- `flex-basis`
- Parent `display`

## Examples

### Warn

```html
<div>
  <div style="flex-grow: 1; flex-basis: 0">...</div>
</div>
```

### OK

```html
<div style="display: flex">
  <div style="flex-grow: 1; flex-basis: 0">...</div>
</div>
```

## Common scenarios

This typically occurs when a parent's `display: flex` is removed during refactoring but child flex properties remain, or when flex properties are copied from a flex layout context into a non-flex container.
