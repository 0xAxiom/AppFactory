# Orchestrator Model

This document explains the relationship between the repository root and pipeline directories.

---

## Two Levels of Operation

AppFactory operates at two distinct levels:

| Level             | Location                                | Purpose                               |
| ----------------- | --------------------------------------- | ------------------------------------- |
| Root Orchestrator | `/` (repository root)                   | Routes requests, provides information |
| Pipeline          | `/app-factory/`, `/dapp-factory/`, etc. | Generates code                        |

Understanding this distinction prevents confusion.

---

## The Root Orchestrator

When you run Claude from the repository root (`/`), you interact with the **Root Orchestrator**.

The Root Orchestrator:

- Explains what AppFactory is
- Helps you choose a pipeline
- Provides navigation guidance
- Delegates to pipelines

The Root Orchestrator **does not**:

- Generate application code
- Write to output directories
- Execute builds

### Root Behavior

```
$ pwd
/path/to/AppFactory

$ claude

You: Build me a meditation app

Claude: I cannot execute builds from the repository root.

To build a meditation app, you have two options:

1. Navigate to the mobile pipeline:
   cd app-factory && claude
   Then describe your app idea.

2. Use the Factory command:
   /factory run app a meditation app with guided sessions
   This will show you a plan and require your approval.

Which approach would you prefer?
```

The orchestrator routes your request but does not execute it directly.

---

## Pipeline Directories

When you navigate to a pipeline directory and run Claude, you interact with that **Pipeline**.

Pipelines:

- Generate complete applications
- Write to their output directories
- Execute quality checks
- Produce runnable code

### Pipeline Behavior

```
$ pwd
/path/to/AppFactory/app-factory

$ claude

You: Build me a meditation app

Claude: I'll build a complete meditation app for you.

[PHASE 0: INTENT NORMALIZATION]
...
[PHASE 1: PLANNING]
...
[BUILD IN PROGRESS]
...
[RALPH QA]
...

BUILD COMPLETE: builds/meditation-app/
```

The pipeline generates code directly.

---

## Why This Separation?

### Safety

The orchestrator prevents accidental writes to wrong locations. It ensures you're in the correct context before generation begins.

### Clarity

Each pipeline has its own CLAUDE.md with specific rules. When you're in a pipeline, those rules apply. When you're at root, orchestrator rules apply.

### Flexibility

You can:

- Ask questions at root without triggering builds
- Build directly in pipelines without orchestrator overhead
- Use `/factory` commands for structured execution

---

## Navigation Patterns

### Pattern 1: Direct Navigation

Navigate to a pipeline, then describe your idea:

```bash
cd app-factory
claude
# Describe your idea
```

Best for: Quick builds when you know which pipeline to use.

### Pattern 2: Root Consultation

Start at root, get guidance, then navigate:

```bash
cd /path/to/AppFactory
claude
# Ask "What pipeline should I use for X?"
# Navigate to recommended pipeline
cd <recommended-pipeline>
# Describe your idea
```

Best for: When unsure which pipeline to use.

### Pattern 3: Factory Command

Use `/factory` from root for structured execution:

```bash
cd /path/to/AppFactory
claude
# /factory run app a meditation app
```

Best for: Explicit approval gates and audit logging.

---

## Output Directory Location

Outputs always appear within the pipeline directory:

```
AppFactory/
├── app-factory/
│   └── builds/              ← app-factory outputs
│       └── meditation-app/
├── dapp-factory/
│   └── dapp-builds/         ← dapp-factory outputs
│       └── my-dapp/
├── website-pipeline/
│   └── website-builds/      ← website-pipeline outputs
│       └── my-site/
└── ...
```

Outputs never appear at root level. This prevents mixing generated code with repository infrastructure.

---

## The Factory Plugin

The `/factory` command (implemented in `plugins/factory/`) provides an alternative interface from root.

### Factory vs Direct Navigation

| Aspect     | Direct Navigation  | /factory Command |
| ---------- | ------------------ | ---------------- |
| Location   | Pipeline directory | Repository root  |
| Approval   | Implicit           | Explicit gate    |
| Logging    | Standard           | Full audit trail |
| Complexity | Simple             | Structured       |

Both approaches produce the same output. Factory adds ceremony for users who want explicit control.

### Factory Commands

| Command                          | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `/factory help`                  | Show available commands             |
| `/factory plan <idea>`           | Generate a plan without executing   |
| `/factory run <pipeline> <idea>` | Execute with approval gate          |
| `/factory ralph <path>`          | Run quality check on existing build |
| `/factory audit`                 | View audit log                      |

---

## Common Mistakes

### Running from Root

**Wrong**:

```bash
cd /path/to/AppFactory
claude
# "Build me an app"
# → Fails: Root cannot build
```

**Right**:

```bash
cd /path/to/AppFactory/app-factory
claude
# "Build me an app"
# → Works: Pipeline builds
```

### Looking for Outputs at Root

**Wrong**:

```bash
ls /path/to/AppFactory/builds/
# → Directory doesn't exist
```

**Right**:

```bash
ls /path/to/AppFactory/app-factory/builds/
# → Your generated apps
```

### Mixing Pipelines

**Wrong**: Starting in one pipeline, then asking for something another pipeline handles.

```bash
cd app-factory
claude
# "Build me a Claude plugin"
# → Wrong pipeline
```

**Right**: Navigate to the correct pipeline first.

```bash
cd plugin-factory
claude
# "Build me a Claude plugin"
```

---

## Visual Model

```
                    ┌─────────────────────────────┐
                    │      Repository Root        │
                    │        (Orchestrator)       │
                    │                             │
                    │  - Routes requests          │
                    │  - Provides information     │
                    │  - Does NOT generate code   │
                    └─────────────┬───────────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
    ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
    │ app-factory │       │dapp-factory │       │   (other)   │
    │  (Pipeline) │       │  (Pipeline) │       │  pipelines  │
    │             │       │             │       │             │
    │ - Generates │       │ - Generates │       │             │
    │   mobile    │       │   web apps  │       │             │
    │   apps      │       │             │       │             │
    └──────┬──────┘       └──────┬──────┘       └─────────────┘
           │                     │
           ▼                     ▼
    ┌─────────────┐       ┌─────────────┐
    │   builds/   │       │ dapp-builds/│
    │  (outputs)  │       │  (outputs)  │
    └─────────────┘       └─────────────┘
```

---

**Next**: [Governance](./governance.md) | [Back to Index](../index.md)
