# scroll-snap-no-align-without-type

Detects scroll-snap child properties without parent `scroll-snap-type`.

## Why this is a no-op

`scroll-snap-align` and `scroll-snap-stop` only work on children of a scroll snap container. A scroll snap container is established by setting `scroll-snap-type` on the parent element. Without it, the child snap properties are completely ignored.

## Properties involved

- `scroll-snap-align`
- `scroll-snap-stop`
- `scroll-snap-type` (parent)

## Examples

### Warn

```html
<div>
  <div style="scroll-snap-align: start">...</div>
</div>
```

### OK

```html
<div style="scroll-snap-type: y mandatory; overflow: auto">
  <div style="scroll-snap-align: start">...</div>
</div>
```

## Common scenarios

Developers often set `scroll-snap-align` on list items but forget to add `scroll-snap-type` to the scrolling parent. This also occurs when the snap container markup is refactored and the type declaration ends up on a different ancestor.
