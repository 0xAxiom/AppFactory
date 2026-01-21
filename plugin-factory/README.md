# plugin-factory

**Claude Plugin Pipeline** | Part of [App Factory](../README.md)

Describe a plugin idea. Get a complete, publishable Claude extension.

---

## Who Is This For?

- Developers building Claude Code extensions
- Builders creating MCP servers for Claude Desktop
- Anyone who wants to extend Claude's capabilities

**Not for you if:** You need a mobile app (use [app-factory](../app-factory/)) or a web app (use [dapp-factory](../dapp-factory/))

---

## Plugin Types

### 1. Claude Code Plugins

Project-local extensions that add commands, hooks, agents, and skills to Claude Code.

**Use when:**

- Adding slash commands (`/format`, `/todo`, etc.)
- Reacting to Claude Code events (file saves, tool usage)
- Creating custom agents or skills
- Building project-specific tooling

### 2. MCP Servers (Desktop Extensions)

Model Context Protocol servers that give Claude access to external data and tools.

**Use when:**

- Connecting Claude to databases, APIs, or services
- Providing Claude with real-time data
- Building tools that work across applications
- Creating shareable extensions with one-click install (.mcpb)

---

## Quickstart

```bash
cd plugin-factory
claude
```

**You:** "Build a plugin that formats code on save"

**Claude:**

1. Normalizes your intent into a product specification
2. Creates a comprehensive plan with plugin type decision
3. Builds complete plugin with all files
4. Writes documentation (README, INSTALL, SECURITY, EXAMPLES)
5. Runs Ralph Polish Loop until quality passes

**When done:**

For Claude Code plugins:

```bash
# Copy to your project
cp -r builds/code-formatter/ /path/to/your/project/
# Reload Claude Code
```

For MCP servers:

```bash
cd builds/my-mcp-server
npm install
npm run build
# Add to claude_desktop_config.json
# Restart Claude Desktop
```

---

## What Gets Generated

### Claude Code Plugin

```
builds/my-plugin/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── commands/
│   └── my-command.md         # Slash commands
├── hooks/
│   └── hooks.json            # Event handlers
├── scripts/
│   └── hook-script.sh        # Scripts for hooks
├── README.md                 # User documentation
├── INSTALL.md                # Installation guide
├── SECURITY.md               # Security documentation
└── EXAMPLES.md               # Usage examples
```

### MCP Server

```
builds/my-server/
├── manifest.json             # MCPB manifest
├── server/
│   └── index.ts              # Server entrypoint
├── src/
│   ├── tools/                # Tool implementations
│   └── resources/            # Resource providers
├── package.json
├── tsconfig.json
├── README.md
├── INSTALL.md
├── SECURITY.md
├── EXAMPLES.md
└── MCPB_PACKAGING.md         # How to create .mcpb bundle
```

---

## The Pipeline

```
PHASE 0: Intent Normalization  → Upgrade "I want a plugin that..." to product spec
PHASE 1: Plan                  → Comprehensive plan with type decision
PHASE 2: Build                 → Complete implementation
PHASE 3: Docs & Distribution   → README, INSTALL, SECURITY, EXAMPLES
PHASE 4: Ralph Polish Loop     → QA until ≥97% quality (max 3 iterations)
```

---

## Quality Standards

Every plugin must pass Ralph's quality checklist:

### Claude Code Plugin

- Valid plugin.json in .claude-plugin/
- Commands at plugin ROOT (not inside .claude-plugin/)
- Hooks reference existing scripts
- No hardcoded secrets
- Complete documentation

### MCP Server

- `npm install` completes
- `npm run build` compiles
- Server starts without errors
- Tools have Zod input validation
- MCPB packaging instructions included

---

## Technology Stack

### Claude Code Plugins

| Component | Format                         |
| --------- | ------------------------------ |
| Manifest  | JSON (plugin.json)             |
| Commands  | Markdown with YAML frontmatter |
| Hooks     | JSON configuration             |
| Scripts   | Shell or Node.js               |

### MCP Servers

| Component         | Technology                |
| ----------------- | ------------------------- |
| Runtime           | Node.js 18+               |
| Language          | TypeScript                |
| SDK               | @modelcontextprotocol/sdk |
| Schema Validation | Zod                       |
| Transport         | STDIO (local)             |

---

## Examples

### Example 1: Command Plugin

**You say:** "A plugin that adds a /commit command for smart git commits"

**You get:**

- `.claude-plugin/plugin.json` with manifest
- `commands/commit.md` with commit logic
- Documentation explaining how it works
- Examples of usage

### Example 2: Hook Plugin

**You say:** "A plugin that auto-formats code after every save"

**You get:**

- `hooks/hooks.json` with PostToolUse hook
- `scripts/format.sh` that detects file type and runs formatters
- Configuration instructions
- Graceful handling when formatters aren't installed

### Example 3: MCP Server

**You say:** "An MCP server that queries my PostgreSQL database"

**You get:**

- Complete TypeScript server with `query_database` tool
- Zod schema for input validation
- Environment variable configuration
- MCPB packaging instructions
- Security documentation for database credentials

---

## Directory Structure

```
plugin-factory/
├── CLAUDE.md               # Constitution (how Claude operates)
├── README.md               # This file
├── templates/
│   ├── system/
│   │   ├── auto_plan_mode.md
│   │   └── ralph_polish_loop.md
│   └── plugin/
│       ├── claude_code_plugin/   # Starter scaffold
│       └── mcp_server/           # Starter scaffold
├── examples/               # Comprehensive example with both plugin types
│   ├── .claude-plugin/     # Claude Code plugin manifest
│   ├── commands/           # Slash commands
│   ├── agents/             # Agent definitions
│   ├── hooks/              # Event hooks
│   ├── mcp-server/         # MCP server implementation
│   └── scripts/            # Hook scripts
├── builds/                 # Generated plugins (output)
└── runs/                   # Execution logs
```

---

## PASS/FAIL Criteria

### PASS

- All required files exist
- Valid JSON in manifest files
- Components in correct locations
- No hardcoded secrets
- Documentation complete
- Ralph gives PASS verdict

### FAIL

- Missing required files
- Invalid JSON syntax
- Components in wrong location (e.g., commands inside .claude-plugin/)
- Hardcoded secrets found
- Missing security documentation
- Ralph gives 3 FAIL verdicts

---

## Troubleshooting

### "Plugin not loading"

1. Check `.claude-plugin/plugin.json` exists
2. Verify JSON syntax is valid
3. Ensure commands/hooks are at plugin ROOT

### "Hook not triggering"

1. Event names are case-sensitive: `PostToolUse` not `postToolUse`
2. Check matcher regex is valid
3. Ensure script is executable: `chmod +x scripts/hook.sh`

### "MCP server won't start"

```bash
npm run build
node dist/server/index.js
# Check console for errors
```

### "Ralph fails 3 times"

Plugin is a hard failure. Check `runs/.../polish/ralph_final_verdict.md` for unresolved issues.

---

## Links

- **Root README:** [../README.md](../README.md)
- **Constitution:** [CLAUDE.md](./CLAUDE.md)
- **Mobile apps:** [app-factory](../app-factory/)
- **Web apps:** [dapp-factory](../dapp-factory/)
- **AI agents:** [agent-factory](../agent-factory/)

---

## Resources

- [Claude Code Plugins Reference](https://code.claude.com/docs/en/plugins-reference)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCPB Bundle Format](https://github.com/modelcontextprotocol/mcpb)
- [Claude Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions)

---

**plugin-factory v1.0** - Describe your plugin idea. Get a complete, publishable Claude extension.
