# contents-no-position

Detects positioning properties on `display: contents` elements.

## Why this is a no-op

Elements with `display: contents` do not generate a box in the layout tree. Since positioning (`position`, offset properties, and `z-index`) operates on the element's box, these properties are ignored when there is no box to position. The element's children participate in layout as if the `display: contents` wrapper did not exist.

## Properties involved

- `position`
- `top`, `right`, `bottom`, `left`
- `inset-block-start`, `inset-block-end`, `inset-inline-start`, `inset-inline-end`
- `z-index`

## Examples

### Warn

```html
<div style="display: contents; position: absolute; top: 10px; z-index: 5">Positioning ignored</div>
```

### OK

```html
<div style="display: block; position: absolute; top: 10px; z-index: 5">Positioned correctly</div>
```

## Writing-mode and direction aware dedup

When both a physical offset (e.g. `top`) and its logical counterpart are set, the rule suppresses the physical warning to avoid duplicates. The physical↔logical mapping depends on both `writing-mode` and `direction`:

| Writing mode                | `top` maps to        | `right` maps to     | `bottom` maps to     | `left` maps to       |
| --------------------------- | -------------------- | ------------------- | -------------------- | -------------------- |
| `horizontal-tb` (default)   | `inset-block-start`  | `inset-inline-end`  | `inset-block-end`    | `inset-inline-start` |
| `vertical-rl`/`sideways-rl` | `inset-inline-start` | `inset-block-start` | `inset-inline-end`   | `inset-block-end`    |
| `vertical-lr`               | `inset-inline-start` | `inset-block-end`   | `inset-inline-end`   | `inset-block-start`  |
| `sideways-lr`               | `inset-inline-end`   | `inset-block-end`   | `inset-inline-start` | `inset-block-start`  |

When `direction: rtl`, inline-start and inline-end swap. For example, in `horizontal-tb` + `rtl`, `left` maps to `inset-inline-end` and `right` maps to `inset-inline-start`. Block-axis mappings are unaffected by direction.

## Common scenarios

This happens when adding `display: contents` to a previously positioned element (e.g. to flatten it for grid layout) without moving the positioning styles to another element that still generates a box.
