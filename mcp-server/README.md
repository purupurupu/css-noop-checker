# css-noop-checker MCP Server

MCP server that exposes CSS no-op detection rules as tools. Uses Playwright to open pages, extract computed styles from all elements, and analyze them with the rules engine.

This is a long-running stdio server — it stays running and communicates over stdin/stdout using the MCP protocol. It is designed to be launched by an MCP client (e.g., Claude Code, Cursor), not run interactively.

## Prerequisites

Playwright requires a Chromium browser binary. Install it once before first use:

```bash
npx playwright install chromium
```

If the browser is missing, the server will print a helpful error message with this command.

## Quick Start (npx)

```bash
npx css-noop-checker-mcp
```

### Claude Code

Add the MCP server to Claude Code:

```bash
claude mcp add --transport stdio css-noop-checker-mcp -- npx css-noop-checker-mcp
```

Or add it to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "css-noop-checker": {
      "command": "npx",
      "args": ["css-noop-checker-mcp"]
    }
  }
}
```

### Cursor / VS Code

Add to `.cursor/mcp.json` or VS Code MCP settings:

```json
{
  "mcpServers": {
    "css-noop-checker": {
      "command": "npx",
      "args": ["css-noop-checker-mcp"]
    }
  }
}
```

## Tools

| Tool              | Parameters                                         | Description                                                    |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `list_rules`      | _(none)_                                           | List all available CSS no-op detection rules                   |
| `analyze_element` | `url` (string), `selector` (string, max 500 chars) | Analyze a specific element for violations                      |
| `scan_page`       | `url` (string)                                     | Scan all elements on a page for violations (5,000 element cap) |

All URL parameters require `http:` or `https:` scheme. Private/internal addresses are rejected (SSRF protection).

## Development

### From the monorepo

The `.mcp.json` at the project root registers the server for development via `start.sh`. Just start Claude Code in this repository.

To run directly with tsx (no build step):

```bash
pnpm start
```

Or register the start script for user-wide access:

```bash
claude mcp add --transport stdio --scope user css-noop-checker -- /path/to/css-noop-checker/mcp-server/start.sh
```

### Building

```bash
cd mcp-server
pnpm build
```

This bundles the rules engine and extraction helpers into a self-contained `dist/index.js`. Runtime dependencies (`playwright`, `@modelcontextprotocol/sdk`, `zod`) remain external.

## Dependencies

| Package                     | Purpose                                                                           |
| --------------------------- | --------------------------------------------------------------------------------- |
| `@modelcontextprotocol/sdk` | MCP protocol server implementation                                                |
| `playwright`                | Browser automation for page analysis (requires `npx playwright install chromium`) |
| `zod`                       | Input schema validation for tool parameters                                       |
