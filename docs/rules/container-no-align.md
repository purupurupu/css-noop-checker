# container-no-align

Detects `align-items` or `justify-content` outside supported alignment containers.

## Why this is a no-op

The `align-items` and `justify-content` properties are defined by the CSS Box Alignment specification for flex, grid, and (for `justify-content`) multi-column containers. On other display types (e.g. `block`, `inline`), these properties have no effect because the layout algorithm does not use them.

## Properties involved

- `align-items`
- `justify-content`
- `display`
- `column-count`
- `column-width`

## Examples

### Warn

```html
<div style="display: block; align-items: center; justify-content: space-between">
  Items are not aligned
</div>
```

### OK

```html
<div style="display: flex; align-items: center; justify-content: space-between">
  Items aligned correctly
</div>
<div style="column-count: 2; justify-content: center">
  justify-content is valid on multi-column containers
</div>
```

## Common scenarios

This commonly happens when a developer adds alignment properties but forgets to set `display: flex` or `display: grid`, or when a display value is overridden by a more specific selector without updating the alignment rules.
