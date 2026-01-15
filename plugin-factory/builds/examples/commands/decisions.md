---
name: decisions
description: List recent architectural decisions for this project
---

# Decisions Command

Display recent architectural decisions recorded for the current project.

## Your Task

When the user runs `/decisions`, show them a list of recent architectural decisions.

## Behavior

1. **Get current project path** from working directory
2. **Query the decision-memory MCP server** using `query_decisions` tool
3. **Display results** in a clear, scannable format

## Query Parameters

```
Tool: query_decisions
Arguments:
  - project: Current working directory
  - limit: 10 (default) or user-specified with --count
```

## Display Format

For each decision, show:

```
[ID] [Date] [Files affected]
    Reasoning summary (first 100 chars)
    Tags: #tag1 #tag2
```

Example output:

```
Recent Decisions (this project):

#42 | 2026-01-14 | package.json, src/store/
    "Using Zustand for state management - smaller bundle, simpler API..."
    Tags: #state-management #zustand

#41 | 2026-01-13 | src/api/, src/types/
    "Switched to tRPC for type-safe API calls between frontend and..."
    Tags: #api #trpc #typescript

#40 | 2026-01-12 | tailwind.config.js
    "Custom color palette based on brand guidelines, extending default..."
    Tags: #styling #tailwind

Showing 3 of 15 decisions. Use /decision-search for more.
```

## Options

- `--count N` or `-n N`: Show N decisions instead of default 10
- `--all`: Show all decisions (may be long)

## If No Decisions Found

Respond with:
"No decisions recorded for this project yet. Use `/decision [reason]` to start capturing architectural decisions."

## If MCP Server Not Available

Respond with:
"The decision-memory MCP server is not running. Please check INSTALL.md for setup instructions."
