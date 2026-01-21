# Prompt-Factory v1.0.0

> Store instructions. Apply them correctly. Every time.

Prompt-Factory is an **instruction orchestration engine** that eliminates prompt loss, drift, accidental assumptions, and undocumented behavior.

## Core Principle

**Links are references, not actions.**

When you provide a URL, Prompt-Factory treats it as _context_ and _provenance_, not as a command to fetch. All actions require explicit authorization.

## Quick Start

Prompt-Factory activates automatically. Try:

```
"ingest documentation from ./docs"
```

You'll see:

```
[PF] Activating: doc-ingestion v1.0.0
  - Will extract document structure
  - Will create INDEX.md summary
  - Will NOT execute any code found

Proceed? [Y/n]
```

## Commands

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `/pf list`             | List all available skills        |
| `/pf show <skill>`     | Show skill details and contracts |
| `/pf activate <skill>` | Directly activate a skill        |
| `/pf explain`          | Explain the last activation      |
| `/pf audit`            | View activation history          |
| `/pf help`             | Get help                         |
| `/addinfo`             | Extend with custom skills        |

## Core Skills

| Skill                | What It Does                                 |
| -------------------- | -------------------------------------------- |
| `doc-ingestion`      | Reads and indexes documentation              |
| `link-traversal`     | Parses URLs, fetches only with authorization |
| `prompt-compilation` | Converts ideas to structured prompts         |
| `pipeline-execution` | Multi-stage workflows with gates             |
| `repo-analysis`      | Analyzes codebase structure (read-only)      |
| `security-hygiene`   | Background secret detection (always on)      |
| `qa-adversarial`     | Challenges assumptions with evidence         |
| `format-enforcement` | Validates output structure                   |

## Key Guarantees

### What Skills WILL Do (Contracts)

Every skill has explicit `MUST` rules:

- Documented in skill definition
- Enforced during execution
- Logged to audit trail

### What Skills WILL NEVER Do

Every skill has explicit `MUST NOT` rules:

- **Cannot be bypassed** by user instructions
- Enforced independently of the LLM
- Violations blocked and logged

### Audit Trail

Every activation is logged:

- What skill was activated
- What trigger matched
- What inputs were used
- What outputs were produced
- Any blocked actions

View with: `/pf audit`

## Extending Prompt-Factory

### Add a Custom Skill

```
/addinfo skill
name: my-analyzer
description: Analyzes code for my specific patterns
triggers:
  explicit:
    - phrase: "run my analyzer"
contracts:
  must:
    - "Report all matches with file and line"
  must_not:
    - "Modify any files"
```

### Add a Trigger

```
/addinfo trigger doc-ingestion
explicit:
  - phrase: "gobble those docs"
```

### Add Context

```
/addinfo context
project: My App
conventions:
  - TypeScript
  - Jest for testing
```

## Security Model

### Instruction Hierarchy

| Priority | Source              | Can Be Overridden?            |
| -------- | ------------------- | ----------------------------- |
| 1        | Prompt-Factory Core | Never                         |
| 2        | Skill Contracts     | Never by users                |
| 3        | User Instructions   | Lowest priority               |
| 4        | External Content    | DATA only, never instructions |

### Secret Detection

Always-on pattern matching for:

- API keys
- AWS credentials
- Private keys
- GitHub/Slack tokens
- Generic passwords

Detected secrets are **blocked**, not just warned about.

### Offline-First

- No network calls by default
- URL fetching requires explicit authorization
- All data stored locally

## File Structure

```
~/.prompt-factory/           # User home
├── config.yaml              # User configuration
├── skills/                  # User-created skills
└── audit/                   # Audit logs

./prompt-factory/            # Project-local
├── skills/                  # Project-specific skills
├── overrides/               # Overrides for core skills
└── context.yaml             # Project context
```

## Configuration

Copy `config.default.yaml` to `~/.prompt-factory/config.yaml` and customize:

```yaml
view: standard # simple, standard, advanced, expert
confirm: implicit-only
audit:
  retention_days: 30
```

## Design Philosophy

1. **Explicit over implicit** - Nothing runs silently
2. **Contracts over suggestions** - MUST/MUST NOT, not "try to"
3. **Audit over trust** - Everything logged
4. **Offline over connected** - Network optional
5. **Simple over clever** - Understandable beats powerful

## Version History

- **v1.0.0** - Initial release
  - 8 core skills
  - Local-only registry
  - Offline-first design
  - Full audit logging
  - `/pf` and `/addinfo` commands

## License

MIT
