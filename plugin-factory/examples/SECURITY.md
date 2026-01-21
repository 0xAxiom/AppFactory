# Security Documentation

This document describes the security model, permissions, and data handling for Decision Memory.

## Overview

Decision Memory is designed with privacy and minimal permissions in mind. All data is stored locally, no network access is required, and file contents are never captured.

## Data Stored

### What IS Captured

| Data              | Purpose                               | Example                         |
| ----------------- | ------------------------------------- | ------------------------------- |
| File paths        | Track which files decisions relate to | `src/store/index.ts`            |
| Reasoning text    | Your explanation of the decision      | "Using Zustand for simpler API" |
| Tags              | Categorization for searchability      | `#state-management`             |
| Timestamps        | When decisions were recorded          | `2026-01-14T10:30:00Z`          |
| Git commit hashes | Link decisions to code changes        | `abc1234`                       |
| Project paths     | Organize decisions by project         | `/Users/you/project`            |

### What is NOT Captured

| Data                  | Reason                                      |
| --------------------- | ------------------------------------------- |
| File contents         | Not needed; paths are sufficient            |
| Source code           | Privacy; you describe changes in your words |
| Environment variables | Security; could contain secrets             |
| Credentials           | Never accessed or stored                    |
| Network data          | No network access required                  |

## Permissions

### Claude Code Plugin

The plugin requires:

| Permission     | Scope               | Justification                |
| -------------- | ------------------- | ---------------------------- |
| Hook execution | PostToolUse events  | Detect architectural changes |
| File read      | hooks.json, scripts | Load configuration           |
| Process spawn  | Node.js for scripts | Run detection logic          |

The plugin does NOT require:

- Network access
- Write access outside plugin directory
- Access to credentials or secrets

### MCP Server

The server requires:

| Permission       | Scope                 | Justification                |
| ---------------- | --------------------- | ---------------------------- |
| Filesystem read  | `~/.decision-memory/` | Read decision database       |
| Filesystem write | `~/.decision-memory/` | Store decisions              |
| Process spawn    | `git` command         | Get commit hashes (optional) |

The server does NOT require:

- Network access
- Access to source code
- Access to credentials or secrets

## Storage Security

### Database Location

```
~/.decision-memory/decisions.db
```

This is a SQLite database with:

- Standard file permissions (readable/writable by owner)
- WAL mode for safe concurrent access
- No encryption (data is not sensitive)

### Backup Considerations

The database can be safely backed up using standard file copy. To export decisions for archival:

```
# In Claude Desktop
export_decisions with format: "json"
```

## Git Integration

### What's Accessed

- Current commit hash via `git rev-parse HEAD`
- Remote URL via `git remote get-url origin`
- Commit existence check via `git rev-parse --verify`

### What's NOT Accessed

- Git credentials
- SSH keys
- Full git history
- File diffs

### Failure Mode

If git is not available or the directory is not a repository, the plugin continues to work without commit linking. No errors are shown to the user.

## Hook Security

### PostToolUse Hook

The hook receives:

- Tool name (Write, Edit, etc.)
- File path from tool result
- Success/failure status

The hook does NOT receive:

- File contents
- Tool input parameters (e.g., what was written)

### Script Execution

Hook scripts run as Node.js processes with:

- No network access
- Read access to stdin (tool result)
- Write access to stdout (detection result)
- No access to user files outside plugin

## Privacy Guarantees

1. **No telemetry**: Decision Memory does not phone home or report usage
2. **No cloud storage**: All data stays on your machine
3. **No file reading**: Only paths are captured, never contents
4. **User-controlled**: You decide what reasoning to record
5. **Deletable**: Remove `~/.decision-memory/` to erase all data

## Threat Model

### In Scope

| Threat                    | Mitigation                            |
| ------------------------- | ------------------------------------- |
| Accidental secret capture | Only user-written reasoning stored    |
| Data exfiltration         | No network access                     |
| Unauthorized access       | Standard file permissions             |
| Database corruption       | WAL mode, standard SQLite reliability |

### Out of Scope

| Threat               | Reason                        |
| -------------------- | ----------------------------- |
| Malicious MCP client | Trusts MCP protocol integrity |
| Compromised Node.js  | System-level security concern |
| Physical access      | Standard OS security          |

## Audit Log

Decisions include timestamps for audit purposes:

- `created_at`: When decision was recorded
- `updated_at`: When decision was modified
- `commit_hash`: Git commit for code traceability

## Reporting Security Issues

If you discover a security vulnerability, please report it by:

1. Opening a private issue on GitHub
2. Emailing the maintainers directly

Do not disclose security issues publicly until they've been addressed.

## Compliance Notes

Decision Memory:

- Stores no PII beyond file paths
- Requires no special data handling
- Can be fully deleted by removing `~/.decision-memory/`
- Leaves no residual data after uninstallation
