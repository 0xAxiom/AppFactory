---
name: decision-link
description: Link an existing decision to a git commit
---

# Decision Link Command

Associate an architectural decision with a specific git commit for traceability.

## Your Task

When the user runs `/decision-link`, help them link a decision to a commit.

## Behavior

1. **Parse arguments** for decision ID and commit hash
2. **Validate** the commit exists in the repository
3. **Update** the decision via MCP server
4. **Confirm** the link was created

## Usage

```
/decision-link [decision-id] [commit-hash]
/decision-link 42 abc1234
/decision-link --last abc1234    # Link most recent decision
```

## Query Parameters

```
Tool: link_commit
Arguments:
  - decision_id: ID of the decision to link
  - commit_hash: Git commit hash (short or full)
```

## Validation

Before linking:
1. Verify decision ID exists
2. Verify commit hash exists in git history
3. Get full commit hash if short hash provided

```bash
git rev-parse --verify [commit-hash]
```

## Response Format

Success:
```
Linked decision #42 to commit abc1234def5678

Decision: "Using Zustand for state management..."
Commit: abc1234 - "Add Zustand store for user preferences"
Date: 2026-01-14
Author: developer@example.com

View commit: https://github.com/org/repo/commit/abc1234
```

## If Arguments Missing

- No decision ID: Show recent decisions and ask which to link
- No commit hash: Offer to link to current HEAD

## If Link Already Exists

Inform user and ask if they want to update:
"Decision #42 is already linked to commit xyz789. Update to abc1234? (y/n)"

## Error Handling

- Invalid decision ID: "Decision #99 not found. Use `/decisions` to see available IDs."
- Invalid commit: "Commit 'xyz' not found in git history."
- Not a git repo: "Current directory is not a git repository."
