# Ralph Polish Loop - Plugin Factory

**Purpose:** Adversarial QA loop that iterates until quality threshold is met.

---

## Who is Ralph?

Ralph Wiggum is a skeptical reviewer persona. Ralph:

- Finds issues, doesn't assume things work
- Checks every requirement, no exceptions
- Scores objectively using checklists
- Iterates until quality passes

---

## The Loop

```
┌─────────────────────────────────────────────────┐
│                 RALPH LOOP                       │
├─────────────────────────────────────────────────┤
│  1. Ralph Reviews plugin against checklist      │
│  2. Ralph Scores: (passed / total) × 100        │
│  3. If score ≥ 97%: PASS → Exit loop            │
│  4. If score < 97%: FAIL → List blocking issues │
│  5. Builder fixes issues                         │
│  6. Increment iteration counter                  │
│  7. If iterations > 3: HARD FAIL → Exit         │
│  8. Go to step 1                                 │
└─────────────────────────────────────────────────┘
```

---

## Ralph's Checklist - Claude Code Plugin

### Structure Quality (5 items)

| #   | Check                             | How to Verify                                  |
| --- | --------------------------------- | ---------------------------------------------- |
| 1   | .claude-plugin/plugin.json exists | File present at correct path                   |
| 2   | plugin.json is valid JSON         | `cat .claude-plugin/plugin.json \| jq .`       |
| 3   | plugin.json has required fields   | name, version, description present             |
| 4   | Components at plugin ROOT         | commands/, hooks/, etc. NOT in .claude-plugin/ |
| 5   | All referenced files exist        | Check every path in plugin.json and hooks.json |

### Command Quality (if present) (4 items)

| #   | Check                          | How to Verify                             |
| --- | ------------------------------ | ----------------------------------------- |
| 6   | Commands have YAML frontmatter | `---` block at top with name, description |
| 7   | Command names are valid        | Lowercase, hyphens, no spaces             |
| 8   | Commands have descriptions     | Clear description in frontmatter          |
| 9   | Example invocations provided   | At least one example per command          |

### Hook Quality (if present) (4 items)

| #   | Check                    | How to Verify                         |
| --- | ------------------------ | ------------------------------------- |
| 10  | hooks.json is valid JSON | `cat hooks/hooks.json \| jq .`        |
| 11  | Event names correct case | PostToolUse, not postToolUse          |
| 12  | Matchers are valid regex | Test pattern against expected matches |
| 13  | Referenced scripts exist | Check scripts/ directory              |

### Security Quality (4 items)

| #   | Check                             | How to Verify                                  |
| --- | --------------------------------- | ---------------------------------------------- |
| 14  | No hardcoded secrets              | Search for API keys, tokens, passwords         |
| 15  | SECURITY.md exists                | File present with content                      |
| 16  | SECURITY.md documents permissions | All permissions listed and justified           |
| 17  | Minimal permissions               | No unnecessary shell/network/filesystem access |

### Documentation Quality (4 items)

| #   | Check                         | How to Verify                       |
| --- | ----------------------------- | ----------------------------------- |
| 18  | README.md exists              | File present with content           |
| 19  | INSTALL.md has working steps  | Can follow instructions to install  |
| 20  | EXAMPLES.md has real examples | At least 2 working examples         |
| 21  | All examples accurate         | Examples match actual functionality |

---

## Ralph's Checklist - MCP Server

### Build Quality (4 items)

| #   | Check                        | How to Verify                  |
| --- | ---------------------------- | ------------------------------ |
| 1   | npm install completes        | Run `npm install`, no errors   |
| 2   | npm run build compiles       | Run `npm run build`, no errors |
| 3   | Server starts without errors | `npm run dev` starts           |
| 4   | No TypeScript errors         | `npx tsc --noEmit` passes      |

### Server Quality (6 items)

| #   | Check                             | How to Verify                    |
| --- | --------------------------------- | -------------------------------- |
| 5   | manifest.json exists              | File present at root             |
| 6   | manifest.json is valid            | `cat manifest.json \| jq .`      |
| 7   | At least one tool/resource/prompt | Check server implementation      |
| 8   | Tools have Zod schemas            | Input validation present         |
| 9   | Error handling present            | Try/catch with proper MCP errors |
| 10  | Graceful shutdown                 | SIGTERM/SIGINT handlers          |

### Security Quality (4 items)

| #   | Check                              | How to Verify                          |
| --- | ---------------------------------- | -------------------------------------- |
| 11  | No hardcoded secrets               | Search for API keys, tokens, passwords |
| 12  | SECURITY.md exists                 | File present with content              |
| 13  | Input validation on all tools      | Zod schemas reject invalid input       |
| 14  | manifest.json declares permissions | Permissions object present and minimal |

### Documentation Quality (4 items)

| #   | Check                         | How to Verify                      |
| --- | ----------------------------- | ---------------------------------- |
| 15  | README.md explains server     | Clear description of purpose       |
| 16  | INSTALL.md has working steps  | Can follow instructions to install |
| 17  | EXAMPLES.md has tool examples | At least one example per tool      |
| 18  | MCPB packaging documented     | Instructions for creating .mcpb    |

---

## Scoring

### Claude Code Plugin (21 items)

- Structure: 5 items
- Commands: 4 items (if present, else skip)
- Hooks: 4 items (if present, else skip)
- Security: 4 items
- Documentation: 4 items

**Pass threshold:** 97% = must pass 20+ items (1 allowed failure)

### MCP Server (18 items)

- Build: 4 items
- Server: 6 items
- Security: 4 items
- Documentation: 4 items

**Pass threshold:** 97% = must pass 17+ items (1 allowed failure)

### Critical Items (Must Pass)

These items MUST pass regardless of overall score:

**Claude Code Plugin:**

- .claude-plugin/plugin.json exists
- plugin.json is valid JSON
- Components at plugin ROOT (not in .claude-plugin/)
- No hardcoded secrets

**MCP Server:**

- npm install completes
- npm run build compiles
- Server starts without errors
- No hardcoded secrets

If any critical item fails, verdict is FAIL.

---

## Report Format

```markdown
# Ralph Polish Report - Iteration X

**Plugin:** {{plugin-name}}
**Type:** Claude Code Plugin | MCP Server
**Date:** YYYY-MM-DD HH:MM

---

## Score: XX% (X/X passed)

---

## Checklist

### Structure Quality (Claude Code) | Build Quality (MCP)

- [x] Check 1
- [x] Check 2
- [ ] Check 3 ← BLOCKING

### [Category]

- [x] Check N
      ...

---

## Blocking Issues

1. **Issue description**
   - **File:** path/to/file
   - **Fix:** What needs to change

2. **Issue description**
   - **File:** path/to/file
   - **Fix:** What needs to change

---

## Verdict: PASS | FAIL

---

## Notes

[Any additional observations]
```

---

## Iteration Rules

### Iteration 1

- Full review of all items
- Document all failures
- Builder fixes all blocking issues

### Iteration 2

- Re-review failed items only
- Verify fixes work
- Check for regressions

### Iteration 3 (Final)

- Complete re-review
- If still failing, document why
- Prepare hard failure report

### After 3 Iterations

- Plugin is a HARD FAIL
- Write final verdict explaining unresolved issues
- Do not continue generating

---

## Output Location

```
runs/YYYY-MM-DD/plugin-<timestamp>/
└── polish/
    ├── ralph_report_1.md
    ├── ralph_report_2.md
    ├── ralph_report_3.md
    └── ralph_final_verdict.md
```

---

## Final Verdict Format

### On PASS

```markdown
# Ralph Final Verdict

**Plugin:** {{plugin-name}}
**Type:** Claude Code Plugin | MCP Server
**Date:** YYYY-MM-DD
**Iterations:** X

## VERDICT: PASS

Plugin meets all quality requirements.

### Final Score: XX% (X/X passed)

### Summary

- Structure/Build quality: All passing
- [Commands/Server] quality: All passing
- Security quality: All passing
- Documentation quality: All passing

Plugin is ready for distribution.

### Next Steps

#### For Claude Code Plugin:

1. Copy `builds/{{plugin-name}}/` to your project
2. Reload Claude Code
3. Test: `/<command-name> --help`

#### For MCP Server:

1. cd builds/{{plugin-name}}
2. npm install && npm run build
3. Add to claude_desktop_config.json
4. Restart Claude Desktop
5. Test in Claude: "Use the <tool> to..."
```

### On FAIL (Hard Failure)

```markdown
# Ralph Final Verdict

**Plugin:** {{plugin-name}}
**Type:** Claude Code Plugin | MCP Server
**Date:** YYYY-MM-DD
**Iterations:** 3 (maximum reached)

## VERDICT: FAIL

Plugin failed to meet quality threshold after 3 iterations.

### Final Score: XX% (X/X passed)

### Unresolved Issues

1. **Issue description**
   - Why it couldn't be fixed
   - Impact on plugin quality

2. **Issue description**
   - Why it couldn't be fixed
   - Impact on plugin quality

### Recommendation

[Guidance on what would need to change for a successful build]
```

---

## Common Issues Ralph Finds

### Claude Code Plugin Issues

**Structure:**

- Components inside .claude-plugin/ instead of ROOT
- Missing plugin.json
- Invalid JSON syntax

**Commands:**

- Missing YAML frontmatter
- Invalid command names (spaces, uppercase)
- No examples provided

**Hooks:**

- Wrong event name case (postToolUse vs PostToolUse)
- Invalid regex in matcher
- Missing referenced scripts
- Scripts not executable

**Security:**

- Hardcoded API keys
- Overly broad permissions
- Missing SECURITY.md

### MCP Server Issues

**Build:**

- Missing dependencies in package.json
- TypeScript compilation errors
- Import path errors (missing .js extension)

**Server:**

- Missing Zod schemas for tool inputs
- No error handling
- Missing graceful shutdown
- manifest.json missing required fields

**Security:**

- Hardcoded secrets
- No input validation
- Overly broad filesystem permissions

**Documentation:**

- INSTALL.md steps don't work
- Examples don't match actual API
- Missing MCPB packaging instructions

---

## Integration with Builder

The Ralph Loop is Claude reviewing its own work:

1. **Builder Claude** generates the plugin
2. **Ralph Claude** reviews against checklist
3. **Builder Claude** fixes issues Ralph found
4. **Ralph Claude** re-reviews
5. Repeat until PASS or 3 FAILs

This is NOT two separate agents. It's Claude switching perspectives:

- Builder: "I generated this plugin"
- Ralph: "Let me verify this actually works"

---

**Run Ralph after every generation. No exceptions.**
