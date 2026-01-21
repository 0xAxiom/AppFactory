# Auto Plan Mode - Plugin Factory

**Purpose:** Guide Claude to write comprehensive plugin plans before implementation.

---

## When to Use

After Intent Normalization, Claude writes a Plan that captures:

- Plugin type decision with rationale
- Complete project structure
- All components (commands, hooks, tools, etc.)
- Security model
- Installation and verification steps

---

## Required Sections

### 1. Plugin Overview

Write a brief overview that captures:

- Plugin name (lowercase, hyphens only)
- Plugin type (Claude Code plugin, MCP server, or both)
- One paragraph describing what it does
- Target users

**Example:**

```markdown
## 1. Plugin Overview

**Name:** code-formatter
**Type:** Claude Code Plugin
**Description:** A Claude Code plugin that automatically formats code files after Write or Edit operations. Uses PostToolUse hooks to trigger formatters like Prettier, ESLint, Black, and rustfmt based on file type. Includes manual /format command for on-demand formatting.
**Target Users:** Developers who want consistent code style without manual formatting.
```

### 2. Plugin Type Decision

Explain why this type was chosen.

**Format:**

```markdown
## 2. Plugin Type Decision

**Chosen Type:** Claude Code Plugin

**Rationale:**

- Needs to react to Claude Code events (Write/Edit) → Hooks required
- No external data sources needed → MCP not required
- All functionality is Claude Code–specific → Plugin is appropriate

**Alternative Considered:**

- MCP server: Would work for formatting, but hooks provide tighter integration
- Hybrid: Not needed since no external APIs required
```

### 3. Project Structure

Show complete file tree.

**Format:**

```markdown
## 3. Project Structure
```

code-formatter/
├── .claude-plugin/
│ └── plugin.json # Plugin manifest
├── commands/
│ ├── format.md # Manual format command
│ └── format-config.md # Configuration command
├── hooks/
│ └── hooks.json # PostToolUse hook config
├── scripts/
│ └── format.sh # Formatting script
├── README.md
├── INSTALL.md
├── SECURITY.md
├── EXAMPLES.md
└── publish/
└── install-instructions.md

```

```

### 4. Components

Detail each component with its purpose.

**Format for Claude Code Plugin:**

```markdown
## 4. Components

### Commands

| Command        | Purpose                          | Arguments                 |
| -------------- | -------------------------------- | ------------------------- |
| /format        | Format current file or selection | `--all` for whole project |
| /format-config | Configure formatter settings     | `--set <key>=<value>`     |

### Hooks

| Event       | Matcher       | Action                        |
| ----------- | ------------- | ----------------------------- |
| PostToolUse | `Write\|Edit` | Run format.sh on changed file |

### Scripts

| Script    | Purpose                                        | Inputs              |
| --------- | ---------------------------------------------- | ------------------- |
| format.sh | Detect file type and run appropriate formatter | File path from hook |
```

**Format for MCP Server:**

```markdown
## 4. Components

### Tools

| Tool Name      | Purpose               | Parameters                           |
| -------------- | --------------------- | ------------------------------------ |
| query_database | Execute SQL query     | `query: string`, `database?: string` |
| list_tables    | List available tables | `database?: string`                  |

### Resources

| URI Pattern         | Purpose                   | MIME Type        |
| ------------------- | ------------------------- | ---------------- |
| db://tables         | List of all tables        | application/json |
| db://schema/{table} | Schema for specific table | application/json |

### Prompts

| Prompt Name   | Purpose                           | Arguments       |
| ------------- | --------------------------------- | --------------- |
| analyze-query | Help user write efficient queries | `table: string` |
```

### 5. Security Model

Document all security considerations.

**Format:**

```markdown
## 5. Security Model

### Permissions Required

| Permission      | Reason               | Scope                  |
| --------------- | -------------------- | ---------------------- |
| Shell execution | Run formatters       | Only format scripts    |
| Filesystem read | Read files to format | Project directory only |

### Secrets Handling

- No secrets required for this plugin
- OR: Requires API_KEY in environment, never logged or exposed

### Data Access

- Reads: Source code files in project
- Writes: Formatted source code files (same files)
- Network: None

### Risk Mitigation

- Format scripts only execute known formatters
- No arbitrary command execution
- File paths validated before processing
```

### 6. Installation Steps

How users will install.

**Format for Claude Code Plugin:**

```markdown
## 6. Installation Steps

### Prerequisites

- Claude Code installed
- (Optional) Formatters installed: prettier, eslint, black, rustfmt

### Installation

1. Clone or download plugin to a directory
2. Copy directory to your project root (or a shared plugins location)
3. Enable plugin in Claude Code settings

### Verification

1. Open Claude Code in project
2. Type `/format --help` - should show usage
3. Edit a file - should auto-format on save
```

**Format for MCP Server:**

````markdown
## 6. Installation Steps

### Prerequisites

- Node.js 18+
- Claude Desktop installed

### Installation (Manual)

1. Clone repository
2. `npm install`
3. `npm run build`
4. Add to claude_desktop_config.json:

```json
{
  "mcpServers": {
    "<server-name>": {
      "command": "node",
      "args": ["<path>/dist/server/index.js"]
    }
  }
}
```
````

5. Restart Claude Desktop

### Installation (MCPB)

1. Download `.mcpb` file
2. Double-click to install
3. Confirm permissions

````

### 7. Verification Steps

How to test it works.

**Format:**
```markdown
## 7. Verification Steps

### Claude Code Plugin
1. [ ] Plugin appears in Claude Code plugin list
2. [ ] `/format --help` shows usage information
3. [ ] Creating a `.js` file triggers prettier (if installed)
4. [ ] Error message shows if formatter not found

### MCP Server
1. [ ] Server starts without errors: `npm run dev`
2. [ ] Inspector shows tools: `npm run inspect`
3. [ ] Test tool in Claude Desktop: "Use the <tool> to..."
4. [ ] Error handling works: send invalid parameters
````

### 8. Distribution Plan

How the plugin will be distributed.

**Format:**

```markdown
## 8. Distribution Plan

### Primary: GitHub Repository

- Public repository with clear README
- Tagged releases for versions
- Issue tracker for bugs

### Secondary: Local ZIP

- ZIP file for easy sharing
- Install instructions in INSTALL.md

### Future: Marketplace (if applicable)

- Submit to Claude Code plugin marketplace
- Include marketplace-listing.md

### For MCP: MCPB Bundle

- Create .mcpb bundle: `npm run bundle`
- Host on releases page
- Users can double-click to install
```

---

## Output Location

```
runs/YYYY-MM-DD/plugin-<timestamp>/
└── planning/
    └── plan.md
```

---

## Quality Bar

A good Plan:

- Has clear plugin type decision with rationale
- Shows complete file structure
- Details every component
- Addresses security concerns
- Has testable verification steps

A bad Plan:

- Leaves plugin type unclear
- Has incomplete file structure
- Skips security considerations
- Has vague verification steps

---

## Template

```markdown
# Plugin Plan: {{PLUGIN_NAME}}

## 1. Plugin Overview

**Name:** {{plugin-name}}
**Type:** Claude Code Plugin | MCP Server | Both
**Description:** [One paragraph]
**Target Users:** [Who is this for]

## 2. Plugin Type Decision

**Chosen Type:** [Type]

**Rationale:**

- [Reason 1]
- [Reason 2]

**Alternative Considered:**

- [Alternative and why not chosen]

## 3. Project Structure
```

{{plugin-name}}/
├── ...

```

## 4. Components

### [Commands | Tools | etc.]

| Name | Purpose | Details |
|------|---------|---------|
| | | |

## 5. Security Model

### Permissions Required
| Permission | Reason | Scope |
|------------|--------|-------|
| | | |

### Secrets Handling
[Details]

### Data Access
[Details]

## 6. Installation Steps

### Prerequisites
- [Requirement]

### Installation
1. [Step]

### Verification
1. [Step]

## 7. Verification Steps

1. [ ] [Check]
2. [ ] [Check]

## 8. Distribution Plan

### Primary
[Method]

### Secondary
[Method]
```

---

**Use this guide to write comprehensive plans before any code is generated.**
