# container-no-place

Detects `place-items` outside grid, flex, or block layout.

## Why this is a no-op

The `place-items` shorthand sets `align-items` and `justify-items` simultaneously. In current Chromium, grid supports both halves, flex supports the `align-items` half, and block layout supports the `justify-items` half. Because of that, `place-items` should only be treated as a no-op when neither half is effective for the current layout mode.

**Note:** `place-content` is intentionally NOT checked by this rule. `place-content` is a shorthand for `align-content` and `justify-content`. Since `align-content` works in block layout (Chrome 123+), `place-content` is at least partially effective on block containers and should not be flagged as a complete no-op.

## Properties involved

- `place-items`
- `display`

## Examples

### Warn

```html
<span style="display: inline; place-items: center">No effect in inline layout</span>
```

### OK

```html
<div style="display: grid; place-items: center">Centered in grid</div>
<div style="display: block; place-items: center">justify-items half is effective</div>
```

## Common scenarios

The popular one-liner `display: grid; place-items: center` sometimes loses its grid context during refactors. The remaining declaration may still be partially effective in flex or block layout, so this rule only warns when Chromium treats the shorthand as fully ineffective.
