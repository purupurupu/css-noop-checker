# css-noop-checker MCP Server

MCP server that exposes CSS no-op detection rules as tools. Uses Playwright to open pages, extract computed styles from all elements, and analyze them with the rules engine.

## Prerequisites

- Node.js 24+ and pnpm 10+ (managed via `.mise.toml` in repo root)
- Run `pnpm install` from the workspace root (not from `mcp-server/` directly)

## Tools

| Tool              | Parameters                                         | Description                                                    |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `list_rules`      | _(none)_                                           | List all available CSS no-op detection rules                   |
| `analyze_element` | `url` (string), `selector` (string, max 500 chars) | Analyze a specific element for violations                      |
| `scan_page`       | `url` (string)                                     | Scan all elements on a page for violations (5,000 element cap) |

All URL parameters require `http:` or `https:` scheme. Private/internal addresses are rejected (SSRF protection).

## Setup

### This project only

The `.mcp.json` at the project root auto-registers the server. Just start Claude Code in this repository.

### All projects (user scope)

```bash
claude mcp add --transport stdio --scope user css-noop-checker -- /path/to/css-noop-checker/mcp-server/start.sh
```

`start.sh` handles `cd` into the repository and launches `npx tsx`. The `--scope user` flag stores the config in `~/.claude.json`, making it available from any project.

### Verify

Run `/mcp` inside Claude Code and confirm `css-noop-checker` shows as connected.

## Dependencies

| Package                     | Purpose                                                                   |
| --------------------------- | ------------------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | MCP protocol server implementation                                        |
| `playwright`                | Browser automation for page analysis (downloads Chromium on first launch) |
| `zod`                       | Input schema validation for tool parameters                               |

The rules engine (`src/rules/`) and extraction helpers (`e2e/helpers/`) are imported directly from the parent workspace — not published as separate packages.
