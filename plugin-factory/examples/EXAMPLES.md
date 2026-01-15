# Usage Examples

Real-world examples of using Decision Memory to capture and query architectural decisions.

## Recording Decisions

### Manual Recording with /decision

```bash
# Record a simple decision
/decision Using Zustand for state management - simpler than Redux for our needs

# Record with more context
/decision Chose PostgreSQL over MongoDB because we need strong relational data integrity for financial transactions

# Record a refactoring decision
/decision Refactored authentication to use middleware pattern - cleaner separation of concerns
```

### Automatic Detection

When you edit certain files, Decision Memory prompts you:

```
# You edit package.json to add a new dependency
> Claude Code: "Architectural decision detected: package.json was modified. Add a one-line 'why'?"
> You: "Added date-fns instead of moment.js for smaller bundle size"

# You create a new config file
> Claude Code: "Architectural decision detected: vite.config.ts was created. Add a one-line 'why'?"
> You: "Migrating from CRA to Vite for faster dev server"
```

### Using the Decision Helper Agent

For complex decisions, use the agent to help format:

```bash
# Invoke the agent
> Use the decision-helper agent to document this decision

# Provide rough notes
> "went with trpc cuz type safety, also easier than graphql"

# Agent formats into:
## Decision Summary
Use tRPC for API layer instead of GraphQL or REST.

## Reasoning
- End-to-end type safety without code generation
- Simpler setup than GraphQL
- Better DX with TypeScript inference

## Tags
#api #trpc #typescript
```

## Querying Decisions

### In Claude Code

```bash
# List recent decisions
/decisions

# Output:
Recent Decisions (this project):

#42 | 2026-01-14 | package.json, src/store/
    "Using Zustand for state management - simpler than Redux..."
    Tags: #state-management #zustand

#41 | 2026-01-13 | src/api/
    "Chose tRPC over REST for end-to-end type safety"
    Tags: #api #trpc

# Search for specific topics
/decision-search authentication

# Output:
Search Results for "authentication":

#38 | 2026-01-10 | src/middleware/auth.ts
    "Using JWT with httpOnly cookies - more secure than localStorage"
    Tags: #authentication #jwt #security
```

### In Claude Desktop

Natural language queries work best:

```
Q: "Why do we use Zustand instead of Redux?"

A: Based on recorded decisions:

Decision #42 (2026-01-14)
Project: my-app
Files: package.json, src/store/index.ts

"Using Zustand for state management - simpler than Redux for our needs.
Redux would add unnecessary complexity for our relatively simple state."

Tags: #state-management #zustand
Commit: abc1234 (view)

---

Q: "What decisions were made about the API layer?"

A: Found 3 decisions about API architecture:

#41 - Chose tRPC for type-safe API calls
#35 - Using Zod for input validation on all endpoints
#30 - REST endpoints follow /api/v1/ convention

---

Q: "Generate an onboarding summary for this project"

A: # Architectural Decision Summary for my-app

This project has 45 recorded architectural decisions.

### state-management (3 decisions)
- Using Zustand for simpler API than Redux...
- Global state split into user and ui slices...
- Persisting user preferences to localStorage...

### authentication (4 decisions)
- JWT with httpOnly cookies for security...
- Refresh token rotation every 7 days...
- ...

### api (5 decisions)
- tRPC for end-to-end type safety...
- ...
```

## Linking Commits

### Manual Linking

```bash
# Link a decision to a specific commit
/decision-link 42 abc1234

# Link the most recent decision to HEAD
/decision-link --last HEAD

# Output:
Linked decision #42 to commit abc1234

Decision: "Using Zustand for state management..."
Commit: abc1234 - "Add Zustand store for user preferences"
Date: 2026-01-14
Author: developer@example.com

View commit: https://github.com/org/repo/commit/abc1234
```

### Automatic Linking

When recording decisions, the current commit is captured automatically if you're in a git repository.

## Exporting Decisions

### JSON Export

```
Q: "Export all decisions as JSON"

# Returns structured JSON for backup or migration
[
  {
    "id": 42,
    "project_name": "my-app",
    "files": ["package.json", "src/store/index.ts"],
    "reasoning": "Using Zustand for state management...",
    "tags": ["state-management", "zustand"],
    "commit_hash": "abc1234",
    "created_at": "2026-01-14T10:30:00Z"
  },
  ...
]
```

### Markdown Export

```
Q: "Export decisions as markdown documentation"

# Returns formatted markdown
## Decision #42
**Date:** 2026-01-14
**Project:** my-app
**Files:** package.json, src/store/index.ts
**Commit:** abc1234
**Tags:** #state-management #zustand

Using Zustand for state management - simpler than Redux for our needs.

---
```

### ADR Export

```
Q: "Export decisions as ADRs"

# Returns Architecture Decision Record format
# ADR 0042: Decision #42

## Status
Accepted

## Context
Decision recorded on 2026-01-14 for project my-app.
Files affected: package.json, src/store/index.ts

## Decision
Using Zustand for state management - simpler than Redux for our needs.

## Consequences
Tags: #state-management #zustand
Commit: abc1234
View: https://github.com/org/repo/commit/abc1234
```

## Team Workflows

### Sharing Decisions

Export decisions and commit to your repo:

```bash
# Export to markdown
# Save to docs/decisions.md
git add docs/decisions.md
git commit -m "Update architectural decisions log"
```

### Onboarding New Developers

```
Q: "I'm new to this project. What architectural decisions should I know about?"

A: Here's a summary of key decisions for this project:

1. **State Management**: Using Zustand (not Redux) for simplicity
2. **API Layer**: tRPC for type-safe communication
3. **Styling**: Tailwind CSS with custom design tokens
4. **Testing**: Vitest for unit tests, Playwright for E2E
5. **Authentication**: JWT with httpOnly cookies

Would you like details on any of these?
```

### Code Review Context

When reviewing code that touches architectural decisions:

```
Q: "Why does this PR change the auth middleware?"

A: Based on decision #38 (2026-01-10):

"Refactored authentication to use middleware pattern - cleaner separation
of concerns. Each route can declare its auth requirements."

The current change follows this pattern by adding role-based checks
to the existing middleware.
```

## Advanced Queries

### Cross-Project Search

```
Q: "How have we handled authentication across all projects?"

# Searches all projects in the database
Found 12 authentication decisions across 4 projects:

my-app: JWT with httpOnly cookies
admin-portal: Same JWT system, shared auth service
marketing-site: No auth (public)
internal-tools: SSO via company SAML provider
```

### Date-Filtered Search

```
Q: "What decisions were made in the last month?"

# Returns recent decisions
Found 8 decisions since 2025-12-14:
...
```

### File-Specific Search

```
Q: "What decisions relate to the user store?"

# Searches by file path
Found 3 decisions involving src/store/user.ts:
- Initial store setup
- Added persistence
- Refactored to separate auth state
```
