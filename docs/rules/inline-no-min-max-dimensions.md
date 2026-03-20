# inline-no-min-max-dimensions

Detects `min-width`, `max-width`, `min-height`, or `max-height` on non-replaced inline elements.

## Why this is a no-op

Non-replaced inline elements do not participate in the box-sizing model for width and height. Since `min-width`, `max-width`, `min-height`, and `max-height` constrain the element's box dimensions, they have no effect on elements that ignore explicit sizing altogether.

## Properties involved

- `min-width`
- `max-width`
- `min-height`
- `max-height`
- `display`

## Examples

### Warn

```html
<span style="min-width: 100px; max-height: 50px">...</span>
```

### OK

```html
<span style="display: inline-block; min-width: 100px">...</span>
```

## Common scenarios

Developers often set min/max constraints on inline elements when building responsive layouts, not realizing the element must be block-level or inline-block to honor these constraints.
