# Per-Rule Documentation Design

**Issue:** #135
**Date:** 2026-03-20

## Goal

Create `docs/rules/<rule-id>.md` for each of the ~40 rules, explaining why the CSS property combination is a no-op. Serves two audiences: developers learning CSS layout and AI agents consuming MCP server output.

## Template

Each rule doc follows this concise format (~30-50 lines):

```markdown
# <rule-id>

<One-sentence description of what this rule detects.>

## Why this is a no-op

<2-3 sentences explaining the CSS spec reason.>

## Properties involved

- `property-a`
- `property-b`

## Examples

### Warn

\`\`\`html
<element style="...">...</element>
\`\`\`

### OK

\`\`\`html
<element style="...">...</element>
\`\`\`

## Common scenarios

<1-2 sentences on when developers typically hit this.>
```

## Content sources

- **Description / explanation**: derived from each rule's `title`, `details`, and `suggestion` fields in the rule source file
- **Examples**: derived from `examples/test.html` test cases and rule source code
- **Category**: matches README groupings (Inline, Block, Container, Item, Static, Positioned, Table, Overflow, Scroll, Transform, Animation, Other)

## Design decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Format | Concise (~30-50 lines) | Maintainable for 40+ rules, scannable |
| Spec links | None | Rot fast, add maintenance burden |
| File location | `docs/rules/<rule-id>.md` | Matches issue request |
| One file per rule | Yes | Easy to find, link, and update independently |

## Scope

All rules listed in README "Detected Patterns" section — currently 40 rules across 12 categories.

## Out of scope

- Index page or navigation (can be added later)
- Deep CSS spec references
- Interactive examples
