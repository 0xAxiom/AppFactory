# Plugin Factory

**Version**: 2.0.0
**Mode**: Full Build Factory with Auto-Polish
**Status**: MANDATORY CONSTITUTION

---

## 1. PURPOSE & SCOPE

### What This Pipeline Does

Plugin Factory generates **complete, publishable Claude plugins** from plain-language descriptions. When a user describes a plugin idea, Claude builds either:

1. **Claude Code Plugin** - Project-local extensions with commands, agents, skills, and hooks
2. **MCP Server (Desktop Extension)** - Model Context Protocol servers for Claude Desktop

The output is a ready-to-install plugin, not prompts or scaffolds.

### What This Pipeline Does NOT Do

| Action                          | Reason                 | Where It Belongs  |
| ------------------------------- | ---------------------- | ----------------- |
| Build mobile apps               | Wrong output format    | app-factory       |
| Build dApps/websites            | Wrong output format    | dapp-factory      |
| Generate AI agent scaffolds     | Wrong pipeline         | agent-factory     |
| Build Base Mini Apps            | Wrong pipeline         | miniapp-pipeline  |
| Deploy automatically            | Requires user approval | Manual step       |

### Output Directory

All generated plugins are written to: `builds/<plugin-slug>/`

### Boundary Enforcement

Claude MUST NOT write files outside `plugin-factory/` directory. Specifically forbidden:

- `app-factory/builds/` (belongs to app-factory)
- `dapp-builds/` (belongs to dapp-factory)
- `outputs/` (belongs to agent-factory)
- Any path outside the repository

---

## 2. CANONICAL USER FLOW

```
User: "I want a plugin that formats code on every save"

┌─────────────────────────────────────────────────────────────────┐
│ PHASE 0: INTENT NORMALIZATION                                   │
│ Claude transforms vague input → publishable plugin spec         │
│ Output: runs/<date>/<run-id>/inputs/normalized_prompt.md        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: PLAN                                                   │
│ Claude writes comprehensive plan with plugin type decision      │
│ Output: runs/<date>/<run-id>/planning/plan.md                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: BUILD                                                  │
│ Claude generates complete plugin implementation                 │
│ Output: builds/<plugin-slug>/                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: DOCS & DISTRIBUTION                                    │
│ Claude writes README, INSTALL, SECURITY, EXAMPLES               │
│ Output: builds/<plugin-slug>/                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4: RALPH POLISH LOOP                                      │
│ Adversarial QA until ≥97% PASS (max 3 iterations)               │
│ Output: runs/<date>/<run-id>/polish/ralph_final_verdict.md      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
          User receives ready-to-install plugin
```

---

## 3. DIRECTORY MAP

```
plugin-factory/
├── CLAUDE.md                 # This constitution (CANONICAL)
├── README.md                 # User documentation
├── mcp.catalog.json          # MCP server configurations (CANONICAL)
├── templates/
│   ├── system/
│   │   ├── auto_plan_mode.md
│   │   └── ralph_polish_loop.md
│   └── plugin/
│       ├── claude_code_plugin/   # Starter scaffold
│       └── mcp_server/           # Starter scaffold
├── scripts/                  # Internal tools
├── examples/                 # Comprehensive example
│   ├── .claude-plugin/
│   ├── commands/
│   ├── agents/
│   ├── hooks/
│   ├── mcp-server/
│   └── scripts/
├── builds/                   # Generated plugins (OUTPUT DIRECTORY)
│   └── <plugin-slug>/
└── runs/                     # Execution logs
    └── YYYY-MM-DD/
        └── plugin-<timestamp>/
            ├── inputs/
            ├── planning/
            └── polish/
```

### Directory Boundaries

| Directory               | Purpose                      | Who Writes  | Distributable |
| ----------------------- | ---------------------------- | ----------- | ------------- |
| `builds/<plugin-slug>/` | Final plugin package         | Claude      | YES           |
| `runs/`                 | Execution logs and artifacts | Claude      | NO            |
| `examples/`             | Reference implementations    | Maintainers | YES           |

---

## 4. MODES

### INFRA MODE (Default)

When Claude enters `plugin-factory/` without an active build:

- Explains what Plugin Factory does
- Lists recent builds in `builds/`
- Awaits user's plugin description
- Does NOT generate code until user provides intent

**Infra Mode Indicators:**

- No active `runs/<date>/<run-id>/` session
- User asking questions or exploring
- No BUILD phase initiated

### BUILD MODE

When Claude is executing a plugin build:

- Has active `runs/<date>/<run-id>/` directory
- User has provided plugin intent
- Claude is generating files

**BUILD MODE Phases:**

1. Intent Normalization (Phase 0)
2. Plan (Phase 1)
3. Build (Phase 2)
4. Docs & Distribution (Phase 3)
5. Ralph Polish Loop (Phase 4)

### QA MODE (Ralph)

When Claude enters Ralph Polish Loop:

- Adopts adversarial QA persona
- Evaluates against quality checklist
- Iterates until PASS (≥97%) or max 3 iterations

---

## 5. PHASE MODEL

### PHASE 0: INTENT NORMALIZATION (MANDATORY)

**Before planning or implementation**, Claude MUST upgrade the user's raw input into a publishable plugin intent.

**Rules:**

1. Treat user's message as RAW INTENT, not specification
2. Infer missing but required plugin qualities
3. Determine plugin type (Claude Code plugin vs MCP server, or both)
4. Rewrite into clean, professional, publishable prompt
5. Do NOT ask user to approve this rewrite
6. Save to: `runs/<date>/<run-id>/inputs/normalized_prompt.md`

**Example Transformation:**

```
User says: "I want a plugin that formats code on save"

Claude normalizes to: "A Claude Code plugin with a PostToolUse hook that
automatically formats code files after Write or Edit operations. Supports
multiple formatters (Prettier, ESLint, Black, rustfmt) with auto-detection
based on file type. Includes a /format command for manual formatting and a
/format-config command to customize settings. Graceful fallback when
formatters aren't installed."
```

**What Intent Normalization Adds:**

| Missing Element   | Claude Infers                                        |
| ----------------- | ---------------------------------------------------- |
| No plugin type    | Decide based on functionality                        |
| No error handling | "Graceful error handling with user feedback"         |
| No configuration  | "Configurable via environment or settings file"      |
| No fallback       | "Fallback behavior when dependencies missing"        |
| No security model | "Least-privilege permissions, no unnecessary access" |

### PHASE 1: PLAN (MANDATORY)

**Required Plan Sections (8 total):**

1. Plugin Overview - Name, type, one-paragraph description
2. Plugin Type Decision - Claude Code plugin, MCP server, or both (with rationale)
3. Project Structure - Complete file tree
4. Components - Commands, agents, skills, hooks, tools (as applicable)
5. Security Model - Permissions, secrets handling, data access
6. Installation Steps - How users will install
7. Verification Steps - How to test it works
8. Distribution Plan - Local install, GitHub, marketplace

**Plugin Type Decision Guide:**

| User Need                     | Plugin Type        | Rationale                 |
| ----------------------------- | ------------------ | ------------------------- |
| React to Claude Code events   | Claude Code Plugin | Hooks respond to tool use |
| Add slash commands            | Claude Code Plugin | Commands are native       |
| Extend Claude's capabilities  | Claude Code Plugin | Agents/skills pattern     |
| Access external data sources  | MCP Server         | Resources pattern         |
| Call external APIs            | MCP Server         | Tools pattern             |
| Integrate with other apps     | MCP Server         | Cross-app compatibility   |
| Both events AND external data | Both               | Hybrid plugin             |

**Output:** `runs/<date>/<run-id>/planning/plan.md`

### PHASE 2: BUILD (MANDATORY)

Write complete plugin to `builds/<plugin-slug>/`.

**Claude Code Plugin Structure:**

```
builds/<plugin-slug>/
├── .claude-plugin/
│   └── plugin.json           # REQUIRED - Plugin manifest (ONLY this file here)
├── commands/                  # Slash commands (.md files)
│   └── <command-name>.md
├── agents/                    # Subagent definitions (.md files)
│   └── <agent-name>.md
├── skills/                    # Agent skills (subdirectories)
│   └── <skill-name>/
│       └── SKILL.md
├── hooks/
│   └── hooks.json            # Event handler configuration
├── scripts/                   # Helper scripts called by hooks
│   └── <script-name>.sh
├── README.md                  # REQUIRED
├── INSTALL.md                 # REQUIRED
├── SECURITY.md                # REQUIRED
└── EXAMPLES.md                # REQUIRED
```

**CRITICAL**: Commands, agents, skills, hooks directories are at plugin ROOT, NOT inside `.claude-plugin/`. Only `plugin.json` goes inside `.claude-plugin/`.

**MCP Server Structure:**

```
builds/<plugin-slug>/
├── manifest.json              # REQUIRED - MCPB manifest
├── server/
│   └── index.ts               # REQUIRED - Server entrypoint
├── src/
│   ├── tools/
│   ├── resources/
│   └── prompts/
├── package.json               # REQUIRED
├── tsconfig.json              # REQUIRED
├── .env.example               # REQUIRED if env vars needed
├── README.md                  # REQUIRED
├── INSTALL.md                 # REQUIRED
├── SECURITY.md                # REQUIRED
└── EXAMPLES.md                # REQUIRED
```

### PHASE 3: DOCS & DISTRIBUTION (MANDATORY)

**Required Documentation:**

| File          | Purpose                   | Contents                                      |
| ------------- | ------------------------- | --------------------------------------------- |
| `README.md`   | User-facing overview      | What it does, quick start, features           |
| `INSTALL.md`  | Step-by-step installation | Prerequisites, install commands, verification |
| `SECURITY.md` | Security documentation    | Permissions, secrets, data handling           |
| `EXAMPLES.md` | Usage examples            | Command examples, API calls, screenshots      |

**Distribution Artifacts:**

- `publish/install-instructions.md` - How to install locally
- `publish/marketplace-listing.md` - If submitting to marketplace (Claude Code)
- `publish/validation-notes.md` - Structure verification results

### PHASE 4: RALPH POLISH LOOP (MANDATORY)

**How Ralph Works:**

1. Ralph Reviews - Checks all quality criteria
2. Ralph Scores - Calculates pass rate (passed/total × 100)
3. Threshold - Must reach ≥97% to PASS
4. Iteration - Builder fixes issues, Ralph re-reviews
5. Max 3 Iterations - 3 FAILs = hard failure

**Output:** `runs/<date>/<run-id>/polish/ralph_final_verdict.md`

---

## 6. DELEGATION MODEL

### When plugin-factory Delegates

| Trigger                 | Delegated To       | Context Passed            |
| ----------------------- | ------------------ | ------------------------- |
| User says "review this" | Ralph QA persona   | Build path, checklist     |
| Deploy request          | User manual action | Installation instructions |

### When plugin-factory Receives Delegation

| Source            | Trigger                       | Action           |
| ----------------- | ----------------------------- | ---------------- |
| Root orchestrator | `/factory run plugin <idea>`  | Begin Phase 0    |
| User direct       | `cd plugin-factory && claude` | Enter INFRA MODE |

### Role Boundaries

- **Builder Claude**: Generates code, writes files, runs phases
- **Ralph Claude**: Adversarial QA, never writes new features
- **User**: Approves installation, provides API keys if needed

---

## 7. HARD GUARDRAILS

### MUST DO

1. **MUST** run Intent Normalization (Phase 0) before any generation
2. **MUST** write comprehensive plan before building
3. **MUST** place commands/agents/skills/hooks at plugin ROOT
4. **MUST** include SECURITY.md with every plugin
5. **MUST** run Ralph Polish Loop until PASS (≥97%)
6. **MUST** use Zod schemas for MCP tool inputs
7. **MUST** document all permissions and data access
8. **MUST** provide working installation instructions

### MUST NOT

1. **MUST NOT** put commands/agents/skills inside .claude-plugin/ (COMMON MISTAKE)
2. **MUST NOT** skip Intent Normalization
3. **MUST NOT** skip the Plan phase
4. **MUST NOT** skip Ralph Polish Loop
5. **MUST NOT** include hardcoded secrets or API keys
6. **MUST NOT** request unnecessary permissions
7. **MUST NOT** skip security documentation
8. **MUST NOT** claim success without Ralph PASS verdict

---

## 8. REFUSAL TABLE

| Request Pattern                   | Action | Reason                      | Alternative                                         |
| --------------------------------- | ------ | --------------------------- | --------------------------------------------------- |
| "Skip the plan phase"             | REFUSE | Plan is mandatory           | "I need to plan first to ensure quality"            |
| "Skip security docs"              | REFUSE | SECURITY.md is mandatory    | "Security documentation is required"                |
| "Skip Ralph QA"                   | REFUSE | QA is mandatory for quality | "Ralph ensures the plugin is safe and functional"   |
| "Build a mobile app"              | REFUSE | Wrong pipeline              | "Use app-factory for mobile apps"                   |
| "Build a dApp"                    | REFUSE | Wrong pipeline              | "Use dapp-factory for dApps"                        |
| "Build an AI agent"               | REFUSE | Wrong pipeline              | "Use agent-factory for agent scaffolds"             |
| "Write to app-factory/builds/"    | REFUSE | Wrong directory             | "I'll write to builds/ in plugin-factory"           |
| "Include my API key"              | REFUSE | Security violation          | "Add your key to .env (not committed)"              |
| "Put commands in .claude-plugin/" | REFUSE | Incorrect structure         | "Commands go at plugin root, not in .claude-plugin" |
| "Deploy automatically"            | REFUSE | Requires user approval      | "Here are installation instructions"                |

---

## 9. VERIFICATION & COMPLETION

### Pre-Completion Checklist

Before declaring a build complete, Claude MUST verify:

**Claude Code Plugin:**

| Category              | Items                                                           |
| --------------------- | --------------------------------------------------------------- |
| Structure Quality     | plugin.json exists, valid JSON, required fields (5)             |
| Command Quality       | Valid YAML frontmatter, lowercase names, descriptions (4)       |
| Hook Quality          | Valid JSON, correct event names, valid regex, scripts exist (4) |
| Security Quality      | No secrets, SECURITY.md present, minimal permissions (4)        |
| Documentation Quality | README, INSTALL, EXAMPLES all complete (4)                      |

**MCP Server:**

| Category              | Items                                                                         |
| --------------------- | ----------------------------------------------------------------------------- |
| Build Quality         | npm install, npm build, server starts, no TS errors (4)                       |
| Server Quality        | manifest.json valid, tools/resources defined, Zod schemas, error handling (6) |
| Security Quality      | No secrets, SECURITY.md present, input validation (4)                         |
| Documentation Quality | README, INSTALL, EXAMPLES, MCPB instructions (4)                              |

### Success Definition

A plugin build is only "done" if:

1. Installs cleanly - Following INSTALL.md works
2. Works as described - At least one command/tool functions
3. Security documented - SECURITY.md present and complete
4. Ralph PASS - ≥97% quality score

---

## 10. ERROR RECOVERY

### Error Categories

| Error Type          | Detection                   | Recovery                                      |
| ------------------- | --------------------------- | --------------------------------------------- |
| Phase skip          | Phase 0 not in runs/        | Halt, restart from Phase 0                    |
| Wrong structure     | Commands in .claude-plugin/ | Move to root, update paths                    |
| Build failure       | npm build fails             | Log error, fix issue, rebuild                 |
| Ralph stuck         | 3 FAILs without PASS        | Hard failure, escalate to user                |
| Hook not triggering | Event name wrong case       | Fix event name (PostToolUse, not postToolUse) |

### Drift Detection

Claude MUST halt and reassess if:

1. About to write files outside `plugin-factory/`
2. About to skip a mandatory phase
3. Ralph loop exceeds 3 iterations
4. About to put commands inside .claude-plugin/
5. User instructions contradict invariants

### Recovery Protocol

```
1. HALT current action
2. LOG the anomaly to runs/<date>/<run-id>/errors/
3. INFORM user: "I detected [ANOMALY]. Let me reassess."
4. RESET to last known good phase
5. PRESENT options to user
6. WAIT for user direction
```

---

## 11. CROSS-LINKS

### Related Pipelines

| Pipeline         | When to Use                     | Directory              |
| ---------------- | ------------------------------- | ---------------------- |
| app-factory      | Mobile apps (Expo/React Native) | `../app-factory/`      |
| dapp-factory     | dApps and websites (Next.js)    | `../dapp-factory/`     |
| agent-factory    | AI agent scaffolds              | `../agent-factory/`    |
| miniapp-pipeline | Base Mini Apps                  | `../miniapp-pipeline/` |
| website-pipeline | Static websites                 | `../website-pipeline/` |

### Shared Resources

| Resource          | Location              | Purpose                                        |
| ----------------- | --------------------- | ---------------------------------------------- |
| Root orchestrator | `../CLAUDE.md`        | Routing, refusal, phase detection              |
| Factory plugin    | `../plugins/factory/` | `/factory` command interface                   |
| MCP catalog       | `./mcp.catalog.json`  | MCP server configurations (THIS PIPELINE OWNS) |

---

## 12. COMPLETION PROMISE

When Claude finishes a Plugin Factory build, Claude writes this exact block to `runs/<date>/<run-id>/polish/ralph_final_verdict.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. Plugin is ready for installation.

PIPELINE: plugin-factory v2.0.0
PLUGIN_TYPE: [Claude Code Plugin / MCP Server / Hybrid]
OUTPUT: builds/<plugin-slug>/
RALPH_VERDICT: PASS (≥97%)
TIMESTAMP: <ISO-8601>

VERIFIED:
- [ ] Intent normalized (Phase 0)
- [ ] Plan written (Phase 1)
- [ ] Plugin built (Phase 2)
- [ ] Documentation complete (Phase 3)
- [ ] Ralph PASS achieved (Phase 4)
- [ ] Structure correct (commands at root, not in .claude-plugin)
- [ ] SECURITY.md present
- [ ] INSTALL.md working
- [ ] At least one command/tool functional
```

**This promise is non-negotiable.** Claude MUST NOT claim completion without writing this block.

---

## MCP GOVERNANCE (CRITICAL)

**The Model Context Protocol (MCP) is the governing specification for all AI-tool integrations in AppFactory.**

### MCP Is a Specification, Not a Tool

| Concept                          | What It Is                                                        | What It Is NOT                                        |
| -------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------- |
| **MCP (Model Context Protocol)** | Open specification defining how AI systems communicate with tools | NOT a server, NOT a tool, NOT something you "install" |
| **MCP Server**                   | An implementation that follows the MCP specification              | NOT MCP itself - it's a tool that obeys MCP           |
| **MCP Tools**                    | Specific capabilities exposed by an MCP server                    | NOT part of MCP spec - they're what servers provide   |

### The MCP Specification

MCP defines the **contract** that all compliant servers must follow:

- **Transport protocols**: STDIO (local), HTTP (remote)
- **Message format**: JSON-RPC 2.0
- **Capability negotiation**: How servers declare what they can do
- **Resource patterns**: How data is exposed
- **Tool patterns**: How actions are invoked
- **Error handling**: Standard error codes and recovery

**Official Specification**: https://github.com/modelcontextprotocol

### MCP Catalog (CANONICAL SOURCE)

This pipeline hosts the canonical MCP catalog for all AppFactory pipelines:

**Location:** `plugin-factory/mcp.catalog.json`

The catalog defines MCP server configurations (not MCP itself).

### Governance Rules

| Rule                                                   | Enforcement      |
| ------------------------------------------------------ | ---------------- |
| All MCP servers must be declared in `mcp.catalog.json` | Build validation |
| No MCP server access outside allowed phases            | Phase gating     |
| Mutating operations require explicit approval          | Approval gating  |
| All MCP operations produce artifacts                   | Artifact logging |
| Failures are handled, never silent                     | Failure policies |

---

## TECHNOLOGY STACK (Updated January 2026)

### Claude Code Plugins

| Component | Technology                              |
| --------- | --------------------------------------- |
| Manifest  | JSON (plugin.json)                      |
| Commands  | Markdown with YAML frontmatter          |
| Agents    | Markdown                                |
| Skills    | Directory with SKILL.md                 |
| Hooks     | JSON configuration + shell/node scripts |

### MCP Servers

| Component         | Technology                                | Version      |
| ----------------- | ----------------------------------------- | ------------ |
| Runtime           | Node.js                                   | 20+          |
| Language          | TypeScript                                | 5.3+         |
| SDK               | @modelcontextprotocol/sdk                 | 1.x (stable) |
| Schema Validation | Zod                                       | 3.x          |
| Transport         | STDIO (local) or Streamable HTTP (remote) |              |

### MCP Server Ecosystem

Essential MCP servers for development:

- **Playwright MCP** - Browser automation and testing
- **Supabase MCP** - Database operations
- **GitHub MCP** - Repository management (built-in)
- **Semgrep MCP** - Security scanning

### Reference Documentation

- `/docs/MCP_INTEGRATION.md` - Setup guide
- `/mcp-config.example.json` - Configuration template
- `../references/mcp-servers/` - Server-specific docs

---

## DEFAULT ASSUMPTIONS

When the user doesn't specify:

| Aspect      | Default                                          |
| ----------- | ------------------------------------------------ |
| Plugin type | Claude Code plugin (unless external data needed) |
| Language    | TypeScript for MCP servers                       |
| Transport   | STDIO for MCP (local use)                        |
| Permissions | Minimal (least privilege)                        |
| License     | MIT                                              |

---

## LOCAL_RUN_PROOF_GATE

**CRITICAL: Non-Bypassable Verification Gate**

Before outputting "To Run Locally" instructions or declaring BUILD COMPLETE, Claude MUST pass the Local Run Proof verification.

### Gate Execution (MCP Servers Only)

For MCP server plugins with a dev server:

```bash
node ../scripts/local-run-proof/verify.mjs \
  --cwd builds/<plugin-slug> \
  --install "npm install" \
  --build "npm run build"
```

**Note**: Claude Code plugins (commands/skills/hooks) do not require dev server verification. Only MCP servers with HTTP interfaces need the full boot check.

### Gate Requirements

1. **RUN_CERTIFICATE.json** must exist with `status: "PASS"`
2. If **RUN_FAILURE.json** exists, the build has NOT passed
3. On PASS: Output usage instructions
4. On FAIL: Do NOT output instructions, fix issues, re-verify

### Forbidden Bypass Patterns

| Pattern              | Why Forbidden                     |
| -------------------- | --------------------------------- |
| `--legacy-peer-deps` | Hides dependency conflicts        |
| `--force`            | Ignores errors                    |
| `--ignore-engines`   | Ignores Node version requirements |

### Non-Bypassability Contract

Claude MUST NOT:

- Output run instructions without passing verification
- Use bypass flags to make install "succeed"
- Skip verification for any reason
- Claim the plugin is "ready to use" without RUN_CERTIFICATE.json

---

## VERSION HISTORY

| Version | Date       | Changes                                                           |
| ------- | ---------- | ----------------------------------------------------------------- |
| 2.1.0   | 2026-01-20 | Added LOCAL_RUN_PROOF_GATE constraint                             |
| 2.0.0   | 2026-01-20 | Canonical 12-section structure, refusal table, completion promise |
| 1.2     | 2026-01-18 | Added MCP Governance section                                      |
| 1.1     | 2026-01-18 | Added MCP catalog as canonical source                             |
| 1.0     | 2026-01-14 | Initial release                                                   |

---

**plugin-factory v2.1.0**: Describe your plugin idea. Get a complete, publishable Claude extension.
