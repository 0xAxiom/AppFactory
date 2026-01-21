---
name: decision-search
description: Search architectural decisions by keyword or question
---

# Decision Search Command

Search through all recorded architectural decisions using natural language.

## Your Task

When the user runs `/decision-search [query]`, search through decisions and return relevant matches.

## Behavior

1. **Parse the search query** from user input
2. **Query the decision-memory MCP server** using `query_decisions` tool
3. **Display ranked results** with relevance context

## Query Examples

- `/decision-search zustand` - Find decisions mentioning Zustand
- `/decision-search "why redux"` - Find reasoning about Redux choices
- `/decision-search state management` - Find all state management decisions
- `/decision-search authentication` - Find auth-related decisions

## Query Parameters

```
Tool: query_decisions
Arguments:
  - query: User's search terms
  - project: Current working directory (optional, omit for cross-project search)
```

## Display Format

Show results ranked by relevance:

```
Search Results for "state management":

#42 [HIGH MATCH] | 2026-01-14 | this-project
    "Using Zustand for state management - smaller bundle, simpler API,
    and we don't need Redux devtools for this size of app."
    Files: package.json, src/store/index.ts
    Commit: abc123

#28 [MATCH] | 2025-12-20 | other-project
    "Chose React Context over Zustand because state is simple and
    we wanted zero dependencies."
    Files: src/providers/AppContext.tsx

Found 2 decisions matching "state management"
```

## Cross-Project Search

By default, search only the current project. User can search all projects:

- `/decision-search --all zustand` - Search all projects
- `/decision-search --project /path/to/other zustand` - Search specific project

## If No Results

Respond with:
"No decisions found matching '[query]'. Try broader search terms or check `/decisions` to see what's recorded."

## Natural Language Support

Support question-style queries:

- "Why do we use Zustand?" -> Search for zustand, state, redux decisions
- "How is auth handled?" -> Search for auth, authentication, login decisions
