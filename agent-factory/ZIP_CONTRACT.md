# Agent Factory ZIP Contract v1.0

This document defines the **exact rules** for what a valid agent ZIP must contain.

If your ZIP does not follow these rules, it will be **rejected**.

---

## What Is This?

When you upload an agent to the Factory platform, you upload a ZIP file.

This ZIP must follow strict rules so that:
1. The platform can safely validate your agent
2. Your agent works correctly when others download it
3. No secrets, malware, or dangerous files sneak through

---

## Required Files

Every agent ZIP **MUST** contain these files at the root level:

| File | Required | Description |
|------|----------|-------------|
| `agent.json` | YES | The agent manifest (source of truth) |
| `package.json` | YES | Node.js dependencies and metadata |
| `src/` | YES | Source code directory |
| `src/index.js` or `src/index.ts` | YES | Entrypoint file (must match `runtime.entrypoint` in agent.json) |

---

## Optional Files

These files are allowed but not required:

| File | Description |
|------|-------------|
| `AGENT_SPEC.md` | Plain English description of your agent |
| `RUNBOOK.md` | Instructions for running locally |
| `README.md` | Additional documentation |
| `LICENSE` | License file |
| `tsconfig.json` | TypeScript configuration |
| `.nvmrc` | Node version specification |

---

## Forbidden Files and Patterns

These files will cause **immediate rejection**:

### 1. Secret Files (NEVER include these)
```
.env
.env.*
*.pem
*.key
*.crt
credentials.json
secrets.json
*.secret
config/secrets/*
```

### 2. Build Artifacts (regenerate these locally)
```
node_modules/
dist/
build/
.cache/
*.log
```

### 3. IDE and System Files
```
.DS_Store
Thumbs.db
.idea/
.vscode/
*.swp
*.swo
```

### 4. Dangerous Files
```
*.exe
*.dll
*.so
*.dylib
*.sh (shell scripts)
*.bat
*.cmd
Makefile
```

### 5. Git Files
```
.git/
.gitignore
.gitattributes
```

---

## Directory Structure Rules

### Rule 1: Flat Root
The ZIP must have a **flat root**. All files must be directly in the ZIP, not inside a nested folder.

**CORRECT:**
```
my-agent.zip
├── agent.json
├── package.json
└── src/
    └── index.js
```

**WRONG (nested folder):**
```
my-agent.zip
└── my-agent/          <-- NO! Don't wrap in a folder
    ├── agent.json
    ├── package.json
    └── src/
```

### Rule 2: Source in src/
All source code must be in the `src/` directory.

**CORRECT:**
```
src/
├── index.js
├── tools/
│   └── get_time.js
└── utils/
    └── helpers.js
```

**WRONG:**
```
lib/                   <-- NO
index.js               <-- NO (must be in src/)
```

### Rule 3: No Path Traversal
No file paths may contain:
- `..` (parent directory)
- Absolute paths (`/etc/passwd`)
- Symbolic links

---

## Size Limits

| Limit | Value | Why |
|-------|-------|-----|
| Total ZIP size | 10 MB max | Prevents abuse |
| Single file size | 1 MB max | Prevents binary blobs |
| Total file count | 100 files max | Keeps agents focused |
| Filename length | 255 chars max | Filesystem compatibility |

---

## Filename Rules

All filenames must:
1. Use only: `a-z`, `A-Z`, `0-9`, `-`, `_`, `.`
2. Not start with `.` (except allowed dotfiles)
3. Not contain spaces
4. Be valid UTF-8

Allowed dotfiles (only these):
- `.nvmrc`
- `.npmrc` (without auth tokens!)

---

## agent.json Validation

The `agent.json` file must:

1. **Parse as valid JSON**
2. **Match the Agent Factory schema** (see `schema/agent.schema.json`)
3. **Have manifestVersion = "1.0"**
4. **Declare a valid entrypoint** that exists in the ZIP
5. **Not contain any secret values** in environment declarations

### Example Valid agent.json

```json
{
  "manifestVersion": "1.0",
  "agent": {
    "name": "my-agent",
    "description": "Does something useful",
    "category": "assistant"
  },
  "runtime": {
    "platform": "node",
    "entrypoint": "src/index.js"
  },
  "interface": {
    "type": "cli"
  },
  "permissions": {
    "network": false
  }
}
```

---

## package.json Validation

The `package.json` file must:

1. **Parse as valid JSON**
2. **Have a "name" field** matching `agent.name` in agent.json
3. **Not have any private registry URLs** in dependencies
4. **Not have "scripts.postinstall"** or other lifecycle hooks that run code

### Forbidden in package.json

```json
{
  "scripts": {
    "postinstall": "...",    // FORBIDDEN
    "preinstall": "...",     // FORBIDDEN
    "prepare": "..."         // FORBIDDEN (if it runs shell commands)
  }
}
```

---

## Validation Checklist

Before uploading, run through this checklist:

- [ ] `agent.json` exists and is valid
- [ ] `package.json` exists and is valid
- [ ] `src/index.js` (or .ts) exists
- [ ] Entrypoint in `agent.json` matches actual file
- [ ] No `.env` or secret files
- [ ] No `node_modules/`
- [ ] No shell scripts
- [ ] ZIP is under 10 MB
- [ ] Files are at root level (not nested)
- [ ] No `..` in any path

---

## What Happens After Upload

1. **Validator runs** - Checks all rules above
2. **If valid** - Agent is listed in showcase
3. **If invalid** - You get a clear error message explaining what's wrong

The platform **never runs your code**. It only validates structure.

Builders download your ZIP and run it locally with their own API keys.

---

## Error Messages

The validator produces human-readable errors like:

```
ERROR: Found forbidden file ".env"
       Secrets should never be in your ZIP.
       Remove this file and use environment variables instead.

ERROR: agent.json is missing required field "runtime.entrypoint"
       This field tells the platform which file to run.
       Add it like this: "entrypoint": "src/index.js"

ERROR: ZIP contains nested folder "my-agent/"
       Files must be at the root of the ZIP.
       Re-zip from inside your project folder, not outside it.
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01 | Initial specification |
