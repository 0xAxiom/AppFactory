# Claw Pipeline

**Version**: 2.0.0
**Mode**: OpenClaw AI Assistant Generator
**Status**: MANDATORY CONSTITUTION

---

## 1. PURPOSE & SCOPE

### What This Pipeline Does

Claw Pipeline generates **custom OpenClaw AI assistants** from plain-language descriptions. Users describe a bot personality, skills, and platform preferences, and Claude produces a complete, runnable OpenClaw project.

The pipeline handles the complete lifecycle: intent normalization, bot personality design, project scaffolding, verification, and adversarial QA.

### What This Pipeline Does NOT Do

| Action                         | Reason                 | Where It Belongs   |
| ------------------------------ | ---------------------- | ------------------ |
| Build mobile apps              | Wrong output format    | app-factory        |
| Build websites                 | Wrong pipeline         | website-pipeline   |
| Build dApps                    | Wrong pipeline         | dapp-factory       |
| Generate Claude plugins        | Wrong pipeline         | plugin-factory     |
| Generate Base Mini Apps        | Wrong pipeline         | miniapp-pipeline   |
| Deploy bots to production      | Requires user approval | Manual step        |

### Output Directory

All generated OpenClaw assistants are written to: `builds/claws/<slug>/`

### Boundary Enforcement

Claude MUST NOT write files outside `claw-pipeline/` directory. Specifically forbidden:

- `app-factory/builds/` (belongs to app-factory)
- `dapp-factory/dapp-builds/` (belongs to dapp-factory)
- `agent-factory/outputs/` (belongs to agent-factory)
- `plugin-factory/builds/` (belongs to plugin-factory)
- `miniapp-pipeline/builds/` (belongs to miniapp-pipeline)
- `website-pipeline/website-builds/` (belongs to website-pipeline)
- Any path outside the repository

---

## 2. CANONICAL USER FLOW

```
User: "I want an AI assistant that helps people learn chess"

┌─────────────────────────────────────────────────────────────────┐
│ STAGE C0: INTENT NORMALIZATION                                   │
│ Claude transforms raw input → structured bot concept             │
│ Output: builds/claws/<slug>/artifacts/inputs/                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE C1: BOT PERSONALITY & SKILLS PLAN                          │
│ Claude designs persona, skills, integrations, platform config    │
│ Output: builds/claws/<slug>/artifacts/stage01/                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE C2: OPENCLAW BOT SCAFFOLD                                  │
│ Claude generates runnable OpenClaw project                       │
│ Output: builds/claws/<slug>/                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE C3: INSTALL & VERIFY                                       │
│ Local Run Proof Gate - npm install, config validation, dry-run   │
│ Output: builds/claws/<slug>/RUN_CERTIFICATE.json                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE C4: RALPH QA                                               │
│ Adversarial quality review ≥97% PASS                             │
│ Output: builds/claws/<slug>/artifacts/ralph/                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ STAGE C5: COMPLETION & LAUNCH CARD                               │
│ Bot summary, setup instructions, and zip packaging               │
│ Output: builds/claws/<slug>/LAUNCH_CARD.md + <slug>.zip          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
          User receives runnable OpenClaw AI assistant as zip
```

---

## 3. DIRECTORY MAP

```
claw-pipeline/
├── CLAUDE.md                    # This constitution (CANONICAL)
├── README.md                    # User documentation
├── package.json                 # Pipeline dependencies
├── scripts/
│   ├── run.mjs                  # Pipeline runner
│   └── lib/
│       ├── skill-detection.mjs  # Detect required bot skills
│       ├── local-run-proof.mjs  # Verification harness
│       ├── process-manager.mjs  # Process lifecycle
│       └── visual.mjs           # Terminal output formatting
├── constants/
│   └── openclaw.ts              # Platform/integration defaults
├── utils/
│   ├── openclaw-config-generator.ts  # Bot config generation
│   └── retry.ts                 # Retry with exponential backoff
├── templates/
│   ├── system/
│   │   ├── bot_spec_author.md        # System prompt for C1
│   │   └── ralph_polish_loop.md      # System prompt for C4
│   └── openclaw/
│       ├── config.template.ts        # OpenClaw config template
│       └── skill.template.ts         # Custom skill template
├── schemas/
│   └── bot-spec.schema.json          # Bot specification schema
├── builds/                      # Generated assistants (OUTPUT DIRECTORY)
│   └── claws/
│       └── <slug>/
│           ├── config/          # OpenClaw configuration
│           ├── src/skills/      # Custom skills
│           ├── .env.example     # Environment template
│           ├── README.md        # Setup documentation
│           ├── SETUP.md         # Step-by-step setup guide
│           └── artifacts/       # Pipeline artifacts
└── vendor/
    └── openclaw/                # Reference documentation
```

### Directory Boundaries

| Directory                        | Purpose                        | Who Writes  | Distributable |
| -------------------------------- | ------------------------------ | ----------- | ------------- |
| `builds/claws/<slug>/`           | Final OpenClaw project         | Claude      | YES           |
| `builds/claws/<slug>/artifacts/` | Pipeline outputs and logs      | Claude      | NO            |
| `vendor/`                        | Cached reference documentation | Maintainers | NO            |

---

## 4. MODES

### INFRA MODE (Default)

When Claude enters `claw-pipeline/` without an active build:

- Explains what Claw Pipeline does
- Lists recent builds in `builds/claws/`
- Awaits user's bot description
- Does NOT generate code until user provides intent

**Infra Mode Indicators:**

- No active build session
- User asking questions or exploring
- No stage initiated

### BUILD MODE

When Claude is executing an OpenClaw assistant build:

- Has active `builds/claws/<slug>/` directory
- User has provided bot intent
- Claude is generating files

**BUILD MODE Stages:**

- C0: Intent Normalization
- C1: Bot Personality & Skills Plan
- C2: Chain Selection Gate (CONDITIONAL)
- C3: Token Configuration (CONDITIONAL)
- C4: Token Creation (APPROVAL GATE, CONDITIONAL)
- C5: OpenClaw Bot Scaffold
- C6: Install & Verify
- C7: Ralph QA
- C8: Completion & Launch Card

### QA MODE (Ralph)

When Claude enters Stage C7:

- Adopts adversarial QA persona
- Evaluates against quality checklist
- Iterates until PASS (>=97%) or max 10 passes

---

## 5. PHASE MODEL

### STAGE C0: INTENT NORMALIZATION (MANDATORY)

Transform raw user input into a structured bot concept.

**Purpose:** Ensure every build starts from a well-defined specification, not vague intent.

**Rules:**

1. Treat user's message as RAW INTENT, not specification
2. Infer missing but required bot qualities (personality, skills, platforms)
3. Rewrite into clean, structured bot concept
4. Do NOT ask user to approve this rewrite
5. Save to: `builds/claws/<slug>/artifacts/inputs/normalized_prompt.md`

**Output Format:**

```markdown
# OpenClaw Bot Concept

## Name

[Suggested bot name]

## Personality

[Core personality traits and communication style]

## Primary Function

[What this bot does]

## Platforms

[WhatsApp, Telegram, Discord, Slack, or all]

## Skills Required

[List of skills: email, calendar, web browsing, custom, etc.]

## Token Interest

[Yes - Solana / Yes - Base / No / Undecided]

## Target Audience

[Who will interact with this bot]
```

**Example Transformation:**

```
User says: "make me a chess tutor bot with a token"

Claude normalizes to: "An AI chess tutor named ChessMind that teaches
chess concepts through interactive dialogue, analyzes positions described
in text, suggests moves, and tracks student progress. Friendly and
encouraging personality. Available on all platforms. Skills: web browsing
(for opening databases), custom analysis skill. Token interest: Yes -
chain undecided."
```

### STAGE C1: BOT PERSONALITY & SKILLS PLAN (MANDATORY)

Design comprehensive bot specification.

**Purpose:** Produce a complete bot blueprint before any code generation.

**Output:** `builds/claws/<slug>/artifacts/stage01/bot_spec.md`

**Required Spec Sections:**

1. **Identity** - Name, avatar description, bio, tagline
2. **Communication Style** - Tone, formality, emoji usage, response length preferences
3. **Platforms** - Which chat platforms, platform-specific behavior
4. **Skills Manifest** - Built-in skills to enable (email, calendar, web browsing, code execution)
5. **Custom Skills** - Any domain-specific skills to implement
6. **Model Configuration** - AI model selection, temperature, system prompt
7. **Multi-Agent** - Whether to enable multi-agent collaboration
8. **Browser Automation** - Whether the bot needs web browsing capabilities

### STAGE C2: CHAIN SELECTION GATE (CONDITIONAL)

**Trigger:** Only if user indicated token interest in C0 or explicitly requests token launch.

**Purpose:** Present clear choice between Solana and Base chains.

**Rules:**

1. Skip entirely if user does not want a token
2. Present both options with clear explanation
3. Wait for explicit user selection
4. Do NOT default to either chain

**Chain Options Presented:**

| Option   | Chain  | Platform        | Key Feature                    |
| -------- | ------ | --------------- | ------------------------------ |
| Solana   | Solana | Bags.fm         | Fast, low fees, SPL token      |
| Base     | Base   | Agent Launchpad | EVM, Clanker ecosystem, ERC-20 |
| No Token | -      | -               | Skip token launch entirely     |

**Output:** `builds/claws/<slug>/artifacts/stage02/chain_decision.md`

### STAGE C3: TOKEN CONFIGURATION (CONDITIONAL)

**Trigger:** Only if user selected Solana or Base in C2.

**Purpose:** Gather chain-specific token parameters from user.

### STAGE C2: OPENCLAW BOT SCAFFOLD (MANDATORY)

Generate runnable OpenClaw project.

**Purpose:** Produce a complete, runnable OpenClaw assistant project.

**Output Structure:**

```
builds/claws/<slug>/
├── config/
│   ├── bot.config.ts          # Main bot configuration
│   ├── platforms.config.ts    # Platform-specific settings
│   ├── skills.config.ts       # Skills manifest
│   └── model.config.ts        # AI model settings
├── src/
│   └── skills/
│       └── <custom-skill>.ts  # Any custom skills from C1
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
├── SETUP.md
└── artifacts/                 # Pipeline artifacts (not distributable)
```

**Rules:**

1. All secrets go in `.env.example` as placeholders, NEVER in source
2. README must include complete setup instructions
3. SETUP.md must include step-by-step guide for each platform

### STAGE C3: INSTALL & VERIFY (MANDATORY)

**Purpose:** Validate the generated project runs correctly.

**Verification Steps:**

1. `npm install` - must complete without errors (no bypass flags)
2. Config validation - all required fields present and valid
3. OpenClaw dry-run - config parses without errors
4. Environment variable documentation complete

**Output:** `builds/claws/<slug>/RUN_CERTIFICATE.json`

### STAGE C4: RALPH QA (MANDATORY)

Adversarial quality review.

**Purpose:** Ensure production readiness through rigorous QA.

**Ralph Review Checklist:**

- **Config Correctness** - All bot.config.ts fields valid, no missing required fields
- **Skills Manifest** - All declared skills have implementations, no orphaned skills
- **Security** - No secrets in source files, all sensitive values in .env.example
- **README Completeness** - Setup instructions cover all platforms, prerequisites listed
- **Environment Variable Docs** - Every .env variable documented with description and example
- **Platform Config** - Each enabled platform has correct configuration
- **Error Handling** - Graceful failures for missing API keys, network errors

**Loop Structure:**

1. Run checklist evaluation
2. If failures: fix highest-impact issue
3. If passing: make one high-leverage polish improvement
4. Document in `artifacts/ralph/PROGRESS.md`
5. Continue until PASS (>=97%) or max 10 passes

**Output:** `builds/claws/<slug>/artifacts/ralph/PROGRESS.md`

### STAGE C5: COMPLETION & LAUNCH CARD (MANDATORY)

**Purpose:** Provide user with everything needed to run and manage their bot.

**Launch Card Contents:**

```markdown
# Launch Card: <Bot Name>

## Bot Summary

- Name: <name>
- Personality: <brief description>
- Platforms: <list>
- Skills: <list>
- Model: <model name>

## Quick Start

1. cd builds/claws/<slug>/
2. cp .env.example .env
3. Fill in API keys in .env
4. npm install
5. npm start

## Platform Setup

[Per-platform instructions]
```

**Output:** `builds/claws/<slug>/LAUNCH_CARD.md`

---

## 6. DELEGATION MODEL

### When claw-pipeline Delegates

| Trigger                  | Delegated To       | Context Passed          |
| ------------------------ | ------------------ | ----------------------- |
| User says "review this"  | Ralph QA persona   | Build path, checklist   |
| Platform API key needed  | User manual action | .env setup instructions |
| Deploy request           | User manual action | Setup documentation     |

### When claw-pipeline Receives Delegation

| Source            | Trigger                      | Action           |
| ----------------- | ---------------------------- | ---------------- |
| Root orchestrator | `/factory run claw <idea>`   | Begin Stage C0   |
| User direct       | `cd claw-pipeline && claude` | Enter INFRA MODE |

### Role Boundaries

- **Builder Claude**: Generates bot config, writes files, runs stages
- **Ralph Claude**: Adversarial QA, never writes new features
- **User**: Approves token creation, provides API keys, provides platform credentials

---

## 7. HARD GUARDRAILS

### MUST DO

1. **MUST** normalize intent through Stage C0 before any generation
2. **MUST** run Ralph QA (C4) before declaring build complete
3. **MUST** pass Local Run Proof Gate (C3) before declaring build complete
4. **MUST** write only to `builds/claws/<slug>/`
5. **MUST** place all secrets in `.env.example` as placeholders

### MUST NOT

1. **MUST NOT** expose API keys in generated source files
2. **MUST NOT** write files outside `claw-pipeline/`
3. **MUST NOT** use bypass flags (`--legacy-peer-deps`, `--force`, `--ignore-engines`, `--ignore-scripts`, `--shamefully-hoist`, `--skip-integrity-check`)

---

## 8. REFUSAL TABLE

| Request Pattern                     | Action | Reason                         | Alternative                                    |
| ----------------------------------- | ------ | ------------------------------ | ---------------------------------------------- |
| "Build me a mobile app"             | REFUSE | Wrong pipeline                 | "Use app-factory for mobile apps"              |
| "Build me a website"                | REFUSE | Wrong pipeline                 | "Use website-pipeline for websites"            |
| "Skip the bot spec"                 | REFUSE | Bot spec is mandatory          | "I need to design the bot spec first"          |
| "Put my API key in the source code" | REFUSE | Security violation             | "Use environment variables in .env"            |
| "Skip Ralph QA"                     | REFUSE | QA is mandatory                | "Ralph ensures production quality"             |
| "Skip install verification"         | REFUSE | Verification is non-bypassable | "Verification ensures the project works"       |
| "Deploy the bot for me"             | REFUSE | Requires user action           | "Follow the setup instructions in SETUP.md"    |
| "Write to agent-factory/"           | REFUSE | Wrong directory                | "I'll write to builds/claws/ instead"          |

---

## 9. VERIFICATION & COMPLETION

### Pre-Completion Checklist

Before declaring a build complete, Claude MUST verify:

**Bot Configuration:**

- [ ] `bot.config.ts` has all required fields (name, personality, system prompt)
- [ ] `platforms.config.ts` has valid config for each enabled platform
- [ ] `skills.config.ts` lists all skills with correct references
- [ ] `model.config.ts` has valid model selection and parameters

**Skills:**

- [ ] All declared skills have implementations in `src/skills/`
- [ ] No orphaned skill files without manifest entries
- [ ] Custom skills follow OpenClaw skill interface

**Security:**

- [ ] No API keys in source files
- [ ] No secrets in config files
- [ ] All sensitive values in `.env.example` with placeholder markers

**Documentation:**

- [ ] README.md covers project overview and quick start
- [ ] SETUP.md has per-platform step-by-step instructions
- [ ] `.env.example` has comments for every variable
- [ ] LAUNCH_CARD.md is complete and accurate

**Build Quality:**

- [ ] `npm install` completes without errors
- [ ] Config validation passes
- [ ] OpenClaw dry-run succeeds
- [ ] No TypeScript errors

### Success Definition

An OpenClaw assistant build is only "done" if:

1. All mandatory stages completed (C0, C1, C5, C6, C7, C8)
2. Conditional stages completed if applicable (C2, C3, C4)
3. Local Run Proof Gate passed
4. Ralph PASS verdict (>=97%)
5. Launch Card generated

---

## 10. ERROR RECOVERY

### Error Categories

| Error Type              | Detection                  | Recovery                                          |
| ----------------------- | -------------------------- | ------------------------------------------------- |
| Stage skip              | Stage not in artifacts/    | Halt, restart from missed stage                   |
| Token launch failure    | API error response         | Log error, show to user, offer retry              |
| API rate limit          | 429 response               | Wait with exponential backoff, retry              |
| Partner key invalid     | Bags API rejection         | Halt, verify partner key, escalate to user        |
| Chain selection skipped | Token requested without C2 | Halt, return to C2                                |
| Build failure           | npm install fails          | Log error, fix issue, re-verify                   |
| Ralph stuck             | 10 passes without PASS     | Document blockers, escalate to user               |
| Invalid wallet address  | Format validation failure  | Show format requirements, ask for correct address |

### Drift Detection

Claude MUST halt and reassess if:

1. About to write files outside `claw-pipeline/`
2. About to create a token without user approval
3. About to skip a mandatory stage
4. About to modify the partner key
5. Ralph loop exceeds 10 passes
6. User instructions contradict invariants

### Recovery Protocol

```
1. HALT current action
2. LOG the anomaly to artifacts/errors/
3. INFORM user: "I detected [ANOMALY]. Let me reassess."
4. RESET to last known good stage
5. PRESENT options to user
6. WAIT for user direction
```

---

## 11. CROSS-LINKS

### Related Pipelines

| Pipeline         | When to Use                     | Directory              |
| ---------------- | ------------------------------- | ---------------------- |
| app-factory      | Mobile apps (Expo/React Native) | `../app-factory/`      |
| dapp-factory     | dApps with Web3 (Next.js)       | `../dapp-factory/`     |
| agent-factory    | AI agent scaffolds              | `../agent-factory/`    |
| plugin-factory   | Claude plugins/MCP servers      | `../plugin-factory/`   |
| miniapp-pipeline | Base Mini Apps                  | `../miniapp-pipeline/` |
| website-pipeline | Static websites                 | `../website-pipeline/` |

### Shared Resources

| Resource          | Location                             | Purpose                           |
| ----------------- | ------------------------------------ | --------------------------------- |
| Root orchestrator | `../CLAUDE.md`                       | Routing, refusal, phase detection |
| Factory plugin    | `../plugins/factory/`                | `/factory` command interface      |
| MCP catalog       | `../plugin-factory/mcp.catalog.json` | MCP server configurations         |
| OpenClaw docs     | `./vendor/openclaw/`                 | Cached reference documentation    |

### Partner Key Canonical Source

The Bags.fm partner key is defined in `constants/partner.ts`:

```
FDYcVLxHkekUFz4M29hCuBH3vbf1aLm62GEFZxLFdGE7
```

This key is immutable. It MUST NOT be modified, overridden, or exposed to end users in generated code.

### MCP Integration

This pipeline supports MCP servers as defined in `plugin-factory/mcp.catalog.json`:

| MCP Server | Stage  | Permission | Purpose                            |
| ---------- | ------ | ---------- | ---------------------------------- |
| GitHub     | all    | read-write | Already integrated via Claude Code |
| Context7   | C1, C5 | read-only  | Documentation lookup               |

**Note:** MCP is the **specification**. MCP servers are **tools** that follow the spec.

---

## 12. COMPLETION PROMISE

When Claude finishes a Claw Pipeline build, Claude writes this exact block to `builds/claws/<slug>/artifacts/ralph/PROGRESS.md`:

```
COMPLETION_PROMISE: All acceptance criteria met. OpenClaw assistant is ready for deployment.

PIPELINE: claw-pipeline v1.0.0
OUTPUT: builds/claws/<slug>/
RALPH_VERDICT: PASS (>=97%)
TOKEN_LAUNCHED: [Yes - Solana / Yes - Base / No]
TIMESTAMP: <ISO-8601>

VERIFIED:
- [ ] Intent normalized (Stage C0)
- [ ] Bot spec designed (Stage C1)
- [ ] Chain selection complete (Stage C2) - or N/A
- [ ] Token configured (Stage C3) - or N/A
- [ ] Token created with approval (Stage C4) - or N/A
- [ ] OpenClaw project scaffolded (Stage C5)
- [ ] Install & verify passed (Stage C6)
- [ ] Ralph PASS achieved (Stage C7)
- [ ] Launch Card generated (Stage C8)
- [ ] npm install succeeds
- [ ] Config validation passes
- [ ] No secrets in source files
- [ ] All .env variables documented
- [ ] README and SETUP complete
```

**This promise is non-negotiable.** Claude MUST NOT claim completion without writing this block.

---

## TECHNOLOGY STACK

### OpenClaw Runtime

| Component | Technology | Notes                        |
| --------- | ---------- | ---------------------------- |
| Runtime   | Node.js    | OpenClaw platform runtime    |
| Config    | TypeScript | Typed configuration files    |
| Skills    | TypeScript | Custom skill implementations |


| Component  | Technology       | Notes                 |
| ---------- | ---------------- | --------------------- |
| API Client | fetch (native)   | REST API calls        |
| Auth       | x-api-key header | User-provided API key |

### Chat Platforms

| Platform | Integration Method    |
| -------- | --------------------- |
| WhatsApp | OpenClaw WhatsApp SDK |
| Telegram | OpenClaw Telegram SDK |
| Discord  | OpenClaw Discord SDK  |
| Slack    | OpenClaw Slack SDK    |

### AI Models

| Model        | Provider   | Default |
| ------------ | ---------- | ------- |
| Claude       | Anthropic  | YES     |
| GPT-4        | OpenAI     | No      |
| Local models | Ollama/etc | No      |

---

## DEFAULT ASSUMPTIONS

When the user does not specify, Claude assumes:

| Parameter     | Default Value                            | Override Trigger               |
| ------------- | ---------------------------------------- | ------------------------------ |
| Platforms     | All (WhatsApp, Telegram, Discord, Slack) | User specifies subset          |
| AI Model      | Claude (Anthropic)                       | User requests different model  |
| Skills        | Standard (email, calendar, web browsing) | User specifies different set   |
| Multi-Agent   | Disabled                                 | User requests multi-agent      |
| Browser Auto  | Disabled                                 | User requests browsing ability |
| Communication | Friendly, professional tone              | User describes personality     |

---

## LOCAL_RUN_PROOF_GATE

**CRITICAL: Non-Bypassable Verification Gate**

Before outputting "To Run Locally" instructions or declaring BUILD COMPLETE, Claude MUST pass the Local Run Proof verification.

### Gate Execution

```bash
node ../scripts/local-run-proof/verify.mjs \
  --cwd builds/claws/<slug> \
  --install "npm install" \
  --build "npx tsc --noEmit" \
  --dev "npm start" \
  --url "http://localhost:3000/"
```

### Gate Requirements

1. **RUN_CERTIFICATE.json** must exist with `status: "PASS"`
2. If **RUN_FAILURE.json** exists, the build has NOT passed
3. On PASS: Output run instructions, browser auto-opens
4. On FAIL: Do NOT output run instructions, fix issues, re-verify

### Forbidden Bypass Patterns

| Pattern                  | Why Forbidden                     |
| ------------------------ | --------------------------------- |
| `--legacy-peer-deps`     | Hides dependency conflicts        |
| `--force`                | Ignores errors                    |
| `--ignore-engines`       | Ignores Node version requirements |
| `--ignore-scripts`       | Skips postinstall (security risk) |
| `--shamefully-hoist`     | pnpm: hides resolution issues     |
| `--skip-integrity-check` | yarn: bypasses lockfile integrity |

### Non-Bypassability Contract

Claude MUST NOT:

- Output run instructions without passing verification
- Use bypass flags to make install "succeed"
- Skip verification for any reason
- Claim the assistant is "ready to run" without RUN_CERTIFICATE.json

---

## VERSION HISTORY

| Version | Date       | Changes                                 |
| ------- | ---------- | --------------------------------------- |
| 1.0.0   | 2026-02-01 | Initial release with C0-C8 stage system |
| 2.0.0   | 2026-02-15 | Removed token launch, streamlined to C0-C5 stages |

---

**claw-pipeline v2.0.0**: Describe your AI assistant idea. Get a complete OpenClaw project as a zip.
