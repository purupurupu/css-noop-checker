# item-no-self-align

Detects `align-self` on elements that are not flex or grid items.

## Why this is a no-op

The `align-self` property only applies to flex items and grid items. In block layout, there is no cross-axis alignment concept, so the browser ignores `align-self`. The element must participate in a flex or grid formatting context for this property to take effect.

## Properties involved

- `align-self`
- Parent `display`

## Examples

### Warn

```html
<div style="display: block">
  <div style="align-self: center">No effect in block layout</div>
</div>
```

### OK

```html
<div style="display: flex">
  <div style="align-self: center">Centered on cross axis</div>
</div>
```

## Common scenarios

Developers sometimes apply `align-self` to elements inside a block container expecting vertical centering. This property requires the parent to be a flex or grid container to function.
