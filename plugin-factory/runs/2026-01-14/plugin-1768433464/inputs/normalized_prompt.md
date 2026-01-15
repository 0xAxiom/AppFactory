# Normalized Intent: Decision Memory

**Plugin Type**: Hybrid (Claude Code Plugin + MCP Server)

## Overview

A knowledge capture system that records architectural decisions, tradeoffs, and reasoning as they happen during Claude Code sessions, then makes them permanently queryable through an MCP server.

## Claude Code Plugin Component

### PostToolUse Hook - Decision Detection

Monitors tool use for signals of architectural decisions:

**High-Signal Triggers** (always prompt for "why"):
- Write to `package.json` (dependency changes)
- Write/Edit to config files (`tsconfig.json`, `vite.config.ts`, `.eslintrc`, `tailwind.config.js`, etc.)
- Creating new directories (structural decisions)
- Write to files matching `**/schema.*`, `**/types.*`, `**/models/*` (data modeling)
- Significant refactors (Edit operations affecting >50 lines or multiple files in sequence)

**Medium-Signal Triggers** (prompt if file appears architectural):
- New files in `src/lib/`, `src/utils/`, `src/services/`, `src/hooks/`
- Files with "provider", "context", "store", "middleware" in name
- Test file creation (testing strategy decisions)

**Capture Flow**:
1. Hook detects trigger condition
2. Displays notification: "Architectural decision detected in [file]. Add a one-line 'why'?"
3. User can respond, skip, or mark as not-a-decision
4. Decision saved with: timestamp, file(s), git commit hash, user's reasoning

### Commands

- `/decision [reason]` - Manually record an architectural decision about recent changes
- `/decisions` - List recent decisions with timestamps and files
- `/decision-search [query]` - Quick search decisions (delegates to MCP for complex queries)
- `/decision-link [commit]` - Link a decision to a specific commit retroactively

### Agent

- `decision-helper` - Assists with writing clear, future-proof decision documentation. Takes rough notes and reformats into searchable, context-rich entries.

## MCP Server Component

### Storage

SQLite database (`~/.decision-memory/decisions.db`) with schema:
- decisions: id, timestamp, project_path, files (JSON array), commit_hash, reasoning, tags, context
- projects: id, path, name, created_at

### Tools

- `query_decisions` - Natural language search across all decisions. Supports filters: project, date range, file patterns, tags
- `get_decision` - Retrieve a specific decision by ID with full context
- `add_decision` - Programmatically add a decision (used by Claude Code hook)
- `link_commit` - Associate a decision with a git commit
- `list_projects` - List all projects with decision history
- `export_decisions` - Export decisions as Markdown, JSON, or ADR format

### Resources

- `decisions://recent` - Last 20 decisions across all projects
- `decisions://project/{path}` - All decisions for a specific project
- `decisions://file/{path}` - Decisions related to a specific file

### Prompts

- `why_prompt` - Template for asking "why" questions about the codebase: "Why do we use [X] instead of [Y]?"
- `decision_summary` - Generate a summary of architectural decisions for onboarding new team members

## Integration Features

- **Git Integration**: Automatically captures current commit hash when recording decisions. Links can be clicked to view commit on GitHub/GitLab.
- **ADR Export**: Export decisions in Architecture Decision Record format for documentation
- **Team Sync**: Optional - decisions can be exported/imported for team sharing (JSON format)
- **Search Quality**: Full-text search with fuzzy matching. Understands synonyms (e.g., "state management" matches decisions about Redux, Zustand, Context)

## Security Model

- Decisions stored locally in user's home directory
- No network access required for core functionality
- No secrets or credentials stored
- Read-only access to git for commit hash extraction
- File paths stored but file contents NOT captured

## Error Handling

- Graceful degradation if git not available (skip commit linking)
- Queue decisions if database temporarily locked
- Non-blocking hooks (decision capture never interrupts workflow)
- Clear error messages if MCP server not running

## Installation Experience

1. Copy plugin to project's `.claude/` directory
2. Run `npm install` in MCP server directory
3. Add MCP server to `claude_desktop_config.json`
4. Start Claude Code - ready to capture decisions
