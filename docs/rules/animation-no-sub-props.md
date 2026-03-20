# animation-no-sub-props

Detects animation properties without `animation-name`.

## Why this is a no-op

Animation sub-properties such as `animation-duration`, `animation-delay`, and `animation-timing-function` configure how an animation runs, but they have no visible effect unless an `animation-name` is set. Without a named `@keyframes` animation to reference, the browser has nothing to animate.

## Properties involved

- `animation-name`
- `animation-duration`
- `animation-timing-function`
- `animation-delay`
- `animation-iteration-count`
- `animation-direction`
- `animation-fill-mode`
- `animation-play-state`

## Examples

### Warn

```html
<div style="animation-duration: 2s; animation-delay: 0.5s">No animation runs</div>
```

### OK

```html
<div style="animation-name: fadeIn; animation-duration: 2s">Animates correctly</div>
```

## Common scenarios

This often happens when an `animation-name` is removed during refactoring but the remaining sub-properties are left behind, or when a shorthand `animation` declaration is split into longhand properties and the name is accidentally omitted.
