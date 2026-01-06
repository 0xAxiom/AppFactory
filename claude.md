# App Factory Control Plane

**Version**: 1.0  
**Status**: MANDATORY — CONSTITUTION FOR ALL CLAUDE OPERATIONS  
**Applies to**: All pipeline stages, agents, and Claude interactions  

---

## MISSION STATEMENT

App Factory is an autonomous, claude.md-driven pipeline system for generating complete, store-ready mobile application specifications. This system operates as a CLI-first, artifact-driven pipeline where each stage produces verifiable file outputs that advance toward a shippable app.

**CORE PRINCIPLE**: The filesystem is the source of truth. No stage is complete without required artifacts existing and passing quality gates.

---

## PIPELINE ARCHITECTURE

### Stage-Driven Execution
- **Stages 01-09**: Specification generation phases
- **Stage 10**: Master Builder (Flutter implementation)
- **Stages are sequential**: Each stage depends on outputs from previous stages
- **Stages are atomic**: Each stage succeeds completely or fails completely
- **Stages are resumable**: Pipeline can be stopped and resumed at any stage boundary

### Artifact-Driven Design
```
runs/YYYY-MM-DD/<run-name>/
├── spec/                    # Human-readable specifications (pipeline output)
├── stages/                  # Stage execution logs and claude.md files  
└── outputs/                 # Build artifacts, logs, generated code
```

### Truth-Preserving Operations
- **No false success**: Never claim completion without file evidence
- **No silent failures**: All errors must be logged with actionable remediation
- **Deterministic where possible**: Same inputs → same outputs (except LLM variability)
- **Local time compliance**: Run paths use local machine time, never UTC

---

## CLAUDE INTEGRATION CONTRACT

### Stage Template Requirements (MANDATORY)
Every stage template (`templates/agents/NN_*.md`) MUST include:

#### 1. Header Structure
```markdown
# Agent NN: [Stage Name]

You are executing Stage NN of the App Factory pipeline. Your mission is [clear purpose].

## MANDATORY GATE CHECK
[If applicable: dependency verification requirements]

## INPUTS
- [List of input files from previous stages]

## OUTPUTS  
- [List of exact output files this stage must produce]

## STANDARDS COMPLIANCE
Read and comply with `standards/mobile_app_best_practices_2026.md`. Your output must include a "Standards Compliance Mapping" section demonstrating how your deliverables meet relevant requirements.
```

#### 2. Output Format Specification (CRITICAL)
```markdown
## OUTPUT FORMAT

**CRITICAL**: You MUST use these exact delimiters for each file. The pipeline parser requires this exact format:

===FILE: spec/filename.md===
[file content here]
===END FILE===
```

#### 3. Quality Gates
```markdown
## DEFINITION OF DONE
- [ ] [Measurable completion criteria]
- [ ] [File existence and quality requirements]  
- [ ] [Standards compliance verification]
```

### Claude Execution Standards

#### Timeout Policy
- **Default timeout**: 120 seconds per stage
- **Maximum timeout**: 600 seconds (configurable via APPFACTORY_CLAUDE_ARGS)
- **No infinite hangs**: All executions must complete or fail with evidence

#### Logging Requirements
All Claude executions MUST generate:
```
runs/*/outputs/stageNN_claude.stdout.log
runs/*/outputs/stageNN_claude.stderr.log  
runs/*/outputs/stageNN_claude.exitcode
```

#### Error Handling
- **Exit code 0**: Success, parse output for artifacts
- **Exit code 124**: Timeout, provide retry guidance
- **Exit code != 0**: Execution failure, show stderr excerpt + troubleshooting steps

---

## GLOBAL CONSTRAINTS

### Technology Stack (IMMUTABLE)
- **Platforms**: iOS + Android
- **Framework**: Flutter (latest stable)
- **Design**: Material 3 + iOS adaptations
- **Monetization**: RevenueCat (subscription-first)
- **Analytics**: Firebase Analytics
- **Crash Reporting**: Firebase Crashlytics

### Architecture Principles
- **Auth**: Guest-first, optional accounts
- **State Management**: Provider/Riverpod (simple), Bloc (complex)
- **Storage**: SQLite + SharedPreferences + Secure Storage
- **Offline-first**: Core functionality works without internet

### Business Model Requirements
- **Subscription required**: No ads, no one-time purchases
- **Competition level**: Low/Medium only
- **MVP scope**: Single focused development stage
- **Excluded categories**: Dating, Gambling, Crypto/Trading, Medical diagnosis

### Security & Compliance
- **No secrets in code**: API keys via environment/secure storage only
- **RevenueCat spec-only**: Configuration details, no actual API keys
- **Privacy-first**: GDPR/CCPA compliant by design
- **Accessibility**: WCAG 2.1 AA compliance mandatory

---

## PIPELINE STATE MANAGEMENT

### Run Lifecycle
1. **Intake** (`spec/00_intake.md`): User input and constraints
2. **Signal Research** (Stage 01): Market research and idea generation  
3. **Idea Selection** (Manual gate): Human curation required
4. **Specification Stages** (02-09): Detailed specifications
5. **Builder Execution** (Stage 10): Flutter implementation

### Human Gates
- **After Stage 01**: Idea selection required (`spec/02_idea_selection.md`)
- **Before Stage 10**: Manual Master Builder execution

### State Files
- **Active run**: `~/.config/appfactory/active_run.json`
- **Stage completion**: Verified by output file existence and quality checks

---

## FAILURE & RETRY STRATEGY

### Retry Policies
- **Claude timeout**: Retry once with same prompt
- **Claude authentication**: Fail fast with auth guidance  
- **Parsing failure**: Fail with output format reminder
- **Missing dependencies**: Fail with installation guidance

### Backtracking
- **Stage failure**: Stop pipeline, require manual intervention
- **Output corruption**: Preserve original, allow manual restart
- **Idea selection changes**: Require full pipeline restart from Stage 02

---

## DEVELOPMENT & TESTING

### Stub Mode
- **Purpose**: Pipeline testing without Claude API calls
- **Activation**: `APPFACTORY_CLAUDE_MODE=stub`
- **Behavior**: Generate synthetic but realistic content for all stages

### Debug Mode  
- **Purpose**: Detailed logging and troubleshooting
- **Activation**: `APPFACTORY_DEBUG=true`
- **Behavior**: Show Claude binary paths, command invocations, file operations

### Doctor Check
- **Purpose**: Verify all dependencies and connectivity
- **Command**: `./bin/appfactory doctor`
- **Coverage**: Claude CLI, Python, directory structure, write permissions

---

## EDITING GUIDELINES

### For Stage Template Authors
1. **READ THIS FILE FIRST** before modifying any stage template
2. **Follow the contract**: All templates must implement required sections
3. **Test your changes**: Run stub mode pipeline to verify parsing works
4. **Document constraints**: Any new requirements must update this file

### For Pipeline Developers
1. **Filesystem as truth**: Never claim success without file evidence
2. **Error propagation**: All failures must bubble up with actionable guidance
3. **Local time compliance**: Use local machine time for all run paths
4. **Claude invocation**: Use `resolve_claude_binary()` for reliable execution

### For Contributors
1. **No GUI code**: CLI-first architecture only
2. **No demo logic**: Real functionality or documented stubs only
3. **No secrets**: API keys and tokens via configuration only
4. **Test compliance**: All changes must pass `./scripts/test_cli.sh`

---

## CONFIGURATION INTERFACE

### Environment Variables
- `APPFACTORY_CLAUDE_MODE`: `real` (default) or `stub`
- `APPFACTORY_DEBUG`: `true` for verbose logging
- `APPFACTORY_CLAUDE_ARGS`: Additional Claude CLI arguments

### Directory Structure
- `bin/appfactory`: Main CLI entrypoint
- `scripts/pipeline_functions.sh`: Core pipeline orchestration
- `templates/agents/`: Stage prompt templates
- `standards/`: Quality and compliance requirements
- `runs/`: All pipeline executions and outputs

---

**STOP CONDITION**: This control plane document defines the complete operating framework for App Factory. All stage agents, pipeline functions, and CLI operations must comply with these specifications.

**NEXT STEPS**: When implementing or modifying stages, refer to specific sections above for compliance requirements and architectural constraints.

---
*This document is the authoritative source for App Factory pipeline behavior. When in doubt, implement the most conservative interpretation that preserves pipeline integrity and user data.*