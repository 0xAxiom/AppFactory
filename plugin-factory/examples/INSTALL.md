# Installation Guide

Decision Memory has two components:

1. **Claude Code Plugin** - Captures decisions during coding sessions
2. **MCP Server** - Stores and queries decisions

You can install both or just the MCP server depending on your needs.

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Claude Code (for plugin features)
- Claude Desktop (for MCP queries)

## Installing the Claude Code Plugin

### Step 1: Copy Plugin to Your Project

```bash
# Navigate to your project
cd /path/to/your/project

# Create plugins directory if it doesn't exist
mkdir -p .claude/plugins

# Copy the plugin (excluding mcp-server)
cp -r /path/to/decision-memory .claude/plugins/
rm -rf .claude/plugins/decision-memory/mcp-server
```

### Step 2: Verify Structure

Your project should now have:

```
your-project/
├── .claude/
│   └── plugins/
│       └── decision-memory/
│           ├── .claude-plugin/
│           │   └── plugin.json
│           ├── commands/
│           │   ├── decision.md
│           │   ├── decisions.md
│           │   ├── decision-search.md
│           │   └── decision-link.md
│           ├── agents/
│           │   └── decision-helper.md
│           ├── hooks/
│           │   └── hooks.json
│           └── scripts/
│               ├── detect-decision.js
│               └── capture-decision.js
```

### Step 3: Reload Claude Code

Restart your Claude Code session to load the plugin.

### Step 4: Verify Installation

```bash
# In Claude Code
/decisions

# Should see: "No decisions recorded for this project yet."
```

## Installing the MCP Server

### Step 1: Install Dependencies

```bash
cd /path/to/decision-memory/mcp-server
npm install
```

### Step 2: Build the Server

```bash
npm run build
```

### Step 3: Test the Server

```bash
# Start the server directly to test
node dist/server/index.js

# Should see: "decision-memory MCP server running on stdio"
# Press Ctrl+C to stop
```

### Step 4: Configure Claude Desktop

Add the server to your Claude Desktop configuration.

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "decision-memory": {
      "command": "node",
      "args": ["/absolute/path/to/decision-memory/mcp-server/dist/server/index.js"]
    }
  }
}
```

**Important**: Use the absolute path to the server.

### Step 5: Restart Claude Desktop

Quit and reopen Claude Desktop for the configuration to take effect.

### Step 6: Verify MCP Server

In Claude Desktop, ask:

```
What architectural decisions have been recorded?
```

You should see a response using the `query_decisions` tool.

## Database Location

Decisions are stored in:

```
~/.decision-memory/decisions.db
```

You can customize this by setting the `DECISION_DB_PATH` environment variable:

```json
{
  "mcpServers": {
    "decision-memory": {
      "command": "node",
      "args": ["/path/to/server/dist/server/index.js"],
      "env": {
        "DECISION_DB_PATH": "/custom/path/decisions.db"
      }
    }
  }
}
```

## Troubleshooting

### Plugin Not Loading

1. Check `.claude-plugin/plugin.json` exists
2. Verify JSON syntax is valid
3. Ensure plugin is in `.claude/plugins/` directory
4. Restart Claude Code

### MCP Server Won't Start

```bash
# Check for errors
cd mcp-server
npm run build
node dist/server/index.js
```

Common issues:

- Missing dependencies: Run `npm install`
- TypeScript errors: Check Node.js version (18+)
- Database permissions: Check `~/.decision-memory/` is writable

### Hook Not Triggering

1. Check `hooks/hooks.json` syntax
2. Verify event name is `PostToolUse` (case-sensitive)
3. Ensure scripts are executable:
   ```bash
   chmod +x scripts/*.js
   ```

### Claude Desktop Not Showing Tools

1. Check `claude_desktop_config.json` syntax
2. Verify path is absolute
3. Restart Claude Desktop completely
4. Check Claude Desktop logs for errors

## Uninstalling

### Remove Claude Code Plugin

```bash
rm -rf /path/to/project/.claude/plugins/decision-memory
```

### Remove MCP Server

1. Remove from `claude_desktop_config.json`
2. Delete server files
3. Optionally delete database:
   ```bash
   rm -rf ~/.decision-memory
   ```

## Next Steps

- See [EXAMPLES.md](./EXAMPLES.md) for usage examples
- Read [SECURITY.md](./SECURITY.md) for security details
