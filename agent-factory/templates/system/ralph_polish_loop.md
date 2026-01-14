# Ralph Polish Loop - Agent Factory

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
│  1. Ralph Reviews agent against checklist       │
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

## Ralph's Checklist

### Build Quality (4 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 1 | npm install completes | Run `npm install`, no errors |
| 2 | npm run build compiles | Run `npm run build`, no errors |
| 3 | npm run dev starts server | Server starts on configured port |
| 4 | No TypeScript errors | `npm run typecheck` passes |

### Agent Quality (8 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 5 | GET / returns agent info | curl http://localhost:8080/ |
| 6 | GET /health returns 200 | curl http://localhost:8080/health |
| 7 | POST /process accepts input | curl -X POST with {"input": "test"} |
| 8 | Error handling works | Send invalid JSON, get 400 response |
| 9 | Input validation works | Send empty input, get clear error |
| 10 | Structured logging present | Check console output is JSON |
| 11 | CORS headers configured | OPTIONS request returns headers |
| 12 | Graceful shutdown works | SIGTERM triggers clean exit |

### Research Quality (3 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 13 | market_research.md exists | File in research/ directory |
| 14 | competitor_analysis.md names alternatives | File references real tools |
| 15 | positioning.md has differentiation | Clear value proposition |

### Documentation Quality (4 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 16 | RUNBOOK.md has correct commands | Commands match package.json |
| 17 | TESTING.md has working curls | Example commands work |
| 18 | .env.example lists all vars | Matches agent.json environment |
| 19 | agent.json matches implementation | Routes, port match code |

### Code Quality (3 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 20 | src/lib/logger.ts exists | Structured logging module |
| 21 | src/lib/errors.ts exists | Error handling utilities |
| 22 | No hardcoded secrets | No API keys in source files |

### Token Integration (if enabled) (3 items)

| # | Check | How to Verify |
|---|-------|---------------|
| 23 | Token config loads from env | getTokenConfig() works |
| 24 | Dry-run mode works | Works without contract address |
| 25 | TOKEN_INTEGRATION.md complete | Has all setup steps |

---

## Scoring

### Standard Agent (No Tokens)
- Total items: 22 (Build: 4, Agent: 8, Research: 3, Docs: 4, Code: 3)
- Pass threshold: 97% = 21.34 → 22 items must pass (1 allowed failure)

### Token-Enabled Agent
- Total items: 25 (Build: 4, Agent: 8, Research: 3, Docs: 4, Code: 3, Token: 3)
- Pass threshold: 97% = 24.25 → 25 items must pass (1 allowed failure)

### Critical Items (Must Pass)

These items MUST pass regardless of overall score:
- `npm install` completes
- `npm run build` compiles
- `npm run dev` starts server
- `GET /health` returns 200
- `POST /process` accepts input
- No hardcoded secrets

If any critical item fails, verdict is FAIL.

---

## Report Format

```markdown
# Ralph Polish Report - Iteration X

**Agent:** {{agent-name}}
**Date:** YYYY-MM-DD HH:MM
**Token Enabled:** Yes | No

---

## Score: XX% (X/X passed)

---

## Checklist

### Build Quality
- [x] npm install completes
- [x] npm run build compiles
- [x] npm run dev starts server
- [x] No TypeScript errors

### Agent Quality
- [x] GET / returns agent info
- [x] GET /health returns 200
- [x] POST /process accepts input
- [ ] Error handling works ← BLOCKING
- [x] Input validation works
- [x] Structured logging present
- [x] CORS headers configured
- [x] Graceful shutdown works

### Research Quality
- [x] market_research.md exists
- [x] competitor_analysis.md names alternatives
- [x] positioning.md has differentiation

### Documentation Quality
- [x] RUNBOOK.md has correct commands
- [x] TESTING.md has working curls
- [x] .env.example lists all vars
- [x] agent.json matches implementation

### Code Quality
- [x] src/lib/logger.ts exists
- [x] src/lib/errors.ts exists
- [x] No hardcoded secrets

---

## Blocking Issues

1. **Error handling works**: handleError() not imported in index.ts
   - **File:** src/index.ts:12
   - **Fix:** Add `import { handleError } from './lib/errors.js'`

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
- Agent is a HARD FAIL
- Write final verdict explaining unresolved issues
- Do not continue generating

---

## Output Location

```
runs/YYYY-MM-DD/agent-<timestamp>/
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

**Agent:** {{agent-name}}
**Date:** YYYY-MM-DD
**Iterations:** X

## VERDICT: PASS

Agent meets all quality requirements.

### Final Score: XX% (X/X passed)

### Summary
- Build quality: All passing
- Agent quality: All passing
- Research quality: All passing
- Documentation quality: All passing
- Code quality: All passing

Agent is ready for deployment.

### Next Steps
1. cd outputs/{{agent-name}}
2. npm install
3. npm run dev
4. Test: curl http://localhost:8080/health
5. Validate: npm run validate
6. Push to GitHub
```

### On FAIL (Hard Failure)

```markdown
# Ralph Final Verdict

**Agent:** {{agent-name}}
**Date:** YYYY-MM-DD
**Iterations:** 3 (maximum reached)

## VERDICT: FAIL

Agent failed to meet quality threshold after 3 iterations.

### Final Score: XX% (X/X passed)

### Unresolved Issues

1. **Issue description**
   - Why it couldn't be fixed
   - Impact on agent quality

2. **Issue description**
   - Why it couldn't be fixed
   - Impact on agent quality

### Recommendation

[Guidance on what would need to change for a successful build]
```

---

## Integration with Builder

The Ralph Loop is Claude reviewing its own work:

1. **Builder Claude** generates the agent
2. **Ralph Claude** reviews against checklist
3. **Builder Claude** fixes issues Ralph found
4. **Ralph Claude** re-reviews
5. Repeat until PASS or 3 FAILs

This is NOT two separate agents. It's Claude switching perspectives:
- Builder: "I generated this agent"
- Ralph: "Let me verify this actually works"

---

## Common Issues Ralph Finds

### Build Issues
- Missing dependencies in package.json
- Import path errors (missing .js extension for ESM)
- TypeScript strict mode violations
- tsconfig.json paths not matching directory structure

### Agent Issues
- Missing CORS headers
- No graceful shutdown handling
- Error handling not wired up
- Health endpoint missing uptime

### Research Issues
- Placeholder text ("Lorem ipsum", "Example competitor")
- Generic research without specifics
- Missing positioning.md entirely

### Documentation Issues
- RUNBOOK commands don't match package.json scripts
- TESTING.md curl examples have wrong port
- .env.example missing required variables

### Code Issues
- Logger module not imported
- Error classes not exported
- Hardcoded localhost in responses

---

**Run Ralph after every generation. No exceptions.**
