# nonreplaced-no-aspect-ratio

Detects `aspect-ratio` on inline non-replaced elements where it has no effect.

## Why this is a no-op

The `aspect-ratio` property has no effect on inline non-replaced elements. Inline boxes do not have an intrinsic sizing concept that `aspect-ratio` can influence. Only block-level, inline-block, or replaced elements (like `<img>` and `<video>`) honor this property.

## Properties involved

- `aspect-ratio`
- `display`

## Examples

### Warn

```html
<span style="aspect-ratio: 16/9">Inline non-replaced, no effect</span>
```

### OK

```html
<span style="display: inline-block; aspect-ratio: 16/9"> Works with inline-block </span>
```

## Common scenarios

This occurs when `aspect-ratio` is applied to inline elements like `<span>` or `<a>` without changing their display value to `block` or `inline-block`.
