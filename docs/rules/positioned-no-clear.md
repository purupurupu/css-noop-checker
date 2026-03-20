# positioned-no-clear

Detects `clear` on absolutely or fixed positioned elements.

## Why this is a no-op

The `clear` property controls whether an element moves below preceding floats in normal flow. Absolutely and fixed positioned elements are removed from normal flow entirely, so they do not interact with floats. The browser ignores `clear` on out-of-flow elements.

## Properties involved

- `clear`
- `position`

## Examples

### Warn

```html
<div style="position: absolute; clear: both">Out of flow, clear is ignored</div>
```

### OK

```html
<div style="clear: both">Clears floats in normal flow</div>
```

## Common scenarios

This occurs when developers add `position: absolute` or `position: fixed` to an element that previously used `clear` for float clearing, without removing the now-unnecessary `clear` declaration.
