# Code Formatter Plugin Template

**Pipeline**: plugin-factory
**Plugin Type**: Claude Code Plugin
**Complexity**: Medium

---

## Description

A Claude Code plugin template for code formatting and linting. Pre-configured with hooks for automatic formatting on save and commands for manual formatting. Supports multiple languages and formatters.

---

## Pre-Configured Features

### Core Features

- PostToolUse hook for auto-format on Write/Edit
- `/format` command for manual formatting
- `/format-config` command for settings
- Multi-language support detection
- Fallback when formatters not installed

### Supported Formatters (Detected)

- Prettier (JS, TS, CSS, HTML, JSON, MD)
- ESLint (JS, TS with --fix)
- Black (Python)
- rustfmt (Rust)
- gofmt (Go)
- clang-format (C, C++)

### Hook Configuration

- Triggers on Write tool completion
- Triggers on Edit tool completion
- File extension detection
- Selective formatting rules

---

## Ideal For

- Code quality automation
- Team style enforcement
- Multi-language projects
- CI/CD preparation

---

## File Structure

```
builds/<plugin-slug>/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── commands/
│   ├── format.md             # /format command
│   └── format-config.md      # /format-config command
├── hooks/
│   └── hooks.json            # PostToolUse configuration
├── scripts/
│   ├── format.sh             # Formatting script
│   └── detect-formatter.sh   # Formatter detection
├── README.md
├── INSTALL.md
├── SECURITY.md
└── EXAMPLES.md
```

---

## Usage

When using this template in Phase 0, Claude will:

1. Normalize your idea for code quality tools
2. Pre-configure hook triggers
3. Set up command interface
4. Include formatter detection logic

**Example prompt enhancement:**

- User says: "plugin that formats code automatically"
- Template adds: PostToolUse hook for Write/Edit, language detection, formatter fallback, config command for customization, error handling for missing formatters

---

## Plugin Manifest (Pre-configured)

```json
// .claude-plugin/plugin.json
{
  "name": "code-formatter",
  "version": "1.0.0",
  "description": "Auto-format code on save",
  "author": "AppFactory",
  "commands": [
    {
      "name": "format",
      "description": "Format current file or selection"
    },
    {
      "name": "format-config",
      "description": "Configure formatting preferences"
    }
  ],
  "hooks": ["PostToolUse"],
  "permissions": {
    "fileRead": ["**/*"],
    "fileWrite": ["**/*"],
    "shellExec": ["prettier", "eslint", "black", "rustfmt", "gofmt"]
  }
}
```

---

## Hooks Configuration (Pre-configured)

```json
// hooks/hooks.json
{
  "PostToolUse": [
    {
      "event": "Write",
      "pattern": "\\.(js|jsx|ts|tsx|css|scss|html|json|md)$",
      "action": {
        "type": "script",
        "path": "./scripts/format.sh",
        "args": ["$FILE_PATH"]
      }
    },
    {
      "event": "Edit",
      "pattern": "\\.(js|jsx|ts|tsx|css|scss|html|json|md)$",
      "action": {
        "type": "script",
        "path": "./scripts/format.sh",
        "args": ["$FILE_PATH"]
      }
    }
  ]
}
```

---

## Command: /format

```yaml
# commands/format.md
---
name: format
description: Format the current file or specified path
arguments:
  - name: path
    description: File path to format (optional, defaults to current file)
    required: false
---

Format the specified file using the appropriate formatter based on file extension.

Supported formatters:
- JavaScript/TypeScript: Prettier, ESLint
- Python: Black
- Rust: rustfmt
- Go: gofmt

If the formatter is not installed, provide instructions to install it.
```

---

## Customization Points

| Element            | How to Customize                     |
| ------------------ | ------------------------------------ |
| File patterns      | Edit `hooks/hooks.json` patterns     |
| Formatter priority | Modify `scripts/format.sh`           |
| Formatter options  | Add config file detection            |
| New formatters     | Add to `scripts/detect-formatter.sh` |
| Commands           | Add .md files to `commands/`         |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] plugin.json is valid JSON
- [ ] Commands have YAML frontmatter
- [ ] Hooks JSON has correct event names
- [ ] Scripts are executable
- [ ] Formatter detection works
- [ ] Fallback message is helpful
- [ ] SECURITY.md documents permissions
- [ ] INSTALL.md has clear steps
- [ ] EXAMPLES.md shows usage

---

## Security Documentation (Pre-configured)

```markdown
// SECURITY.md outline

## Permissions Required

| Permission | Scope      | Justification                    |
| ---------- | ---------- | -------------------------------- |
| fileRead   | \*_/_      | Read files to determine language |
| fileWrite  | \*_/_      | Write formatted content back     |
| shellExec  | formatters | Execute formatting commands      |

## Data Handling

- No data sent externally
- All formatting done locally
- No caching of file contents

## Risks

- Formatter bugs could corrupt files
- Large files may timeout

## Mitigations

- Only formats after successful Write/Edit
- Backup via git recommended
```
