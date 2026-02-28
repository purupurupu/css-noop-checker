# css-noop-checker MCP Server

MCP server that exposes CSS no-op detection rules as tools. Uses Playwright to open pages, extract computed styles from all elements, and analyze them with the rules engine.

## Tools

| Tool | Description |
| --- | --- |
| `list_rules` | List all available CSS no-op detection rules |
| `analyze_element(url, selector)` | Analyze a specific element for violations |
| `scan_page(url)` | Scan all elements on a page for violations |

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

- Node.js
- Playwright (downloads Chromium on first launch)
