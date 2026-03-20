# inline-no-overflow

Detects `overflow` on non-replaced inline elements.

## Why this is a no-op

The `overflow` property controls how content that exceeds an element's box is handled. Non-replaced inline elements do not establish a box that can be overflowed, so `overflow` (including `hidden`, `scroll`, `auto`, and `clip`) has no visual effect on them.

## Properties involved

- `overflow` (`overflow-x`, `overflow-y`)
- `display`

## Examples

### Warn

```html
<span style="overflow: hidden">...</span>
```

### OK

```html
<span style="display: inline-block; overflow: hidden">...</span>
```

## Common scenarios

Developers commonly apply `overflow: hidden` to inline elements expecting text truncation or clipping, but the element must be block-level or inline-block for overflow behavior to take effect.
