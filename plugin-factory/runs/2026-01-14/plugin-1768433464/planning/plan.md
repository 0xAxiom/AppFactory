# Decision Memory - Implementation Plan

## 1. Plugin Overview

**Name**: decision-memory
**Type**: Hybrid (Claude Code Plugin + MCP Server)
**Description**: A knowledge capture system that automatically detects architectural decisions during Claude Code sessions and makes them permanently queryable. Uses PostToolUse hooks to prompt for reasoning when significant code changes occur, then indexes everything in a local SQLite database accessible via MCP tools.

## 2. Plugin Type Decision

**Decision**: Build BOTH a Claude Code plugin AND an MCP server

**Rationale**:
- **Claude Code Plugin needed for**: PostToolUse hooks to detect decisions in real-time, slash commands for manual decision recording, and session-level integration
- **MCP Server needed for**: Persistent storage, complex queries, cross-project search, and access from Claude Desktop or any MCP client
- **Hybrid approach benefits**: Capture happens where work happens (Claude Code), querying works everywhere (any MCP client)

## 3. Project Structure

```
builds/decision-memory/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── commands/
│   ├── decision.md              # /decision - Record a decision manually
│   ├── decisions.md             # /decisions - List recent decisions
│   ├── decision-search.md       # /decision-search - Quick search
│   └── decision-link.md         # /decision-link - Link to commit
├── agents/
│   └── decision-helper.md       # Agent for writing clear decision docs
├── hooks/
│   └── hooks.json               # PostToolUse hook configuration
├── scripts/
│   ├── detect-decision.js       # Decision detection logic
│   └── capture-decision.js      # Save decision to MCP server
├── mcp-server/
│   ├── package.json
│   ├── tsconfig.json
│   ├── manifest.json            # MCPB manifest
│   ├── server/
│   │   └── index.ts             # MCP server entrypoint
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts        # SQLite schema
│   │   │   └── queries.ts       # Database operations
│   │   ├── tools/
│   │   │   ├── query-decisions.ts
│   │   │   ├── add-decision.ts
│   │   │   ├── get-decision.ts
│   │   │   ├── link-commit.ts
│   │   │   ├── list-projects.ts
│   │   │   └── export-decisions.ts
│   │   ├── resources/
│   │   │   └── decisions.ts     # Decision resources
│   │   ├── prompts/
│   │   │   └── why-prompt.ts    # Query templates
│   │   └── utils/
│   │       ├── git.ts           # Git integration
│   │       └── search.ts        # Full-text search
│   └── .env.example
├── README.md
├── INSTALL.md
├── SECURITY.md
└── EXAMPLES.md
```

## 4. Components

### 4.1 Claude Code Plugin - Commands

| Command | Purpose | Arguments |
|---------|---------|-----------|
| `/decision` | Record an architectural decision | `[reason]` - The reasoning |
| `/decisions` | List recent decisions | `[--count N]` - Number to show |
| `/decision-search` | Search decisions | `[query]` - Search terms |
| `/decision-link` | Link decision to commit | `[commit-hash]` - Git commit |

### 4.2 Claude Code Plugin - Agent

| Agent | Purpose |
|-------|---------|
| `decision-helper` | Takes rough notes about a decision and reformats into a clear, searchable, context-rich entry with proper tags and file references |

### 4.3 Claude Code Plugin - Hook

**Event**: `PostToolUse`

**Matchers**:
- `Write` to package.json, config files, schema files
- `Write` creating new directories
- `Edit` with significant changes to architectural files

**Behavior**:
1. Check if tool result matches decision criteria
2. If match, signal that a decision was detected
3. Pass context to capture script for processing

### 4.4 MCP Server - Tools

| Tool | Description | Inputs |
|------|-------------|--------|
| `query_decisions` | Natural language search | `query`, `project?`, `since?`, `until?`, `files?` |
| `get_decision` | Get decision by ID | `id` |
| `add_decision` | Add new decision | `project`, `files`, `reasoning`, `commit?`, `tags?` |
| `link_commit` | Link decision to commit | `decision_id`, `commit_hash` |
| `list_projects` | List all projects | none |
| `export_decisions` | Export as MD/JSON/ADR | `project?`, `format` |

### 4.5 MCP Server - Resources

| Resource URI | Description |
|--------------|-------------|
| `decisions://recent` | Last 20 decisions |
| `decisions://project/{path}` | Decisions for project |
| `decisions://file/{path}` | Decisions for file |

### 4.6 MCP Server - Prompts

| Prompt | Description |
|--------|-------------|
| `why_prompt` | Template for "why" questions |
| `decision_summary` | Generate onboarding summary |

## 5. Security Model

### Permissions Required

| Permission | Scope | Justification |
|------------|-------|---------------|
| Filesystem Read | `~/.decision-memory/` | Read decision database |
| Filesystem Write | `~/.decision-memory/` | Write decisions |
| Process Spawn | `git` | Get commit hashes |

### Permissions NOT Required

- Network access (all local)
- Access to source code contents (only file paths)
- Credentials or secrets

### Data Handling

- All data stored locally in `~/.decision-memory/decisions.db`
- File paths recorded, NOT file contents
- User reasoning stored verbatim
- No telemetry or external reporting

## 6. Installation Steps

### Claude Code Plugin

1. Copy `decision-memory/` (excluding `mcp-server/`) to project's `.claude/plugins/` directory
2. Reload Claude Code session
3. Verify with `/decision test` command

### MCP Server

1. Navigate to `mcp-server/` directory
2. Run `npm install`
3. Run `npm run build`
4. Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "decision-memory": {
      "command": "node",
      "args": ["/path/to/decision-memory/mcp-server/dist/server/index.js"]
    }
  }
}
```
5. Restart Claude Desktop

## 7. Verification Steps

### Plugin Verification

1. Open Claude Code in a project
2. Run `/decisions` - should show empty list
3. Run `/decision "Testing initial setup"`
4. Run `/decisions` - should show the test decision
5. Make a change to `package.json`
6. Observe decision detection prompt

### MCP Server Verification

1. Open Claude Desktop
2. Ask: "What decisions have been recorded?"
3. Should see response using `query_decisions` tool
4. Ask: "Why do we use [some dependency]?"
5. Should search and return relevant decisions

## 8. Distribution Plan

### Local Installation

- Copy plugin directory to project
- Run npm install for MCP server
- Configure Claude Desktop

### GitHub Release

- Repository with installation instructions
- Tagged releases for versioning
- Issue tracker for bugs/features

### Future: Marketplace

- Submit to Claude Code plugin marketplace when available
- MCPB bundle for MCP server distribution

---

## Implementation Order

1. **MCP Server first** - Core storage and query infrastructure
2. **Claude Code commands** - Manual decision recording
3. **Hook system** - Automatic detection
4. **Agent** - Decision writing helper
5. **Resources and prompts** - Enhanced query experience
6. **Documentation** - README, INSTALL, SECURITY, EXAMPLES
