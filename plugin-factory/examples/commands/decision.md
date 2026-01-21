---
name: decision
description: Record an architectural decision about recent code changes
---

# Decision Command

Record an architectural decision with reasoning that will be searchable forever.

## Your Task

When the user runs `/decision`, help them capture an architectural decision:

1. **If reasoning is provided**: Record it directly
2. **If no reasoning provided**: Ask what decision they want to document

## What to Capture

For each decision, gather:

- **What changed**: Which files or systems were affected
- **Why**: The reasoning behind the choice
- **Alternatives considered**: What else was evaluated (if mentioned)
- **Context**: Current project path and git commit

## Recording the Decision

Use the decision-memory MCP server to store the decision:

```
Tool: add_decision
Arguments:
  - project: Current working directory
  - files: Array of affected file paths
  - reasoning: User's explanation
  - commit: Current git HEAD (if available)
  - tags: Extracted keywords (e.g., "state-management", "authentication")
```

If the MCP server is not available, inform the user and suggest they install it.

## Response Format

After recording, confirm with:

- Decision ID
- Summary of what was captured
- Reminder that they can query with `/decision-search`

## Examples

User: `/decision Using Zustand instead of Redux because bundle size matters more than devtools`

Response: Record decision about state management choice, tag with "state-management", "zustand", "redux", link to current commit.

User: `/decision`

Response: Ask "What architectural decision would you like to document? I'll help you capture the reasoning for future reference."
