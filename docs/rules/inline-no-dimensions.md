# inline-no-dimensions

Detects `width` or `height` on non-replaced inline elements.

## Why this is a no-op

Per the CSS specification, non-replaced inline elements (such as `<span>`) do not accept explicit `width` or `height`. Their dimensions are determined entirely by their content and line-height. Setting `width` or `height` on these elements is silently ignored by the browser.

## Properties involved

- `width`
- `height`
- `display`

## Examples

### Warn

```html
<span style="width: 200px; height: 100px">...</span>
```

### OK

```html
<span style="display: inline-block; width: 200px; height: 100px">...</span>
```

## Common scenarios

Developers often encounter this when styling `<span>`, `<a>`, or `<em>` elements with explicit dimensions, not realizing these are inline by default and need `display: inline-block` or `display: block` to accept sizing.
