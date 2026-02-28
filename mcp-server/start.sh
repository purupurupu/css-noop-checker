#!/bin/bash
cd "$(dirname "$0")/.."
exec npx tsx mcp-server/src/index.ts
