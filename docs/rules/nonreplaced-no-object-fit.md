# nonreplaced-no-object-fit

Detects `object-fit` and `object-position` on non-replaced elements.

## Why this is a no-op

The `object-fit` and `object-position` properties only apply to replaced elements such as `<img>`, `<video>`, and `<canvas>`. These properties control how replaced content is sized and positioned within its box. Non-replaced elements like `<div>` or `<span>` have no replaced content to fit, so the browser ignores these properties.

## Properties involved

- `object-fit`
- `object-position`

## Examples

### Warn

```html
<div style="object-fit: cover; object-position: top">Non-replaced element, no effect</div>
```

### OK

```html
<img src="photo.jpg" style="object-fit: cover; object-position: top" />
```

## Common scenarios

Developers sometimes apply `object-fit: cover` to `<div>` elements expecting image-like scaling behavior, when they should use `background-size: cover` with a background image instead.
