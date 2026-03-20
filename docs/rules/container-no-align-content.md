# container-no-align-content

Detects `align-content` on a single-line flex container.

## Why this is a no-op

In the original CSS Flexbox Level 1 specification, the `align-content` property distributed space between flex lines along the cross axis. When `flex-wrap` is `nowrap` (the default), the container has only a single flex line, so there was no extra space between lines to distribute.

## Properties involved

- `align-content`
- `flex-wrap`
- `display` (must be a flex container)

## Examples

### Warn

```html
<div style="display: flex; flex-wrap: nowrap; align-content: space-around">
  Single-line flex — align-content ignored
</div>
```

### OK

```html
<div style="display: flex; flex-wrap: wrap; align-content: space-around">
  Multi-line flex — align-content works
</div>
```

## Common scenarios

Developers often confuse `align-content` with `align-items`. Since `flex-wrap` defaults to `nowrap`, setting `align-content` without also enabling wrapping was a frequent mistake.

## Known limitation

This rule is based on the outdated Flexbox Level 1 behavior. Per CSS Box Alignment Level 3 and Flexbox Level 2, `align-content` now works on single-line flex containers (Chrome 129+, Firefox 125+, Safari 17.4+). This rule produces false positives on modern browsers. See [#158](https://github.com/purupurupu/css-noop-checker/issues/158).
