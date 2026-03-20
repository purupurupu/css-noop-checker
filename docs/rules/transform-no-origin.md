# transform-no-origin

Detects `transform-origin` without an active transform.

## Why this is a no-op

`transform-origin` defines the point around which transformations are applied. Without an active `transform`, `rotate`, or `scale` property, there is nothing for the origin to affect. Note that `translate` is not considered here because transform-origin has no visual effect on pure translations (the origin offset cancels out).

## Properties involved

- `transform-origin`
- `transform`
- `rotate`
- `scale`
- `will-change`
- `offset-path`

## Examples

### Warn

```html
<div style="transform-origin: top left">...</div>
```

### OK

```html
<div style="transform: rotate(45deg); transform-origin: top left">...</div>
```

## Common scenarios

Developers sometimes set `transform-origin` in preparation for a transform that is toggled via JavaScript or CSS transitions, but forget to add `will-change: transform` to signal the intent. This also occurs when a transform is removed but the origin remains.
