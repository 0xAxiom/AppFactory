# Decision Memory - Pipeline Example Build

**This plugin was built entirely by the Plugin Factory pipeline.**

Examine this folder to see what the 5-phase pipeline produces from a single prompt.

---

## The Test

On January 14, 2026, we ran a controlled experiment:

1. **Same prompt** given to two separate processes
2. **Pipeline version** (this folder) - Built through Plugin Factory's 5-phase process
3. **Direct version** - Built by Claude without the pipeline

Both built simultaneously. Both evaluated on 8 criteria.

---

## Results

| Version | Score | Files |
|---------|-------|-------|
| **Pipeline (this build)** | **91/100** | 30 files |
| Direct | 71/100 | 14 files |

```
+28.2% improvement using the pipeline
```

---

## What the Pipeline Produced vs Direct

| Feature | Pipeline (This Build) | Direct Build |
|---------|----------------------|--------------|
| Storage | SQLite + FTS5 full-text search | JSONL flat file |
| Architecture | Modular (1 file per tool) | Monolithic (280 lines) |
| AI Agent | `decision-helper` for formatting | None |
| Export Formats | JSON, Markdown, ADR | JSON, Markdown only |
| MCP Prompts | `why_prompt`, `decision_summary` | None |
| Security Docs | Full threat model | Basic overview |
| Detection | Confidence scoring (HIGH/MEDIUM) | Simple pattern match |

---

## Scoring Breakdown

| Criteria | Pipeline | Direct | Delta |
|----------|----------|--------|-------|
| Architecture | 95 | 70 | +25 |
| Scalability | 92 | 55 | +37 |
| Feature Completeness | 94 | 72 | +22 |
| Code Quality | 90 | 78 | +12 |
| Documentation | 93 | 75 | +18 |
| Security Model | 91 | 70 | +21 |
| Developer UX | 88 | 82 | +6 |
| Maintainability | 91 | 68 | +23 |

---

## Why the Pipeline Won

### 1. Planning Phase
The `auto_plan_mode.md` template forced upfront decisions:
- Storage strategy → SQLite/FTS5 instead of flat files
- Scalability → Modular architecture
- Export formats → ADR support added

### 2. Templates
MCP server templates ensured:
- Resources AND prompts, not just tools
- Proper SDK patterns
- Correct plugin structure

### 3. Ralph Polish Loop
Adversarial QA caught:
- Missing threat model → Added to SECURITY.md
- No cross-project queries → Added `list_projects` tool
- Manual formatting burden → Added `decision-helper` agent

### 4. Explicit Docs Phase
Documentation wasn't an afterthought:
- INSTALL.md with copy-paste commands
- SECURITY.md with permission tables
- EXAMPLES.md with real workflows

---

## The Prompt Used

```
Decision Memory - "Your codebase finally has a memory"

A Claude Code plugin + MCP server combo that:
1. Automatically detects architectural decisions via PostToolUse hooks
2. Prompts for a quick "why" explanation
3. Stores decisions in a queryable format
4. Exposes them via MCP for natural language queries

Features:
- /decision [reason] - manually record a decision
- /decisions - list recent decisions
- /decision-search [query] - search decisions
- MCP tools: query_decisions, add_decision, get_decision, link_commit
- MCP resources: decisions://recent, decisions://project/{path}
```

---

## Explore This Build

```
examples/
├── .claude-plugin/       # Plugin manifest
├── commands/             # 4 slash commands
├── hooks/                # PostToolUse detection
├── agents/               # decision-helper AI agent
├── scripts/              # Detection logic
├── mcp-server/           # Full MCP server
│   └── src/
│       ├── tools/        # 6 MCP tools (modular)
│       ├── resources/    # 3 MCP resources
│       ├── prompts/      # 2 MCP prompts
│       └── db/           # SQLite + FTS5
├── INSTALL.md
├── SECURITY.md
├── EXAMPLES.md
└── README.md             # (this file)
```

---

## Key Insight

The pipeline doesn't make Claude smarter. It makes Claude **systematic**.

Same AI capabilities. 28% better output. Because:
- Forced planning prevents bad defaults
- Templates encode best practices
- Ralph catches what the builder missed
- Explicit phases ensure nothing is skipped

---

## License

MIT
