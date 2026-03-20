# item-no-float

Detects `float` on flex or grid items.

## Why this is a no-op

The CSS specification states that `float` is ignored for elements that are flex items or grid items. When an element participates in a flex or grid formatting context, the float property has no effect because flex and grid layouts provide their own alignment and positioning mechanisms.

## Properties involved

- `float`
- Parent `display`

## Examples

### Warn

```html
<div style="display: flex">
  <div style="float: left">...</div>
</div>
```

### OK

```html
<div>
  <div style="float: left">...</div>
</div>
```

## Common scenarios

This commonly happens when migrating a float-based layout to flexbox or grid without removing the legacy `float` declarations, or when a utility class adds `float` to an element that is already inside a flex or grid container.
