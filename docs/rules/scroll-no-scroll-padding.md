# scroll-no-scroll-padding

Detects scroll-padding on non-scroll containers.

## Why this is a no-op

The `scroll-padding` properties only apply to scroll containers -- elements whose `overflow` is `auto`, `scroll`, or `hidden`. When overflow is `visible` or `clip`, the element does not establish a scroll container, so any scroll-padding values are ignored by the browser.

Special viewport cases:

- On `<html>`, `scroll-padding` targets viewport scrolling and is meaningful.
- On `<body>`, `scroll-padding` is only treated as meaningful when the root `<html>` element still has `overflow: visible`; otherwise the root establishes its own scroll container and the body's scroll-padding does not apply automatically.

## Properties involved

- `scroll-padding-top`
- `scroll-padding-right`
- `scroll-padding-bottom`
- `scroll-padding-left`
- `scroll-padding-block-start`
- `scroll-padding-block-end`
- `scroll-padding-inline-start`
- `scroll-padding-inline-end`
- `overflow-x`
- `overflow-y`

## Examples

### Warn

```html
<div style="overflow: visible; scroll-padding-top: 20px">...</div>
```

### OK

```html
<div style="overflow: auto; scroll-padding-top: 20px">...</div>
```

## Common scenarios

This commonly happens when developers add scroll-padding for scroll-snap alignment but forget to set overflow on the container, or when overflow is later removed during refactoring.
