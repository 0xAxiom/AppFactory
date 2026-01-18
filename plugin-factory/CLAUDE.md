# Plugin Factory

**Version**: 1.0
**Mode**: Full Build Factory with Auto-Polish
**Status**: MANDATORY CONSTITUTION

---

## Purpose

Plugin Factory generates **complete, publishable Claude plugins** from plain-language descriptions. When a user describes a plugin idea, Claude builds either:

1. **Claude Code Plugin** - Project-local extensions with commands, agents, skills, and hooks
2. **MCP Server (Desktop Extension)** - Model Context Protocol servers for Claude Desktop

The output is a ready-to-install plugin, not prompts or scaffolds.

---

## The Pipeline

```
PHASE 0: Intent Normalization  → Upgrade vague input to publishable spec
PHASE 1: Plan                  → Comprehensive plan with plugin type decision
PHASE 2: Build                 → Complete plugin implementation
PHASE 3: Docs & Distribution   → README, INSTALL, SECURITY, examples
PHASE 4: Ralph Polish Loop     → QA until ≥97% (max 3 iterations)
```

---

## For Users

```bash
cd plugin-factory
claude
```

Then describe your plugin idea:

- "I want a plugin that formats code on every save"
- "Build a plugin that adds git commit shortcuts"
- "Create an MCP server that reads from my database"

---

## PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before planning or implementation**, Claude MUST upgrade the user's raw input into a publishable plugin intent.

### Rules for Intent Normalization

1. Treat the user's message as RAW INTENT, not a specification
2. Infer missing but required plugin qualities
3. Determine plugin type (Claude Code plugin vs MCP server, or both)
4. Rewrite into clean, professional, **publishable prompt**
5. Do NOT ask user to approve this rewrite
6. Save to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`

### Example

**User says:**
> "I want a plugin that formats code on save"

**Claude normalizes to:**
> "A Claude Code plugin with a PostToolUse hook that automatically formats code files after Write or Edit operations. Supports multiple formatters (Prettier, ESLint, Black, rustfmt) with auto-detection based on file type. Includes a /format command for manual formatting and a /format-config command to customize settings. Graceful fallback when formatters aren't installed."

### What Intent Normalization Adds

| Missing Element | Claude Infers |
|-----------------|---------------|
| No plugin type | Decide based on functionality (hooks → Claude Code, external data → MCP) |
| No error handling | "Graceful error handling with user feedback" |
| No configuration | "Configurable via environment or settings file" |
| No fallback | "Fallback behavior when dependencies missing" |
| No security model | "Least-privilege permissions, no unnecessary access" |

### Normalization Saves To

```
runs/YYYY-MM-DD/plugin-<timestamp>/
└── inputs/
    ├── user_prompt.md         # User's exact words
    └── normalized_prompt.md   # Claude's upgraded version
```

---

## PHASE 1: PLAN (MANDATORY)

After normalization, Claude writes a comprehensive plan.

### Required Plan Sections

1. **Plugin Overview** - Name, type, one-paragraph description
2. **Plugin Type Decision** - Claude Code plugin, MCP server, or both (with rationale)
3. **Project Structure** - Complete file tree
4. **Components** - Commands, agents, skills, hooks, tools (as applicable)
5. **Security Model** - Permissions, secrets handling, data access
6. **Installation Steps** - How users will install
7. **Verification Steps** - How to test it works
8. **Distribution Plan** - Local install, GitHub, marketplace

### Plan Saves To

```
runs/YYYY-MM-DD/plugin-<timestamp>/
└── planning/
    └── plan.md
```

### Plugin Type Decision Guide

| User Need | Plugin Type | Rationale |
|-----------|-------------|-----------|
| React to Claude Code events | Claude Code Plugin | Hooks respond to tool use |
| Add slash commands | Claude Code Plugin | Commands are native |
| Extend Claude's capabilities | Claude Code Plugin | Agents/skills pattern |
| Access external data sources | MCP Server | Resources pattern |
| Call external APIs | MCP Server | Tools pattern |
| Integrate with other apps | MCP Server | Cross-app compatibility |
| Both events AND external data | Both | Hybrid plugin |

---

## PHASE 2: BUILD (MANDATORY)

Write complete plugin to `builds/<plugin-slug>/`.

### Claude Code Plugin Structure

```
builds/<plugin-slug>/
├── .claude-plugin/
│   └── plugin.json           # REQUIRED - Plugin manifest (ONLY this file here)
├── commands/                  # Slash commands (.md files)
│   └── <command-name>.md
├── agents/                    # Subagent definitions (.md files)
│   └── <agent-name>.md
├── skills/                    # Agent skills (subdirectories)
│   └── <skill-name>/
│       └── SKILL.md
├── hooks/
│   └── hooks.json            # Event handler configuration
├── scripts/                   # Helper scripts called by hooks
│   └── <script-name>.sh
├── README.md                  # REQUIRED
├── INSTALL.md                 # REQUIRED
├── SECURITY.md                # REQUIRED
└── EXAMPLES.md                # REQUIRED
```

**CRITICAL**: Commands, agents, skills, hooks directories are at plugin ROOT, NOT inside `.claude-plugin/`. Only `plugin.json` goes inside `.claude-plugin/`.

### MCP Server Structure

```
builds/<plugin-slug>/
├── manifest.json              # REQUIRED - MCPB manifest
├── server/
│   └── index.ts               # REQUIRED - Server entrypoint
├── src/
│   ├── tools/                 # Tool implementations
│   │   └── <tool-name>.ts
│   ├── resources/             # Resource providers
│   │   └── <resource-name>.ts
│   └── prompts/               # Prompt templates
│       └── <prompt-name>.ts
├── package.json               # REQUIRED
├── tsconfig.json              # REQUIRED
├── .env.example               # REQUIRED if env vars needed
├── README.md                  # REQUIRED
├── INSTALL.md                 # REQUIRED
├── SECURITY.md                # REQUIRED
└── EXAMPLES.md                # REQUIRED
```

---

## PHASE 3: DOCS & DISTRIBUTION (MANDATORY)

Every build MUST include complete documentation.

### Required Documentation

| File | Purpose | Contents |
|------|---------|----------|
| `README.md` | User-facing overview | What it does, quick start, features |
| `INSTALL.md` | Step-by-step installation | Prerequisites, install commands, verification |
| `SECURITY.md` | Security documentation | Permissions, secrets, data handling |
| `EXAMPLES.md` | Usage examples | Command examples, API calls, screenshots |

### Distribution Artifacts

#### For Claude Code Plugins

```
publish/
├── install-instructions.md   # How to install locally
├── marketplace-listing.md    # If submitting to marketplace
└── validation-notes.md       # Structure verification results
```

#### For MCP Servers

```
publish/
├── install-instructions.md   # Manual installation steps
├── mcpb-packaging.md         # How to create .mcpb bundle
└── claude-desktop-config.md  # How to add to claude_desktop_config.json
```

---

## PHASE 4: RALPH POLISH LOOP (MANDATORY)

After building, Claude runs adversarial QA as "Ralph Wiggum".

### How Ralph Works

1. **Ralph Reviews** - Checks all quality criteria
2. **Ralph Scores** - Calculates pass rate (passed/total × 100)
3. **Threshold** - Must reach ≥97% to PASS
4. **Iteration** - Builder fixes issues, Ralph re-reviews
5. **Max 3 Iterations** - 3 FAILs = hard failure

### Ralph's Checklist - Claude Code Plugin

#### Structure Quality (5 items)
- [ ] `.claude-plugin/plugin.json` exists and is valid JSON
- [ ] `plugin.json` has required fields (name, version, description)
- [ ] Commands/agents/skills/hooks are at plugin ROOT (not in .claude-plugin/)
- [ ] All referenced files exist
- [ ] No circular dependencies

#### Command Quality (if commands present) (4 items)
- [ ] Each command has valid YAML frontmatter
- [ ] Command names are lowercase with hyphens
- [ ] Commands have clear descriptions
- [ ] Example invocations provided

#### Hook Quality (if hooks present) (4 items)
- [ ] hooks.json is valid JSON
- [ ] Event names are correct (case-sensitive: PostToolUse, not postToolUse)
- [ ] Matchers are valid regex patterns
- [ ] Scripts referenced in hooks exist and are executable

#### Security Quality (4 items)
- [ ] No hardcoded secrets or API keys
- [ ] SECURITY.md documents all permissions
- [ ] Minimal permissions requested (least privilege)
- [ ] Data handling documented

#### Documentation Quality (4 items)
- [ ] README.md explains what plugin does
- [ ] INSTALL.md has working installation steps
- [ ] EXAMPLES.md has real usage examples
- [ ] All examples are accurate and work

### Ralph's Checklist - MCP Server

#### Build Quality (4 items)
- [ ] `npm install` completes without errors
- [ ] `npm run build` compiles TypeScript
- [ ] Server starts without errors
- [ ] No TypeScript errors

#### Server Quality (6 items)
- [ ] manifest.json is valid and complete
- [ ] At least one tool, resource, or prompt defined
- [ ] Tools have proper input schemas (Zod)
- [ ] Error handling returns proper MCP errors
- [ ] Structured logging present
- [ ] Graceful shutdown on SIGTERM/SIGINT

#### Security Quality (4 items)
- [ ] No hardcoded secrets or API keys
- [ ] SECURITY.md documents all permissions
- [ ] Input validation on all tools
- [ ] MCPB manifest declares required permissions

#### Documentation Quality (4 items)
- [ ] README.md explains what server does
- [ ] INSTALL.md has working installation steps
- [ ] EXAMPLES.md has tool invocation examples
- [ ] MCPB packaging instructions provided

### Ralph Saves To

```
runs/YYYY-MM-DD/plugin-<timestamp>/
└── polish/
    ├── ralph_report_1.md
    ├── ralph_report_2.md
    ├── ralph_report_3.md
    └── ralph_final_verdict.md
```

---

## Technology Stack

### Claude Code Plugins

| Component | Technology |
|-----------|------------|
| Manifest | JSON (plugin.json) |
| Commands | Markdown with YAML frontmatter |
| Agents | Markdown |
| Skills | Directory with SKILL.md |
| Hooks | JSON configuration + shell/node scripts |

### MCP Servers

| Component | Technology | Version |
|-----------|------------|---------|
| Runtime | Node.js | 18+ |
| Language | TypeScript | 5.0+ |
| SDK | @modelcontextprotocol/sdk | 1.x (stable) |
| Schema Validation | Zod | 3.x |
| Transport | STDIO (local) or Streamable HTTP (remote) |

---

## File Templates

### Claude Code Plugin - plugin.json

```json
{
  "name": "<plugin-name>",
  "version": "1.0.0",
  "description": "<Brief plugin description>",
  "author": {
    "name": "<Author Name>"
  },
  "keywords": ["claude", "plugin", "<category>"],
  "license": "MIT"
}
```

### Claude Code Plugin - Command Template

```markdown
---
name: <command-name>
description: <What this command does>
---

# <Command Name>

<Instructions for Claude when this command is invoked>

## Usage

```
/<command-name> [arguments]
```

## Examples

- `/<command-name>` - <what happens>
- `/<command-name> --flag` - <what happens with flag>
```

### Claude Code Plugin - hooks.json Template

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<regex-pattern>",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/<script-name>.sh"
          }
        ]
      }
    ]
  }
}
```

**Supported Events:**
- `PreToolUse` - Before a tool executes
- `PostToolUse` - After a tool executes
- `SessionStart` - When Claude Code session starts
- `SessionEnd` - When Claude Code session ends
- `PreCompact` - Before context compaction
- `UserPromptSubmit` - When user submits a prompt
- `Notification` - On notifications
- `Stop` - When generation stops
- `SubagentStop` - When a subagent stops

### MCP Server - manifest.json Template

```json
{
  "name": "<server-name>",
  "version": "1.0.0",
  "description": "<Brief server description>",
  "author": "<Author Name>",
  "license": "MIT",
  "mcp": {
    "command": "node",
    "args": ["server/index.js"],
    "env": {}
  },
  "permissions": {
    "network": false,
    "filesystem": {
      "read": [],
      "write": []
    }
  }
}
```

### MCP Server - server/index.ts Template

```typescript
/**
 * <Server Name>
 * <Description>
 * Generated by Plugin Factory v1.0
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: '<server-name>',
  version: '1.0.0',
});

// Define tools
server.tool(
  '<tool-name>',
  '<Tool description>',
  {
    // Zod schema for input
    param1: z.string().describe('Parameter description'),
  },
  async ({ param1 }) => {
    // Tool implementation
    return {
      content: [
        {
          type: 'text',
          text: `Result for ${param1}`,
        },
      ],
    };
  }
);

// Define resources (optional)
server.resource(
  '<resource-uri>',
  '<Resource description>',
  async () => {
    return {
      contents: [
        {
          uri: '<resource-uri>',
          mimeType: 'text/plain',
          text: 'Resource content',
        },
      ],
    };
  }
);

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('<server-name> MCP server running on stdio');
}

main().catch(console.error);
```

### MCP Server - package.json Template

```json
{
  "name": "<server-name>",
  "version": "1.0.0",
  "description": "<Description>",
  "type": "module",
  "main": "dist/server/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server/index.js",
    "dev": "tsx watch server/index.ts",
    "inspect": "npx @modelcontextprotocol/inspector dist/server/index.js",
    "bundle": "mcpb pack"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@anthropic-ai/mcpb": "^1.0.0",
    "@types/node": "^20.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

## Guardrails

### DO

- Normalize intent before planning
- Write comprehensive plan before building
- Place commands/agents/skills/hooks at plugin ROOT
- Include SECURITY.md with every plugin
- Run Ralph Polish Loop until PASS
- Use Zod schemas for MCP tool inputs
- Document all permissions and data access
- Provide working installation instructions

### DO NOT

- Put commands/agents/skills inside .claude-plugin/ (COMMON MISTAKE)
- Skip Intent Normalization
- Skip the Plan phase
- Skip Ralph Polish Loop
- Include hardcoded secrets or API keys
- Request unnecessary permissions
- Skip security documentation
- Claim success without Ralph PASS verdict

---

## Execution Flow Summary

### Step 1: Receive Plugin Idea
- Accept user's plain-language description
- Create run directory: `runs/YYYY-MM-DD/plugin-<timestamp>/`

### Step 2: Normalize Intent
- Upgrade raw input to publishable spec
- Determine plugin type (Claude Code, MCP, or both)
- Save to `runs/.../inputs/normalized_prompt.md`

### Step 3: Write Plan
- Comprehensive plan with all 8 sections
- Save to `runs/.../planning/plan.md`

### Step 4: Build Plugin
- Write ALL files to `builds/<plugin-slug>/`
- Follow correct directory structure
- Implement all specified components

### Step 5: Write Documentation
- README.md, INSTALL.md, SECURITY.md, EXAMPLES.md
- Create publish/ distribution artifacts

### Step 6: Ralph Polish Loop
- Run adversarial QA
- Iterate until ≥97% pass rate
- Max 3 iterations before hard failure

### Step 7: Confirm to User
- Provide installation instructions
- Explain verification steps

---

## Directory Structure

```
plugin-factory/
├── CLAUDE.md                 # This constitution
├── README.md                 # User documentation
├── templates/
│   ├── system/
│   │   ├── auto_plan_mode.md
│   │   └── ralph_polish_loop.md
│   └── plugin/
│       ├── claude_code_plugin/   # Starter scaffold
│       └── mcp_server/           # Starter scaffold
├── scripts/                  # Internal tools (optional)
├── examples/                 # Comprehensive example with both plugin types
│   ├── .claude-plugin/       # Claude Code plugin manifest
│   ├── commands/             # Slash commands
│   ├── agents/               # Agent definitions
│   ├── hooks/                # Event hooks
│   ├── mcp-server/           # MCP server implementation
│   └── scripts/              # Hook scripts
├── builds/                   # Generated plugins (output)
└── runs/                     # Execution logs
    └── YYYY-MM-DD/
        └── plugin-<timestamp>/
            ├── inputs/
            │   ├── user_prompt.md
            │   ├── normalized_prompt.md
            └── planning/
            │   └── plan.md
            └── polish/
                └── ralph_final_verdict.md
```

### Directory Boundaries

| Directory | Purpose | Who Writes |
|-----------|---------|------------|
| `builds/<plugin-slug>/` | **Final output** - complete plugin | Claude |
| `runs/` | Execution logs and artifacts | Claude |
| `examples/` | Reference implementations | Maintainers |

### FORBIDDEN Directories (never write to)

- `builds/` in app-factory
- `dapp-builds/` in dapp-factory
- `outputs/` in agent-factory
- Any path outside `plugin-factory/`

---

## Default Assumptions

When the user doesn't specify:

| Aspect | Default |
|--------|---------|
| Plugin type | Claude Code plugin (unless external data needed) |
| Language | TypeScript for MCP servers |
| Transport | STDIO for MCP (local use) |
| Permissions | Minimal (least privilege) |
| License | MIT |

---

## Definition of Done

A plugin build is only "done" if:

1. **Installs cleanly** - Following INSTALL.md works
2. **Works as described** - At least one command/tool functions
3. **Security documented** - SECURITY.md present and complete
4. **Ralph PASS** - ≥97% quality score

---

## Quickstart

```bash
cd plugin-factory
claude
# Describe: "A plugin that adds a /todo command to track tasks"
# Claude builds complete plugin in builds/<plugin-slug>/
# When done:
# For Claude Code plugin:
#   Copy builds/<plugin-slug>/ to your project
#   Reload Claude Code
# For MCP server:
#   cd builds/<plugin-slug>
#   npm install && npm run build
#   Add to claude_desktop_config.json
```

---

## Troubleshooting

### "Plugin not loading"

1. Check `.claude-plugin/plugin.json` exists
2. Verify commands/agents/hooks are at ROOT (not in .claude-plugin/)
3. Check for JSON syntax errors

### "MCP server won't start"

```bash
npm run build
node dist/server/index.js
# Check for errors in console
```

### "Hook not triggering"

1. Verify event name is correct case (PostToolUse, not postToolUse)
2. Check matcher regex is valid
3. Ensure script is executable: `chmod +x scripts/hook.sh`

### "Ralph fails 3 times"

Plugin is a hard failure. Check `runs/.../polish/ralph_final_verdict.md` for unresolved issues.

---

## Success Definition

A successful execution produces:
- Complete plugin in `builds/<plugin-slug>/`
- Ralph PASS verdict in `runs/.../polish/ralph_final_verdict.md`
- All documentation artifacts
- Working installation via INSTALL.md

---

## Version History

- **1.0** (2026-01-14): Initial release with Claude Code plugins and MCP server support

---

**plugin-factory**: Describe your plugin idea. Get a complete, publishable Claude extension.
