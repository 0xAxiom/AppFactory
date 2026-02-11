---
name: setup-environment
description: Initialize and configure a new user's local development environment for App Factory. Triggers on /setup, "set me up", or "configure my environment".
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Environment Setup Skill

Automatically configure a new user's local development environment for App Factory.

## When This Skill Applies

- User says `/setup`, "set me up", or "configure my environment"
- User asks "how do I get started" or "what do I need to install"
- First-time contributor onboarding

## Setup Procedure

When triggered, execute the following checks **in order**. Skip tools that are already installed and at the correct version. Show a plan before executing any installations.

### Phase 1: Core Requirements (BLOCKING)

These MUST pass before proceeding. If any fail, show the fix and stop.

#### 1.1 Node.js (>= 18.0.0)

```bash
node --version 2>/dev/null
```

- **PASS**: Version >= 18.0.0
- **FAIL**: Prompt user to install via `brew install node` (macOS), `nvm install 18`, or https://nodejs.org

#### 1.2 npm

```bash
npm --version 2>/dev/null
```

- **PASS**: Any version (ships with Node.js)
- **FAIL**: Reinstall Node.js

#### 1.3 Git

```bash
git --version 2>/dev/null
```

- **PASS**: Any version 2.x+
- **FAIL**: `xcode-select --install` (macOS) or `sudo apt-get install git` (Linux)

#### 1.4 Claude Code CLI

```bash
claude --version 2>/dev/null
```

- **PASS**: Any version
- **FAIL**: `npm install -g @anthropic-ai/claude-code`

### Phase 2: Repository Integrity

Verify the repo is intact and all 6 pipelines are present.

#### 2.1 Pipeline Directories

Check each directory exists and contains a CLAUDE.md:

```
app-factory/CLAUDE.md
website-pipeline/CLAUDE.md
dapp-factory/CLAUDE.md
agent-factory/CLAUDE.md
plugin-factory/CLAUDE.md
miniapp-pipeline/CLAUDE.md
```

- **PASS**: All 6 exist
- **WARN**: Missing pipelines (list which ones)

#### 2.2 Core Infrastructure

Check these critical files/directories exist:

```
plugins/factory/commands/factory.md
scripts/local-run-proof/verify.mjs
scripts/factory_ready_check.sh
core/package.json
.claude/settings.json
.mcp.json
```

- **PASS**: All present
- **WARN**: List missing files with remediation

### Phase 3: Dependencies

#### 3.1 Root npm Install

```bash
# Check if node_modules exists
ls node_modules/.package-lock.json 2>/dev/null
```

- **PASS**: node_modules exists and is populated
- **ACTION**: Run `npm install` at repository root (requires user approval)

#### 3.2 Husky Git Hooks

```bash
ls .husky/_/husky.sh 2>/dev/null
```

- **PASS**: Husky hooks installed
- **ACTION**: Run `npx husky install` (requires user approval)

### Phase 4: Environment Configuration

#### 4.1 Environment Variables

```bash
# Check .env exists
test -f .env
```

- **PASS**: .env exists
- **ACTION**: Copy from .env.example → .env, then prompt user to fill in ANTHROPIC_API_KEY

#### 4.2 MCP Server Configuration

Check `.mcp.json` exists and `.claude/settings.json` has MCP servers enabled:

```
github, playwright, filesystem, context7, semgrep
```

- **PASS**: Configuration files present and servers listed
- **WARN**: Missing servers with instructions to enable

### Phase 5: Optional Tools (Non-Blocking)

These improve the development experience but are not required.

#### 5.1 watchman (for Expo/React Native hot reload)

```bash
watchman --version 2>/dev/null
```

- **PASS**: Installed
- **SKIP**: Not installed (suggest `brew install watchman` on macOS)
- Only relevant if user plans to use app-factory

#### 5.2 Xcode Command Line Tools (macOS only)

```bash
xcode-select -p 2>/dev/null
```

- **PASS**: Installed
- **SKIP**: Not installed (suggest `xcode-select --install`)
- Only relevant on macOS for iOS simulator preview

#### 5.3 Development Tools Check

Verify these work from root package.json scripts:

```bash
npx eslint --version 2>/dev/null
npx prettier --version 2>/dev/null
npx tsc --version 2>/dev/null
```

- **PASS**: All return versions
- **WARN**: Missing tools (will be available after npm install)

### Phase 6: Validation

Run the validation script to confirm everything:

```bash
bash scripts/validate-setup.sh
```

### Output: Status Report

After all phases, display a summary table:

```
============================================================
  App Factory Environment Setup Report
============================================================

  Core Requirements:
    Node.js 18+          PASS  (v20.11.0)
    npm                  PASS  (v10.2.4)
    Git                  PASS  (v2.43.0)
    Claude Code CLI      PASS  (v1.x.x)

  Repository Integrity:
    app-factory          PASS
    website-pipeline     PASS
    dapp-factory         PASS
    agent-factory        PASS
    plugin-factory       PASS
    miniapp-pipeline     PASS
    Core infrastructure  PASS

  Dependencies:
    npm install          PASS
    Husky hooks          PASS

  Environment:
    .env file            PASS
    MCP servers          PASS  (5/5 configured)

  Optional Tools:
    watchman             SKIP  (not needed unless using app-factory)
    Xcode CLI Tools      PASS  (macOS)
    ESLint               PASS
    Prettier             PASS
    TypeScript           PASS

============================================================
  Result: READY

  You're all set! Next steps:
  1. Run /factory help to see available commands
  2. Run ./quickstart.sh for an interactive guide
  3. cd into any pipeline directory and run claude
============================================================
```

## Critical Rules

1. **Show plan first** - Never install anything without showing what will happen
2. **Require approval** - Ask before running npm install or brew install
3. **Skip installed tools** - Never reinstall something that's already at the right version
4. **Non-destructive** - Never overwrite existing .env files (only create if missing)
5. **Parallel where safe** - Version checks can run in parallel; installations must be sequential
6. **Respect invariants** - All 8 App Factory invariants apply (no silent execution, mandatory approval, etc.)
7. **macOS awareness** - Detect platform and adjust commands accordingly (brew vs apt)
8. **Graceful degradation** - Optional tools failing should not block setup completion

## Error Recovery

If any BLOCKING check fails:

1. Show the specific error
2. Provide the exact fix command
3. Ask user to fix and re-run `/setup`
4. Do NOT attempt to continue past blocking failures

If any OPTIONAL check fails:

1. Mark as SKIP in the report
2. Note what functionality is affected
3. Continue with remaining checks
