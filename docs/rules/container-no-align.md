# container-no-align

Detects `align-items` or `justify-content` on non-flex/grid containers.

## Why this is a no-op

The `align-items` and `justify-content` properties are defined by the CSS Box Alignment specification for flex, grid, and (for `justify-content`) multi-column containers. On other display types (e.g. `block`, `inline`), these properties have no effect because the layout algorithm does not use them.

## Properties involved

- `align-items`
- `justify-content`
- `display`

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
```

## Common scenarios

This commonly happens when a developer adds alignment properties but forgets to set `display: flex` or `display: grid`, or when a display value is overridden by a more specific selector without updating the alignment rules.

## Known limitation

The current rule implementation does not recognize multi-column containers. `justify-content` is valid on a multicol container (e.g. a block with `column-count` set), but the rule will incorrectly flag it. See [#157](https://github.com/purupurupu/css-noop-checker/issues/157).
